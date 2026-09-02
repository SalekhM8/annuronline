import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, History } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/portal/ui";
import { formatDate, monthName } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import ActionButton from "@/components/admin/ActionButton";
import ObservationForm from "@/components/admin/ObservationForm";

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const teacher = await prisma.user.findUnique({
    where: { id },
    include: {
      taughtGroups: {
        include: {
          course: { select: { title: true } },
          _count: { select: { enrolments: { where: { status: "ACTIVE" } } } },
        },
      },
      loginEvents: {
        where: { loggedInAt: { gte: sixMonthsAgo } },
        orderBy: { loggedInAt: "desc" },
      },
      observationsAsTeacher: {
        orderBy: { observedAt: "desc" },
        take: 50,
        include: { observer: { select: { firstName: true, lastName: true } } },
      },
    },
  });
  if (!teacher || teacher.role !== "TEACHER") notFound();

  // Monthly login-hour totals (lastSeenAt − loggedInAt, approximate)
  const monthly = new Map<string, number>();
  for (const ev of teacher.loginEvents) {
    const key = `${ev.loggedInAt.getFullYear()}-${ev.loggedInAt.getMonth() + 1}`;
    const mins = Math.max(0, (ev.lastSeenAt.getTime() - ev.loggedInAt.getTime()) / 60000);
    monthly.set(key, (monthly.get(key) ?? 0) + mins);
  }
  const months: { label: string; hours: string }[] = [];
  const cursor = new Date();
  for (let i = 0; i < 6; i++) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`;
    months.push({
      label: `${monthName(cursor.getMonth() + 1)} ${cursor.getFullYear()}`,
      hours: ((monthly.get(key) ?? 0) / 60).toFixed(1),
    });
    cursor.setMonth(cursor.getMonth() - 1);
  }

  return (
    <div>
      <PageHeader
        title={`${teacher.firstName} ${teacher.lastName}`}
        subtitle={`${teacher.email}${teacher.phone ? ` · ${teacher.phone}` : ""}`}
        actions={
          <>
            <Modal trigger={<><Eye className="h-4 w-4" /> Record observation</>} title="Record observation">
              <ObservationForm fixedTeacherId={teacher.id} />
            </Modal>
            <ActionButton
              label={teacher.isActive ? "Deactivate account" : "Reactivate account"}
              url={`/api/admin/teachers/${teacher.id}`}
              method="PATCH"
              body={{ isActive: !teacher.isActive }}
              confirmText={
                teacher.isActive
                  ? "Deactivate this teacher? They will no longer be able to sign in."
                  : "Reactivate this teacher's account?"
              }
              className={teacher.isActive ? "btn btn-danger" : "btn btn-primary"}
            />
          </>
        }
      />

      {!teacher.isActive && (
        <div className="card mb-6 border-l-4 border-red-600 p-4">
          <p className="text-sm font-bold text-red-700">This account is deactivated — the teacher cannot sign in.</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-3 text-lg">Assigned class groups</h2>
          {teacher.taughtGroups.length === 0 ? (
            <p className="text-sm text-ink-soft">No classes assigned. Assign classes from Classes &amp; timetable.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Course</th>
                    <th>Schedule</th>
                    <th>Active students</th>
                  </tr>
                </thead>
                <tbody>
                  {teacher.taughtGroups.map((g) => (
                    <tr key={g.id}>
                      <td>
                        <Link href={`/admin/classes/${g.id}`} className="font-bold text-green-800 hover:underline">
                          {g.name}
                        </Link>
                      </td>
                      <td>{g.course.title}</td>
                      <td>{g.scheduleText ?? "—"}</td>
                      <td>{g._count.enrolments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg"><History className="h-4 w-4" /> Login hours</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Hours online</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.label}>
                    <td>{m.label}</td>
                    <td className="font-bold">{m.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Approximate — based on portal session activity (login to last activity).
          </p>
        </section>

        <section className="card p-5 xl:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 text-lg"><Eye className="h-4 w-4" /> Observations</h2>
          {teacher.observationsAsTeacher.length === 0 ? (
            <p className="text-sm text-ink-soft">
              No observations recorded yet. Each teacher should be observed at least monthly.
            </p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Observer</th>
                    <th>Class</th>
                    <th>Score</th>
                    <th>Strengths</th>
                    <th>Improvements</th>
                  </tr>
                </thead>
                <tbody>
                  {teacher.observationsAsTeacher.map((o) => (
                    <tr key={o.id}>
                      <td>{formatDate(o.observedAt)}</td>
                      <td>{o.observer.firstName} {o.observer.lastName}</td>
                      <td>{o.classContext ?? "—"}</td>
                      <td className="font-bold">{o.score}/{o.maxScore}</td>
                      <td className="max-w-xs whitespace-pre-wrap text-xs">{o.strengths ?? "—"}</td>
                      <td className="max-w-xs whitespace-pre-wrap text-xs">{o.improvements ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <p className="mt-6 text-sm">
        <Link href="/admin/teachers" className="font-bold text-green-700 hover:underline">
          ← Back to teachers
        </Link>
      </p>
    </div>
  );
}
