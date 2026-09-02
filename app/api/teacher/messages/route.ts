import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { notify } from "@/lib/notify";

const schema = z.object({
  studentId: z.string().min(1),
  body: z.string().trim().min(1, "Message cannot be empty").max(4000),
});

export async function POST(req: Request) {
  return apiHandler(async () => {
    const user = await requireUser("TEACHER", "ADMIN");
    const input = schema.parse(await req.json());

    // A teacher may only write on boards of students actively enrolled
    // in one of their own class groups. Admins may write on any
    // student's board.
    if (user.role === "ADMIN") {
      const student = await prisma.user.findUnique({
        where: { id: input.studentId },
        select: { id: true, role: true },
      });
      if (!student || student.role !== "STUDENT") throw new ApiError(404, "Student not found");
    } else {
      const enrolment = await prisma.enrolment.findFirst({
        where: {
          studentId: input.studentId,
          status: { in: ["ACTIVE", "LOCKED"] },
          classGroup: { teacherId: user.id },
        },
        select: { id: true },
      });
      if (!enrolment) throw new ApiError(403, "This student is not in one of your classes");
    }

    const message = await prisma.boardMessage.create({
      data: {
        studentId: input.studentId,
        authorId: user.id,
        authorRole: user.role,
        body: input.body,
      },
      select: { id: true, createdAt: true },
    });

    await notify(
      input.studentId,
      user.role === "ADMIN" ? "New message from the academy" : "New message from your teacher",
      input.body.length > 120 ? `${input.body.slice(0, 120)}…` : input.body,
      "/student/messages"
    );

    return { ok: true, message };
  });
}
