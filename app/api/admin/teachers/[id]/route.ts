import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";

const schema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(50).nullable().optional(),
  isActive: z.boolean().optional(),
});

/** Edit a teacher (including activate/deactivate). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const teacher = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!teacher || teacher.role !== "TEACHER") throw new ApiError(404, "Teacher not found");

    await prisma.user.update({
      where: { id },
      data: {
        ...(body.firstName !== undefined && { firstName: body.firstName }),
        ...(body.lastName !== undefined && { lastName: body.lastName }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return { ok: true };
  });
}
