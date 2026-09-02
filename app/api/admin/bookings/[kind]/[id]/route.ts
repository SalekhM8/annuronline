import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CONVERTED", "DECLINED"]),
  scheduledAt: z.string().optional(),
});

/** Move an assessment / counselling booking along the pipeline. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ kind: string; id: string }> }
) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { kind, id } = await params;
    if (kind !== "assessment" && kind !== "counselling") {
      throw new ApiError(404, "Unknown booking type");
    }
    const body = schema.parse(await req.json());

    if (body.status === "CONFIRMED" && !body.scheduledAt) {
      throw new ApiError(400, "A confirmed booking needs a scheduled date & time");
    }
    const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : undefined;
    if (scheduledAt && Number.isNaN(scheduledAt.getTime())) {
      throw new ApiError(400, "Invalid date/time");
    }

    const data = {
      status: body.status,
      ...(scheduledAt !== undefined && { scheduledAt }),
    };

    if (kind === "assessment") {
      const existing = await prisma.assessmentBooking.findUnique({ where: { id }, select: { id: true } });
      if (!existing) throw new ApiError(404, "Booking not found");
      await prisma.assessmentBooking.update({ where: { id }, data });
    } else {
      const existing = await prisma.counsellingBooking.findUnique({ where: { id }, select: { id: true } });
      if (!existing) throw new ApiError(404, "Booking not found");
      await prisma.counsellingBooking.update({ where: { id }, data });
    }
    return { ok: true };
  });
}
