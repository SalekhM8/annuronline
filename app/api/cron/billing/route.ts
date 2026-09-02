import { NextResponse } from "next/server";
import { generateMonthlyInvoices, sweepOverdueAndLock } from "@/lib/billing";

/**
 * Daily billing cron (vercel.json). Idempotent:
 * - generates this month's invoices for active enrolments (once each)
 * - marks invoices 7+ days past due as OVERDUE and auto-locks the student
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const invoices = await generateMonthlyInvoices();
  const overdue = await sweepOverdueAndLock();
  return NextResponse.json({ ok: true, ...invoices, ...overdue });
}
