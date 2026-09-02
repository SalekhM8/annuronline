import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { ApiError, apiHandler, requireUnlockedStudent } from "@/lib/rbac";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // hard cap even with blob storage
const MAX_DEMO_BYTES = Math.floor(1.5 * 1024 * 1024); // data-URL fallback cap

/**
 * Distance-learning audio assessment upload.
 * Multipart FormData: enrolmentId, moduleId, audio (webm blob), durationSecs?.
 */
export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const user = await requireUnlockedStudent();

    const form = await req.formData();
    const enrolmentId = form.get("enrolmentId");
    const moduleId = form.get("moduleId");
    const audio = form.get("audio");
    const durationRaw = form.get("durationSecs");

    if (typeof enrolmentId !== "string" || !enrolmentId) throw new ApiError(400, "enrolmentId is required");
    if (typeof moduleId !== "string" || !moduleId) throw new ApiError(400, "moduleId is required");
    if (!(audio instanceof Blob) || audio.size === 0) throw new ApiError(400, "No audio recording attached");
    if (audio.size > MAX_UPLOAD_BYTES) throw new ApiError(413, "Recording is too large");

    let durationSecs: number | null = null;
    if (typeof durationRaw === "string" && durationRaw) {
      const n = Number.parseInt(durationRaw, 10);
      if (Number.isFinite(n) && n > 0 && n <= 200) durationSecs = n;
    }

    // The enrolment must belong to this student, be a DISTANCE enrolment,
    // and still be live — students may only submit for their own courses.
    const enrolment = await prisma.enrolment.findFirst({
      where: {
        id: enrolmentId,
        studentId: user.id,
        mode: "DISTANCE",
        status: { not: "CANCELLED" },
      },
      select: { id: true, courseId: true },
    });
    if (!enrolment) throw new ApiError(404, "Distance-learning enrolment not found");

    // The module must belong to the enrolled course.
    const module_ = await prisma.module.findFirst({
      where: { id: moduleId, courseId: enrolment.courseId },
      select: { id: true },
    });
    if (!module_) throw new ApiError(404, "Module not found on this course");

    // One live submission per module: block if already awaiting review or passed.
    const existing = await prisma.audioSubmission.findFirst({
      where: {
        enrolmentId: enrolment.id,
        moduleId: module_.id,
        status: { in: ["SUBMITTED", "UNDER_REVIEW", "PASSED"] },
      },
      select: { status: true },
    });
    if (existing) {
      throw new ApiError(
        409,
        existing.status === "PASSED"
          ? "You have already passed this module"
          : "Your previous recording for this module is still being reviewed"
      );
    }

    const contentType = audio.type || "audio/webm";
    let audioUrl: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`assessments/${randomUUID()}.webm`, audio, {
        access: "public",
        contentType,
      });
      audioUrl = blob.url;
    } else {
      // Demo mode: no Vercel Blob token configured locally, so there is
      // nowhere durable to put the file. We inline small recordings as a
      // base64 data: URL in audioUrl instead — playable directly in the
      // teacher's <audio> element — and cap the size so a text column
      // isn't abused as file storage.
      if (audio.size > MAX_DEMO_BYTES) {
        throw new ApiError(413, "Recording too large for demo mode — please keep it under 90 seconds");
      }
      const buffer = Buffer.from(await audio.arrayBuffer());
      audioUrl = `data:${contentType};base64,${buffer.toString("base64")}`;
    }

    const submission = await prisma.audioSubmission.create({
      data: {
        enrolmentId: enrolment.id,
        moduleId: module_.id,
        audioUrl,
        durationSecs,
        status: "SUBMITTED",
      },
      select: { id: true },
    });

    return { ok: true, id: submission.id };
  });
}
