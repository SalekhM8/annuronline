"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Landmark, ShieldCheck } from "lucide-react";
import { BrandLockup } from "@/components/site/Brand";

/**
 * Direct-debit setup SIMULATOR. Used only when GoCardless keys are not
 * configured, so the full enrolment flow can be demonstrated end-to-end.
 * With live keys, students are sent to GoCardless' hosted page instead.
 */
function MockMandateForm() {
  const params = useSearchParams();
  const router = useRouter();
  const studentId = params.get("student") ?? "";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    const res = await fetch("/api/enrol/mock-mandate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    if (res.ok) {
      router.push(`/enrol/mandate-complete?student=${studentId}`);
    } else {
      setError("Could not confirm the mandate. Please contact the academy.");
      setBusy(false);
    }
  }

  return (
    <div className="card mx-auto max-w-md p-8">
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-gold-100 p-3 text-xs font-bold text-gold-700">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Demo mode — no real bank details are collected on this page.
      </div>
      <h1 className="text-xl">Set up your direct debit</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Your monthly fee is collected automatically by direct debit. In live mode this page is
        GoCardless&apos; secure hosted form.
      </p>
      <div className="mt-5 space-y-3 opacity-60">
        <div>
          <label className="label">Account holder name</label>
          <input className="input" placeholder="e.g. A. Rahman" disabled />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Sort code</label>
            <input className="input" placeholder="00-00-00" disabled />
          </div>
          <div>
            <label className="label">Account number</label>
            <input className="input" placeholder="12345678" disabled />
          </div>
        </div>
      </div>
      {error && <p className="form-error mt-3">{error}</p>}
      <button onClick={confirm} disabled={busy || !studentId} className="btn-primary mt-6 w-full">
        <Landmark className="h-4 w-4" />
        {busy ? "Confirming…" : "Confirm direct debit (demo)"}
      </button>
    </div>
  );
}

export default function MockMandatePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-10">
      <div className="mb-8">
        <BrandLockup />
      </div>
      <Suspense>
        <MockMandateForm />
      </Suspense>
    </div>
  );
}
