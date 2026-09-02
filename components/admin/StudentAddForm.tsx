"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { callApi, poundsToPence } from "./api";

export type CourseOption = { id: string; title: string };
export type GroupOption = {
  id: string;
  courseId: string;
  name: string;
  type: string;
  monthlyFeePence: number | null;
  hourlyFeePence: number | null;
};

export default function StudentAddForm({
  courses,
  groups,
}: {
  courses: CourseOption[];
  groups: GroupOption[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ studentId: string; tempPassword: string } | null>(null);
  const [isChild, setIsChild] = useState(false);
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");

  const courseGroups = groups.filter((g) => g.courseId === courseId);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    try {
      const data = await callApi<{ ok: boolean; studentId: string; tempPassword: string }>(
        "/api/admin/students",
        "POST",
        {
          firstName: get("firstName"),
          lastName: get("lastName"),
          email: get("email"),
          phone: get("phone") || undefined,
          dateOfBirth: get("dateOfBirth") || undefined,
          gender: get("gender") || undefined,
          isChild,
          guardianName: isChild ? get("guardianName") || undefined : undefined,
          guardianEmail: isChild ? get("guardianEmail") || undefined : undefined,
          guardianPhone: isChild ? get("guardianPhone") || undefined : undefined,
          notes: get("notes") || undefined,
          enrolment: {
            courseId: get("courseId"),
            classGroupId: get("classGroupId") || undefined,
            mode: get("mode"),
            paymentDayOfMonth: Number(get("paymentDayOfMonth") || "1"),
            feePenceOverride: poundsToPence(get("feeOverride")) ?? undefined,
          },
        }
      );
      setResult({ studentId: data.studentId, tempPassword: data.tempPassword });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="card p-6">
        <h2 className="text-lg">Student created</h2>
        <p className="mt-2 text-sm text-ink-soft">
          The welcome email (with the direct-debit setup link) and the portal login email have been
          sent. If email delivery fails, share these details securely — the temporary password is
          shown only once:
        </p>
        <p className="mt-4 rounded-xl bg-cream-deep p-4 text-center text-xl font-extrabold tracking-wider text-green-900">
          {result.tempPassword}
        </p>
        <div className="mt-6 flex gap-2">
          <Link href={`/admin/students/${result.studentId}`} className="btn btn-primary">
            Open student profile
          </Link>
          <Link href="/admin/students" className="btn btn-outline">
            Back to register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-6 p-6">
      <div>
        <h2 className="text-lg">Personal details</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="firstName">First name *</label>
            <input className="input" id="firstName" name="firstName" required />
          </div>
          <div>
            <label className="label" htmlFor="lastName">Last name *</label>
            <input className="input" id="lastName" name="lastName" required />
          </div>
          <div>
            <label className="label" htmlFor="email">Email *</label>
            <input className="input" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input className="input" id="phone" name="phone" />
          </div>
          <div>
            <label className="label" htmlFor="dateOfBirth">Date of birth</label>
            <input className="input" id="dateOfBirth" name="dateOfBirth" type="date" />
          </div>
          <div>
            <label className="label" htmlFor="gender">Gender</label>
            <select className="select" id="gender" name="gender" defaultValue="">
              <option value="">Not specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={isChild}
            onChange={(e) => setIsChild(e.target.checked)}
          />
          Student is a child (under 18)
        </label>
        {isChild && (
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="guardianName">Guardian name *</label>
              <input className="input" id="guardianName" name="guardianName" required />
            </div>
            <div>
              <label className="label" htmlFor="guardianEmail">Guardian email *</label>
              <input className="input" id="guardianEmail" name="guardianEmail" type="email" required />
            </div>
            <div>
              <label className="label" htmlFor="guardianPhone">Guardian phone</label>
              <input className="input" id="guardianPhone" name="guardianPhone" />
            </div>
          </div>
        )}
        <div className="mt-4">
          <label className="label" htmlFor="notes">Admin notes (not visible to the student)</label>
          <textarea className="textarea" id="notes" name="notes" rows={2} />
        </div>
      </div>

      <div>
        <h2 className="text-lg">Initial enrolment</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="courseId">Course *</label>
            <select
              className="select"
              id="courseId"
              name="courseId"
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="classGroupId">Class group</label>
            <select className="select" id="classGroupId" name="classGroupId" defaultValue="">
              <option value="">No group yet</option>
              {courseGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                  {g.monthlyFeePence != null ? ` — £${(g.monthlyFeePence / 100).toFixed(2)}/month` : ""}
                  {g.hourlyFeePence != null ? ` — £${(g.hourlyFeePence / 100).toFixed(2)}/hour` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="mode">Learning mode *</label>
            <select className="select" id="mode" name="mode" defaultValue="LIVE" required>
              <option value="LIVE">Live classes</option>
              <option value="DISTANCE">Distance learning</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="paymentDayOfMonth">Payment day of month</label>
            <input
              className="input"
              id="paymentDayOfMonth"
              name="paymentDayOfMonth"
              type="number"
              min={1}
              max={28}
              defaultValue={1}
            />
          </div>
          <div>
            <label className="label" htmlFor="feeOverride">Monthly fee override (£, optional)</label>
            <input className="input" id="feeOverride" name="feeOverride" inputMode="decimal" placeholder="Leave blank to use the group fee" />
          </div>
        </div>
      </div>

      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Creating…" : "Create student & send welcome emails"}
        </button>
        <Link href="/admin/students" className="btn btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
