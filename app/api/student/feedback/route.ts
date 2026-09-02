import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ApiError, apiHandler, requireUnlockedStudent } from "@/lib/rbac";
import { voterHashFor } from "../anon";

const feedbackSchema = z.object({
  sessionId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

/**
 * Anonymous end-of-class poll.
 * Privacy-critical: we verify eligibility using the signed-in user, but the
 * stored LessonFeedback row contains ONLY a salted hash — never the userId.
 */
export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const user = await requireUnlockedStudent();
    const body = feedbackSchema.parse(await req.json());

    const session = await prisma.classSession.findUnique({
      where: { id: body.sessionId },
      select: { id: true, classGroupId: true, scheduledAt: true, isCancelled: true },
    });
    if (!session || session.isCancelled) throw new ApiError(404, "Class session not found");
    if (session.scheduledAt.getTime() > Date.now()) {
      throw new ApiError(400, "This class has not been held yet");
    }

    // The student must be (or have been) enrolled in the class group that held it.
    const enrolment = await prisma.enrolment.findFirst({
      where: {
        studentId: user.id,
        classGroupId: session.classGroupId,
        status: { not: "CANCELLED" },
      },
      select: { id: true },
    });
    if (!enrolment) throw new ApiError(403, "You are not enrolled in this class");

    const voterHash = voterHashFor(user.id, session.id);
    try {
      await prisma.lessonFeedback.create({
        data: {
          sessionId: session.id,
          rating: body.rating,
          comment: body.comment?.trim() || null,
          voterHash,
        },
      });
    } catch (err: unknown) {
      // Unique violation on (sessionId, voterHash) → already voted.
      if (typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002") {
        throw new ApiError(409, "You have already rated this class — thank you!");
      }
      throw err;
    }

    return { ok: true };
  });
}

/** Answers "has this student rated session X?" by recomputing the hash. */
export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const user = await requireUnlockedStudent();
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) throw new ApiError(400, "sessionId is required");

    const existing = await prisma.lessonFeedback.findUnique({
      where: { sessionId_voterHash: { sessionId, voterHash: voterHashFor(user.id, sessionId) } },
      select: { id: true },
    });
    return { rated: Boolean(existing) };
  });
}
