import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendAdminAlert } from "@/lib/email";

const schema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(200),
  question: z.string().trim().min(10).max(3000),
});

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form — a valid email and a question of at least 10 characters are required." },
        { status: 400 }
      );
    }
    const d = parsed.data;

    await prisma.muftiQuestion.create({
      data: {
        name: d.name || null,
        email: d.email,
        question: d.question,
      },
    });

    await sendAdminAlert(
      "New question for the Mufti",
      `<p>A new question has been submitted via Ask the Mufti.</p>
       <table style="width:100%;border-collapse:collapse;">
         <tr><td style="padding:6px 8px;color:#48594f;white-space:nowrap;vertical-align:top;">Name</td><td style="padding:6px 8px;font-weight:bold;">${esc(d.name || "Anonymous")}</td></tr>
         <tr><td style="padding:6px 8px;color:#48594f;white-space:nowrap;vertical-align:top;">Email</td><td style="padding:6px 8px;font-weight:bold;">${esc(d.email)}</td></tr>
         <tr><td style="padding:6px 8px;color:#48594f;white-space:nowrap;vertical-align:top;">Question</td><td style="padding:6px 8px;">${esc(d.question)}</td></tr>
       </table>
       <p>Answer it from the admin portal — the reply goes to the asker's email, and it can optionally be published anonymously.</p>`
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Ask-the-Mufti submission failed:", e);
    return NextResponse.json(
      { error: "We could not submit your question. Please try again or email info@an-nur.online." },
      { status: 500 }
    );
  }
}
