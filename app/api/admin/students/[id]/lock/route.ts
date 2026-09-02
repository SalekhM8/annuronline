import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { lockStudent, unlockStudent } from "@/lib/billing";

const schema = z.object({
  action: z.enum(["lock", "unlock"]),
  reason: z.string().max(500).optional(),
});

/** Manual portal lock/unlock (client requirement). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const admin = await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const student = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!student || student.role !== "STUDENT") throw new ApiError(404, "Student not found");

    if (body.action === "lock") {
      await lockStudent(id, body.reason?.trim() || `Locked manually by ${admin.firstName} ${admin.lastName}`);
    } else {
      await unlockStudent(id, body.reason?.trim() || `manually by ${admin.firstName} ${admin.lastName}`);
    }
    return { ok: true };
  });
}
