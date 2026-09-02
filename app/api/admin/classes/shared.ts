import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/rbac";

export const classGroupSchema = z.object({
  courseId: z.string().min(1),
  name: z.string().min(1).max(150),
  type: z.enum(["GROUP", "ONE_TO_ONE"]),
  audience: z.enum(["ADULT", "CHILD", "MIXED"]),
  teacherId: z.string().nullable(),
  scheduleText: z.string().max(200).nullable(),
  monthlyFeePence: z.number().int().min(0).nullable(),
  hourlyFeePence: z.number().int().min(0).nullable(),
  meetingLink: z.string().max(500).nullable(),
  capacity: z.number().int().min(1).nullable(),
  isActive: z.boolean(),
});

export async function validateGroupRefs(courseId: string, teacherId: string | null) {
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
  if (!course) throw new ApiError(404, "Course not found");
  if (teacherId) {
    const teacher = await prisma.user.findUnique({ where: { id: teacherId }, select: { role: true } });
    if (!teacher || teacher.role !== "TEACHER") throw new ApiError(400, "Selected teacher not found");
  }
}
