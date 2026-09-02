import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiHandler, ApiError, requireUser } from "@/lib/rbac";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

export async function POST(req: Request) {
  return apiHandler(async () => {
    const user = await requireUser();
    const input = schema.parse(await req.json());

    const record = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    const valid = await compare(input.currentPassword, record.passwordHash);
    if (!valid) throw new ApiError(400, "Your current password is incorrect");

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hash(input.newPassword, 12) },
    });
    return { ok: true };
  });
}
