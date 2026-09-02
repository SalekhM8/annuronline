"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";

const TYPES = [
  { value: "PERSONAL", label: "Personal" },
  { value: "YOUTH", label: "Youth" },
  { value: "MARRIAGE", label: "Marriage" },
  { value: "BENEFITS_FINANCE", label: "Benefits & Finance" },
];

export default function CounsellingForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("PERSONAL");
  const [method, setMethod] = useState("ONLINE");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/public/counselling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, type, method, message }),
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
      <div className="card p-8 text-center md:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-700" />
        <h2 className="mt-4 text-2xl">Request received, in confidence</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          JazakAllahu khairan for reaching out — that first step is often the hardest. We will
          contact you discreetly to arrange a time and discuss the session fee.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-8 md:p-10">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fullName">Full name *</label>
          <input id="fullName" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={120} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
        </div>
        <div>
          <label className="label" htmlFor="type">Type of counselling *</label>
          <select id="type" className="select" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="method">In person or online? *</label>
          <select id="method" className="select" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">In person</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Briefly, what would you like help with?</label>
        <textarea
          id="message"
          className="textarea"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          placeholder="Share only what you're comfortable sharing — everything is confidential."
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary w-full">
        <Send className="h-4 w-4" />
        {busy ? "Sending…" : "Request a session"}
      </button>
      <p className="text-center text-xs text-ink-soft">
        Your request is handled in strict confidence. See our{" "}
        <Link href="/policies#data-protection" className="font-semibold text-green-700 hover:underline">
          data protection notice
        </Link>
        .
      </p>
    </form>
  );
}
