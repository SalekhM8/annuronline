"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

/**
 * Admin override for distance-learning progress: mark a module complete
 * (issues the certificate via the shared progress pipeline).
 */
export default function ModuleCompleteForm({
  enrolmentId,
  modules,
}: {
  enrolmentId: string;
  modules: { id: string; title: string; order: number; completed: boolean }[];
}) {
  const router = useRouter();
  const [moduleId, setModuleId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const open = modules.filter((m) => !m.completed);

  if (open.length === 0) {
    return <p className="text-xs text-ink-soft">All modules complete.</p>;
  }

  async function run() {
    if (!moduleId) return;
    const chosen = open.find((m) => m.id === moduleId);
    if (!window.confirm(`Mark "${chosen?.title}" as complete? This issues the certificate.`)) return;
    setBusy(true);
    setError(null);
    try {
      await callApi(`/api/admin/enrolments/${enrolmentId}/complete-module`, "POST", { moduleId });
      setModuleId("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className="select !w-auto" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
        <option value="">Module override…</option>
        {open.map((m) => (
          <option key={m.id} value={m.id}>
            {m.order}. {m.title}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn-outline" disabled={busy || !moduleId} onClick={run}>
        {busy ? "Working…" : "Mark complete"}
      </button>
      {error && <span className="text-xs font-semibold text-red-700">{error}</span>}
    </div>
  );
}
