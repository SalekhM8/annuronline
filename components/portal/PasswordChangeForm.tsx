"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

export default function PasswordChangeForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) return setMsg({ ok: false, text: "New password must be at least 8 characters." });
    if (next !== confirm) return setMsg({ ok: false, text: "New passwords do not match." });
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg({ ok: true, text: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } else {
      setMsg({ ok: false, text: data.error ?? "Could not update password." });
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-4">
      <div>
        <label className="label" htmlFor="current">Current password</label>
        <input id="current" type="password" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
      </div>
      <div>
        <label className="label" htmlFor="new">New password</label>
        <input id="new" type="password" className="input" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm new password</label>
        <input id="confirm" type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
      </div>
      {msg && <p className={msg.ok ? "text-sm font-bold text-green-700" : "form-error"}>{msg.text}</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        <KeyRound className="h-4 w-4" />
        {busy ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
