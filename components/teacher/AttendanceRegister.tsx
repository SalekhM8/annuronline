"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { MailCheck, Save } from "lucide-react";

type Status = "PRESENT" | "LATE" | "ABSENT";

type RosterRow = {
  studentId: string;
  name: string;
  status: Status | null;
  note: string;
  absenceEmailSent: boolean;
};

const OPTIONS: { value: Status; label: string; active: string }[] = [
  { value: "PRESENT", label: "Present", active: "bg-green-700 text-white border-green-700" },
  { value: "LATE", label: "Late", active: "bg-gold-500 text-green-950 border-gold-500" },
  { value: "ABSENT", label: "Absent", active: "bg-[#b3372f] text-white border-[#b3372f]" },
];

export default function AttendanceRegister({
  sessionId,
  roster,
}: {
  sessionId: string;
  roster: RosterRow[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<RosterRow[]>(roster);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function setStatus(studentId: string, status: Status) {
    setRows((r) => r.map((row) => (row.studentId === studentId ? { ...row, status } : row)));
    setSavedAt(null);
  }

  function setNote(studentId: string, note: string) {
    setRows((r) => r.map((row) => (row.studentId === studentId ? { ...row, note } : row)));
    setSavedAt(null);
  }

  async function save() {
    const entries = rows
      .filter((r) => r.status !== null)
      .map((r) => ({ studentId: r.studentId, status: r.status as Status, note: r.note || undefined }));
    if (entries.length === 0) {
      setError("Mark at least one student before saving.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, entries }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not save the register");
      const sentMap = new Map<string, boolean>(
        (data.results ?? []).map((r: { studentId: string; absenceEmailSent: boolean }) => [
          r.studentId,
          r.absenceEmailSent,
        ])
      );
      setRows((r) =>
        r.map((row) =>
          sentMap.has(row.studentId)
            ? { ...row, absenceEmailSent: sentMap.get(row.studentId) ?? row.absenceEmailSent }
            : row
        )
      );
      setSavedAt(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Attendance</th>
              <th>Note (optional)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.studentId}>
                <td className="whitespace-nowrap font-semibold text-green-900">
                  {row.name}
                  {row.absenceEmailSent && (
                    <span
                      className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-green-700"
                      title="An absence email has been sent for this session"
                    >
                      <MailCheck className="h-3.5 w-3.5" /> absence email sent
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex gap-1.5">
                    {OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStatus(row.studentId, opt.value)}
                        className={clsx(
                          "rounded-full border px-3 py-1 text-xs font-bold transition",
                          row.status === opt.value
                            ? opt.active
                            : "border-ink-soft/25 bg-white text-ink-soft hover:border-green-700 hover:text-green-800"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </td>
                <td>
                  <input
                    type="text"
                    className="input py-1.5! text-sm"
                    maxLength={500}
                    placeholder="e.g. left early"
                    value={row.note}
                    onChange={(e) => setNote(row.studentId, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={save} disabled={busy}>
          <Save className="h-4 w-4" />
          {busy ? "Saving…" : "Save register"}
        </button>
        {savedAt && <span className="text-sm font-semibold text-green-700">Saved at {savedAt}.</span>}
        {error && <span className="form-error mt-0!">{error}</span>}
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        Marking a student absent automatically emails their guardian (or the student) asking for a
        brief explanation. The email is sent once per session.
      </p>
    </div>
  );
}
