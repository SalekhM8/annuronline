import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";

const schema = z.object({
  classGroupId: z.string().min(1),
  scheduledAt: z.string().min(1),
  durationMins: z.number().int().min(15).max(480).default(60),
  topic: z.string().max(300).optional(),
  moduleId: z.string().optional(),
});

/** Schedule a class session. */
export async function POST(req: Request) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const body = schema.parse(await req.json());

    const group = await prisma.classGroup.findUnique({
      where: { id: body.classGroupId },
      select: { courseId: true },
    });
    if (!group) throw new ApiError(404, "Class group not found");

    if (body.moduleId) {
      const module_ = await prisma.module.findUnique({
        where: { id: body.moduleId },
        select: { courseId: true },
      });
      if (!module_ || module_.courseId !== group.courseId) {
        throw new ApiError(400, "Module does not belong to this group's course");
      }
    }

    const scheduledAt = new Date(body.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) throw new ApiError(400, "Invalid date/time");

    const session = await prisma.classSession.create({
      data: {
        classGroupId: body.classGroupId,
        scheduledAt,
        durationMins: body.durationMins,
        topic: body.topic ?? null,
        moduleId: body.moduleId ?? null,
      },
    });
    return { ok: true, sessionId: session.id };
  });
}
