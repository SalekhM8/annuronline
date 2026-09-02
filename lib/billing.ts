import { prisma } from "@/lib/prisma";
import { sendAccountLockedEmail, sendInvoiceEmail, sendWelcomeEmail } from "@/lib/email";
import { formatDate, formatPence, monthName } from "@/lib/utils";

/**
 * Direct-debit billing via GoCardless (client requirement: direct debit only).
 * Runs in MOCK MODE when GOCARDLESS_ACCESS_TOKEN is unset: mandate setup
 * links point at an internal simulator page and collections are simulated,
 * so the whole flow is demonstrable without a GoCardless account.
 */

const GC_BASE = process.env.GOCARDLESS_ENV === "live"
  ? "https://api.gocardless.com"
  : "https://api-sandbox.gocardless.com";

export function isBillingLive() {
  return Boolean(process.env.GOCARDLESS_ACCESS_TOKEN);
}

async function gcFetch(path: string, method: "GET" | "POST" | "PUT", body?: unknown) {
  const res = await fetch(`${GC_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.GOCARDLESS_ACCESS_TOKEN}`,
      "GoCardless-Version": "2015-07-06",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GoCardless ${method} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return res.json();
}

/** Create (or refresh) the mandate-setup link sent in the welcome email. */
export async function createMandateSetup(studentId: string): Promise<string> {
  const site = process.env.NEXTAUTH_URL ?? "https://annur.online";
  let setupUrl: string;
  let mandateRef: string | null = null;

  if (isBillingLive()) {
    const student = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
    const flow = await gcFetch("/redirect_flows", "POST", {
      redirect_flows: {
        description: "An-Nur Academy monthly fees",
        session_token: studentId,
        success_redirect_url: `${site}/enrol/mandate-complete?student=${studentId}`,
        prefilled_customer: {
          email: student.email,
          given_name: student.firstName,
          family_name: student.lastName,
        },
      },
    });
    setupUrl = flow.redirect_flows.redirect_url;
    mandateRef = flow.redirect_flows.id;
  } else {
    setupUrl = `${site}/enrol/mock-mandate?student=${studentId}`;
  }

  await prisma.paymentMandate.upsert({
    where: { studentId },
    create: { studentId, setupUrl, mandateRef, status: "PENDING" },
    update: { setupUrl, mandateRef, status: "PENDING" },
  });
  return setupUrl;
}

/** Mark the mandate active (webhook in live mode; simulator in mock mode). */
export async function activateMandate(studentId: string, mandateRef?: string) {
  await prisma.paymentMandate.update({
    where: { studentId },
    data: { status: "ACTIVE", mandateRef: mandateRef ?? `MOCK-${studentId.slice(-6).toUpperCase()}` },
  });
  await prisma.enrolment.updateMany({
    where: { studentId, status: "PENDING_PAYMENT" },
    data: { status: "ACTIVE" },
  });
}

/** Send the enrolment welcome email with the mandate link. */
export async function sendEnrolmentWelcome(studentId: string) {
  const student = await prisma.user.findUniqueOrThrow({ where: { id: studentId } });
  const url = await createMandateSetup(studentId);
  await sendWelcomeEmail(student.email, student.firstName, url);
  return url;
}

function invoiceNumber(year: number, month: number, seq: number) {
  return `INV-${year}-${String(month).padStart(2, "0")}-${String(seq).padStart(4, "0")}`;
}

export function feeForEnrolment(e: {
  feePenceOverride: number | null;
  classGroup: { monthlyFeePence: number | null; type: string } | null;
}): number | null {
  if (e.feePenceOverride != null) return e.feePenceOverride;
  return e.classGroup?.monthlyFeePence ?? null;
}

/**
 * Generate this month's invoices for all ACTIVE enrolments with a monthly
 * fee (1:1 hourly enrolments are invoiced manually by admin). Idempotent
 * per enrolment+period. Emails each new invoice. Called from the billing
 * cron route and from the admin "run billing now" button.
 */
export async function generateMonthlyInvoices(now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const enrolments = await prisma.enrolment.findMany({
    where: { status: "ACTIVE" },
    include: { classGroup: true, student: true, course: true },
  });

  let created = 0;
  for (const e of enrolments) {
    const fee = feeForEnrolment(e);
    if (fee == null || fee <= 0) continue;

    const exists = await prisma.invoice.findFirst({
      where: { enrolmentId: e.id, periodYear: year, periodMonth: month },
      select: { id: true },
    });
    if (exists) continue;

    const seq = (await prisma.invoice.count({ where: { periodYear: year, periodMonth: month } })) + 1;
    const day = Math.min(e.paymentDayOfMonth, 28);
    const dueDate = new Date(year, month - 1, day);
    const description = `${e.course.title} — ${monthName(month)} ${year}`;

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber(year, month, seq),
        studentId: e.studentId,
        enrolmentId: e.id,
        periodYear: year,
        periodMonth: month,
        description,
        amountPence: fee,
        dueDate,
      },
    });

    await sendInvoiceEmail(e.student.email, e.student.firstName, {
      number: invoice.number,
      description,
      amount: formatPence(fee),
      dueDate: formatDate(dueDate),
      paid: false,
    });
    await prisma.invoice.update({ where: { id: invoice.id }, data: { emailedAt: new Date() } });
    created++;
  }
  return { created };
}

/** Record a successful payment and email the receipt. */
export async function markInvoicePaid(invoiceId: string, providerPaymentRef?: string) {
  const invoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "PAID", paidAt: new Date(), providerPaymentRef },
    include: { student: true },
  });
  await sendInvoiceEmail(invoice.student.email, invoice.student.firstName, {
    number: invoice.number,
    description: invoice.description,
    amount: formatPence(invoice.amountPence),
    dueDate: formatDate(invoice.dueDate),
    paid: true,
  });
  // Paying clears an automatic lock if no other overdue invoices remain
  const stillOverdue = await prisma.invoice.count({
    where: { studentId: invoice.studentId, status: "OVERDUE" },
  });
  if (stillOverdue === 0) {
    await unlockStudent(invoice.studentId, "Payment received");
  }
  return invoice;
}

/**
 * Overdue sweep (cron): invoices unpaid 7+ days past due become OVERDUE
 * and the student's portal is locked automatically (client requirement).
 */
export async function sweepOverdueAndLock(now = new Date()) {
  const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const overdue = await prisma.invoice.findMany({
    where: { status: "PENDING", dueDate: { lt: cutoff } },
    include: { student: true },
  });

  let locked = 0;
  for (const invoice of overdue) {
    await prisma.invoice.update({ where: { id: invoice.id }, data: { status: "OVERDUE" } });
    if (!invoice.student.lockedAt) {
      await lockStudent(invoice.studentId, `Invoice ${invoice.number} unpaid 7+ days`);
      locked++;
    }
  }
  return { overdue: overdue.length, locked };
}

export async function lockStudent(studentId: string, reason: string) {
  const student = await prisma.user.update({
    where: { id: studentId },
    data: { lockedAt: new Date(), lockReason: reason },
  });
  await prisma.enrolment.updateMany({
    where: { studentId, status: "ACTIVE" },
    data: { status: "LOCKED" },
  });
  await sendAccountLockedEmail(student.email, student.firstName);
  return student;
}

export async function unlockStudent(studentId: string, reason?: string) {
  await prisma.user.update({
    where: { id: studentId },
    data: { lockedAt: null, lockReason: reason ? `Unlocked: ${reason}` : null },
  });
  await prisma.enrolment.updateMany({
    where: { studentId, status: "LOCKED" },
    data: { status: "ACTIVE" },
  });
}
