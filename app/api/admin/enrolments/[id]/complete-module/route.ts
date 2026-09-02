import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { completeModule } from "@/lib/progress";

const schema = z.object({ moduleId: z.string().min(1) });

/**
 * Admin override: mark a module complete for a (distance) enrolment.
 * Uses the shared progress pipeline, which issues the certificate and
 * unlocks the next module.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const enrolment = await prisma.enrolment.findUnique({
      where: { id },
      select: { id: true, courseId: true },
    });
    if (!enrolment) throw new ApiError(404, "Enrolment not found");

    const module_ = await prisma.module.findUnique({
      where: { id: body.moduleId },
      select: { courseId: true },
    });
    if (!module_ || module_.courseId !== enrolment.courseId) {
      throw new ApiError(400, "Module does not belong to this enrolment's course");
    }

    const certificate = await completeModule(id, body.moduleId);
    return { ok: true, certificateSerial: certificate.serial };
  });
}
