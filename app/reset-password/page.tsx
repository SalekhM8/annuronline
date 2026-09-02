"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BrandLockup } from "@/components/site/Brand";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) {
      router.push("/login?reset=1");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "This link is invalid or has expired.");
      setBusy(false);
    }
  }

  if (!token) return <p className="text-center text-sm text-ink-soft">This link is invalid.</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="password">New password</label>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm password</label>
        <input
          id="confirm"
          type="password"
          className="input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLockup />
        </div>
        <div className="card p-8">
          <h1 className="mb-6 text-center text-2xl">Choose a new password</h1>
          <Suspense>
            <ResetForm />
          </Suspense>
          <p className="mt-6 text-center text-sm">
            <Link href="/login" className="font-semibold text-green-700 hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
