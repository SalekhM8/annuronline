import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  Video,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { EmptyState, StatCard } from "@/components/portal/ui";
import RateClassCard from "@/components/student/RateClassCard";
import { voterHashFor } from "@/app/api/student/anon";

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Every query below is scoped to the signed-in student.
  const enrolments = await prisma.enrolment.findMany({
    where: { studentId: userId, status: { not: "CANCELLED" } },
    select: { id: true, status: true, classGroupId: true },
  });
  const activeCourses = enrolments.filter((e) => e.status === "ACTIVE").length;
  const groupIds = enrolments
    .map((e) => e.classGroupId)
    .filter((id): id is string => Boolean(id));

  const [modulesCompleted, certificateCount, upcomingSessions, lastSession, boardMessages, dueInvoices] =
    await Promise.all([
      prisma.moduleProgress.count({
        where: { status: "COMPLETED", enrolment: { studentId: userId } },
      }),
      prisma.certificate.count({ where: { studentId: userId } }),
      groupIds.length
        ? prisma.classSession.findMany({
            where: { classGroupId: { in: groupIds }, isCancelled: false, scheduledAt: { gte: now } },
            orderBy: { scheduledAt: "asc" },
            take: 5,
            select: {
              id: true,
              scheduledAt: true,
              durationMins: true,
              topic: true,
              classGroup: { select: { name: true, meetingLink: true } },
            },
          })
        : Promise.resolve([]),
      groupIds.length
        ? prisma.classSession.findFirst({
            where: {
              classGroupId: { in: groupIds },
              isCancelled: false,
              scheduledAt: { lt: now, gte: sevenDaysAgo },
            },
            orderBy: { scheduledAt: "desc" },
            select: {
              id: true,
              scheduledAt: true,
              topic: true,
              classGroup: { select: { name: true } },
            },
          })
        : Promise.resolve(null),
      prisma.boardMessage.findMany({
        where: { studentId: userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          body: true,
          authorRole: true,
          authorId: true,
          createdAt: true,
          author: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.invoice.findMany({
        where: { studentId: userId, status: { in: ["PENDING", "OVERDUE"] } },
        select: { id: true, status: true },
      }),
    ]);

  // Anonymous-poll check: has this student already rated the last session?
  // We recompute the one-way hash — no userId is ever stored with feedback.
  let rateSession: typeof lastSession = null;
  if (lastSession) {
    const alreadyRated = await prisma.lessonFeedback.findUnique({
      where: {
        sessionId_voterHash: {
          sessionId: lastSession.id,
          voterHash: voterHashFor(userId, lastSession.id),
        },
      },
      select: { id: true },
    });
    if (!alreadyRated) rateSession = lastSession;
  }

  const nextSession = upcomingSessions[0] ?? null;
  const hasOverdue = dueInvoices.some((i) => i.status === "OVERDUE");

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Student portal</p>
        <h1 className="mt-1 text-2xl lg:text-3xl">
          Assalamu alaikum, {session.user.firstName}
        </h1>
      </div>

      {dueInvoices.length > 0 && (
        <div
          className={
            hasOverdue
              ? "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] p-4"
              : "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-300 bg-gold-100 p-4"
          }
        >
          <p className="flex items-center gap-2 text-sm font-bold text-ink">
            <AlertTriangle className={hasOverdue ? "h-5 w-5 text-[var(--danger)]" : "h-5 w-5 text-gold-700"} />
            {hasOverdue
              ? "You have an overdue invoice — please settle it to keep your portal access."
              : `You have ${dueInvoices.length} pending invoice${dueInvoices.length > 1 ? "s" : ""}.`}
          </p>
          <Link href="/student/fees" className="btn-outline !px-4 !py-1.5 text-sm">
            View fees
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active courses" value={activeCourses} icon={BookOpen} tone="green" />
        <StatCard label="Modules completed" value={modulesCompleted} icon={CheckCircle2} tone="gold" />
        <StatCard label="Certificates" value={certificateCount} icon={Award} tone="gold" />
        <StatCard
          label="Next class"
          value={nextSession ? formatDateTime(nextSession.scheduledAt) : "—"}
          icon={CalendarDays}
          tone="neutral"
        />
      </div>

      {rateSession && (
        <RateClassCard
          sessionId={rateSession.id}
          groupName={rateSession.classGroup.name}
          topic={rateSession.topic}
          heldAtLabel={formatDateTime(rateSession.scheduledAt)}
        />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg">Upcoming classes</h2>
          {upcomingSessions.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming classes scheduled"
              hint="New sessions will appear here once your teacher schedules them."
            />
          ) : (
            <div className="card divide-y divide-green-900/5">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-bold text-green-900">{s.classGroup.name}</p>
                    <p className="text-sm text-ink-soft">
                      {formatDateTime(s.scheduledAt)} · {s.durationMins} mins
                      {s.topic ? ` · ${s.topic}` : ""}
                    </p>
                  </div>
                  {s.classGroup.meetingLink && (
                    <a
                      href={s.classGroup.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary !px-4 !py-1.5 text-sm"
                    >
                      <Video className="h-4 w-4" /> Join
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg">Message board</h2>
            <Link href="/student/messages" className="text-sm font-bold text-green-800 hover:underline">
              View all
            </Link>
          </div>
          {boardMessages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No messages yet"
              hint="Notes from your teacher and the academy will appear here."
            />
          ) : (
            <div className="card divide-y divide-green-900/5">
              {boardMessages.map((m) => (
                <div key={m.id} className="p-4">
                  <p className="text-sm font-bold text-green-900">
                    {m.authorId === userId
                      ? "You"
                      : `${m.author.firstName} ${m.author.lastName}`}
                    <span className="ml-2 text-xs font-semibold text-ink-soft">
                      {formatDateTime(m.createdAt)}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm text-ink">{m.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
