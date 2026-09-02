import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { sendAbsenceEmail } from "@/lib/email";
import { formatDate } from "@/lib/utils";

const schema = z.object({
  sessionId: z.string().min(1),
  entries: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(["PRESENT", "LATE", "ABSENT"]),
        note: z.string().trim().max(500).optional(),
      })
    )
    .min(1)
    .max(200),
});

export async function POST(req: Request) {
  return apiHandler(async () => {
    const user = await requireUser("TEACHER", "ADMIN");
    const body = schema.parse(await req.json());

    const session = await prisma.classSession.findUnique({
      where: { id: body.sessionId },
      select: {
        id: true,
        scheduledAt: true,
        classGroup: { select: { id: true, name: true, teacherId: true } },
      },
    });
    if (!session) throw new ApiError(404, "Session not found");
    if (user.role !== "ADMIN" && session.classGroup.teacherId !== user.id) {
      throw new ApiError(403, "This class is not assigned to you");
    }

    // Only students enrolled in this class group may be marked.
    const enrolled = await prisma.enrolment.findMany({
      where: { classGroupId: session.classGroup.id, status: { in: ["ACTIVE", "LOCKED"] } },
      select: { studentId: true },
    });
    const allowed = new Set(enrolled.map((e) => e.studentId));
    for (const entry of body.entries) {
      if (!allowed.has(entry.studentId)) {
        throw new ApiError(400, "One or more students are not enrolled in this class");
      }
    }

    const results: { studentId: string; status: string; absenceEmailSent: boolean }[] = [];

    for (const entry of body.entries) {
      const record = await prisma.attendance.upsert({
        where: { sessionId_studentId: { sessionId: session.id, studentId: entry.studentId } },
        create: {
          sessionId: session.id,
          studentId: entry.studentId,
          status: entry.status,
          note: entry.note || null,
        },
        update: { status: entry.status, note: entry.note || null, markedAt: new Date() },
        select: { id: true, absenceEmailSentAt: true },
      });

      let emailSent = Boolean(record.absenceEmailSentAt);

      // Automatic absence email — sent server-side, once per record.
      // The address (guardian's, falling back to the student's) never
      // reaches the teacher UI.
      if (entry.status === "ABSENT" && !record.absenceEmailSentAt) {
        const student = await prisma.user.findUnique({
          where: { id: entry.studentId },
          select: { firstName: true, lastName: true, email: true, guardianEmail: true },
        });
        if (student) {
          const address = student.guardianEmail ?? student.email;
          const ok = await sendAbsenceEmail(
            address,
            `${student.firstName} ${student.lastName}`,
            session.classGroup.name,
            formatDate(session.scheduledAt)
          );
          if (ok) {
            await prisma.attendance.update({
              where: { id: record.id },
              data: { absenceEmailSentAt: new Date() },
            });
            emailSent = true;
          }
        }
      }

      results.push({ studentId: entry.studentId, status: entry.status, absenceEmailSent: emailSent });
    }

    return { ok: true, saved: results.length, results };
  });
}
