import { History, Mic } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal/ui";
import ReviewActions from "@/components/teacher/ReviewActions";
import { requireTeacherPage } from "../guard";

export default async function TeacherAssessmentsPage() {
  await requireTeacherPage();

  // All pending distance-learning submissions are visible to every
  // teacher (admin decided routing comes later).
  // PRIVACY: student names only — no other student fields.
  const selection = {
    id: true,
    status: true,
    audioUrl: true,
    durationSecs: true,
    submittedAt: true,
    reviewedAt: true,
    feedback: true,
    module: { select: { order: true, title: true } },
    enrolment: {
      select: {
        course: { select: { title: true } },
        student: { select: { firstName: true, lastName: true } },
      },
    },
  } as const;

  const [submissions, reviewed] = await Promise.all([
    prisma.audioSubmission.findMany({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      orderBy: { submittedAt: "asc" },
      select: selection,
    }),
    prisma.audioSubmission.findMany({
      where: { status: { in: ["PASSED", "REPEAT"] } },
      orderBy: { reviewedAt: "desc" },
      take: 10,
      select: selection,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Audio assessments"
        subtitle="Distance-learning recitations awaiting review. Passing a module issues the certificate automatically."
      />

      {submissions.length === 0 ? (
        <EmptyState
          icon={Mic}
          title="Nothing to review"
          hint="New distance-learning submissions appear here."
        />
      ) : (
        <div className="space-y-5">
          {submissions.map((s) => (
            <div key={s.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg">
                    {s.enrolment.student.firstName} {s.enrolment.student.lastName}
                  </h2>
                  <p className="text-sm text-ink-soft">
                    {s.enrolment.course.title} · Module {s.module.order}: {s.module.title}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Submitted {formatDateTime(s.submittedAt)}
                    {s.durationSecs != null &&
                      ` · ${Math.floor(s.durationSecs / 60)}:${String(s.durationSecs % 60).padStart(2, "0")} min`}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>

              <audio controls preload="none" src={s.audioUrl} className="mt-4 w-full">
                Your browser cannot play this recording.
              </audio>

              <ReviewActions
                submissionId={s.id}
                status={s.status as "SUBMITTED" | "UNDER_REVIEW"}
              />
            </div>
          ))}
        </div>
      )}

      {/* Reviewed history — passed submissions leave the queue but stay
          auditable here (and on the student's own assessments page). */}
      {reviewed.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl">
            <History className="h-5 w-5 text-green-700" /> Recently reviewed
          </h2>
          <div className="space-y-3">
            {reviewed.map((s) => (
              <div key={s.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-bold text-green-900">
                    {s.enrolment.student.firstName} {s.enrolment.student.lastName}
                    <span className="ml-2 font-semibold text-ink-soft">
                      {s.enrolment.course.title} · Module {s.module.order}: {s.module.title}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Reviewed {s.reviewedAt ? formatDateTime(s.reviewedAt) : "—"}
                    {s.status === "PASSED" && " · certificate issued"}
                  </p>
                  {s.feedback && (
                    <p className="mt-1 text-xs italic text-ink-soft">“{s.feedback}”</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <audio controls preload="none" src={s.audioUrl} className="h-9 w-56" />
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
