import { Lock, Mail, Phone } from "lucide-react";

export default function LockedScreen({ reason }: { reason: string | null }) {
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
