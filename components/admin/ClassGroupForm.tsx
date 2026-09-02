"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi, poundsToPence } from "./api";
import { useModalClose } from "./Modal";

export type ClassGroupFormData = {
  id?: string;
  courseId: string;
  name: string;
  type: string;
  audience: string;
  teacherId: string | null;
  scheduleText: string | null;
  monthlyFeePence: number | null;
  hourlyFeePence: number | null;
  meetingLink: string | null;
  capacity: number | null;
  isActive: boolean;
};

/** Create (no `group.id`) or edit a class group. */
export default function ClassGroupForm({
  group,
  courses,
  teachers,
}: {
  group?: ClassGroupFormData;
  courses: { id: string; title: string }[];
  teachers: { id: string; name: string }[];
}) {
  const router = useRouter();
  const close = useModalClose();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const payload = {
      courseId: get("courseId"),
      name: get("name"),
      type: get("type"),
      audience: get("audience"),
      teacherId: get("teacherId") || null,
      scheduleText: get("scheduleText") || null,
      monthlyFeePence: poundsToPence(get("monthlyFee")),
      hourlyFeePence: poundsToPence(get("hourlyFee")),
      meetingLink: get("meetingLink") || null,
      capacity: get("capacity") ? Number(get("capacity")) : null,
      isActive: f.get("isActive") === "on",
    };
    try {
      if (group?.id) {
        await callApi(`/api/admin/classes/${group.id}`, "PATCH", payload);
      } else {
        await callApi("/api/admin/classes", "POST", payload);
      }
      router.refresh();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Course *</label>
          <select className="select" name="courseId" required defaultValue={group?.courseId ?? ""}>
            <option value="" disabled>Select course…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Group name *</label>
          <input className="input" name="name" required defaultValue={group?.name ?? ""} placeholder="e.g. Boys Mon–Thu 5–6pm" />
        </div>
        <div>
          <label className="label">Type</label>
          <select className="select" name="type" defaultValue={group?.type ?? "GROUP"}>
            <option value="GROUP">Group class</option>
            <option value="ONE_TO_ONE">One-to-one</option>
          </select>
        </div>
        <div>
          <label className="label">Audience</label>
          <select className="select" name="audience" defaultValue={group?.audience ?? "MIXED"}>
            <option value="ADULT">Adults</option>
            <option value="CHILD">Children</option>
            <option value="MIXED">Mixed</option>
          </select>
        </div>
        <div>
          <label className="label">Teacher</label>
          <select className="select" name="teacherId" defaultValue={group?.teacherId ?? ""}>
            <option value="">Unassigned</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Schedule</label>
          <input className="input" name="scheduleText" defaultValue={group?.scheduleText ?? ""} placeholder="e.g. Mon–Thu 5–6pm" />
        </div>
        <div>
          <label className="label">Monthly fee (£)</label>
          <input
            className="input"
            name="monthlyFee"
            inputMode="decimal"
            defaultValue={group?.monthlyFeePence != null ? (group.monthlyFeePence / 100).toFixed(2) : ""}
            placeholder="Group pricing"
          />
        </div>
        <div>
          <label className="label">Hourly fee (£)</label>
          <input
            className="input"
            name="hourlyFee"
            inputMode="decimal"
            defaultValue={group?.hourlyFeePence != null ? (group.hourlyFeePence / 100).toFixed(2) : ""}
            placeholder="1:1 pricing"
          />
        </div>
        <div>
          <label className="label">Meeting link</label>
          <input className="input" name="meetingLink" defaultValue={group?.meetingLink ?? ""} placeholder="https://…" />
        </div>
        <div>
          <label className="label">Capacity</label>
          <input className="input" name="capacity" type="number" min={1} defaultValue={group?.capacity ?? ""} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="isActive" defaultChecked={group?.isActive ?? true} />
        Group is active
      </label>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Saving…" : group?.id ? "Save changes" : "Create class group"}
      </button>
    </form>
  );
}
