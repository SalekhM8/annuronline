"use client";

import { useEffect, useState } from "react";
import { Lock, Star } from "lucide-react";

type Submission = {
  id: string;
  createdAt: string;
  type: "ASSESSMENT" | "ENROLLMENT";
  fullName: string;
  email: string;
  courses: string; // comma-separated
} & Partial<{
  phone: string;
  forWhom: string;
  studentName: string;
  relationship: string;
  age: number;
  gender: string;
  preferences: string;
  comments: string;
  heardAbout: string;
}>;

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
      <div className="py-10 max-w-md mx-auto">
        <div className="fun-box-white space-y-6">
          <h1 className="text-3xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
            <Lock className="w-10 h-10" />
            Admin Login
          </h1>
          <form className="space-y-4" onSubmit={login}>
            <input 
              className="w-full rounded-2xl border-2 border-[--brand-gold]/40 p-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[--brand-green]/30 focus:border-[--brand-green]/60 transition-all shadow-sm" 
              style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {loginError && <p className="text-sm text-red-600 font-semibold">{loginError}</p>}
            <button className="btn-fun w-full flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-playful gradient-text flex items-center justify-center gap-3 mb-8">
        <Star className="w-12 h-12" fill="currentColor" />
        Submissions
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-4">
        {submissions.map((s) => (
          <button 
            key={s.id} 
            className="rounded-2xl p-6 text-left shadow-lg border border-white/40 transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5))',
              backdropFilter: 'blur(20px) saturate(180%)',
            }}
            onClick={() => setSelected(s)}
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg text-brand-green">{s.fullName}</div>
              <div className="text-xs text-neutral-600 font-semibold">{new Date(s.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-sm text-brand-green-dark font-semibold">{s.email} — {s.type} — {s.courses}</div>
          </button>
        ))}
      </div>

      {selected && (
        <dialog open className="fixed inset-0 z-50 bg-black/50 p-4 backdrop-blur-sm">
          <div 
            className="mx-auto max-w-2xl rounded-3xl p-8 shadow-2xl border border-white/40"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
              backdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-playful gradient-text">Submission Details</h3>
              <button className="btn-fun-gold flex items-center gap-2" onClick={() => setSelected(null)}>
                <Star className="w-4 h-4" fill="currentColor" />
                Close
              </button>
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
                <div className="text-xs font-bold text-brand-green">Courses</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.courses.split(",").map((c) => (
                    <span 
                      key={c} 
                      className="rounded-full border border-[--brand-gold]/40 px-4 py-2 text-xs font-bold text-brand-green-dark shadow-sm"
                      style={{
                        background: 'linear-gradient(145deg, rgba(253,185,39,0.2), rgba(253,185,39,0.1))',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {c.trim()}
                    </span>
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
    <div 
      className="rounded-xl border border-white/40 p-4 shadow-sm"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4))',
        backdropFilter: 'blur(10px) saturate(180%)',
      }}
    >
      <div className="text-xs font-bold text-brand-green">{label}</div>
      <div className="text-sm font-semibold text-brand-green-dark mt-1">{value}</div>
    </div>
  );
}

function DetailWide({ label, value }: { label: string; value: string }) {
  return (
    <div 
      className="col-span-1 sm:col-span-2 rounded-xl border border-white/40 p-4 shadow-sm"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4))',
        backdropFilter: 'blur(10px) saturate(180%)',
      }}
    >
      <div className="text-xs font-bold text-brand-green">{label}</div>
      <div className="text-sm font-semibold text-brand-green-dark mt-1 whitespace-pre-wrap">{value}</div>
    </div>
  );
}


