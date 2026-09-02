"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

/** Compose box for the student's own immutable message board. */
export default function MessageComposer() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/student/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-4">
      <label className="label" htmlFor="board-message">
        Write on your board
      </label>
      <textarea
        id="board-message"
        className="textarea"
        rows={3}
        maxLength={4000}
        placeholder="Ask your teacher a question, or leave a note…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {error && <p className="form-error">{error}</p>}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-ink-soft">
          Messages are permanent — they cannot be edited or deleted once posted.
        </p>
        <button
          type="submit"
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!body.trim() || busy}
        >
          <Send className="h-4 w-4" /> {busy ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
