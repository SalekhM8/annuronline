import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { notify } from "@/lib/notify";

const schema = z.object({ body: z.string().min(1).max(5000) });

/** Post to a student's message board as the admin. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const admin = await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const student = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!student || student.role !== "STUDENT") throw new ApiError(404, "Student not found");

    await prisma.boardMessage.create({
      data: {
        studentId: id,
        authorId: admin.id,
        authorRole: "ADMIN",
        body: body.body,
      },
    });
    await notify(
      id,
      "New message from the academy",
      body.body.length > 120 ? `${body.body.slice(0, 120)}…` : body.body,
      "/student/messages"
    );
    return { ok: true };
  });
}
