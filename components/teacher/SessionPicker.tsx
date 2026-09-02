"use client";

import { useRouter } from "next/navigation";

export default function SessionPicker({
  sessions,
  selectedId,
}: {
  sessions: { id: string; label: string }[];
  selectedId: string;
}) {
  const router = useRouter();
  return (
    <div className="max-w-xl">
      <label className="label" htmlFor="register-session">Session</label>
      <select
        id="register-session"
        className="select"
        value={selectedId}
        onChange={(e) => router.push(`/teacher/register?session=${e.target.value}`)}
      >
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
