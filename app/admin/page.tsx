"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  createdAt: string;
  type: "ASSESSMENT" | "ENROLLMENT";
  fullName: string;
  email: string;
  courses: string;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/admin/submissions").then((r) => r.json()).then((d) => setSubmissions(d.items));
  }, [authed]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError("Incorrect password");
    }
  }

  if (!authed) {
    return (
      <div className="py-10">
        <h1 className="text-3xl font-semibold">Admin</h1>
        <form className="mt-6 max-w-sm space-y-3" onSubmit={login}>
          <input className="w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button className="btn-primary">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Submissions</h1>
      <div className="mt-6 grid grid-cols-1 gap-4">
        {submissions.map((s) => (
          <button key={s.id} className="rounded-2xl bg-white/90 p-4 text-left shadow-sm ring-1 ring-[--brand-gold]/20 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[--brand-gold]/40 cursor-pointer" onClick={() => setSelected(s)}>
            <div className="flex items-center justify-between">
              <div className="font-medium">{s.fullName}</div>
              <div className="text-xs text-neutral-600">{new Date(s.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-1 text-sm text-neutral-700">{s.email} — {s.type} — {s.courses}</div>
          </button>
        ))}
      </div>

      {selected && (
        <dialog open className="fixed inset-0 z-50 bg-black/40 p-4">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white/90 p-6 shadow-xl ring-1 ring-[--brand-gold]/40 backdrop-blur">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Submission Detail</h3>
              <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail label="Type" value={selected.type} />
              <Detail label="Created" value={new Date(selected.createdAt).toLocaleString()} />
              <Detail label="Full name" value={selected.fullName} />
              <Detail label="Email" value={selected.email} />
              {selected.phone && <Detail label="Phone" value={selected.phone} />}
              {selected.forWhom && <Detail label="For" value={selected.forWhom} />}
              {selected.studentName && <Detail label="Student" value={selected.studentName} />}
              {selected.relationship && <Detail label="Relationship" value={selected.relationship} />}
              {selected.age !== undefined && <Detail label="Age" value={String(selected.age)} />}
              {selected.gender && <Detail label="Gender" value={selected.gender} />}
              <div className="col-span-1 sm:col-span-2">
                <div className="text-xs font-semibold text-neutral-700">Courses</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.courses.split(",").map((c) => (
                    <span key={c} className="rounded-full border border-[--brand-gold]/30 bg-gold-soft px-3 py-1 text-xs">{c.trim()}</span>
                  ))}
                </div>
              </div>
              {selected.preferences && <DetailWide label="Preferences" value={selected.preferences} />}
              {selected.comments && <DetailWide label="Comments" value={selected.comments} />}
              {selected.heardAbout && <DetailWide label="Heard about" value={selected.heardAbout} />}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[--brand-gold]/30 bg-white/80 p-3 ring-1 ring-[--brand-gold]/20">
      <div className="text-xs font-semibold text-neutral-700">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function DetailWide({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-1 sm:col-span-2 rounded-xl border border-[--brand-gold]/30 bg-white/80 p-3 ring-1 ring-[--brand-gold]/20">
      <div className="text-xs font-semibold text-neutral-700">{label}</div>
      <div className="text-sm whitespace-pre-wrap">{value}</div>
    </div>
  );
}


