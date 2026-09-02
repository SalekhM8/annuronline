import { prisma } from "@/lib/prisma";
import { nextSerial } from "@/lib/certificates";
import { sendCertificateEmail } from "@/lib/email";
import { notify } from "@/lib/notify";

const SITE = process.env.NEXTAUTH_URL ?? "https://annur.online";

/**
 * Mark a module COMPLETED for an enrolment, issue the certificate
 * (once per student+module), advance the next module of the course to
 * IN_PROGRESS, and congratulate the student by email.
 *
 * Shared by the teacher portal (manual completion + audio-assessment
 * PASS) and the admin portal. The certificate email is sent entirely
 * server-side — the student's address is never returned to callers.
 */
export async function completeModule(
  enrolmentId: string,
  moduleId: string,
  opts?: { skipEmail?: boolean }
) {
  const enrolment = await prisma.enrolment.findUnique({
    where: { id: enrolmentId },
    select: {
      id: true,
      studentId: true,
      courseId: true,
      student: { select: { firstName: true, lastName: true, email: true } },
    },
  });
  if (!enrolment) throw new Error("Enrolment not found");

  const mod = await prisma.module.findUnique({
    where: { id: moduleId },
    select: {
      id: true,
      title: true,
      order: true,
      courseId: true,
      course: { select: { title: true } },
    },
  });
  if (!mod) throw new Error("Module not found");
  if (mod.courseId !== enrolment.courseId) {
    throw new Error("Module does not belong to this enrolment's course");
  }

  const now = new Date();

  await prisma.moduleProgress.upsert({
    where: { enrolmentId_moduleId: { enrolmentId, moduleId } },
    create: {
      enrolmentId,
      moduleId,
      status: "COMPLETED",
      startedAt: now,
      completedAt: now,
    },
    update: { status: "COMPLETED", completedAt: now },
  });

  // One certificate per (student, module) — repeat completions reuse it.
  let certificate = await prisma.certificate.findFirst({
    where: { studentId: enrolment.studentId, moduleId },
  });
  let isNewCertificate = false;
  if (!certificate) {
    const count = await prisma.certificate.count();
    certificate = await prisma.certificate.create({
      data: {
        serial: nextSerial(count),
        studentId: enrolment.studentId,
        moduleId,
        studentName: `${enrolment.student.firstName} ${enrolment.student.lastName}`,
        moduleTitle: mod.title,
        courseTitle: mod.course.title,
      },
    });
    isNewCertificate = true;
  }

  // Advance the next module of the same course to IN_PROGRESS,
  // but never downgrade one already in progress or completed.
  const nextModule = await prisma.module.findFirst({
    where: { courseId: mod.courseId, order: { gt: mod.order } },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  if (nextModule) {
    const existing = await prisma.moduleProgress.findUnique({
      where: { enrolmentId_moduleId: { enrolmentId, moduleId: nextModule.id } },
      select: { id: true, status: true },
    });
    if (!existing) {
      await prisma.moduleProgress.create({
        data: {
          enrolmentId,
          moduleId: nextModule.id,
          status: "IN_PROGRESS",
          startedAt: now,
        },
      });
    } else if (existing.status === "NOT_STARTED") {
      await prisma.moduleProgress.update({
        where: { id: existing.id },
        data: { status: "IN_PROGRESS", startedAt: now },
      });
    }
  }

  if (isNewCertificate) {
    await notify(
      enrolment.studentId,
      "Module completed — certificate issued!",
      `MashaAllah! You completed "${mod.title}" and earned certificate ${certificate.serial}.`,
      "/student/certificates"
    );
  }

  if (!opts?.skipEmail && isNewCertificate) {
    await sendCertificateEmail(
      enrolment.student.email,
      enrolment.student.firstName,
      mod.title,
      `${SITE}/student/certificates`
    );
  }

  return certificate;
}

/** Mark a module IN_PROGRESS for an enrolment (never downgrades COMPLETED). */
export async function startModule(enrolmentId: string, moduleId: string) {
  const existing = await prisma.moduleProgress.findUnique({
    where: { enrolmentId_moduleId: { enrolmentId, moduleId } },
  });
  if (existing?.status === "COMPLETED") return existing;

  const now = new Date();
  return prisma.moduleProgress.upsert({
    where: { enrolmentId_moduleId: { enrolmentId, moduleId } },
    create: { enrolmentId, moduleId, status: "IN_PROGRESS", startedAt: now },
    update: { status: "IN_PROGRESS", startedAt: existing?.startedAt ?? now },
  });
}
