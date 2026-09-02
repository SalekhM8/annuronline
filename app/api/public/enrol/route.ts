import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendAdminAlert } from "@/lib/email";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(30),
  forWhom: z.enum(["ADULT", "CHILD"]),
  studentName: z.string().trim().min(2).max(120).optional(),
  relationship: z.string().trim().max(60).optional(),
  age: z.number().int().min(3).max(17).optional(),
  gender: z.string().trim().max(20).optional(),
  courses: z.array(z.string().trim().min(1).max(60)).min(1).max(6),
  format: z.enum(["GROUP", "ONE_TO_ONE", "NOT_SURE"]),
  preferredTimes: z.string().trim().max(300).optional(),
  comments: z.string().trim().max(2000).optional(),
  heardAbout: z.string().trim().max(100).optional(),
});

const FORMAT_LABEL: Record<string, string> = {
  GROUP: "Group classes",
  ONE_TO_ONE: "One-to-one",
  NOT_SURE: "Not sure — needs advice",
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

    if (d.forWhom === "CHILD" && (!d.studentName || !d.relationship || d.age === undefined)) {
      return NextResponse.json(
        { error: "Please complete your child's details." },
        { status: 400 }
      );
    }

    const preferences = [
      `Format: ${FORMAT_LABEL[d.format]}`,
      d.preferredTimes ? `Preferred days/times: ${d.preferredTimes}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    await prisma.submission.create({
      data: {
        type: "ENROLLMENT",
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        forWhom: d.forWhom === "ADULT" ? "Myself (adult)" : "My child",
        studentName: d.forWhom === "CHILD" ? d.studentName : null,
        relationship: d.forWhom === "CHILD" ? d.relationship : null,
        age: d.forWhom === "CHILD" ? d.age : null,
        gender: d.gender || null,
        courses: d.courses.join(", "),
        preferences,
        comments: d.comments || null,
        heardAbout: d.heardAbout || null,
      },
    });

    const rows: [string, string][] = [
      ["Name", d.fullName],
      ["Email", d.email],
      ["Phone", d.phone],
      ["For", d.forWhom === "ADULT" ? "Myself (adult)" : "Child"],
      ...(d.forWhom === "CHILD"
        ? ([
            ["Child's name", d.studentName ?? ""],
            ["Relationship", d.relationship ?? ""],
            ["Age", String(d.age ?? "")],
          ] as [string, string][])
        : []),
      ["Gender", d.gender || "—"],
      ["Courses", d.courses.join(", ")],
      ["Format", FORMAT_LABEL[d.format]],
      ["Preferred times", d.preferredTimes || "—"],
      ["Heard about us", d.heardAbout || "—"],
      ["Comments", d.comments || "—"],
    ];

    await sendAdminAlert(
      `New enrolment application — ${d.fullName}`,
      `<p>A new enrolment application has been submitted on the website.</p>
       <table style="width:100%;border-collapse:collapse;">
         ${rows
           .map(
             ([k, v]) =>
               `<tr><td style="padding:6px 8px;color:#48594f;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:6px 8px;font-weight:bold;">${esc(v)}</td></tr>`
           )
           .join("")}
       </table>
       <p>Review it in the admin portal to send the welcome email and direct debit link.</p>`
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Enrol submission failed:", e);
    return NextResponse.json(
      { error: "We could not submit your application. Please try again or email info@an-nur.online." },
      { status: 500 }
    );
  }
}
