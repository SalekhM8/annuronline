"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi, poundsToPence } from "./api";
import { useModalClose } from "./Modal";

export type EditableEnrolment = {
  id: string;
  status: string;
  classGroupId: string | null;
  paymentDayOfMonth: number;
  feePenceOverride: number | null;
  groups: { id: string; name: string }[]; // groups on this enrolment's course
};

/** Edit class group / payment day / fee override, or cancel the enrolment. */
export default function EnrolmentEditor({ enrolment }: { enrolment: EditableEnrolment }) {
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
      await callApi(`/api/admin/enrolments/${enrolment.id}`, "PATCH", {
        classGroupId: get("classGroupId") || null,
        paymentDayOfMonth: Number(get("paymentDayOfMonth") || "1"),
        feePenceOverride: poundsToPence(get("feeOverride")),
      });
      router.refresh();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function cancelEnrolment() {
    if (!window.confirm("Cancel this enrolment? The student keeps their account but this course ends.")) return;
    setBusy(true);
    setError(null);
    try {
      await callApi(`/api/admin/enrolments/${enrolment.id}`, "PATCH", { action: "cancel" });
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
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Class group</label>
          <select className="select" name="classGroupId" defaultValue={enrolment.classGroupId ?? ""}>
            <option value="">No group</option>
            {enrolment.groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Payment day (1–28)</label>
          <input
            className="input"
            name="paymentDayOfMonth"
            type="number"
            min={1}
            max={28}
            defaultValue={enrolment.paymentDayOfMonth}
          />
        </div>
        <div>
          <label className="label">Fee override (£/month)</label>
          <input
            className="input"
            name="feeOverride"
            inputMode="decimal"
            defaultValue={enrolment.feePenceOverride != null ? (enrolment.feePenceOverride / 100).toFixed(2) : ""}
            placeholder="Blank = group fee"
          />
        </div>
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
        {enrolment.status !== "CANCELLED" && (
          <button type="button" className="btn btn-danger" disabled={busy} onClick={cancelEnrolment}>
            Cancel enrolment
          </button>
        )}
      </div>
    </form>
  );
}
