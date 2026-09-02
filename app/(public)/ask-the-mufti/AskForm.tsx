"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";

export default function AskForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/public/ask-mufti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, email, question }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card p-8 text-center md:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-700" />
        <h2 className="mt-4 text-2xl">Question received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          JazakAllahu khairan. Mufti Ateiq will consider your question carefully and reply to your
          email. Some answers, fully anonymised, are also published below to benefit others.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-8 md:p-10">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name (optional)</label>
          <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder="You may stay anonymous" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email * (for your answer)</label>
          <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="question">Your question *</label>
        <textarea
          id="question"
          className="textarea"
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          minLength={10}
          maxLength={3000}
          placeholder="Ask anything — matters of worship, daily life, family, finance…"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary w-full">
        <Send className="h-4 w-4" />
        {busy ? "Sending…" : "Submit your question"}
      </button>
      <p className="text-center text-xs text-ink-soft">
        Your name and email are never published. See our{" "}
        <Link href="/policies#data-protection" className="font-semibold text-green-700 hover:underline">
          data protection notice
        </Link>
        .
      </p>
    </form>
  );
}
