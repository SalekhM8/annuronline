"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi, poundsToPence } from "./api";
import { useModalClose } from "./Modal";

/** Create and email a one-off (ad-hoc) invoice, e.g. 1:1 hourly lessons. */
export default function OneOffInvoiceForm({
  students,
}: {
  students: { id: string; name: string; email: string }[];
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
    const amountPence = poundsToPence(get("amount"));
    if (amountPence == null || amountPence <= 0) {
      setError("Enter a valid amount in pounds");
      setBusy(false);
      return;
    }
    try {
      await callApi("/api/admin/invoices", "POST", {
        studentId: get("studentId"),
        description: get("description"),
        amountPence,
        dueDate: get("dueDate"),
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
      <div>
        <label className="label">Student *</label>
        <select className="select" name="studentId" required defaultValue="">
          <option value="" disabled>Select student…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Description *</label>
        <input
          className="input"
          name="description"
          required
          placeholder='e.g. "1:1 Tajweed — 4 hours @ £15"'
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Amount (£) *</label>
          <input className="input" name="amount" inputMode="decimal" required placeholder="60.00" />
        </div>
        <div>
          <label className="label">Due date *</label>
          <input className="input" name="dueDate" type="date" required />
        </div>
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Creating…" : "Create & email invoice"}
      </button>
    </form>
  );
}
