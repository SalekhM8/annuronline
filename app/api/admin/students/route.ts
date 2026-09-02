import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { sendEnrolmentWelcome } from "@/lib/billing";
import { sendPortalReadyEmail } from "@/lib/email";

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().max(20).optional(),
  isChild: z.boolean().optional(),
  guardianName: z.string().max(150).optional(),
  guardianEmail: z.string().email().optional(),
  guardianPhone: z.string().max(50).optional(),
  notes: z.string().max(5000).optional(),
  enrolment: z.object({
    courseId: z.string().min(1),
    classGroupId: z.string().optional(),
    mode: z.enum(["LIVE", "DISTANCE"]),
    paymentDayOfMonth: z.number().int().min(1).max(28).default(1),
    feePenceOverride: z.number().int().min(0).optional(),
  }),
});

/** Create a student + initial enrolment; email welcome (mandate) + portal login. */
export async function POST(req: Request) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const body = schema.parse(await req.json());
    const email = body.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) throw new ApiError(409, "A user with this email already exists");

    const course = await prisma.course.findUnique({
      where: { id: body.enrolment.courseId },
      include: { modules: { orderBy: { order: "asc" }, take: 1 } },
    });
    if (!course) throw new ApiError(404, "Course not found");

    if (body.enrolment.classGroupId) {
      const group = await prisma.classGroup.findUnique({
        where: { id: body.enrolment.classGroupId },
        select: { courseId: true },
      });
      if (!group || group.courseId !== course.id) {
        throw new ApiError(400, "Class group does not belong to the selected course");
      }
    }

    const tempPassword = randomBytes(6).toString("base64url");
    const passwordHash = await hash(tempPassword, 12);

    const student = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        role: "STUDENT",
        phone: body.phone ?? null,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender ?? null,
        isChild: body.isChild ?? false,
        guardianName: body.isChild ? body.guardianName ?? null : null,
        guardianEmail: body.isChild ? body.guardianEmail ?? null : null,
        guardianPhone: body.isChild ? body.guardianPhone ?? null : null,
        notes: body.notes ?? null,
      },
    });

    const enrolment = await prisma.enrolment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
        classGroupId: body.enrolment.classGroupId ?? null,
        mode: body.enrolment.mode,
        status: "PENDING_PAYMENT",
        paymentDayOfMonth: body.enrolment.paymentDayOfMonth,
        feePenceOverride: body.enrolment.feePenceOverride ?? null,
      },
    });

    const firstModule = course.modules[0];
    if (firstModule) {
      await prisma.moduleProgress.create({
        data: {
          enrolmentId: enrolment.id,
          moduleId: firstModule.id,
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
      });
    }

    // Welcome (direct-debit mandate link) + portal credentials
    await sendEnrolmentWelcome(student.id);
    await sendPortalReadyEmail(email, body.firstName, tempPassword);

    return { ok: true, studentId: student.id, tempPassword };
  });
}
