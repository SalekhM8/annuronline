"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";
import { useModalClose } from "./Modal";

export type EditableStudent = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null; // yyyy-mm-dd
  gender: string | null;
  isChild: boolean;
  guardianName: string | null;
  guardianEmail: string | null;
  guardianPhone: string | null;
  notes: string | null;
};

export default function StudentEditForm({ student }: { student: EditableStudent }) {
  const router = useRouter();
  const close = useModalClose();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChild, setIsChild] = useState(student.isChild);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    try {
      await callApi(`/api/admin/students/${student.id}`, "PATCH", {
        firstName: get("firstName"),
        lastName: get("lastName"),
        email: get("email"),
        phone: get("phone") || null,
        dateOfBirth: get("dateOfBirth") || null,
        gender: get("gender") || null,
        isChild,
        guardianName: isChild ? get("guardianName") || null : null,
        guardianEmail: isChild ? get("guardianEmail") || null : null,
        guardianPhone: isChild ? get("guardianPhone") || null : null,
        notes: get("notes") || null,
      });
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
          <label className="label">First name</label>
          <input className="input" name="firstName" defaultValue={student.firstName} required />
        </div>
        <div>
          <label className="label">Last name</label>
          <input className="input" name="lastName" defaultValue={student.lastName} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" name="email" type="email" defaultValue={student.email} required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" name="phone" defaultValue={student.phone ?? ""} />
        </div>
        <div>
          <label className="label">Date of birth</label>
          <input className="input" name="dateOfBirth" type="date" defaultValue={student.dateOfBirth ?? ""} />
        </div>
        <div>
          <label className="label">Gender</label>
          <select className="select" name="gender" defaultValue={student.gender ?? ""}>
            <option value="">Not specified</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={isChild} onChange={(e) => setIsChild(e.target.checked)} />
        Student is a child (under 18)
      </label>
      {isChild && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Guardian name</label>
            <input className="input" name="guardianName" defaultValue={student.guardianName ?? ""} />
          </div>
          <div>
            <label className="label">Guardian email</label>
            <input className="input" name="guardianEmail" type="email" defaultValue={student.guardianEmail ?? ""} />
          </div>
          <div>
            <label className="label">Guardian phone</label>
            <input className="input" name="guardianPhone" defaultValue={student.guardianPhone ?? ""} />
          </div>
        </div>
      )}
      <div>
        <label className="label">Admin notes</label>
        <textarea className="textarea" name="notes" rows={3} defaultValue={student.notes ?? ""} />
      </div>
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
