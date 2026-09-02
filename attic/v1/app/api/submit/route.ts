import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const record = await prisma.submission.create({
      data: {
        type: data.type,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? null,
        forWhom: data.forWhom ?? null,
        studentName: data.studentName ?? null,
        relationship: data.relationship ?? null,
        age: data.age ?? null,
        gender: data.gender ?? null,
        courses: Array.isArray(data.courses) ? data.courses.join(", ") : String(data.courses ?? ""),
        preferences: data.preferences ?? null,
        comments: data.comments ?? null,
        heardAbout: data.heardAbout ?? null,
      },
    });
    return NextResponse.json({ ok: true, id: record.id });
  } catch (e) {
    console.error("/api/submit error", e);
    return NextResponse.json({ ok: false, error: "Unable to save" }, { status: 500 });
  }
}


