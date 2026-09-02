import { notFound, redirect } from "next/navigation";
import { CalendarDays, ClipboardCheck, GraduationCap, Video } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { EmptyState, PageHeader, StatusBadge } from "@/components/portal/ui";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ enrolmentId: string }>;
}) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;
  const { enrolmentId } = await params;

  // Ownership check: 404 unless this enrolment belongs to the signed-in student.
  const enrolment = await prisma.enrolment.findFirst({
    where: { id: enrolmentId, studentId: userId },
    select: {
      id: true,
      mode: true,
      status: true,
      startedAt: true,
      course: {
        select: {
          title: true,
          arabicTitle: true,
          modules: { orderBy: { order: "asc" }, select: { id: true, order: true, title: true, summary: true } },
        },
      },
      classGroup: {
        select: {
          id: true,
          name: true,
          scheduleText: true,
          meetingLink: true,
          teacher: { select: { firstName: true, lastName: true } },
        },
      },
      progress: { select: { moduleId: true, status: true, completedAt: true } },
    },
  });
  if (!enrolment) notFound();

  const now = new Date();
  const [sessions, attendance] = await Promise.all([
    enrolment.classGroup
      ? prisma.classSession.findMany({
          where: { classGroupId: enrolment.classGroup.id, isCancelled: false },
          orderBy: { scheduledAt: "asc" },
          select: { id: true, scheduledAt: true, durationMins: true, topic: true },
        })
      : Promise.resolve([]),
    enrolment.classGroup
      ? prisma.attendance.findMany({
          where: { studentId: userId, session: { classGroupId: enrolment.classGroup.id } },
          orderBy: { session: { scheduledAt: "desc" } },
          take: 50,
          select: {
            id: true,
            status: true,
            note: true,
            session: { select: { scheduledAt: true, topic: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  const upcoming = sessions.filter((s) => s.scheduledAt >= now).slice(0, 8);
  const past = sessions.filter((s) => s.scheduledAt < now).reverse().slice(0, 8);
  const progressByModule = new Map(enrolment.progress.map((p) => [p.moduleId, p]));

  return (
    <div>
      <PageHeader
        title={enrolment.course.title}
        subtitle={
          enrolment.classGroup
            ? `${enrolment.classGroup.name}${enrolment.classGroup.scheduleText ? ` · ${enrolment.classGroup.scheduleText}` : ""}${
                enrolment.classGroup.teacher
                  ? ` · taught by ${enrolment.classGroup.teacher.firstName} ${enrolment.classGroup.teacher.lastName}`
                  : ""
              }`
            : enrolment.mode === "DISTANCE"
              ? "Distance learning"
              : undefined
        }
        actions={<StatusBadge status={enrolment.status} />}
      />

      {enrolment.course.arabicTitle && (
        <p className="arabic -mt-4 mb-8 text-2xl text-gold-700">{enrolment.course.arabicTitle}</p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Modules */}
        <section className="xl:col-span-3">
          <h2 className="mb-3 text-lg">Modules</h2>
          {enrolment.course.modules.length === 0 ? (
            <EmptyState icon={GraduationCap} title="No modules published yet" />
          ) : (
            <div className="card divide-y divide-green-900/5">
              {enrolment.course.modules.map((m) => {
                const p = progressByModule.get(m.id);
                const status = p?.status ?? "NOT_STARTED";
                return (
                  <div key={m.id} className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="font-bold text-green-900">
                        <span className="mr-2 text-gold-700">{m.order}.</span>
                        {m.title}
                      </p>
                      {m.summary && <p className="mt-0.5 text-sm text-ink-soft">{m.summary}</p>}
                      {p?.completedAt && (
                        <p className="mt-0.5 text-xs font-semibold text-ink-soft">
                          Completed {formatDateTime(p.completedAt)}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={status} />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sessions + attendance */}
        <div className="space-y-6 xl:col-span-2">
          <section>
            <h2 className="mb-3 text-lg">Upcoming sessions</h2>
            {upcoming.length === 0 ? (
              <EmptyState icon={CalendarDays} title="Nothing scheduled" />
            ) : (
              <div className="card divide-y divide-green-900/5">
                {upcoming.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-bold text-green-900">{formatDateTime(s.scheduledAt)}</p>
                      <p className="text-xs text-ink-soft">
                        {s.durationMins} mins{s.topic ? ` · ${s.topic}` : ""}
                      </p>
                    </div>
                    {enrolment.classGroup?.meetingLink && (
                      <a
                        href={enrolment.classGroup.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline !px-3 !py-1 text-xs"
                      >
                        <Video className="h-3.5 w-3.5" /> Join
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg">Recent sessions</h2>
            {past.length === 0 ? (
              <EmptyState icon={CalendarDays} title="No sessions held yet" />
            ) : (
              <div className="card divide-y divide-green-900/5">
                {past.map((s) => (
                  <div key={s.id} className="p-4">
                    <p className="text-sm font-bold text-green-900">{formatDateTime(s.scheduledAt)}</p>
                    {s.topic && <p className="text-xs text-ink-soft">{s.topic}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg">Your attendance</h2>
            {attendance.length === 0 ? (
              <EmptyState icon={ClipboardCheck} title="No attendance recorded yet" />
            ) : (
              <div className="card table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <p className="font-semibold text-green-900">{formatDateTime(a.session.scheduledAt)}</p>
                          {a.session.topic && <p className="text-xs text-ink-soft">{a.session.topic}</p>}
                          {a.note && <p className="text-xs italic text-ink-soft">{a.note}</p>}
                        </td>
                        <td>
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
