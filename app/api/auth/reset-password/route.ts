import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ token: z.string().min(10), password: z.string().min(8) });

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: body.data.token },
  });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "This link is invalid or has expired." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash: await hash(body.data.password, 12) },
  });
  await prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } });
  return NextResponse.json({ ok: true });
}
