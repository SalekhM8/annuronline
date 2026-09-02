"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CONVERTED", "DECLINED"] as const;

/** Booking pipeline control for assessment / counselling bookings. */
export default function BookingStatusControl({
  kind,
  bookingId,
  status,
  scheduledAt,
}: {
  kind: "assessment" | "counselling";
  bookingId: string;
  status: string;
  scheduledAt: string | null; // ISO or null
}) {
  const router = useRouter();
  const [next, setNext] = useState(status);
  const [when, setWhen] = useState(() => {
    if (!scheduledAt) return "";
    const d = new Date(scheduledAt);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = next !== status || (next === "CONFIRMED" && when !== "");

  async function save() {
    if (next === "CONFIRMED" && !when) {
      setError("Set a date & time to confirm");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await callApi(`/api/admin/bookings/${kind}/${bookingId}`, "PATCH", {
        status: next,
        scheduledAt: next === "CONFIRMED" && when ? new Date(when).toISOString() : undefined,
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className="select !w-auto" value={next} onChange={(e) => setNext(e.target.value)}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
        ))}
      </select>
      {next === "CONFIRMED" && (
        <input
          className="input !w-auto"
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
        />
      )}
      <button type="button" className="btn btn-outline" disabled={busy || !dirty} onClick={save}>
        {busy ? "Saving…" : "Update"}
      </button>
      {error && <span className="text-xs font-semibold text-red-700">{error}</span>}
    </div>
  );
}
