import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";

const schema = z.object({
  teacherId: z.string().min(1),
  observedAt: z.string().optional(),
  classContext: z.string().max(300).optional(),
  score: z.number().int().min(0).max(10),
  strengths: z.string().max(5000).optional(),
  improvements: z.string().max(5000).optional(),
});

/** Record a lesson observation (observer = current admin). */
export async function POST(req: Request) {
  return apiHandler(async () => {
    const admin = await requireUser("ADMIN");
    const body = schema.parse(await req.json());

    const teacher = await prisma.user.findUnique({
      where: { id: body.teacherId },
      select: { role: true },
    });
    if (!teacher || teacher.role !== "TEACHER") throw new ApiError(404, "Teacher not found");

    await prisma.observation.create({
      data: {
        teacherId: body.teacherId,
        observerId: admin.id,
        observedAt: body.observedAt ? new Date(body.observedAt) : new Date(),
        classContext: body.classContext ?? null,
        score: body.score,
        maxScore: 10,
        strengths: body.strengths ?? null,
        improvements: body.improvements ?? null,
      },
    });
    return { ok: true };
  });
}
