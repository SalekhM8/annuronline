import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser } from "@/lib/rbac";
import { classGroupSchema, validateGroupRefs } from "./shared";

/** Create a class group. */
export async function POST(req: Request) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const body = classGroupSchema.parse(await req.json());
    await validateGroupRefs(body.courseId, body.teacherId);
    const group = await prisma.classGroup.create({ data: body });
    return { ok: true, groupId: group.id };
  });
}
