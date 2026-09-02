import { redirect } from "next/navigation";
import { Banknote, Info, Receipt } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPence } from "@/lib/utils";
import { EmptyState, PageHeader, StatusBadge } from "@/components/portal/ui";

export default async function FeesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Only this student's mandate and invoices.
  const [mandate, invoices] = await Promise.all([
    prisma.paymentMandate.findUnique({
      where: { studentId: userId },
      select: { status: true, provider: true, setupUrl: true, createdAt: true },
    }),
    prisma.invoice.findMany({
      where: { studentId: userId },
      orderBy: { dueDate: "desc" },
      take: 100,
      select: {
        id: true,
        number: true,
        description: true,
        amountPence: true,
        dueDate: true,
        status: true,
        paidAt: true,
      },
    }),
  ]);

  return (
    <div>
      <PageHeader title="Fees & invoices" subtitle="Your direct debit and monthly invoices" />

      <div className="space-y-6">
        {/* Mandate status */}
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-green-900">Direct debit mandate</p>
                <p className="mt-1 max-w-xl text-sm text-ink-soft">
                  {!mandate &&
                    "No direct debit is set up yet. The academy will send you a setup link with your welcome email."}
                  {mandate?.status === "ACTIVE" &&
                    "Your direct debit is active. Fees are collected automatically each month on your agreed payment day — nothing else for you to do."}
                  {mandate?.status === "PENDING" &&
                    "Your direct debit is awaiting setup. Please complete the setup so your monthly fees can be collected automatically."}
                  {mandate?.status === "FAILED" &&
                    "Your direct debit setup failed. Please contact the academy so we can send you a fresh setup link."}
                  {mandate?.status === "CANCELLED" &&
                    "Your direct debit has been cancelled. Please contact the academy to set up a new one."}
                </p>
                {mandate?.status === "PENDING" && mandate.setupUrl && (
                  <a
                    href={mandate.setupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold mt-3 !px-4 !py-2 text-sm"
                  >
                    Complete direct debit setup
                  </a>
                )}
              </div>
            </div>
            <StatusBadge status={mandate?.status ?? "PENDING"} />
          </div>
        </div>

        {/* Invoices */}
        <section>
          <h2 className="mb-3 text-lg">Invoices</h2>
          {invoices.length === 0 ? (
            <EmptyState icon={Receipt} title="No invoices yet" />
          ) : (
            <div className="card table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Due date</th>
                    <th>Status</th>
                    <th>Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="font-semibold text-green-900">{inv.number}</td>
                      <td>{inv.description}</td>
                      <td className="font-semibold">{formatPence(inv.amountPence)}</td>
                      <td>{formatDate(inv.dueDate)}</td>
                      <td>
                        <StatusBadge status={inv.status} />
                      </td>
                      <td>{inv.paidAt ? formatDate(inv.paidAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Grace / lock policy */}
        <div className="flex items-start gap-3 rounded-2xl border border-gold-300 bg-gold-100/60 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
          <p className="text-sm text-ink">
            <span className="font-bold">Please note:</span> if an invoice remains unpaid, there is a
            7-day grace period after the due date. After that, portal access is locked until the
            balance is settled. If you are having difficulty with fees, please speak to the academy —
            we are always happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}
