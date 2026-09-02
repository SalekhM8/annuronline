import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { BrandLockup } from "@/components/site/Brand";

export default function MandateCompletePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
      <div className="mb-8">
        <BrandLockup />
      </div>
      <div className="card mx-auto max-w-md p-10 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-700" />
        <h1 className="mt-4 text-2xl">Direct debit confirmed</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          JazakAllahu khairan — your payment details are set up. Your enrolment is now active and
          your portal login details will arrive by email shortly.
        </p>
        <Link href="/login" className="btn-primary mt-6">
          Go to portal login
        </Link>
      </div>
    </div>
  );
}
