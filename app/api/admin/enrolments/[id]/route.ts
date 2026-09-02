import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";

const schema = z.object({
  action: z.enum(["cancel"]).optional(),
  classGroupId: z.string().nullable().optional(),
  paymentDayOfMonth: z.number().int().min(1).max(28).optional(),
  feePenceOverride: z.number().int().min(0).nullable().optional(),
});

/** Edit an enrolment (group / payment day / fee override) or cancel it. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const enrolment = await prisma.enrolment.findUnique({
      where: { id },
      select: { id: true, courseId: true, status: true },
    });
    if (!enrolment) throw new ApiError(404, "Enrolment not found");

    if (body.action === "cancel") {
      await prisma.enrolment.update({
        where: { id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });
      return { ok: true };
    }

    if (body.classGroupId) {
      const group = await prisma.classGroup.findUnique({
        where: { id: body.classGroupId },
        select: { courseId: true },
      });
      if (!group || group.courseId !== enrolment.courseId) {
        throw new ApiError(400, "Class group does not belong to this enrolment's course");
      }
    }

    await prisma.enrolment.update({
      where: { id },
      data: {
        ...(body.classGroupId !== undefined && { classGroupId: body.classGroupId }),
        ...(body.paymentDayOfMonth !== undefined && { paymentDayOfMonth: body.paymentDayOfMonth }),
        ...(body.feePenceOverride !== undefined && { feePenceOverride: body.feePenceOverride }),
      },
    });
    return { ok: true };
  });
}
