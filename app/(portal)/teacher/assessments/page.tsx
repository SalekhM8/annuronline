import { Mic } from "lucide-react";
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
  const submissions = await prisma.audioSubmission.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    orderBy: { submittedAt: "asc" },
    select: {
      id: true,
      status: true,
      audioUrl: true,
      durationSecs: true,
      submittedAt: true,
      module: { select: { order: true, title: true } },
      enrolment: {
        select: {
          course: { select: { title: true } },
          student: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

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
    </div>
  );
}

export const dynamic = "force-dynamic";
