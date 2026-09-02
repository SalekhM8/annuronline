import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { completeModule, startModule } from "@/lib/progress";

const schema = z.object({
  enrolmentId: z.string().min(1),
  moduleId: z.string().min(1),
  action: z.enum(["start", "complete"]),
});

export async function POST(req: Request) {
  return apiHandler(async () => {
    const user = await requireUser("TEACHER", "ADMIN");
    const input = schema.parse(await req.json());

    const enrolment = await prisma.enrolment.findUnique({
      where: { id: input.enrolmentId },
      select: {
        id: true,
        courseId: true,
        classGroup: { select: { teacherId: true } },
      },
    });
    if (!enrolment) throw new ApiError(404, "Enrolment not found");
    if (user.role !== "ADMIN" && enrolment.classGroup?.teacherId !== user.id) {
      throw new ApiError(403, "This student is not in one of your classes");
    }

    const mod = await prisma.module.findUnique({
      where: { id: input.moduleId },
      select: { courseId: true },
    });
    if (!mod || mod.courseId !== enrolment.courseId) {
      throw new ApiError(400, "Module does not belong to this enrolment's course");
    }

    if (input.action === "start") {
      await startModule(input.enrolmentId, input.moduleId);
      return { ok: true, status: "IN_PROGRESS" };
    }

    // completeModule issues the certificate + emails the student
    // server-side (no addresses returned).
    const certificate = await completeModule(input.enrolmentId, input.moduleId);
    return { ok: true, status: "COMPLETED", certificateSerial: certificate.serial };
  });
}
