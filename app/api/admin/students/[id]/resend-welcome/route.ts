import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { sendEnrolmentWelcome } from "@/lib/billing";

/** Re-send the welcome email with a fresh direct-debit mandate link. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const student = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!student || student.role !== "STUDENT") throw new ApiError(404, "Student not found");
    await sendEnrolmentWelcome(id);
    return { ok: true };
  });
}
