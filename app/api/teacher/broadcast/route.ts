import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser } from "@/lib/rbac";
import { requireOwnGroup } from "../guard";

const schema = z.object({
  classGroupId: z.string().min(1),
  body: z.string().trim().min(1, "Message cannot be empty").max(4000),
});

/**
 * One-button class broadcast (client requirement): posts the same
 * message to the board of every actively-enrolled student in the
 * class, linked by a shared broadcastId.
 */
export async function POST(req: Request) {
  return apiHandler(async () => {
    const user = await requireUser("TEACHER", "ADMIN");
    const input = schema.parse(await req.json());

    const group = await requireOwnGroup(user, input.classGroupId);

    const enrolments = await prisma.enrolment.findMany({
      where: { classGroupId: group.id, status: "ACTIVE" },
      select: { studentId: true },
      distinct: ["studentId"],
    });

    if (enrolments.length === 0) {
      return { ok: true, recipients: 0 };
    }

    const broadcastId = randomUUID();
    await prisma.boardMessage.createMany({
      data: enrolments.map((e) => ({
        studentId: e.studentId,
        authorId: user.id,
        authorRole: user.role,
        body: input.body,
        broadcastId,
      })),
    });

    return { ok: true, recipients: enrolments.length, broadcastId };
  });
}
