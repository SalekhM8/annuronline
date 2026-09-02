import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";

const schema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().max(20).nullable().optional(),
  isChild: z.boolean().optional(),
  guardianName: z.string().max(150).nullable().optional(),
  guardianEmail: z.string().email().nullable().optional(),
  guardianPhone: z.string().max(50).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

/** Edit a student's profile. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const student = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!student || student.role !== "STUDENT") throw new ApiError(404, "Student not found");

    if (body.email) {
      const email = body.email.toLowerCase().trim();
      const clash = await prisma.user.findUnique({ where: { email }, select: { id: true } });
      if (clash && clash.id !== id) throw new ApiError(409, "Another user already has this email");
      body.email = email;
    }

    await prisma.user.update({
      where: { id },
      data: {
        ...(body.firstName !== undefined && { firstName: body.firstName }),
        ...(body.lastName !== undefined && { lastName: body.lastName }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.dateOfBirth !== undefined && {
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        }),
        ...(body.gender !== undefined && { gender: body.gender }),
        ...(body.isChild !== undefined && { isChild: body.isChild }),
        ...(body.guardianName !== undefined && { guardianName: body.guardianName }),
        ...(body.guardianEmail !== undefined && { guardianEmail: body.guardianEmail }),
        ...(body.guardianPhone !== undefined && { guardianPhone: body.guardianPhone }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });
    return { ok: true };
  });
}
