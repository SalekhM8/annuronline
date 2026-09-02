import Link from "next/link";
import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { EnrolmentStatus } from "@prisma/client";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal/ui";
import { formatPence } from "@/lib/utils";
import { feeForEnrolment } from "@/lib/billing";
import Modal from "@/components/admin/Modal";
import EnrolmentEditor from "@/components/admin/EnrolmentEditor";
import ModuleCompleteForm from "@/components/admin/ModuleCompleteForm";

const STATUSES = ["PENDING_PAYMENT", "ACTIVE", "LOCKED", "CANCELLED"] as const;

export default async function EnrolmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; course?: string }>;
}) {
  const { status, course } = await searchParams;
  const statusFilter = STATUSES.includes(status as (typeof STATUSES)[number])
    ? (status as EnrolmentStatus)
    : undefined;

  const [courses, enrolments] = await Promise.all([
    prisma.course.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true } }),
    prisma.enrolment.findMany({
      where: {
        ...(statusFilter && { status: statusFilter }),
        ...(course && { courseId: course }),
      },
      orderBy: { startedAt: "desc" },
      take: 100,
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        course: { select: { id: true, title: true } },
        classGroup: { select: { name: true, monthlyFeePence: true, type: true } },
        progress: { select: { moduleId: true, status: true } },
      },
    }),
  ]);

  const courseIds = [...new Set(enrolments.map((e) => e.courseId))];
  const distanceCourseIds = [...new Set(enrolments.filter((e) => e.mode === "DISTANCE").map((e) => e.courseId))];
  const [groups, modules] = await Promise.all([
    prisma.classGroup.findMany({
      where: { courseId: { in: courseIds }, isActive: true },
      select: { id: true, courseId: true, name: true },
      orderBy: { name: "asc" },
    }),
    distanceCourseIds.length
      ? prisma.module.findMany({
          where: { courseId: { in: distanceCourseIds } },
          select: { id: true, courseId: true, title: true, order: true },
          orderBy: { order: "asc" },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <PageHeader title="Enrolments" subtitle="Every course enrolment across the academy" />

      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <select className="select !w-auto" name="status" defaultValue={statusFilter ?? ""}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
          ))}
        </select>
        <select className="select !w-auto" name="course" defaultValue={course ?? ""}>
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-outline">Filter</button>
      </form>

      {enrolments.length === 0 ? (
        <EmptyState icon={BookOpen} title="No enrolments found" hint="Try clearing the filters." />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Group</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Pay day</th>
                <th>Monthly fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrolments.map((e) => {
                const fee = feeForEnrolment(e);
                const courseModules = modules.filter((m) => m.courseId === e.courseId);
                const completedIds = new Set(
                  e.progress.filter((p) => p.status === "COMPLETED").map((p) => p.moduleId)
                );
                return (
                  <tr key={e.id}>
                    <td>
                      <Link href={`/admin/students/${e.student.id}`} className="font-bold text-green-800 hover:underline">
                        {e.student.firstName} {e.student.lastName}
                      </Link>
                    </td>
                    <td>{e.course.title}</td>
                    <td>{e.classGroup?.name ?? "—"}</td>
                    <td>{e.mode === "LIVE" ? "Live" : "Distance"}</td>
                    <td><StatusBadge status={e.status} /></td>
                    <td>{e.paymentDayOfMonth}</td>
                    <td>
                      {fee != null ? formatPence(fee) : "—"}
                      {e.feePenceOverride != null && (
                        <span className="badge badge-gold ml-1">override</span>
                      )}
                    </td>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        <Modal
                          trigger="Edit"
                          triggerClassName="btn btn-outline !py-1.5"
                          title={`${e.student.firstName} ${e.student.lastName} — ${e.course.title}`}
                        >
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
      {enrolments.length === 100 && (
        <p className="mt-2 text-xs text-ink-soft">Showing the first 100 enrolments — use the filters to narrow the list.</p>
      )}
    </div>
  );
}
