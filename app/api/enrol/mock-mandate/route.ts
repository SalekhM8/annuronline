import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { activateMandate, isBillingLive } from "@/lib/billing";

const schema = z.object({ studentId: z.string().min(1) });

export async function POST(req: Request) {
  // The simulator is only valid when GoCardless is NOT configured.
  if (isBillingLive()) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const mandate = await prisma.paymentMandate.findUnique({
    where: { studentId: body.data.studentId },
  });
  if (!mandate) return NextResponse.json({ error: "No pending mandate" }, { status: 404 });

  await activateMandate(body.data.studentId);
  return NextResponse.json({ ok: true });
}
