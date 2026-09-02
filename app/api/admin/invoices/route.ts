import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { sendInvoiceEmail } from "@/lib/email";
import { formatDate, formatPence } from "@/lib/utils";

const schema = z.object({
  studentId: z.string().min(1),
  description: z.string().min(1).max(300),
  amountPence: z.number().int().min(1).max(10_000_00),
  dueDate: z.string().min(1),
});

/** Create and email a one-off (ad-hoc) invoice, e.g. 1:1 hourly lessons. */
export async function POST(req: Request) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const body = schema.parse(await req.json());

    const student = await prisma.user.findUnique({
      where: { id: body.studentId },
      select: { role: true, email: true, firstName: true },
    });
    if (!student || student.role !== "STUDENT") throw new ApiError(404, "Student not found");

    const dueDate = new Date(body.dueDate);
    if (Number.isNaN(dueDate.getTime())) throw new ApiError(400, "Invalid due date");

    const invoice = await prisma.invoice.create({
      data: {
        number: `INV-ADHOC-${Date.now()}`,
        studentId: body.studentId,
        periodYear: dueDate.getFullYear(),
        periodMonth: dueDate.getMonth() + 1,
        description: body.description,
        amountPence: body.amountPence,
        dueDate,
      },
    });

    await sendInvoiceEmail(student.email, student.firstName, {
      number: invoice.number,
      description: invoice.description,
      amount: formatPence(invoice.amountPence),
      dueDate: formatDate(dueDate),
      paid: false,
    });
    await prisma.invoice.update({ where: { id: invoice.id }, data: { emailedAt: new Date() } });

    return { ok: true, invoiceId: invoice.id, number: invoice.number };
  });
}
