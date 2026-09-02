import Link from "next/link";
import {
  Users, BookOpen, Receipt, Inbox, HelpCircle, Lock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard, StatusBadge, EmptyState } from "@/components/portal/ui";
import { formatDateTime, formatPence } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const [
    activeStudents,
    lockedStudents,
    activeEnrolments,
    unpaidAgg,
    pendingAssessments,
    pendingCounselling,
    pendingQuestions,
    recentSubmissions,
    recentBookings,
    recentInvoices,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT", isActive: true } }),
    prisma.user.count({ where: { role: "STUDENT", lockedAt: { not: null } } }),
    prisma.enrolment.count({ where: { status: "ACTIVE" } }),
    prisma.invoice.aggregate({
      where: { status: { in: ["PENDING", "OVERDUE"] } },
      _count: true,
      _sum: { amountPence: true },
    }),
    prisma.assessmentBooking.count({ where: { status: "PENDING" } }),
    prisma.counsellingBooking.count({ where: { status: "PENDING" } }),
    prisma.muftiQuestion.count({ where: { status: "PENDING" } }),
    prisma.submission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.assessmentBooking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { student: { select: { firstName: true, lastName: true } } },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Academy overview"
        subtitle="Everything happening across An-Nur Academy at a glance"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Active students" value={activeStudents} icon={Users} />
        <StatCard label="Active enrolments" value={activeEnrolments} icon={BookOpen} />
        <StatCard
          label="Unpaid invoices"
          value={`${unpaidAgg._count} (${formatPence(unpaidAgg._sum.amountPence ?? 0)})`}
          icon={Receipt}
          tone="gold"
        />
        <StatCard
          label="Pending bookings"
          value={pendingAssessments + pendingCounselling}
          icon={Inbox}
          tone="gold"
        />
        <StatCard label="Pending Mufti questions" value={pendingQuestions} icon={HelpCircle} tone="gold" />
        <StatCard label="Locked students" value={lockedStudents} icon={Lock} tone="neutral" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Latest enrolment applications</h2>
            <Link href="/admin/bookings" className="text-sm font-bold text-green-700">View all</Link>
          </div>
          {recentSubmissions.length === 0 && recentBookings.length === 0 ? (
            <EmptyState icon={Inbox} title="No applications yet" />
          ) : (
            <ul className="divide-y divide-cream-deep">
              {recentSubmissions.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-green-900">{s.fullName}</p>
                    <p className="truncate text-xs text-ink-soft">
                      {s.type === "ENROLLMENT" ? "Enrolment" : "Assessment"} · {s.courses}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-soft">{formatDateTime(s.createdAt)}</span>
                </li>
              ))}
              {recentBookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-green-900">{b.fullName}</p>
                    <p className="truncate text-xs text-ink-soft">
                      Assessment booking{b.courseInterest ? ` · ${b.courseInterest}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={b.status} />
                    <span className="text-xs text-ink-soft">{formatDateTime(b.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Latest invoices</h2>
            <Link href="/admin/billing" className="text-sm font-bold text-green-700">View all</Link>
          </div>
          {recentInvoices.length === 0 ? (
            <EmptyState icon={Receipt} title="No invoices yet" />
          ) : (
            <ul className="divide-y divide-cream-deep">
              {recentInvoices.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-green-900">
                      {inv.student.firstName} {inv.student.lastName}
                    </p>
                    <p className="truncate text-xs text-ink-soft">
                      {inv.number} · {inv.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-bold">{formatPence(inv.amountPence)}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
