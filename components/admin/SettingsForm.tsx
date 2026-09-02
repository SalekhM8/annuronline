"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

/** Edit academy-wide settings (persisted as Setting key/value rows). */
export default function SettingsForm({
  values,
}: {
  values: {
    contact_email: string;
    contact_phone: string;
    absence_email_enabled: string;
    bank_details_text: string;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      await callApi("/api/admin/settings", "POST", {
        settings: {
          contact_email: String(f.get("contact_email") ?? "").trim(),
          contact_phone: String(f.get("contact_phone") ?? "").trim(),
          absence_email_enabled: f.get("absence_email_enabled") === "on" ? "true" : "false",
          bank_details_text: String(f.get("bank_details_text") ?? "").trim(),
        },
      });
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-2xl space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Contact email</label>
          <input className="input" name="contact_email" type="email" defaultValue={values.contact_email} />
        </div>
        <div>
          <label className="label">Contact phone</label>
          <input className="input" name="contact_phone" defaultValue={values.contact_phone} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          name="absence_email_enabled"
          defaultChecked={values.absence_email_enabled === "true"}
        />
        Automatically email parents/students about marked absences
      </label>
      <div>
        <label className="label">Bank details (shown on the donate page)</label>
        <textarea
          className="textarea"
          name="bank_details_text"
          rows={4}
          defaultValue={values.bank_details_text}
          placeholder={"Account name: …\nSort code: …\nAccount number: …"}
        />
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
        {saved && <span className="text-sm font-semibold text-green-800">Saved.</span>}
      </div>
    </form>
  );
}
