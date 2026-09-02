import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { sendPortalReadyEmail } from "@/lib/email";

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
});

/** Create a teacher account and email their portal login. */
export async function POST(req: Request) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const body = schema.parse(await req.json());
    const email = body.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) throw new ApiError(409, "A user with this email already exists");

    const tempPassword = randomBytes(6).toString("base64url");
    const passwordHash = await hash(tempPassword, 12);

    const teacher = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        role: "TEACHER",
        phone: body.phone ?? null,
      },
    });

    await sendPortalReadyEmail(email, body.firstName, tempPassword);
    return { ok: true, teacherId: teacher.id, tempPassword };
  });
}
