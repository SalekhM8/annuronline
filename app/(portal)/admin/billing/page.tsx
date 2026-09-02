import Link from "next/link";
import { Receipt, FilePlus2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { InvoiceStatus, Prisma } from "@prisma/client";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal/ui";
import { formatDate, formatPence, monthName } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import ActionButton from "@/components/admin/ActionButton";
import RunBillingButton from "@/components/admin/RunBillingButton";
import OneOffInvoiceForm from "@/components/admin/OneOffInvoiceForm";

const STATUSES = ["PENDING", "PAID", "FAILED", "OVERDUE", "CANCELLED"] as const;

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; month?: string }>;
}) {
  const { status, month } = await searchParams;
  const statusFilter = STATUSES.includes(status as (typeof STATUSES)[number])
    ? (status as InvoiceStatus)
    : undefined;

  // month filter as "YYYY-MM"
  let periodFilter: { periodYear: number; periodMonth: number } | undefined;
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    periodFilter = {
      periodYear: Number(month.slice(0, 4)),
      periodMonth: Number(month.slice(5, 7)),
    };
  }

  const where: Prisma.InvoiceWhereInput = {
    ...(statusFilter && { status: statusFilter }),
    ...(periodFilter && periodFilter),
  };

  const [invoices, totals, students] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
    }),
    prisma.invoice.aggregate({ where, _count: true, _sum: { amountPence: true } }),
    prisma.user.findMany({
      where: { role: "STUDENT", isActive: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      take: 300,
      select: { id: true, firstName: true, lastName: true, email: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Billing & invoices"
        subtitle="Monthly direct-debit invoicing, overdue sweep and one-off invoices"
        actions={
          <>
            <Modal
              trigger={<><FilePlus2 className="h-4 w-4" /> Create one-off invoice</>}
              triggerClassName="btn btn-outline"
              title="Create one-off invoice"
            >
              <OneOffInvoiceForm
                students={students.map((s) => ({
                  id: s.id,
                  name: `${s.firstName} ${s.lastName}`,
                  email: s.email,
                }))}
              />
            </Modal>
            <RunBillingButton />
          </>
        }
      />

      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <select className="select !w-auto" name="status" defaultValue={statusFilter ?? ""}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          className="input !w-auto"
          type="month"
          name="month"
          defaultValue={month && /^\d{4}-\d{2}$/.test(month) ? month : ""}
        />
        <button type="submit" className="btn btn-outline">Filter</button>
      </form>

      {invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices found" hint="Run monthly billing or create a one-off invoice." />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Student</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Due</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono text-xs">{inv.number}</td>
                  <td>
                    <Link href={`/admin/students/${inv.student.id}`} className="font-bold text-green-800 hover:underline">
                      {inv.student.firstName} {inv.student.lastName}
                    </Link>
                  </td>
                  <td>{inv.description}</td>
                  <td className="font-bold">{formatPence(inv.amountPence)}</td>
                  <td>{formatDate(inv.dueDate)}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>{inv.paidAt ? formatDate(inv.paidAt) : "—"}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {(inv.status === "PENDING" || inv.status === "OVERDUE" || inv.status === "FAILED") && (
                        <>
                          <ActionButton
                            label="Mark paid"
                            url={`/api/admin/invoices/${inv.id}`}
                            method="PATCH"
                            body={{ action: "paid" }}
                            confirmText={`Mark ${inv.number} as paid? A receipt is emailed and any fee-lock is lifted once the account is clear.`}
                            className="btn btn-primary !py-1.5"
                          />
                          <ActionButton
                            label="Cancel"
                            url={`/api/admin/invoices/${inv.id}`}
                            method="PATCH"
                            body={{ action: "cancel" }}
                            confirmText={`Cancel invoice ${inv.number}?`}
                            className="btn btn-ghost !py-1.5"
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="font-extrabold text-green-900">
                  Total ({totals._count} invoice{totals._count === 1 ? "" : "s"}
                  {periodFilter ? ` — ${monthName(periodFilter.periodMonth)} ${periodFilter.periodYear}` : ""})
                </td>
                <td className="font-extrabold text-green-900">
                  {formatPence(totals._sum.amountPence ?? 0)}
                </td>
                <td colSpan={4}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      {invoices.length === 100 && totals._count > 100 && (
        <p className="mt-2 text-xs text-ink-soft">
          Showing the latest 100 of {totals._count} invoices — the total covers all matching invoices.
        </p>
      )}
    </div>
  );
}
