import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.submission.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("/api/admin/submissions error", e);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}


