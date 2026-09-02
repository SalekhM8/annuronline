import { redirect } from "next/navigation";
import { Award, Hourglass, Mic } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { EmptyState, PageHeader, StatusBadge } from "@/components/portal/ui";
import AudioRecorder from "@/components/student/AudioRecorder";

export default async function AssessmentsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Distance-learning enrolments only, scoped to this student.
  const [enrolments, certificates] = await Promise.all([
    prisma.enrolment.findMany({
      where: { studentId: userId, mode: "DISTANCE", status: { not: "CANCELLED" } },
      orderBy: { startedAt: "asc" },
      select: {
        id: true,
        status: true,
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
        audioSubmissions: {
          orderBy: { submittedAt: "desc" },
          select: {
            id: true,
            moduleId: true,
            status: true,
            feedback: true,
            durationSecs: true,
            submittedAt: true,
            reviewedAt: true,
          },
        },
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
        title="Assessments"
        subtitle="Distance-learning modules are assessed by a short audio recording, reviewed by your teacher"
      />

      {enrolments.length === 0 ? (
        <EmptyState
          icon={Mic}
          title="No distance-learning courses"
          hint="Audio assessments only apply to distance-learning enrolments. Your live classes are assessed in lessons."
        />
      ) : (
        <div className="space-y-10">
          {enrolments.map((enrolment) => {
            const subsByModule = new Map<string, typeof enrolment.audioSubmissions>();
            for (const sub of enrolment.audioSubmissions) {
              const list = subsByModule.get(sub.moduleId) ?? [];
              list.push(sub);
              subsByModule.set(sub.moduleId, list);
            }

            // Current module: the first (in order) not yet passed.
            const currentModule = enrolment.course.modules.find(
              (m) => !(subsByModule.get(m.id) ?? []).some((s) => s.status === "PASSED")
            );
            const currentPending = currentModule
              ? (subsByModule.get(currentModule.id) ?? []).some(
                  (s) => s.status === "SUBMITTED" || s.status === "UNDER_REVIEW"
                )
              : false;

            return (
              <section key={enrolment.id} className="space-y-4">
                <div>
                  <h2 className="text-xl">{enrolment.course.title}</h2>
                  {enrolment.course.arabicTitle && (
                    <p className="arabic text-lg text-gold-700">{enrolment.course.arabicTitle}</p>
                  )}
                </div>

                {currentModule && enrolment.status === "ACTIVE" && (
                  currentPending ? (
                    <div className="card flex items-start gap-3 p-5">
                      <Hourglass className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                      <div>
                        <p className="font-bold text-green-900">
                          {currentModule.order}. {currentModule.title} — awaiting review
                        </p>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          Your recording has been submitted. Your teacher will pass the module or ask you to repeat.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <AudioRecorder
                      enrolmentId={enrolment.id}
                      moduleId={currentModule.id}
                      moduleTitle={`${currentModule.order}. ${currentModule.title}`}
                    />
                  )
                )}
                {!currentModule && enrolment.course.modules.length > 0 && (
                  <div className="card-gold p-5">
                    <p className="font-bold text-green-900">
                      Masha&apos;Allah — you have passed every module on this course!
                    </p>
                  </div>
                )}

                <div className="card divide-y divide-green-900/5">
                  {enrolment.course.modules.map((m) => {
                    const subs = subsByModule.get(m.id) ?? [];
                    const latest = subs[0];
                    const passed = subs.some((s) => s.status === "PASSED");
                    const cert = passed ? certByModule.get(m.id) : undefined;

                    return (
                      <div key={m.id} className="p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-bold text-green-900">
                            <span className="mr-2 text-gold-700">{m.order}.</span>
                            {m.title}
                          </p>
                          <StatusBadge status={latest ? latest.status : "NOT_STARTED"} />
                        </div>

                        {subs.length > 0 && (
                          <div className="mt-3 space-y-2 border-l-2 border-green-100 pl-4">
                            {subs.map((s) => (
                              <div key={s.id} className="text-sm">
                                <p className="font-semibold text-ink">
                                  Submitted {formatDateTime(s.submittedAt)}
                                  {s.durationSecs ? ` · ${s.durationSecs}s` : ""}
                                  {s.reviewedAt ? ` · reviewed ${formatDateTime(s.reviewedAt)}` : ""}
                                </p>
                                {s.feedback && (
                                  <p className="mt-0.5 rounded-lg bg-green-50 px-3 py-2 text-ink-soft">
                                    <span className="font-bold text-green-800">Teacher feedback: </span>
                                    {s.feedback}
                                  </p>
                                )}
                                {s.status === "REPEAT" && (
                                  <p className="mt-0.5 text-xs font-bold text-[var(--danger)]">
                                    Please record this module again.
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
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
