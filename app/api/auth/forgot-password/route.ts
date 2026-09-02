import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json().catch(() => null));
  // Always respond identically to prevent account enumeration
  const ok = NextResponse.json({ ok: true });
  if (!body.success) return ok;

  const user = await prisma.user.findUnique({
    where: { email: body.data.email.toLowerCase().trim() },
  });
  if (!user || !user.isActive) return ok;

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
  });

  const site = process.env.NEXTAUTH_URL ?? "https://annur.online";
  await sendPasswordResetEmail(user.email, user.firstName, `${site}/reset-password?token=${token}`);
  return ok;
}
