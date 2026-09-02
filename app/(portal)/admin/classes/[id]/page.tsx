import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/portal/ui";
import { formatDateTime } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import ActionButton from "@/components/admin/ActionButton";
import ClassGroupForm from "@/components/admin/ClassGroupForm";
import SessionAddForm from "@/components/admin/SessionAddForm";

export default async function ClassGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const group = await prisma.classGroup.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true } },
      teacher: { select: { firstName: true, lastName: true } },
      enrolments: {
        where: { status: { in: ["ACTIVE", "PENDING_PAYMENT", "LOCKED"] } },
        include: { student: { select: { id: true, firstName: true, lastName: true } } },
      },
      sessions: {
        orderBy: { scheduledAt: "desc" },
        take: 50,
        include: {
          module: { select: { title: true, order: true } },
          _count: { select: { attendance: true } },
        },
      },
    },
  });
  if (!group) notFound();

  const [courses, teachers, modules] = await Promise.all([
    prisma.course.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true } }),
    prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.module.findMany({
      where: { courseId: group.courseId },
      orderBy: { order: "asc" },
      select: { id: true, title: true, order: true },
    }),
  ]);

  const now = Date.now();

  return (
    <div>
      <PageHeader
        title={group.name}
        subtitle={`${group.course.title}${group.teacher ? ` · ${group.teacher.firstName} ${group.teacher.lastName}` : ""}${group.scheduleText ? ` · ${group.scheduleText}` : ""}`}
        actions={
          <Modal trigger={<><Plus className="h-4 w-4" /> Add session</>} title={`Add session — ${group.name}`}>
            <SessionAddForm classGroupId={group.id} modules={modules} />
          </Modal>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-3 text-lg">Group settings</h2>
          <ClassGroupForm
            group={{
              id: group.id,
              courseId: group.courseId,
              name: group.name,
              type: group.type,
              audience: group.audience,
              teacherId: group.teacherId,
              scheduleText: group.scheduleText,
              monthlyFeePence: group.monthlyFeePence,
              hourlyFeePence: group.hourlyFeePence,
              meetingLink: group.meetingLink,
              capacity: group.capacity,
              isActive: group.isActive,
            }}
            courses={courses}
            teachers={teachers.map((t) => ({ id: t.id, name: `${t.firstName} ${t.lastName}` }))}
          />
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-3 text-lg">Students in this group ({group.enrolments.length}{group.capacity != null ? ` / ${group.capacity}` : ""})</h2>
            {group.enrolments.length === 0 ? (
              <p className="text-sm text-ink-soft">No students assigned to this group yet.</p>
            ) : (
              <ul className="divide-y divide-cream-deep text-sm">
                {group.enrolments.map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-2">
                    <Link href={`/admin/students/${e.student.id}`} className="font-bold text-green-800 hover:underline">
                      {e.student.firstName} {e.student.lastName}
                    </Link>
                    <span className="badge badge-neutral">{e.status.replaceAll("_", " ")}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 text-lg">Sessions</h2>
            {group.sessions.length === 0 ? (
              <p className="text-sm text-ink-soft">No sessions yet — use “Add session”.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Topic</th>
                      <th>Module</th>
                      <th>Marked</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.sessions.map((s) => (
                      <tr key={s.id} className={s.isCancelled ? "opacity-50" : undefined}>
                        <td>
                          {formatDateTime(s.scheduledAt)}
                          <span className="ml-1 text-xs text-ink-soft">({s.durationMins} min)</span>
                        </td>
                        <td>{s.topic ?? "—"}</td>
                        <td>{s.module ? `${s.module.order}. ${s.module.title}` : "—"}</td>
                        <td>{s._count.attendance > 0 ? `${s._count.attendance} students` : "—"}</td>
                        <td>
                          {s.isCancelled ? (
                            <div className="flex items-center gap-2">
                              <span className="badge badge-neutral">Cancelled</span>
                              <ActionButton
                                label="Restore"
                                url={`/api/admin/sessions/${s.id}`}
                                method="PATCH"
                                body={{ isCancelled: false }}
                                className="btn btn-ghost !py-1.5"
                              />
                            </div>
                          ) : s.scheduledAt.getTime() > now ? (
                            <ActionButton
                              label="Cancel"
                              url={`/api/admin/sessions/${s.id}`}
                              method="PATCH"
                              body={{ isCancelled: true }}
                              confirmText="Cancel this session?"
                              className="btn btn-ghost !py-1.5"
                            />
                          ) : null}
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

      <p className="mt-6 text-sm">
        <Link href="/admin/classes" className="font-bold text-green-700 hover:underline">
          ← Back to classes &amp; timetable
        </Link>
      </p>
    </div>
  );
}
