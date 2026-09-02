import { ClipboardCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { PageHeader, EmptyState } from "@/components/portal/ui";
import SessionPicker from "@/components/teacher/SessionPicker";
import AttendanceRegister from "@/components/teacher/AttendanceRegister";
import { requireTeacherPage } from "../guard";

export default async function TeacherRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const user = await requireTeacherPage();
  const { session: sessionParam } = await searchParams;

  const sessions = await prisma.classSession.findMany({
    where: { classGroup: { teacherId: user.id }, isCancelled: false },
    orderBy: { scheduledAt: "desc" },
    take: 60,
    select: {
      id: true,
      scheduledAt: true,
      topic: true,
      classGroup: { select: { id: true, name: true } },
    },
  });

  if (sessions.length === 0) {
    return (
      <div>
        <PageHeader title="Attendance register" subtitle="Mark attendance for your sessions." />
        <EmptyState
          icon={ClipboardCheck}
          title="No sessions yet"
          hint="Add sessions from a class page, then take the register here."
        />
      </div>
    );
  }

  // Default: the most recent session that is today or in the past.
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const defaultSession = sessions.find((s) => s.scheduledAt <= endOfToday) ?? sessions[0];
  const selected = sessions.find((s) => s.id === sessionParam) ?? defaultSession;

  // Roster + any attendance already marked for this session.
  // PRIVACY: names only — the guardian/student email used for absence
  // notifications is looked up and sent entirely server-side.
  const [enrolments, marked] = await Promise.all([
    prisma.enrolment.findMany({
      where: { classGroupId: selected.classGroup.id, status: { in: ["ACTIVE", "LOCKED"] } },
      distinct: ["studentId"],
      orderBy: { student: { firstName: "asc" } },
      select: { student: { select: { id: true, firstName: true, lastName: true } } },
    }),
    prisma.attendance.findMany({
      where: { sessionId: selected.id },
      select: { studentId: true, status: true, note: true, absenceEmailSentAt: true },
    }),
  ]);

  const markedByStudent = new Map(marked.map((a) => [a.studentId, a]));
  const roster = enrolments.map((e) => {
    const existing = markedByStudent.get(e.student.id);
    return {
      studentId: e.student.id,
      name: `${e.student.firstName} ${e.student.lastName}`,
      status: existing?.status ?? null,
      note: existing?.note ?? "",
      absenceEmailSent: Boolean(existing?.absenceEmailSentAt),
    };
  });

  return (
    <div>
      <PageHeader
        title="Attendance register"
        subtitle="Pick a session and mark each student present, late or absent."
      />

      <div className="card mb-6 p-6">
        <SessionPicker
          sessions={sessions.map((s) => ({
            id: s.id,
            label: `${s.classGroup.name} — ${formatDateTime(s.scheduledAt)}${s.topic ? ` (${s.topic})` : ""}`,
          }))}
          selectedId={selected.id}
        />
      </div>

      {roster.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No students enrolled in this class"
          hint="The register appears once students are enrolled."
        />
      ) : (
        <AttendanceRegister key={selected.id} sessionId={selected.id} roster={roster} />
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
