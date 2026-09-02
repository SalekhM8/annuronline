import Link from "next/link";
import { CalendarDays, GraduationCap, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import { requireTeacherPage } from "../guard";

export default async function TeacherClassesPage() {
  const user = await requireTeacherPage();

  const groups = await prisma.classGroup.findMany({
    where: { teacherId: user.id, isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      type: true,
      audience: true,
      scheduleText: true,
      course: { select: { title: true } },
      _count: { select: { sessions: true } },
      // PRIVACY: names only — no other student fields.
      enrolments: {
        where: { status: "ACTIVE" },
        select: { student: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { student: { firstName: "asc" } },
      },
    },
  });

  return (
    <div>
      <PageHeader title="My classes" subtitle="The class groups assigned to you." />

      {groups.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No classes assigned yet"
          hint="Classes appear here once the admin assigns them to you."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((g) => (
            <Link key={g.id} href={`/teacher/classes/${g.id}`} className="card block p-6 transition hover:shadow-lg">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg">{g.name}</h2>
                  <p className="text-sm text-ink-soft">{g.course.title}</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="badge badge-green">{g.type === "ONE_TO_ONE" ? "1-to-1" : "Group"}</span>
                  <span className="badge badge-gold">{g.audience.toLowerCase()}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-soft">
                {g.scheduleText && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" /> {g.scheduleText}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {g.enrolments.length} student
                  {g.enrolments.length === 1 ? "" : "s"} · {g._count.sessions} session
                  {g._count.sessions === 1 ? "" : "s"}
                </span>
              </div>

              {g.enrolments.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {g.enrolments.map((e) => (
                    <span key={e.student.id} className="badge badge-neutral normal-case font-semibold!">
                      {e.student.firstName} {e.student.lastName}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
