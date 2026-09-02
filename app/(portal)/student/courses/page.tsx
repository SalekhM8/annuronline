import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ChevronRight, GraduationCap, Radio } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, PageHeader, StatusBadge } from "@/components/portal/ui";

export default async function StudentCoursesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Scoped: only this student's enrolments, only their enrolled courses.
  const enrolments = await prisma.enrolment.findMany({
    where: { studentId: userId },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      mode: true,
      status: true,
      course: {
        select: {
          title: true,
          arabicTitle: true,
          _count: { select: { modules: true } },
        },
      },
      classGroup: {
        select: {
          name: true,
          scheduleText: true,
          teacher: { select: { firstName: true, lastName: true } },
        },
      },
      progress: { where: { status: "COMPLETED" }, select: { id: true } },
    },
  });

  return (
    <div>
      <PageHeader title="My courses" subtitle="Everything you are enrolled in at An-Nur Academy" />

      {enrolments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="You are not enrolled in any courses yet"
          hint="Once the academy enrols you, your courses will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {enrolments.map((e) => {
            const total = e.course._count.modules;
            const completed = e.progress.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <Link
                key={e.id}
                href={`/student/courses/${e.id}`}
                className="card group block p-6 transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl">{e.course.title}</h2>
                    {e.course.arabicTitle && (
                      <p className="arabic mt-0.5 text-lg text-gold-700">{e.course.arabicTitle}</p>
                    )}
                  </div>
                  <StatusBadge status={e.status} />
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-ink-soft">
                  {e.classGroup ? (
                    <>
                      <p className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 shrink-0 text-green-700" />
                        <span>
                          {e.classGroup.name}
                          {e.classGroup.scheduleText ? ` · ${e.classGroup.scheduleText}` : ""}
                        </span>
                      </p>
                      {e.classGroup.teacher && (
                        <p className="pl-6">
                          Taught by {e.classGroup.teacher.firstName} {e.classGroup.teacher.lastName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="flex items-center gap-2">
                      <Radio className="h-4 w-4 shrink-0 text-green-700" />
                      {e.mode === "DISTANCE" ? "Distance learning — study at your own pace" : "No class group assigned yet"}
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
                    <span className="text-ink-soft">
                      {completed} of {total} modules completed
                    </span>
                    <span className="text-green-800">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream-deep">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-700 to-gold-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-1 text-sm font-bold text-green-800 group-hover:underline">
                  View course <ChevronRight className="h-4 w-4" />
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
