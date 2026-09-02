import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler, requireUser, ApiError } from "@/lib/rbac";
import { markInvoicePaid } from "@/lib/billing";

const schema = z.object({ action: z.enum(["paid", "cancel"]) });

/** Mark an invoice paid (emails receipt, auto-unlocks when clear) or cancel it. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await requireUser("ADMIN");
    const { id } = await params;
    const body = schema.parse(await req.json());

    const invoice = await prisma.invoice.findUnique({ where: { id }, select: { status: true } });
    if (!invoice) throw new ApiError(404, "Invoice not found");

    if (body.action === "paid") {
      if (invoice.status === "PAID") throw new ApiError(400, "Invoice is already paid");
      await markInvoicePaid(id, "MANUAL-ADMIN");
    } else {
      if (invoice.status === "PAID") throw new ApiError(400, "A paid invoice cannot be cancelled");
      await prisma.invoice.update({ where: { id }, data: { status: "CANCELLED" } });
    }
    return { ok: true };
  });
}
