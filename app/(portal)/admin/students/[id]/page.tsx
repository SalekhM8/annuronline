import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, MessageSquare, Receipt, History, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatusBadge } from "@/components/portal/ui";
import { formatDate, formatDateTime, formatPence } from "@/lib/utils";
import Modal from "@/components/admin/Modal";
import StudentEditForm from "@/components/admin/StudentEditForm";
import LockControls from "@/components/admin/LockControls";
import ActionButton from "@/components/admin/ActionButton";
import BoardPostForm from "@/components/admin/BoardPostForm";
import EnrolmentEditor from "@/components/admin/EnrolmentEditor";
import ModuleCompleteForm from "@/components/admin/ModuleCompleteForm";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="text-sm font-semibold text-green-900">{value ?? "—"}</p>
    </div>
  );
}

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      enrolments: {
        orderBy: { startedAt: "desc" },
        include: {
          course: { select: { id: true, title: true } },
          classGroup: { select: { name: true } },
          progress: { select: { moduleId: true, status: true } },
        },
      },
      invoices: { orderBy: { createdAt: "desc" }, take: 20 },
      mandate: true,
      certificates: { orderBy: { issuedAt: "desc" }, take: 20 },
      loginEvents: { orderBy: { loggedInAt: "desc" }, take: 20 },
      boardMessages: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { author: { select: { firstName: true, lastName: true } } },
      },
    },
  });
  if (!student || student.role !== "STUDENT") notFound();

  const courseIds = [...new Set(student.enrolments.map((e) => e.courseId))];
  const [groups, modules, attendanceSummary] = await Promise.all([
    prisma.classGroup.findMany({
      where: { courseId: { in: courseIds }, isActive: true },
      select: { id: true, courseId: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.module.findMany({
      where: { courseId: { in: courseIds } },
      select: { id: true, courseId: true, title: true, order: true },
      orderBy: { order: "asc" },
    }),
    prisma.attendance.groupBy({
      by: ["status"],
      where: { studentId: id },
      _count: { _all: true },
    }),
  ]);
  const attCount = (s: string) =>
    attendanceSummary.find((a) => a.status === s)?._count._all ?? 0;

  const dob = student.dateOfBirth ? student.dateOfBirth.toISOString().slice(0, 10) : null;

  return (
    <div>
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        subtitle={student.email}
        actions={
          <>
            <Modal trigger={<><Pencil className="h-4 w-4" /> Edit profile</>} triggerClassName="btn btn-outline" title="Edit profile">
              <StudentEditForm
                student={{
                  id: student.id,
                  firstName: student.firstName,
                  lastName: student.lastName,
                  email: student.email,
                  phone: student.phone,
                  dateOfBirth: dob,
                  gender: student.gender,
                  isChild: student.isChild,
                  guardianName: student.guardianName,
                  guardianEmail: student.guardianEmail,
                  guardianPhone: student.guardianPhone,
                  notes: student.notes,
                }}
              />
            </Modal>
            <LockControls studentId={student.id} locked={student.lockedAt != null} />
          </>
        }
      />

      {student.lockedAt && (
        <div className="card mb-6 border-l-4 border-red-600 p-4">
          <p className="text-sm font-bold text-red-700">
            Portal locked since {formatDateTime(student.lockedAt)}
            {student.lockReason ? ` — ${student.lockReason}` : ""}
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left column: personal, mandate, attendance, logins */}
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-3 text-lg">Personal details</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" value={student.phone} />
              <Field label="Date of birth" value={student.dateOfBirth ? formatDate(student.dateOfBirth) : null} />
              <Field label="Gender" value={student.gender} />
              <Field label="Child" value={student.isChild ? "Yes" : "No"} />
              <Field label="Joined" value={formatDate(student.createdAt)} />
              <Field
                label="Account"
                value={student.lockedAt ? "Locked" : student.isActive ? "Active" : "Inactive"}
              />
            </div>
            {student.isChild && (
              <div className="mt-4 rounded-xl bg-cream-deep p-3">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-ink-soft">Guardian</p>
                <div className="grid grid-cols-1 gap-2">
                  <Field label="Name" value={student.guardianName} />
                  <Field label="Email" value={student.guardianEmail} />
                  <Field label="Phone" value={student.guardianPhone} />
                </div>
              </div>
            )}
            {student.notes && (
              <div className="mt-4">
                <Field label="Admin notes" value={student.notes} />
              </div>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 text-lg">Payment mandate</h2>
            {student.mandate ? (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <StatusBadge status={student.mandate.status} />
                  <p className="mt-1 text-xs text-ink-soft">
                    {student.mandate.provider}
                    {student.mandate.mandateRef ? ` · ${student.mandate.mandateRef}` : ""}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink-soft">No direct-debit mandate yet.</p>
            )}
            {student.mandate?.status === "PENDING" && student.mandate.setupUrl && (
              <div className="mt-3 rounded-xl bg-gold-100 p-3">
                <p className="text-xs font-bold text-gold-700">
                  Direct-debit setup link (also sent in the welcome email — copy it to the
                  student directly if needed):
                </p>
                <a
                  href={student.mandate.setupUrl}
                  className="mt-1 block break-all text-xs font-semibold text-green-800 underline"
                >
                  {student.mandate.setupUrl}
                </a>
              </div>
            )}
            <div className="mt-3">
              <ActionButton
                label="Resend welcome / mandate email"
                doneLabel="Email sent"
                url={`/api/admin/students/${student.id}/resend-welcome`}
                className="btn btn-outline"
              />
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-3 text-lg">Attendance summary</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-green-100 p-3">
                <p className="text-xl font-extrabold text-green-800">{attCount("PRESENT")}</p>
                <p className="text-xs font-bold uppercase text-ink-soft">Present</p>
              </div>
              <div className="rounded-xl bg-gold-100 p-3">
                <p className="text-xl font-extrabold text-gold-700">{attCount("LATE")}</p>
                <p className="text-xs font-bold uppercase text-ink-soft">Late</p>
              </div>
              <div className="rounded-xl bg-cream-deep p-3">
                <p className="text-xl font-extrabold text-red-700">{attCount("ABSENT")}</p>
                <p className="text-xs font-bold uppercase text-ink-soft">Absent</p>
              </div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg"><History className="h-4 w-4" /> Login history</h2>
            {student.loginEvents.length === 0 ? (
              <p className="text-sm text-ink-soft">No logins yet.</p>
            ) : (
              <ul className="divide-y divide-cream-deep text-sm">
                {student.loginEvents.map((ev) => {
                  const mins = Math.max(
                    0,
                    Math.round((ev.lastSeenAt.getTime() - ev.loggedInAt.getTime()) / 60000)
                  );
                  return (
                    <li key={ev.id} className="flex items-center justify-between py-2">
                      <span>{formatDateTime(ev.loggedInAt)}</span>
                      <span className="text-xs text-ink-soft">{mins ? `~${mins} min` : "brief"}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Middle + right: enrolments, invoices, certificates, message board */}
        <div className="space-y-6 xl:col-span-2">
          <section className="card p-5">
            <h2 className="mb-3 text-lg">Enrolments</h2>
            {student.enrolments.length === 0 ? (
              <p className="text-sm text-ink-soft">No enrolments.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Group</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th>Pay day</th>
                      <th>Fee override</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.enrolments.map((e) => {
                      const courseModules = modules.filter((m) => m.courseId === e.courseId);
                      const completedIds = new Set(
                        e.progress.filter((p) => p.status === "COMPLETED").map((p) => p.moduleId)
                      );
                      return (
                        <tr key={e.id}>
                          <td className="font-bold text-green-900">{e.course.title}</td>
                          <td>{e.classGroup?.name ?? "—"}</td>
                          <td>{e.mode === "LIVE" ? "Live" : "Distance"}</td>
                          <td><StatusBadge status={e.status} /></td>
                          <td>{e.paymentDayOfMonth}</td>
                          <td>{e.feePenceOverride != null ? formatPence(e.feePenceOverride) : "—"}</td>
                          <td>
                            <div className="flex flex-wrap items-center gap-2">
                              <Modal trigger="Edit" triggerClassName="btn btn-outline !py-1.5" title={`Edit enrolment — ${e.course.title}`}>
                                <EnrolmentEditor
                                  enrolment={{
                                    id: e.id,
                                    status: e.status,
                                    classGroupId: e.classGroupId,
                                    paymentDayOfMonth: e.paymentDayOfMonth,
                                    feePenceOverride: e.feePenceOverride,
                                    groups: groups
                                      .filter((g) => g.courseId === e.courseId)
                                      .map((g) => ({ id: g.id, name: g.name })),
                                  }}
                                />
                              </Modal>
                              {e.mode === "DISTANCE" && e.status !== "CANCELLED" && (
                                <ModuleCompleteForm
                                  enrolmentId={e.id}
                                  modules={courseModules.map((m) => ({
                                    id: m.id,
                                    title: m.title,
                                    order: m.order,
                                    completed: completedIds.has(m.id),
                                  }))}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg"><Receipt className="h-4 w-4" /> Invoices</h2>
            {student.invoices.length === 0 ? (
              <p className="text-sm text-ink-soft">No invoices yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Number</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Due</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="font-mono text-xs">{inv.number}</td>
                        <td>{inv.description}</td>
                        <td className="font-bold">{formatPence(inv.amountPence)}</td>
                        <td>{formatDate(inv.dueDate)}</td>
                        <td><StatusBadge status={inv.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg"><Award className="h-4 w-4" /> Certificates</h2>
            {student.certificates.length === 0 ? (
              <p className="text-sm text-ink-soft">No certificates yet.</p>
            ) : (
              <ul className="divide-y divide-cream-deep text-sm">
                {student.certificates.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-2">
                    <div>
                      <p className="font-bold text-green-900">{c.moduleTitle}</p>
                      <p className="text-xs text-ink-soft">{c.courseTitle} · {c.serial}</p>
                    </div>
                    <span className="shrink-0 text-xs text-ink-soft">{formatDate(c.issuedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg"><MessageSquare className="h-4 w-4" /> Message board</h2>
            <BoardPostForm studentId={student.id} />
            {student.boardMessages.length > 0 && (
              <ul className="mt-4 space-y-3">
                {student.boardMessages.map((m) => (
                  <li key={m.id} className="rounded-xl bg-cream-deep p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold text-green-800">
                        {m.author.firstName} {m.author.lastName}
                        <span className="badge badge-neutral ml-2">{m.authorRole}</span>
                      </p>
                      <span className="text-xs text-ink-soft">{formatDateTime(m.createdAt)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{m.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <p className="mt-6 text-sm">
        <Link href="/admin/students" className="font-bold text-green-700 hover:underline">
          ← Back to student register
        </Link>
      </p>
    </div>
  );
}
