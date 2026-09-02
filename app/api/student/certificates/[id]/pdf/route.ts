import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, requireUnlockedStudent } from "@/lib/rbac";
import { renderCertificatePdf } from "@/lib/certificates";

/**
 * Download a certificate PDF. Not wrapped in apiHandler because the
 * success path returns a binary response, not JSON.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUnlockedStudent();
    const { id } = await params;

    // Ownership check — a student can only download their own certificates.
    const cert = await prisma.certificate.findFirst({
      where: { id, studentId: user.id },
    });
    if (!cert) throw new ApiError(404, "Certificate not found");

    const pdf = await renderCertificatePdf({
      serial: cert.serial,
      studentName: cert.studentName,
      moduleTitle: cert.moduleTitle,
      courseTitle: cert.courseTitle,
      issuedAt: cert.issuedAt,
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cert.serial}.pdf"`,
      },
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Certificate PDF error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
