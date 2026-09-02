"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";
import { useModalClose } from "./Modal";

/** Schedule a class session for a group. */
export default function SessionAddForm({
  classGroupId,
  modules,
}: {
  classGroupId: string;
  modules: { id: string; title: string; order: number }[];
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
    const local = get("scheduledAt");
    try {
      await callApi("/api/admin/sessions", "POST", {
        classGroupId,
        scheduledAt: new Date(local).toISOString(),
        durationMins: Number(get("durationMins") || "60"),
        topic: get("topic") || undefined,
        moduleId: get("moduleId") || undefined,
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
        <div>
          <label className="label">Date &amp; time *</label>
          <input className="input" name="scheduledAt" type="datetime-local" required />
        </div>
        <div>
          <label className="label">Duration (minutes)</label>
          <input className="input" name="durationMins" type="number" min={15} max={480} defaultValue={60} />
        </div>
        <div>
          <label className="label">Topic</label>
          <input className="input" name="topic" placeholder="e.g. Surah al-Fatihah revision" />
        </div>
        <div>
          <label className="label">Module</label>
          <select className="select" name="moduleId" defaultValue="">
            <option value="">No module</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.order}. {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Adding…" : "Add session"}
      </button>
    </form>
  );
}
