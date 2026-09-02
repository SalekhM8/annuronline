import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendAdminAlert } from "@/lib/email";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(30),
  audience: z.enum(["ADULT", "CHILD"]),
  courseInterest: z.string().trim().max(100).optional(),
  preferredTimes: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(2000).optional(),
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
        { error: "Please check the form — some details are missing or invalid." },
        { status: 400 }
      );
    }
    const d = parsed.data;

    await prisma.assessmentBooking.create({
      data: {
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        audience: d.audience,
        courseInterest: d.courseInterest || null,
        preferredTimes: d.preferredTimes || null,
        notes: d.notes || null,
      },
    });

    const rows: [string, string][] = [
      ["Name", d.fullName],
      ["Email", d.email],
      ["Phone", d.phone],
      ["For", d.audience === "ADULT" ? "Adult (themselves)" : "Child"],
      ["Course interest", d.courseInterest || "—"],
      ["Preferred times", d.preferredTimes || "—"],
      ["Notes", d.notes || "—"],
    ];

    await sendAdminAlert(
      `New free assessment request — ${d.fullName}`,
      `<p>A free 20-minute assessment has been requested on the website.</p>
       <table style="width:100%;border-collapse:collapse;">
         ${rows
           .map(
             ([k, v]) =>
               `<tr><td style="padding:6px 8px;color:#48594f;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:6px 8px;font-weight:bold;">${esc(v)}</td></tr>`
           )
           .join("")}
       </table>
       <p>Please contact them to schedule the assessment.</p>`
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Assessment booking failed:", e);
    return NextResponse.json(
      { error: "We could not submit your booking. Please try again or email info@an-nur.online." },
      { status: 500 }
    );
  }
}
