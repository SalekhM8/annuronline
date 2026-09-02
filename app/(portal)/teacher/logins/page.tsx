import { History } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime, monthName } from "@/lib/utils";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import { requireTeacherPage } from "../guard";

function durationMins(loggedInAt: Date, lastSeenAt: Date): number {
  return Math.max(0, Math.round((lastSeenAt.getTime() - loggedInAt.getTime()) / 60000));
}

function formatMins(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function TeacherHoursPage() {
  const user = await requireTeacherPage();

  // Last 6 calendar months, for the payroll evidence table.
  const now = new Date();
  const sixMonthsStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [recentEvents, monthlyEvents] = await Promise.all([
    prisma.loginEvent.findMany({
      where: { userId: user.id },
      orderBy: { loggedInAt: "desc" },
      take: 100,
      select: { id: true, loggedInAt: true, lastSeenAt: true },
    }),
    prisma.loginEvent.findMany({
      where: { userId: user.id, loggedInAt: { gte: sixMonthsStart } },
      select: { loggedInAt: true, lastSeenAt: true },
    }),
  ]);

  const months: { key: string; label: string; mins: number; sessions: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: `${monthName(d.getMonth() + 1)} ${d.getFullYear()}`,
      mins: 0,
      sessions: 0,
    });
  }
  const byKey = new Map(months.map((m) => [m.key, m]));
  for (const e of monthlyEvents) {
    const key = `${e.loggedInAt.getFullYear()}-${e.loggedInAt.getMonth()}`;
    const bucket = byKey.get(key);
    if (bucket) {
      bucket.mins += durationMins(e.loggedInAt, e.lastSeenAt);
      bucket.sessions += 1;
    }
  }

  return (
    <div>
      <PageHeader
        title="My hours"
        subtitle="Your itemised portal activity — evidence of hours for payroll."
      />

      <section className="card mb-6 p-6">
        <h2 className="mb-3 text-lg">Monthly totals</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Logins</th>
                <th>Total time</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.key}>
                  <td className="font-semibold text-green-900">{m.label}</td>
                  <td>{m.sessions}</td>
                  <td className="font-bold">{formatMins(m.mins)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-soft">Hours are approximate, based on portal activity.</p>
      </section>

      <section>
        <h2 className="mb-3 text-lg">Login history</h2>
        {recentEvents.length === 0 ? (
          <EmptyState icon={History} title="No logins recorded yet" />
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Logged in</th>
                    <th>Last activity</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((e) => (
                    <tr key={e.id}>
                      <td>{formatDateTime(e.loggedInAt)}</td>
                      <td>{formatDateTime(e.lastSeenAt)}</td>
                      <td className="font-semibold">
                        {formatMins(durationMins(e.loggedInAt, e.lastSeenAt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export const dynamic = "force-dynamic";
