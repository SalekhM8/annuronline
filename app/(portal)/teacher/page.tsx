import Link from "next/link";
import { CalendarDays, GraduationCap, MessageSquare, Mic, Users, Video } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { PageHeader, StatCard, EmptyState, StatusBadge } from "@/components/portal/ui";
import { requireTeacherPage } from "./guard";

export default async function TeacherDashboard() {
  const user = await requireTeacherPage();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7)); // Monday
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [classCount, distinctStudents, sessionsThisWeek, pendingReviews, upcomingSessions, recentMessages] =
    await Promise.all([
      prisma.classGroup.count({ where: { teacherId: user.id, isActive: true } }),
      prisma.enrolment.findMany({
        where: { status: "ACTIVE", classGroup: { teacherId: user.id } },
        distinct: ["studentId"],
        select: { studentId: true },
      }),
      prisma.classSession.count({
        where: {
          classGroup: { teacherId: user.id },
          isCancelled: false,
          scheduledAt: { gte: weekStart, lt: weekEnd },
        },
      }),
      prisma.audioSubmission.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
      prisma.classSession.findMany({
        where: {
          classGroup: { teacherId: user.id },
          isCancelled: false,
          scheduledAt: { gte: todayStart },
        },
        orderBy: { scheduledAt: "asc" },
        take: 5,
        select: {
          id: true,
          scheduledAt: true,
          durationMins: true,
          topic: true,
          classGroup: { select: { id: true, name: true, meetingLink: true } },
        },
      }),
      // PRIVACY: only student names ever reach the teacher UI.
      prisma.boardMessage.findMany({
        where: {
          student: {
            enrolments: { some: { status: "ACTIVE", classGroup: { teacherId: user.id } } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          body: true,
          createdAt: true,
          authorRole: true,
          student: { select: { firstName: true, lastName: true } },
          author: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

  return (
    <div>
      <PageHeader
        title={`Assalamu alaikum, ${user.firstName}`}
        subtitle="Your teaching at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My classes" value={classCount} icon={GraduationCap} />
        <StatCard label="Students taught" value={distinctStudents.length} icon={Users} tone="gold" />
        <StatCard label="Sessions this week" value={sessionsThisWeek} icon={CalendarDays} />
        <StatCard
          label="Pending audio reviews"
          value={pendingReviews}
          icon={Mic}
          tone={pendingReviews > 0 ? "gold" : "neutral"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg">Upcoming sessions</h2>
          {upcomingSessions.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming sessions"
              hint="Add sessions from a class page."
            />
          ) : (
            <div className="card divide-y divide-green-900/10">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-bold text-green-900">{s.classGroup.name}</p>
                    <p className="text-sm text-ink-soft">
                      {formatDateTime(s.scheduledAt)} · {s.durationMins} mins
                      {s.topic ? ` · ${s.topic}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {s.classGroup.meetingLink && (
                      <a
                        href={s.classGroup.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline px-4! py-1.5! text-sm"
                      >
                        <Video className="h-4 w-4" /> Join
                      </a>
                    )}
                    <Link
                      href={`/teacher/classes/${s.classGroup.id}`}
                      className="btn-ghost px-3! py-1.5! text-sm"
                    >
                      Class
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg">Recent board activity</h2>
          {recentMessages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No recent messages"
              hint="Messages on your students' boards appear here."
            />
          ) : (
            <div className="card divide-y divide-green-900/10">
              {recentMessages.map((m) => (
                <div key={m.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-green-900">
                      {m.student.firstName} {m.student.lastName}
                      <span className="ml-2 text-xs font-semibold text-ink-soft">
                        by {m.author.firstName} {m.author.lastName}
                      </span>
                    </p>
                    <span className="flex items-center gap-2 text-xs text-ink-soft">
                      <StatusBadge status={m.authorRole} />
                      {formatDateTime(m.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {m.body.length > 140 ? `${m.body.slice(0, 140)}…` : m.body}
                  </p>
                </div>
              ))}
              <div className="p-3 text-right">
                <Link href="/teacher/messages" className="text-sm font-bold text-green-700 hover:underline">
                  Open message boards →
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
