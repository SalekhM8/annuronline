"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

export default function TeacherAddForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    try {
      const data = await callApi<{ ok: boolean; tempPassword: string }>(
        "/api/admin/teachers",
        "POST",
        {
          firstName: get("firstName"),
          lastName: get("lastName"),
          email: get("email"),
          phone: get("phone") || undefined,
        }
      );
      setTempPassword(data.tempPassword);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (tempPassword) {
    return (
      <div>
        <p className="text-sm text-ink-soft">
          Teacher created and portal login email sent. If email delivery fails, share this
          temporary password securely — it is shown only once:
        </p>
        <p className="mt-3 rounded-xl bg-cream-deep p-4 text-center text-xl font-extrabold tracking-wider text-green-900">
          {tempPassword}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">First name *</label>
          <input className="input" name="firstName" required />
        </div>
        <div>
          <label className="label">Last name *</label>
          <input className="input" name="lastName" required />
        </div>
        <div>
          <label className="label">Email *</label>
          <input className="input" name="email" type="email" required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" name="phone" />
        </div>
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Creating…" : "Create teacher & send login email"}
      </button>
    </form>
  );
}
