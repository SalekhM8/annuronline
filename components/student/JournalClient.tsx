"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotebookPen, Pencil, Plus, X } from "lucide-react";

export type JournalEntryDto = {
  id: string;
  title: string | null;
  content: string;
  entryDate: string; // ISO
  entryDateLabel: string; // pre-formatted en-GB
  updatedAtLabel: string;
  wasEdited: boolean;
};

function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function EntryForm({
  initial,
  busy,
  error,
  onSubmit,
  onCancel,
}: {
  initial?: { title: string; content: string; entryDate: string };
  busy: boolean;
  error: string | null;
  onSubmit: (v: { title: string; content: string; entryDate: string }) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [entryDate, setEntryDate] = useState(initial?.entryDate ?? toDateInputValue(new Date().toISOString()));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (content.trim()) onSubmit({ title: title.trim(), content: content.trim(), entryDate });
      }}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="label">Title (optional)</label>
          <input
            className="input"
            maxLength={200}
            placeholder="e.g. Surah Al-Falaq revision"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label">What did you learn?</label>
        <textarea
          className="textarea"
          rows={5}
          maxLength={20000}
          placeholder="Reflections, new vocabulary, verses memorised, questions to ask…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!content.trim() || busy}
        >
          {busy ? "Saving…" : "Save entry"}
        </button>
        {onCancel && (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            <X className="h-4 w-4" /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}

/** Learning journal: list, create and edit the student's own entries. */
export default function JournalClient({ entries }: { entries: JournalEntryDto[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(url: string, method: "POST" | "PATCH", payload: object) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      setCreating(false);
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {creating ? (
        <div className="card p-5">
          <p className="mb-3 font-bold text-green-900">New journal entry</p>
          <EntryForm
            busy={busy}
            error={error}
            onCancel={() => {
              setCreating(false);
              setError(null);
            }}
            onSubmit={(v) =>
              save("/api/student/journal", "POST", {
                title: v.title || undefined,
                content: v.content,
                entryDate: v.entryDate || undefined,
              })
            }
          />
        </div>
      ) : (
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setCreating(true);
            setEditingId(null);
            setError(null);
          }}
        >
          <Plus className="h-4 w-4" /> New entry
        </button>
      )}

      {entries.length === 0 && !creating && (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <NotebookPen className="h-10 w-10 text-green-600/40" />
          <p className="mt-3 font-bold text-green-900">Your journal is empty</p>
          <p className="mt-1 text-sm text-ink-soft">
            Keep a note of what you learn after each lesson — it makes revision much easier.
          </p>
        </div>
      )}

      {entries.map((entry) =>
        editingId === entry.id ? (
          <div key={entry.id} className="card p-5">
            <p className="mb-3 font-bold text-green-900">Edit entry</p>
            <EntryForm
              initial={{
                title: entry.title ?? "",
                content: entry.content,
                entryDate: toDateInputValue(entry.entryDate),
              }}
              busy={busy}
              error={error}
              onCancel={() => {
                setEditingId(null);
                setError(null);
              }}
              onSubmit={(v) =>
                save(`/api/student/journal/${entry.id}`, "PATCH", {
                  title: v.title || null,
                  content: v.content,
                  entryDate: v.entryDate || undefined,
                })
              }
            />
          </div>
        ) : (
          <article key={entry.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wide text-gold-700">
                  {entry.entryDateLabel}
                </p>
                {entry.title && <h2 className="mt-0.5 text-lg">{entry.title}</h2>}
              </div>
              <button
                type="button"
                className="btn-ghost shrink-0 !px-3 !py-1.5 text-sm"
                onClick={() => {
                  setEditingId(entry.id);
                  setCreating(false);
                  setError(null);
                }}
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">{entry.content}</p>
            {entry.wasEdited && (
              <p className="mt-3 text-xs text-ink-soft">Last edited {entry.updatedAtLabel}</p>
            )}
          </article>
        )
      )}
    </div>
  );
}
