"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

/** "Run monthly billing now" — generate invoices then sweep overdue/lock. */
export default function RunBillingButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!window.confirm("Run monthly billing now? New invoices are emailed to students, and accounts 7+ days overdue are locked.")) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const data = await callApi<{ created: number; overdue: number; locked: number }>(
        "/api/admin/billing/run",
        "POST"
      );
      setResult(
        `${data.created} invoice${data.created === 1 ? "" : "s"} created, ${data.overdue} marked overdue, ${data.locked} account${data.locked === 1 ? "" : "s"} locked.`
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" className="btn btn-gold" disabled={busy} onClick={run}>
        {busy ? "Running…" : "Run monthly billing now"}
      </button>
      {result && <p className="text-xs font-semibold text-green-800">{result}</p>}
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
