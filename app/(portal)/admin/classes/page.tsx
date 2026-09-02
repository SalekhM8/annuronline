import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import { formatPence } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import ClassGroupForm from "@/components/admin/ClassGroupForm";

export default async function ClassesPage() {
  const now = new Date();
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const [courses, teachers, upcoming] = await Promise.all([
    prisma.course.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        classGroups: {
          orderBy: { name: "asc" },
          include: {
            teacher: { select: { firstName: true, lastName: true } },
            _count: { select: { enrolments: { where: { status: "ACTIVE" } } } },
          },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.classSession.findMany({
      where: { scheduledAt: { gte: now, lte: in14Days }, isCancelled: false },
      orderBy: { scheduledAt: "asc" },
      take: 200,
      include: {
        classGroup: {
          select: {
            id: true,
            name: true,
            course: { select: { title: true } },
            teacher: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),
  ]);

  const courseOptions = courses.map((c) => ({ id: c.id, title: c.title }));
  const teacherOptions = teachers.map((t) => ({ id: t.id, name: `${t.firstName} ${t.lastName}` }));

  // Timetable: group next-14-day sessions by calendar day
  const byDay = new Map<string, typeof upcoming>();
  for (const s of upcoming) {
    const key = s.scheduledAt.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    const list = byDay.get(key) ?? [];
    list.push(s);
    byDay.set(key, list);
  }

  return (
    <div>
      <PageHeader
        title="Classes & timetable"
        subtitle="Class groups by course, and the coming fortnight's sessions"
        actions={
          <Modal trigger={<><Plus className="h-4 w-4" /> New class group</>} title="Create class group">
            <ClassGroupForm courses={courseOptions} teachers={teacherOptions} />
          </Modal>
        }
      />

      <div className="space-y-6">
        {courses.filter((c) => c.classGroups.length > 0).length === 0 ? (
          <EmptyState icon={CalendarDays} title="No class groups yet" hint="Create the first class group to build the timetable." />
        ) : (
          courses
            .filter((c) => c.classGroups.length > 0)
            .map((course) => (
              <section key={course.id} className="card p-5">
                <h2 className="mb-3 text-lg">{course.title}</h2>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Group</th>
                        <th>Type</th>
                        <th>Audience</th>
                        <th>Teacher</th>
                        <th>Schedule</th>
                        <th>Fee</th>
                        <th>Students</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.classGroups.map((g) => (
                        <tr key={g.id}>
                          <td>
                            <Link href={`/admin/classes/${g.id}`} className="font-bold text-green-800 hover:underline">
                              {g.name}
                            </Link>
                          </td>
                          <td>{g.type === "GROUP" ? "Group" : "1:1"}</td>
                          <td>{g.audience === "ADULT" ? "Adults" : g.audience === "CHILD" ? "Children" : "Mixed"}</td>
                          <td>{g.teacher ? `${g.teacher.firstName} ${g.teacher.lastName}` : "—"}</td>
                          <td>{g.scheduleText ?? "—"}</td>
                          <td>
                            {g.monthlyFeePence != null && `${formatPence(g.monthlyFeePence)}/mo`}
                            {g.monthlyFeePence != null && g.hourlyFeePence != null && " · "}
                            {g.hourlyFeePence != null && `${formatPence(g.hourlyFeePence)}/hr`}
                            {g.monthlyFeePence == null && g.hourlyFeePence == null && "—"}
                          </td>
                          <td>
                            {g._count.enrolments}
                            {g.capacity != null && ` / ${g.capacity}`}
                          </td>
                          <td>
                            {g.isActive ? (
                              <span className="badge badge-ok">Active</span>
                            ) : (
                              <span className="badge badge-neutral">Inactive</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
        )}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-xl">Timetable — next 14 days</h2>
        {upcoming.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No sessions scheduled" hint="Add sessions from each class group's page." />
        ) : (
          <div className="space-y-4">
            {[...byDay.entries()].map(([day, sessions]) => (
              <div key={day} className="card p-4">
                <h3 className="mb-2 font-extrabold text-green-900">{day}</h3>
                <ul className="divide-y divide-cream-deep">
                  {sessions.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                      <div>
                        <span className="font-bold text-green-800">
                          {s.scheduledAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="ml-2">
                          <Link href={`/admin/classes/${s.classGroup.id}`} className="font-bold hover:underline">
                            {s.classGroup.name}
                          </Link>{" "}
                          · {s.classGroup.course.title}
                        </span>
                        {s.topic && <span className="ml-2 text-ink-soft">— {s.topic}</span>}
                      </div>
                      <span className="text-xs text-ink-soft">
                        {s.durationMins} min
                        {s.classGroup.teacher &&
                          ` · ${s.classGroup.teacher.firstName} ${s.classGroup.teacher.lastName}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
