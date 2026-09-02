import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ApiError, apiHandler, requireUnlockedStudent } from "@/lib/rbac";

const patchSchema = z.object({
  title: z.string().trim().max(200).nullable().optional(),
  content: z.string().trim().min(1, "Please write something first").max(20000).optional(),
  entryDate: z.string().optional(),
});

/** Edit one of the student's OWN journal entries. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const user = await requireUnlockedStudent();
    const { id } = await params;
    const body = patchSchema.parse(await req.json());

    // Ownership check — students may only touch their own entries.
    const existing = await prisma.journalEntry.findFirst({
      where: { id, studentId: user.id },
      select: { id: true },
    });
    if (!existing) throw new ApiError(404, "Journal entry not found");

    const data: { title?: string | null; content?: string; entryDate?: Date } = {};
    if (body.title !== undefined) data.title = body.title || null;
    if (body.content !== undefined) data.content = body.content;
    if (body.entryDate !== undefined) {
      const parsed = new Date(body.entryDate);
      if (Number.isNaN(parsed.getTime())) throw new ApiError(400, "Invalid entry date");
      data.entryDate = parsed;
    }

    await prisma.journalEntry.update({ where: { id: existing.id }, data });
    return { ok: true };
  });
}
