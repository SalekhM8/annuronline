import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import { formatDateTime } from "@/lib/utils";

export default async function AttendancePage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const [sessions, absences] = await Promise.all([
    prisma.classSession.findMany({
      where: {
        scheduledAt: { gte: thirtyDaysAgo, lte: now },
        isCancelled: false,
      },
      orderBy: { scheduledAt: "desc" },
      take: 100,
      include: {
        classGroup: { select: { name: true, course: { select: { title: true } } } },
        attendance: { select: { status: true } },
        feedback: { select: { rating: true } },
      },
    }),
    prisma.attendance.findMany({
      where: { status: "ABSENT", session: { scheduledAt: { gte: thirtyDaysAgo } } },
      orderBy: { markedAt: "desc" },
      take: 100,
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        session: {
          select: { scheduledAt: true, classGroup: { select: { name: true } } },
        },
      },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Academy-wide attendance and anonymous lesson polls — last 30 days"
      />

      <section>
        <h2 className="mb-3 text-xl">Recent sessions</h2>
        {sessions.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title="No sessions in the last 30 days" />
        ) : (
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Class</th>
                  <th>Present</th>
                  <th>Late</th>
                  <th>Absent</th>
                  <th>Poll average</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const count = (st: string) => s.attendance.filter((a) => a.status === st).length;
                  const avg =
                    s.feedback.length > 0
                      ? (s.feedback.reduce((sum, f) => sum + f.rating, 0) / s.feedback.length).toFixed(1)
                      : null;
                  return (
                    <tr key={s.id}>
                      <td>{formatDateTime(s.scheduledAt)}</td>
                      <td>
                        <span className="font-bold text-green-900">{s.classGroup.name}</span>
                        <span className="ml-1 text-xs text-ink-soft">{s.classGroup.course.title}</span>
                      </td>
                      <td className="font-bold text-green-800">{count("PRESENT")}</td>
                      <td className="font-bold text-gold-700">{count("LATE")}</td>
                      <td className="font-bold text-red-700">{count("ABSENT")}</td>
                      <td>{avg != null ? `${avg} / 5 (${s.feedback.length} votes)` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xl">Absences</h2>
        {absences.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title="No absences in the last 30 days" hint="MashaAllah — full attendance." />
        ) : (
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Session date</th>
                  <th>Note</th>
                  <th>Absence email</th>
                </tr>
              </thead>
              <tbody>
                {absences.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/admin/students/${a.student.id}`} className="font-bold text-green-800 hover:underline">
                        {a.student.firstName} {a.student.lastName}
                      </Link>
                    </td>
                    <td>{a.session.classGroup.name}</td>
                    <td>{formatDateTime(a.session.scheduledAt)}</td>
                    <td>{a.note ?? "—"}</td>
                    <td>
                      {a.absenceEmailSentAt ? (
                        <span className="badge badge-ok">Sent</span>
                      ) : (
                        <span className="badge badge-neutral">Not sent</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
