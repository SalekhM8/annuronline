import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUnlockedStudent } from "@/lib/rbac";

const messageSchema = z.object({
  body: z.string().trim().min(1, "Message cannot be empty").max(4000),
});

/**
 * Post a message to the student's OWN board.
 * The board is immutable by design (client requirement): there is no
 * update or delete endpoint anywhere in the codebase.
 */
export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const user = await requireUnlockedStudent();
    const body = messageSchema.parse(await req.json());

    const message = await prisma.boardMessage.create({
      data: {
        studentId: user.id, // always the student's own board
        authorId: user.id,
        authorRole: "STUDENT",
        body: body.body,
      },
      select: { id: true, createdAt: true },
    });

    return { ok: true, id: message.id };
  });
}
