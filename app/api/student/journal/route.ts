import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ApiError, apiHandler, requireUnlockedStudent } from "@/lib/rbac";

const createSchema = z.object({
  title: z.string().trim().max(200).optional(),
  content: z.string().trim().min(1, "Please write something first").max(20000),
  entryDate: z.string().optional(), // ISO date; defaults to today
});

/** Create a journal entry (personal notes — editable, unlike the message board). */
export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const user = await requireUnlockedStudent();
    const body = createSchema.parse(await req.json());

    let entryDate = new Date();
    if (body.entryDate) {
      const parsed = new Date(body.entryDate);
      if (Number.isNaN(parsed.getTime())) throw new ApiError(400, "Invalid entry date");
      entryDate = parsed;
    }

    const entry = await prisma.journalEntry.create({
      data: {
        studentId: user.id,
        title: body.title || null,
        content: body.content,
        entryDate,
      },
      select: { id: true },
    });

    return { ok: true, id: entry.id };
  });
}
