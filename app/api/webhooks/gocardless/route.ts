import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { markInvoicePaid } from "@/lib/billing";

/**
 * GoCardless webhook: payment confirmations and mandate lifecycle.
 * Signature-verified with the webhook endpoint secret.
 */
export async function POST(req: Request) {
  const secret = process.env.GOCARDLESS_WEBHOOK_SECRET;
  const raw = await req.text();

  if (secret) {
    const signature = req.headers.get("webhook-signature") ?? "";
    const digest = createHmac("sha256", secret).update(raw).digest("hex");
    const a = Buffer.from(digest);
    const b = Buffer.from(signature);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 498 });
    }
  }

  const payload = JSON.parse(raw) as { events?: Array<{ resource_type: string; action: string; links?: Record<string, string> }> };

  for (const event of payload.events ?? []) {
    try {
      if (event.resource_type === "payments" && event.action === "confirmed") {
        const paymentRef = event.links?.payment;
        if (paymentRef) {
          const invoice = await prisma.invoice.findFirst({
            where: { providerPaymentRef: paymentRef, status: { in: ["PENDING", "OVERDUE", "FAILED"] } },
          });
          if (invoice) await markInvoicePaid(invoice.id, paymentRef);
        }
      }
      if (event.resource_type === "payments" && event.action === "failed") {
        const paymentRef = event.links?.payment;
        if (paymentRef) {
          await prisma.invoice.updateMany({
            where: { providerPaymentRef: paymentRef, status: "PENDING" },
            data: { status: "FAILED" },
          });
        }
      }
      if (event.resource_type === "mandates" && ["cancelled", "failed", "expired"].includes(event.action)) {
        const mandateRef = event.links?.mandate;
        if (mandateRef) {
          await prisma.paymentMandate.updateMany({
            where: { mandateRef },
            data: { status: event.action === "cancelled" ? "CANCELLED" : "FAILED" },
          });
        }
      }
      if (event.resource_type === "mandates" && event.action === "active") {
        const mandateRef = event.links?.mandate;
        if (mandateRef) {
          await prisma.paymentMandate.updateMany({
            where: { mandateRef },
            data: { status: "ACTIVE" },
          });
        }
      }
    } catch (e) {
      console.error("GoCardless webhook event failed:", event, e);
    }
  }

  return NextResponse.json({ ok: true });
}
