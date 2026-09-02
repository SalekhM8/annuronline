"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";

const COURSE_OPTIONS = [
  "Qa'idah",
  "Tajweed & Qur'an Recitation",
  "Arabic Language",
  "Hifz al-Qur'an",
  "Islamic Studies",
  "Not sure yet",
];

export default function AssessmentForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [audience, setAudience] = useState<"ADULT" | "CHILD">("ADULT");
  const [courseInterest, setCourseInterest] = useState("");
  const [preferredTimes, setPreferredTimes] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/public/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          audience,
          courseInterest: courseInterest || undefined,
          preferredTimes,
          notes,
        }),
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
        <h2 className="mt-4 text-2xl">Booking request received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          JazakAllahu khairan. We&rsquo;ll be in touch shortly — usually within 1–2 working days —
          to confirm a time for your free 20-minute assessment.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          Already know what you want to study?{" "}
          <Link href="/enrol" className="font-bold text-green-700 hover:underline">
            You can enrol now
          </Link>
          .
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
          <label className="label" htmlFor="phone">Phone *</label>
          <input id="phone" type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={30} />
        </div>
        <div>
          <label className="label" htmlFor="audience">Who is the assessment for? *</label>
          <select id="audience" className="select" value={audience} onChange={(e) => setAudience(e.target.value as "ADULT" | "CHILD")}>
            <option value="ADULT">Myself (adult)</option>
            <option value="CHILD">My child</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="courseInterest">Course of interest</label>
          <select id="courseInterest" className="select" value={courseInterest} onChange={(e) => setCourseInterest(e.target.value)}>
            <option value="">Select…</option>
            {COURSE_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="preferredTimes">Preferred days &amp; times</label>
          <input
            id="preferredTimes"
            className="input"
            placeholder="e.g. weekends, or evenings after 6pm"
            value={preferredTimes}
            onChange={(e) => setPreferredTimes(e.target.value)}
            maxLength={300}
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          className="textarea"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
          placeholder="Any previous learning, goals, or questions for the teacher."
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary w-full">
        <Send className="h-4 w-4" />
        {busy ? "Sending…" : "Request my free assessment"}
      </button>
      <p className="text-center text-xs text-ink-soft">
        Free, friendly and without obligation. See our{" "}
        <Link href="/policies#data-protection" className="font-semibold text-green-700 hover:underline">
          data protection notice
        </Link>
        .
      </p>
    </form>
  );
}
