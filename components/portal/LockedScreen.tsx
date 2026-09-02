import { Lock, Mail, Phone, Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPence } from "@/lib/utils";

export default async function LockedScreen({
  userId,
  reason,
}: {
  userId: string;
  reason: string | null;
}) {
  // The one thing a locked student must still see: what is owed.
  const outstanding = await prisma.invoice.findMany({
    where: { studentId: userId, status: { in: ["PENDING", "OVERDUE", "FAILED"] } },
    orderBy: { dueDate: "asc" },
    select: { id: true, number: true, description: true, amountPence: true, dueDate: true, status: true },
  });
  const total = outstanding.reduce((sum, i) => sum + i.amountPence, 0);

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="card-gold p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-900">
          <Lock className="h-8 w-8 text-gold-300" />
        </div>
        <h1 className="text-2xl">Portal access paused</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Your student portal has been temporarily paused because a fee payment is outstanding.
          Access is restored automatically as soon as payment is received.
        </p>
        {reason && <p className="mt-3 text-xs font-semibold text-ink-soft">({reason})</p>}

        {outstanding.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white/70 p-4 text-left">
            <p className="mb-2 flex items-center gap-2 text-sm font-extrabold text-green-900">
              <Receipt className="h-4 w-4" /> Outstanding fees
            </p>
            {outstanding.map((i) => (
              <div key={i.id} className="flex items-baseline justify-between gap-3 border-b border-green-900/10 py-2 text-sm last:border-b-0">
                <span className="min-w-0">
                  <span className="font-bold text-green-900">{i.number}</span>
                  <span className="block text-xs text-ink-soft">
                    {i.description} · due {formatDate(i.dueDate)}
                  </span>
                </span>
                <span className="font-extrabold text-green-900">{formatPence(i.amountPence)}</span>
              </div>
            ))}
            <div className="flex items-baseline justify-between pt-3 text-sm">
              <span className="font-extrabold text-green-900">Total due</span>
              <span className="text-lg font-extrabold text-green-900">{formatPence(total)}</span>
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              Payment is collected by direct debit. If your payment failed, please contact us to
              arrange collection — access is restored straight away once it clears.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-2 text-sm font-semibold text-green-900">
          <p className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" /> info@an-nur.online
          </p>
          <p className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" /> +44 7724 343150
          </p>
        </div>
        <p className="mt-4 text-xs text-ink-soft">
          If you believe this is a mistake, or you are experiencing difficulties, please get in
          touch — we are always happy to help.
        </p>
      </div>
    </div>
  );
}
