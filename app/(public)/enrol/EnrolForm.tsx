"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";

const COURSE_OPTIONS = [
  { value: "Qa'idah", label: "Qa'idah" },
  { value: "Tajweed", label: "Tajweed & Qur'an Recitation" },
  { value: "Arabic Language", label: "Arabic Language" },
  { value: "Hifz", label: "Hifz al-Qur'an (one-to-one only)" },
  { value: "Islamic Studies", label: "Islamic Studies" },
  { value: "Weekly Tafsir", label: "Weekly Tafsir (free)" },
];

export default function EnrolForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [forWhom, setForWhom] = useState<"ADULT" | "CHILD">("ADULT");
  const [studentName, setStudentName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [format, setFormat] = useState("GROUP");
  const [preferredTimes, setPreferredTimes] = useState("");
  const [comments, setComments] = useState("");
  const [heardAbout, setHeardAbout] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function toggleCourse(value: string) {
    setCourses((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (courses.length === 0) {
      setError("Please choose at least one course.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/public/enrol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          forWhom,
          studentName: forWhom === "CHILD" ? studentName : undefined,
          relationship: forWhom === "CHILD" ? relationship : undefined,
          age: forWhom === "CHILD" && age ? Number(age) : undefined,
          gender: gender || undefined,
          courses,
          format,
          preferredTimes,
          comments,
          heardAbout,
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
        <h2 className="mt-4 text-2xl">JazakAllahu khairan — application received</h2>
        <div className="mx-auto mt-4 max-w-xl space-y-3 text-left text-sm text-ink-soft">
          <p className="font-bold text-green-900">What happens next:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Our team reviews your application — usually within 1–2 working days.</li>
            <li>
              You&rsquo;ll receive a <strong>welcome email</strong> with a secure link to set up
              your monthly direct debit.
            </li>
            <li>
              Once payment is set up, your <strong>student portal login</strong> is activated and
              you can choose your class times.
            </li>
          </ol>
          <p>
            Haven&rsquo;t had your placement assessment yet?{" "}
            <Link href="/assessment" className="font-bold text-green-700 hover:underline">
              Book a free 20-minute assessment
            </Link>{" "}
            while you wait.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6 p-8 md:p-10">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fullName">Your full name *</label>
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
          <label className="label" htmlFor="forWhom">Who is enrolling? *</label>
          <select id="forWhom" className="select" value={forWhom} onChange={(e) => setForWhom(e.target.value as "ADULT" | "CHILD")}>
            <option value="ADULT">Myself (adult)</option>
            <option value="CHILD">My child</option>
          </select>
        </div>
      </div>

      {forWhom === "CHILD" && (
        <div className="rounded-xl bg-green-50 p-5">
          <p className="label">About your child</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="studentName">Child&rsquo;s full name *</label>
              <input id="studentName" className="input" value={studentName} onChange={(e) => setStudentName(e.target.value)} required maxLength={120} />
            </div>
            <div>
              <label className="label" htmlFor="relationship">Your relationship *</label>
              <select id="relationship" className="select" value={relationship} onChange={(e) => setRelationship(e.target.value)} required>
                <option value="">Select…</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="age">Child&rsquo;s age *</label>
              <input id="age" type="number" min={3} max={17} className="input" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="label" htmlFor="gender">Student gender (helps us place classes)</label>
        <select id="gender" className="select" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Prefer not to say</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div>
        <p className="label">Course(s) *</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {COURSE_OPTIONS.map((c) => (
            <label
              key={c.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 text-sm font-semibold transition-colors ${
                courses.includes(c.value)
                  ? "border-green-700 bg-green-50 text-green-900"
                  : "border-green-900/15 text-ink hover:bg-green-50/60"
              }`}
            >
              <input
                type="checkbox"
                className="accent-[var(--green-700)]"
                checked={courses.includes(c.value)}
                onChange={() => toggleCourse(c.value)}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="format">Group or one-to-one? *</label>
          <select id="format" className="select" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="GROUP">Group classes</option>
            <option value="ONE_TO_ONE">One-to-one</option>
            <option value="NOT_SURE">Not sure yet — advise me</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="preferredTimes">Preferred days &amp; times</label>
          <input
            id="preferredTimes"
            className="input"
            placeholder="e.g. weekday evenings after 6pm"
            value={preferredTimes}
            onChange={(e) => setPreferredTimes(e.target.value)}
            maxLength={300}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="heardAbout">How did you hear about us?</label>
        <select id="heardAbout" className="select" value={heardAbout} onChange={(e) => setHeardAbout(e.target.value)}>
          <option value="">Select…</option>
          <option value="Friend or family">Friend or family</option>
          <option value="Social media">Social media</option>
          <option value="Search engine">Search engine</option>
          <option value="Mosque or community">Mosque or community</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="label" htmlFor="comments">Anything else we should know?</label>
        <textarea
          id="comments"
          className="textarea"
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          maxLength={2000}
          placeholder="Previous learning, goals, accessibility needs — anything that helps us help you."
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={busy} className="btn-gold w-full">
        <Send className="h-4 w-4" />
        {busy ? "Submitting…" : "Submit application"}
      </button>
      <p className="text-center text-xs text-ink-soft">
        We use your details only to process your enrolment. See our{" "}
        <Link href="/policies#data-protection" className="font-semibold text-green-700 hover:underline">
          data protection notice
        </Link>
        .
      </p>
    </form>
  );
}
