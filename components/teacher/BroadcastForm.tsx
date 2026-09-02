"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone } from "lucide-react";

export default function BroadcastForm({ groups }: { groups: { id: string; name: string }[] }) {
  const router = useRouter();
  const [classGroupId, setClassGroupId] = useState(groups[0]?.id ?? "");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<number | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!classGroupId || !body.trim()) return;
    setBusy(true);
    setError(null);
    setSentTo(null);
    try {
      const res = await fetch("/api/teacher/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classGroupId, body: body.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not send the broadcast");
      setBody("");
      setSentTo(data.recipients ?? 0);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card-gold p-6">
      <h2 className="flex items-center gap-2 text-lg">
        <Megaphone className="h-5 w-5 text-gold-700" />
        Message the whole class
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Posts the same message to the board of every actively-enrolled student in the class.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-[240px_1fr]">
        <div>
          <label className="label" htmlFor="broadcast-class">Class</label>
          <select
            id="broadcast-class"
            className="select"
            value={classGroupId}
            onChange={(e) => setClassGroupId(e.target.value)}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="broadcast-body">Message</label>
          <textarea
            id="broadcast-body"
            className="textarea"
            rows={2}
            maxLength={4000}
            placeholder="e.g. No class this Thursday — we resume Monday inshaAllah."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-gold" disabled={busy || !classGroupId || !body.trim()}>
          {busy ? "Sending…" : "Send to class"}
        </button>
        {sentTo !== null && (
          <span className="text-sm font-semibold text-green-800">
            Sent to {sentTo} student{sentTo === 1 ? "" : "s"}.
          </span>
        )}
        {error && <span className="form-error mt-0!">{error}</span>}
      </div>
    </form>
  );
}
