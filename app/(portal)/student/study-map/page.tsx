import { redirect } from "next/navigation";
import clsx from "clsx";
import { Award, Check, Map as MapIcon } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { EmptyState, PageHeader } from "@/components/portal/ui";

export default async function StudyMapPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // One journey map per enrolment — scoped to the signed-in student.
  const [enrolments, certificates] = await Promise.all([
    prisma.enrolment.findMany({
      where: { studentId: userId, status: { not: "CANCELLED" } },
      orderBy: { startedAt: "asc" },
      select: {
        id: true,
        mode: true,
        course: {
          select: {
            title: true,
            arabicTitle: true,
            modules: {
              orderBy: { order: "asc" },
              select: { id: true, order: true, title: true, summary: true },
            },
          },
        },
        progress: { select: { moduleId: true, status: true, completedAt: true } },
      },
    }),
    prisma.certificate.findMany({
      where: { studentId: userId },
      select: { id: true, moduleId: true, serial: true },
    }),
  ]);

  const certByModule = new Map(certificates.map((c) => [c.moduleId, c]));

  return (
    <div>
      <PageHeader
        title="Study maps"
        subtitle="Your journey through each course, module by module"
      />

      {enrolments.length === 0 ? (
        <EmptyState
          icon={MapIcon}
          title="No study maps yet"
          hint="Your journey will appear here once you are enrolled in a course."
        />
      ) : (
        <div className="space-y-10">
          {enrolments.map((enrolment) => {
            const progressByModule = new Map(
              enrolment.progress.map((p) => [p.moduleId, p])
            );
            const completedCount = enrolment.course.modules.filter(
              (m) => progressByModule.get(m.id)?.status === "COMPLETED"
            ).length;

            return (
              <section key={enrolment.id} className="card overflow-hidden">
                <div className="card-green rounded-b-none px-6 py-5">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="text-xl">{enrolment.course.title}</h2>
                      {enrolment.course.arabicTitle && (
                        <p className="arabic mt-0.5 text-lg text-gold-300">
                          {enrolment.course.arabicTitle}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gold-300">
                      {completedCount} / {enrolment.course.modules.length} modules completed
                    </p>
                  </div>
                </div>

                <div className="space-y-0 p-6 lg:p-8">
                  {enrolment.course.modules.length === 0 && (
                    <p className="text-sm text-ink-soft">Modules for this course are being prepared.</p>
                  )}
                  {enrolment.course.modules.map((m) => {
                    const p = progressByModule.get(m.id);
                    const status = p?.status ?? "NOT_STARTED";
                    const cert = certByModule.get(m.id);
                    const done = status === "COMPLETED";
                    const inProgress = status === "IN_PROGRESS";

                    return (
                      <div key={m.id} className={clsx("map-node flex gap-4 pb-6", done && "done")}>
                        {/* Node circle */}
                        <div
                          className={clsx(
                            "z-10 flex h-[2.1rem] w-[2.1rem] shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                            done && "bg-gold-500 text-green-950 shadow-[var(--shadow-soft)]",
                            inProgress && "border-2 border-green-700 bg-white text-green-800",
                            !done && !inProgress && "border-2 border-cream-deep bg-cream-deep text-ink-soft/60"
                          )}
                        >
                          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : m.order}
                        </div>

                        {/* Node body */}
                        <div className="min-w-0 flex-1 pt-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <p
                              className={clsx(
                                "font-heading text-base",
                                done && "text-green-900",
                                inProgress && "text-green-800",
                                !done && !inProgress && "text-ink-soft/70"
                              )}
                            >
                              {m.title}
                            </p>
                            {inProgress && (
                              <span className="badge badge-gold">In progress</span>
                            )}
                          </div>
                          {m.summary && (
                            <p className={clsx("mt-0.5 text-sm", done || inProgress ? "text-ink-soft" : "text-ink-soft/60")}>
                              {m.summary}
                            </p>
                          )}
                          {done && p?.completedAt && (
                            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gold-700">
                              Completed {formatDate(p.completedAt)}
                            </p>
                          )}
                          {cert && (
                            <a
                              href={`/api/student/certificates/${cert.id}/pdf`}
                              className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-green-800 hover:underline"
                            >
                              <Award className="h-4 w-4 text-gold-600" />
                              Download certificate ({cert.serial})
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
