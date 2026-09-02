"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";
import { useModalClose } from "./Modal";

/**
 * Record a lesson observation. Pass `teachers` for a selectable list, or
 * `fixedTeacherId` when recording from a teacher's own profile page.
 */
export default function ObservationForm({
  teachers = [],
  fixedTeacherId,
}: {
  teachers?: { id: string; name: string }[];
  fixedTeacherId?: string;
}) {
  const router = useRouter();
  const close = useModalClose();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    try {
      await callApi("/api/admin/observations", "POST", {
        teacherId: fixedTeacherId ?? get("teacherId"),
        observedAt: get("observedAt") || undefined,
        classContext: get("classContext") || undefined,
        score: Number(get("score")),
        strengths: get("strengths") || undefined,
        improvements: get("improvements") || undefined,
      });
      router.refresh();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {!fixedTeacherId && (
          <div>
            <label className="label">Teacher *</label>
            <select className="select" name="teacherId" required defaultValue="">
              <option value="" disabled>Select teacher…</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="label">Date of observation *</label>
          <input className="input" name="observedAt" type="date" required />
        </div>
        <div>
          <label className="label">Score out of 10 *</label>
          <input className="input" name="score" type="number" min={0} max={10} required />
        </div>
        <div className={fixedTeacherId ? "" : "sm:col-span-2"}>
          <label className="label">Class / session observed</label>
          <input className="input" name="classContext" placeholder="e.g. Qur'an Foundations — Tuesday 5pm group" />
        </div>
      </div>
      <div>
        <label className="label">Strengths</label>
        <textarea className="textarea" name="strengths" rows={2} />
      </div>
      <div>
        <label className="label">Areas for improvement</label>
        <textarea className="textarea" name="improvements" rows={2} />
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Saving…" : "Record observation"}
      </button>
    </form>
  );
}
