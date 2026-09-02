"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";

type ModuleOption = { id: string; order: number; title: string };

export default function AddSessionForm({
  classGroupId,
  modules,
}: {
  classGroupId: string;
  modules: ModuleOption[];
}) {
  const router = useRouter();
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMins, setDurationMins] = useState(60);
  const [topic, setTopic] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (!scheduledAt) {
      setError("Please choose a date and time.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/teacher/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classGroupId,
          scheduledAt: new Date(scheduledAt).toISOString(),
          durationMins,
          topic: topic || undefined,
          moduleId: moduleId || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not add the session");
      setScheduledAt("");
      setTopic("");
      setModuleId("");
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="session-when">Date &amp; time</label>
        <input
          id="session-when"
          type="datetime-local"
          className="input"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="session-duration">Duration (minutes)</label>
        <input
          id="session-duration"
          type="number"
          className="input"
          min={15}
          max={300}
          step={5}
          value={durationMins}
          onChange={(e) => setDurationMins(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="label" htmlFor="session-topic">Topic (optional)</label>
        <input
          id="session-topic"
          type="text"
          className="input"
          maxLength={200}
          placeholder="e.g. Revision of lesson 4"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="session-module">Module (optional)</label>
        <select
          id="session-module"
          className="select"
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
        >
          <option value="">— No module —</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.order}. {m.title}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={busy}>
          <CalendarPlus className="h-4 w-4" />
          {busy ? "Adding…" : "Add session"}
        </button>
        {done && <span className="text-sm font-semibold text-green-700">Session added.</span>}
        {error && <span className="form-error mt-0!">{error}</span>}
      </div>
    </form>
  );
}
