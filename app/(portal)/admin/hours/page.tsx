import { History } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import { monthName } from "@/lib/utils";

export default async function StaffHoursPage() {
  const start = new Date();
  start.setMonth(start.getMonth() - 5);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    take: 100,
    include: {
      loginEvents: {
        where: { loggedInAt: { gte: start } },
        select: { loggedInAt: true, lastSeenAt: true },
      },
    },
  });

  // Column per month, most recent first
  const months: { key: string; label: string }[] = [];
  const cursor = new Date();
  for (let i = 0; i < 6; i++) {
    months.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth() + 1}`,
      label: `${monthName(cursor.getMonth() + 1).slice(0, 3)} ${cursor.getFullYear()}`,
    });
    cursor.setMonth(cursor.getMonth() - 1);
  }

  const rows = teachers.map((t) => {
    const totals = new Map<string, number>();
    for (const ev of t.loginEvents) {
      const key = `${ev.loggedInAt.getFullYear()}-${ev.loggedInAt.getMonth() + 1}`;
      const mins = Math.max(0, (ev.lastSeenAt.getTime() - ev.loggedInAt.getTime()) / 60000);
      totals.set(key, (totals.get(key) ?? 0) + mins);
    }
    return {
      id: t.id,
      name: `${t.firstName} ${t.lastName}`,
      isActive: t.isActive,
      hours: months.map((m) => (totals.get(m.key) ?? 0) / 60),
    };
  });

  return (
    <div>
      <PageHeader
        title="Staff hours"
        subtitle="Monthly portal hours per teacher, from itemised login history"
      />

      {rows.length === 0 ? (
        <EmptyState icon={History} title="No teachers yet" />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Teacher</th>
                {months.map((m) => (
                  <th key={m.key}>{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-bold text-green-900">
                    {r.name}
                    {!r.isActive && <span className="badge badge-neutral ml-2">Inactive</span>}
                  </td>
                  {r.hours.map((h, i) => (
                    <td key={months[i].key}>{h > 0 ? `${h.toFixed(1)} h` : "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-2 text-xs text-ink-soft">
        Approximate: hours are measured from each login to the last recorded activity in that
        session, so short or idle sessions may under- or over-count slightly.
      </p>
    </div>
  );
}
