import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { completeModule } from "@/lib/progress";
import { notify } from "@/lib/notify";

const schema = z.object({
  action: z.enum(["UNDER_REVIEW", "PASS", "REPEAT"]),
  feedback: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const user = await requireUser("TEACHER", "ADMIN");
    const { id } = await params;
    const input = schema.parse(await req.json());

    // All distance submissions are visible to all teachers (admin
    // decided routing later), so no per-teacher ownership check here.
    const submission = await prisma.audioSubmission.findUnique({
      where: { id },
      select: { id: true, status: true, enrolmentId: true, moduleId: true },
    });
    if (!submission) throw new ApiError(404, "Submission not found");
    if (submission.status === "PASSED" || submission.status === "REPEAT") {
      throw new ApiError(409, "This submission has already been reviewed");
    }

    if (input.action === "UNDER_REVIEW") {
      await prisma.audioSubmission.update({
        where: { id: submission.id },
        data: { status: "UNDER_REVIEW", reviewerId: user.id },
      });
      return { ok: true, status: "UNDER_REVIEW" };
    }

    if (input.action === "REPEAT") {
      if (!input.feedback) {
        throw new ApiError(400, "Feedback is required when asking a student to repeat");
      }
      await prisma.audioSubmission.update({
        where: { id: submission.id },
        data: {
          status: "REPEAT",
          reviewerId: user.id,
          reviewedAt: new Date(),
          feedback: input.feedback,
        },
      });
      const enrolment = await prisma.enrolment.findUnique({
        where: { id: submission.enrolmentId },
        select: { studentId: true },
      });
      if (enrolment) {
        await notify(
          enrolment.studentId,
          "Assessment feedback",
          "Your teacher has asked you to repeat this module's assessment — see their feedback.",
          "/student/assessments"
        );
      }
      return { ok: true, status: "REPEAT" };
    }

    // PASS: record the review, then complete the module — this issues
    // the certificate and emails the student, all server-side.
    await prisma.audioSubmission.update({
      where: { id: submission.id },
      data: {
        status: "PASSED",
        reviewerId: user.id,
        reviewedAt: new Date(),
        feedback: input.feedback || null,
      },
    });
    const certificate = await completeModule(submission.enrolmentId, submission.moduleId);
    return { ok: true, status: "PASSED", certificateSerial: certificate.serial };
  });
}
