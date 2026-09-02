import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";

const schema = z.object({ isCancelled: z.boolean() });

/** Cancel (or restore) a class session. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const session = await prisma.classSession.findUnique({ where: { id }, select: { id: true } });
    if (!session) throw new ApiError(404, "Session not found");

    await prisma.classSession.update({ where: { id }, data: { isCancelled: body.isCancelled } });
    return { ok: true };
  });
}
