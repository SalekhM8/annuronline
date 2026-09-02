import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { emailShell, sendEmail } from "@/lib/email";

const schema = z.object({
  action: z.enum(["answer", "reject"]),
  answer: z.string().min(1).max(20000).optional(),
  publish: z.boolean().optional(),
});

/** Moderate an Ask-the-Mufti question: answer (± publish anonymously) or reject. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const question = await prisma.muftiQuestion.findUnique({ where: { id } });
    if (!question) throw new ApiError(404, "Question not found");

    if (body.action === "reject") {
      await prisma.muftiQuestion.update({ where: { id }, data: { status: "REJECTED" } });
      return { ok: true };
    }

    if (!body.answer) throw new ApiError(400, "An answer is required");
    const firstAnswer = question.answeredAt == null;

    await prisma.muftiQuestion.update({
      where: { id },
      data: {
        answer: body.answer,
        status: body.publish ? "PUBLISHED" : "ANSWERED",
        answeredAt: question.answeredAt ?? new Date(),
      },
    });

    // Email the answer to the asker the first time it is answered
    if (firstAnswer) {
      await sendEmail(
        question.email,
        "An-Nur Academy — your question has been answered",
        emailShell(
          "Your question has been answered",
          `<p>Assalamu alaikum${question.name ? ` ${question.name}` : ""},</p>
           <p><strong>Your question:</strong></p>
           <blockquote style="border-left:3px solid #d4af37;margin:8px 0;padding:4px 12px;color:#48594f;">${question.question}</blockquote>
           <p><strong>Answer:</strong></p>
           <p>${body.answer.replaceAll("\n", "<br/>")}</p>`
        )
      );
    }
    return { ok: true };
  });
}
