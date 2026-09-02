import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { classGroupSchema, validateGroupRefs } from "../shared";

/** Edit a class group. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = classGroupSchema.parse(await req.json());

    const existing = await prisma.classGroup.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new ApiError(404, "Class group not found");
    await validateGroupRefs(body.courseId, body.teacherId);

    await prisma.classGroup.update({ where: { id }, data: body });
    return { ok: true };
  });
}
