import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { requireOwnGroup } from "../guard";

const schema = z.object({
  classGroupId: z.string().min(1),
  scheduledAt: z.coerce.date(),
  durationMins: z.number().int().min(15).max(300).default(60),
  topic: z.string().trim().max(200).optional(),
  moduleId: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  return apiHandler(async () => {
    const user = await requireUser("TEACHER", "ADMIN");
    const body = schema.parse(await req.json());

    const group = await requireOwnGroup(user, body.classGroupId);

    if (Number.isNaN(body.scheduledAt.getTime())) {
      throw new ApiError(400, "Invalid date/time");
    }

    if (body.moduleId) {
      const mod = await prisma.module.findUnique({
        where: { id: body.moduleId },
        select: { courseId: true },
      });
      if (!mod || mod.courseId !== group.courseId) {
        throw new ApiError(400, "Module does not belong to this class's course");
      }
    }

    const session = await prisma.classSession.create({
      data: {
        classGroupId: group.id,
        scheduledAt: body.scheduledAt,
        durationMins: body.durationMins,
        topic: body.topic || null,
        moduleId: body.moduleId ?? null,
      },
      select: { id: true, scheduledAt: true, durationMins: true, topic: true },
    });

    return { ok: true, session };
  });
}
