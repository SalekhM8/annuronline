"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/site/Brand";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLockup />
        </div>
        <div className="card p-8">
          <h1 className="mb-1 text-center text-2xl">Reset password</h1>
          {sent ? (
            <p className="mt-4 text-center text-sm text-ink-soft">
              If an account exists for <strong>{email}</strong>, a reset link is on its way. Check
              your inbox.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}
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
