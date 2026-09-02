"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

/** Post to a student's message board as the admin. */
export default function BoardPostForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await callApi(`/api/admin/students/${studentId}/messages`, "POST", { body: body.trim() });
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <textarea
        className="textarea"
        rows={3}
        placeholder="Write a message to this student…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy || !body.trim()}>
        {busy ? "Posting…" : "Post message"}
      </button>
    </form>
  );
}
