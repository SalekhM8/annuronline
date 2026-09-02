"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

/** Manual portal lock/unlock for a student (client requirement). */
export default function LockControls({
  studentId,
  locked,
}: {
  studentId: string;
  locked: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      await callApi(`/api/admin/students/${studentId}/lock`, "POST", {
        action: locked ? "unlock" : "lock",
        reason: reason.trim() || undefined,
      });
      setOpen(false);
      setReason("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className={locked ? "btn btn-primary" : "btn btn-danger"}
        onClick={() => setOpen(true)}
      >
        {locked ? "Unlock portal access" : "Lock portal access"}
      </button>
    );
  }

  return (
    <div className="card w-full max-w-md p-4">
      <p className="text-sm font-bold text-green-900">
        {locked ? "Unlock this student's portal?" : "Lock this student out of the portal?"}
      </p>
      <input
        className="input mt-2"
        placeholder="Reason (recorded on the account)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      {error && <p className="mt-2 text-xs font-semibold text-red-700">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className={locked ? "btn btn-primary" : "btn btn-danger"}
          disabled={busy}
          onClick={run}
        >
          {busy ? "Working…" : locked ? "Confirm unlock" : "Confirm lock"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
