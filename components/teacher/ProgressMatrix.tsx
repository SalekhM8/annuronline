"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Check, Play } from "lucide-react";

type Status = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
type MatrixModule = { id: string; order: number; title: string };
type MatrixRow = {
  enrolmentId: string;
  studentName: string;
  progress: Record<string, Status>;
};

const DOT: Record<Status, string> = {
  NOT_STARTED: "bg-cream-deep border border-ink-soft/30",
  IN_PROGRESS: "bg-gold-500",
  COMPLETED: "bg-green-700",
};

const LABEL: Record<Status, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

export default function ProgressMatrix({
  modules,
  rows,
}: {
  modules: MatrixModule[];
  rows: MatrixRow[];
}) {
  const router = useRouter();
  const [busyCell, setBusyCell] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(enrolmentId: string, moduleId: string, action: "start" | "complete") {
    const key = `${enrolmentId}:${moduleId}`;
    setBusyCell(key);
    setError(null);
    try {
      const res = await fetch("/api/teacher/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrolmentId, moduleId, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not update progress");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyCell(null);
    }
  }

  if (modules.length === 0 || rows.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        Progress appears here once the course has modules and the class has enrolled students.
      </p>
    );
  }

  return (
    <div>
      {error && <p className="form-error mb-2">{error}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              {modules.map((m) => (
                <th key={m.id} className="text-center" title={m.title}>
                  M{m.order}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.enrolmentId}>
                <td className="whitespace-nowrap font-semibold text-green-900">{row.studentName}</td>
                {modules.map((m) => {
                  const status: Status = row.progress[m.id] ?? "NOT_STARTED";
                  const key = `${row.enrolmentId}:${m.id}`;
                  const busy = busyCell === key;
                  return (
                    <td key={m.id} className="text-center">
                      <div className="inline-flex flex-col items-center gap-1.5">
                        <span
                          className={clsx("inline-block h-3.5 w-3.5 rounded-full", DOT[status], busy && "animate-pulse")}
                          title={`${m.title} — ${LABEL[status]}`}
                        />
                        <span className="flex gap-1">
                          {status === "NOT_STARTED" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => update(row.enrolmentId, m.id, "start")}
                              title={`Mark "${m.title}" in progress`}
                              className="rounded-md bg-gold-100 p-1 text-gold-700 transition hover:bg-gold-300 disabled:opacity-50"
                            >
                              <Play className="h-3 w-3" />
                            </button>
                          )}
                          {status !== "COMPLETED" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => update(row.enrolmentId, m.id, "complete")}
                              title={`Mark "${m.title}" complete (issues certificate)`}
                              className="rounded-md bg-green-100 p-1 text-green-800 transition hover:bg-green-600 hover:text-white disabled:opacity-50"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className={clsx("inline-block h-2.5 w-2.5 rounded-full", DOT.NOT_STARTED)} /> Not started
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={clsx("inline-block h-2.5 w-2.5 rounded-full", DOT.IN_PROGRESS)} /> In progress
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={clsx("inline-block h-2.5 w-2.5 rounded-full", DOT.COMPLETED)} /> Completed
        </span>
        <span>Marking complete issues the certificate and emails the student automatically.</span>
      </p>
    </div>
  );
}
