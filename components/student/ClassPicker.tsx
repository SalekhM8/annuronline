"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Check } from "lucide-react";

export type ClassOption = {
  id: string;
  name: string;
  scheduleText: string | null;
  teacherName: string | null;
  seatsLeft: number | null; // null = unlimited
  current: boolean;
};

export default function ClassPicker({
  enrolmentId,
  options,
}: {
  enrolmentId: string;
  options: ClassOption[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function choose(classGroupId: string) {
    setBusy(classGroupId);
    setError(null);
    const res = await fetch("/api/student/class-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrolmentId, classGroupId }),
    });
    if (res.ok) {
      setDone(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not update your class — please try again.");
    }
    setBusy(null);
  }

  if (options.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        No alternative class times are open right now — contact the academy if your current time
        doesn&apos;t work.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {options.map((o) => (
        <div
          key={o.id}
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${
            o.current ? "border-gold-500 bg-gold-100/50" : "border-green-900/10 bg-white"
          }`}
        >
          <div className="min-w-0">
            <p className="font-bold text-green-900">{o.name}</p>
            <p className="text-sm text-ink-soft">
              {o.scheduleText ?? "Schedule to be confirmed"}
              {o.teacherName ? ` · ${o.teacherName}` : ""}
              {o.seatsLeft != null ? ` · ${o.seatsLeft} place${o.seatsLeft === 1 ? "" : "s"} left` : ""}
            </p>
          </div>
          {o.current ? (
            <span className="badge badge-gold">
              <Check className="h-3 w-3" /> Your class
            </span>
          ) : (
            <button
              onClick={() => choose(o.id)}
              disabled={busy !== null || o.seatsLeft === 0}
              className="btn-outline px-4 py-1.5 text-sm disabled:opacity-50"
            >
              <CalendarCheck className="h-4 w-4" />
              {busy === o.id ? "Saving…" : o.seatsLeft === 0 ? "Full" : "Choose this time"}
            </button>
          )}
        </div>
      ))}
      {error && <p className="form-error">{error}</p>}
      {done && !error && (
        <p className="text-sm font-bold text-green-700">Your class time has been updated.</p>
      )}
    </div>
  );
}
