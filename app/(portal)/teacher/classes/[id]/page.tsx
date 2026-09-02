import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Star, Users, Video } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { PageHeader, StatusBadge } from "@/components/portal/ui";
import AddSessionForm from "@/components/teacher/AddSessionForm";
import ProgressMatrix from "@/components/teacher/ProgressMatrix";
import { requireTeacherPage } from "../../guard";

export default async function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireTeacherPage();
  const { id } = await params;

  const group = await prisma.classGroup.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      type: true,
      audience: true,
      scheduleText: true,
      meetingLink: true,
      teacherId: true,
      course: {
        select: {
          title: true,
          modules: { orderBy: { order: "asc" }, select: { id: true, order: true, title: true } },
        },
      },
      // PRIVACY: names only — no other student fields.
      enrolments: {
        where: { status: { in: ["ACTIVE", "LOCKED"] } },
        orderBy: { student: { firstName: "asc" } },
        select: {
          id: true,
          student: { select: { id: true, firstName: true, lastName: true } },
          progress: { select: { moduleId: true, status: true } },
        },
      },
      sessions: {
        orderBy: { scheduledAt: "desc" },
        select: {
          id: true,
          scheduledAt: true,
          durationMins: true,
          topic: true,
          isCancelled: true,
          module: { select: { order: true, title: true } },
        },
      },
    },
  });

  if (!group) notFound();
  if (user.role !== "ADMIN" && group.teacherId !== user.id) notFound();

  // Anonymous poll results — aggregate only (average + count), never
  // individual votes.
  const feedback = await prisma.lessonFeedback.groupBy({
    by: ["sessionId"],
    where: { session: { classGroupId: group.id } },
    _avg: { rating: true },
    _count: { _all: true },
  });
  const feedbackBySession = new Map(feedback.map((f) => [f.sessionId, f]));

  const now = new Date();
  const upcoming = group.sessions.filter((s) => s.scheduledAt >= now && !s.isCancelled).reverse();
  const past = group.sessions.filter((s) => s.scheduledAt < now);

  const matrixRows = group.enrolments.map((e) => ({
    enrolmentId: e.id,
    studentName: `${e.student.firstName} ${e.student.lastName}`,
    progress: Object.fromEntries(e.progress.map((p) => [p.moduleId, p.status])) as Record<
      string,
      "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
    >,
  }));

  const sessionRow = (s: (typeof group.sessions)[number]) => {
    const fb = feedbackBySession.get(s.id);
    return (
      <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="min-w-0">
          <p className="font-semibold text-green-900">
            {formatDateTime(s.scheduledAt)}
            <span className="ml-2 text-sm font-normal text-ink-soft">{s.durationMins} mins</span>
            {s.isCancelled && <span className="badge badge-red ml-2">Cancelled</span>}
          </p>
          <p className="text-sm text-ink-soft">
            {s.module ? `Module ${s.module.order}: ${s.module.title}` : null}
            {s.module && s.topic ? " · " : null}
            {s.topic}
          </p>
        </div>
        {fb && fb._avg.rating != null && (
          <span
            className="inline-flex items-center gap-1 text-sm font-bold text-gold-700"
            title={`Average anonymous class rating from ${fb._count._all} response${fb._count._all === 1 ? "" : "s"}`}
          >
            <Star className="h-4 w-4 fill-current" />
            {fb._avg.rating.toFixed(1)} ({fb._count._all})
          </span>
        )}
      </div>
    );
  };

  return (
    <div>
      <Link href="/teacher/classes" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:underline">
        <ArrowLeft className="h-4 w-4" /> All classes
      </Link>

      <PageHeader
        title={group.name}
        subtitle={`${group.course.title}${group.scheduleText ? ` · ${group.scheduleText}` : ""}`}
        actions={
          group.meetingLink ? (
            <a href={group.meetingLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Video className="h-4 w-4" /> Join meeting
            </a>
          ) : undefined
        }
      />

      <div className="mb-6 flex gap-1.5">
        <span className="badge badge-green">{group.type === "ONE_TO_ONE" ? "1-to-1" : "Group"}</span>
        <span className="badge badge-gold">{group.audience.toLowerCase()}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-1">
          <h2 className="mb-3 flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-green-700" /> Roster
          </h2>
          {group.enrolments.length === 0 ? (
            <p className="text-sm text-ink-soft">No students enrolled yet.</p>
          ) : (
            <ul className="space-y-2">
              {group.enrolments.map((e) => (
                <li key={e.id} className="flex items-center gap-2 text-sm font-semibold text-green-900">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-500" />
                  {e.student.firstName} {e.student.lastName}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6 lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5 text-green-700" /> Add a session
          </h2>
          <AddSessionForm classGroupId={group.id} modules={group.course.modules} />
        </section>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg">Upcoming sessions</h2>
          {upcoming.length === 0 ? (
            <div className="card p-6 text-sm text-ink-soft">No upcoming sessions scheduled.</div>
          ) : (
            <div className="card divide-y divide-green-900/10">{upcoming.map(sessionRow)}</div>
          )}
        </div>
        <div>
          <h2 className="mb-3 text-lg">Past sessions</h2>
          {past.length === 0 ? (
            <div className="card p-6 text-sm text-ink-soft">No sessions have taken place yet.</div>
          ) : (
            <div className="card max-h-96 divide-y divide-green-900/10 overflow-y-auto">
              {past.map(sessionRow)}
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 card p-6">
        <h2 className="mb-1 text-lg">Module progress</h2>
        <p className="mb-4 text-sm text-ink-soft">
          {group.course.title} — <StatusBadge status="IN_PROGRESS" /> and{" "}
          <StatusBadge status="COMPLETED" /> per student and module.
        </p>
        <ProgressMatrix modules={group.course.modules} rows={matrixRows} />
      </section>
    </div>
  );
}

export const dynamic = "force-dynamic";
