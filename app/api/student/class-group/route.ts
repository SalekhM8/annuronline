import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, ApiError, requireUnlockedStudent } from "@/lib/rbac";
import { sendAdminAlert } from "@/lib/email";

const schema = z.object({
  enrolmentId: z.string().min(1),
  classGroupId: z.string().min(1),
});

/** Student self-serve class-time selection (client requirement):
 * after enrolment, the student picks the group whose timings suit them. */
export async function POST(req: Request) {
  return apiHandler(async () => {
    const user = await requireUnlockedStudent();
    const input = schema.parse(await req.json());

    const enrolment = await prisma.enrolment.findFirst({
      where: { id: input.enrolmentId, studentId: user.id },
      include: { course: { select: { title: true } } },
    });
    if (!enrolment) throw new ApiError(404, "Enrolment not found");
    if (enrolment.mode !== "LIVE") throw new ApiError(400, "Distance courses have no class times");
    if (!["ACTIVE", "PENDING_PAYMENT"].includes(enrolment.status)) {
      throw new ApiError(400, "This enrolment cannot change class group");
    }
    if (enrolment.classGroupId === input.classGroupId) {
      return { ok: true, unchanged: true };
    }

    const student = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { isChild: true, firstName: true, lastName: true },
    });

    const group = await prisma.classGroup.findFirst({
      where: {
        id: input.classGroupId,
        courseId: enrolment.courseId,
        isActive: true,
        type: "GROUP",
        audience: { in: student.isChild ? ["CHILD", "MIXED"] : ["ADULT", "MIXED"] },
      },
      include: { _count: { select: { enrolments: { where: { status: { in: ["ACTIVE", "PENDING_PAYMENT"] } } } } } },
    });
    if (!group) throw new ApiError(404, "That class is not available for this course");
    if (group.capacity != null && group._count.enrolments >= group.capacity) {
      throw new ApiError(409, "That class is full — please choose another time");
    }

    await prisma.enrolment.update({
      where: { id: enrolment.id },
      data: { classGroupId: group.id },
    });

    await sendAdminAlert(
      "Class time chosen by student",
      `<p><strong>${student.firstName} ${student.lastName}</strong> selected <strong>${group.name}</strong> (${group.scheduleText ?? "no schedule text"}) for ${enrolment.course.title}.</p>`
    );

    return { ok: true };
  });
}
