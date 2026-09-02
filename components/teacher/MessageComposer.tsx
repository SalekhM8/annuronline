"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export default function MessageComposer({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, body: body.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not post the message");
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 border-t border-green-900/10 pt-4">
      <label className="label" htmlFor="board-message">Write on this board</label>
      <textarea
        id="board-message"
        className="textarea"
        rows={3}
        maxLength={4000}
        placeholder="Assalamu alaikum…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <div className="mt-3 flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={busy || !body.trim()}>
          <Send className="h-4 w-4" />
          {busy ? "Posting…" : "Post message"}
        </button>
        {error && <span className="form-error mt-0!">{error}</span>}
      </div>
      <p className="mt-2 text-xs text-ink-soft">Board messages are permanent and cannot be edited or deleted.</p>
    </form>
  );
}
