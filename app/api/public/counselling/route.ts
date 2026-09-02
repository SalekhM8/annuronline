import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendAdminAlert } from "@/lib/email";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  type: z.enum(["PERSONAL", "YOUTH", "MARRIAGE", "BENEFITS_FINANCE"]),
  method: z.enum(["IN_PERSON", "ONLINE"]),
  message: z.string().trim().max(2000).optional(),
});

const TYPE_LABEL: Record<string, string> = {
  PERSONAL: "Personal",
  YOUTH: "Youth",
  MARRIAGE: "Marriage",
  BENEFITS_FINANCE: "Benefits & Finance",
};

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

    await prisma.counsellingBooking.create({
      data: {
        fullName: d.fullName,
        email: d.email,
        phone: d.phone || null,
        type: d.type,
        method: d.method,
        message: d.message || null,
      },
    });

    const rows: [string, string][] = [
      ["Name", d.fullName],
      ["Email", d.email],
      ["Phone", d.phone || "—"],
      ["Type", TYPE_LABEL[d.type]],
      ["Method", d.method === "ONLINE" ? "Online" : "In person"],
      ["Message", d.message || "—"],
    ];

    await sendAdminAlert(
      `New counselling request — ${TYPE_LABEL[d.type]}`,
      `<p>A counselling session has been requested on the website. Please handle in confidence.</p>
       <table style="width:100%;border-collapse:collapse;">
         ${rows
           .map(
             ([k, v]) =>
               `<tr><td style="padding:6px 8px;color:#48594f;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:6px 8px;font-weight:bold;">${esc(v)}</td></tr>`
           )
           .join("")}
       </table>`
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Counselling booking failed:", e);
    return NextResponse.json(
      { error: "We could not submit your request. Please try again or email info@an-nur.online." },
      { status: 500 }
    );
  }
}
