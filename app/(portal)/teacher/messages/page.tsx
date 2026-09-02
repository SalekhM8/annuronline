import Link from "next/link";
import clsx from "clsx";
import { MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal/ui";
import MessageComposer from "@/components/teacher/MessageComposer";
import BroadcastForm from "@/components/teacher/BroadcastForm";
import { requireTeacherPage } from "../guard";

export default async function TeacherMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const user = await requireTeacherPage();
  const { student: studentParam } = await searchParams;

  // My classes with their actively-enrolled students.
  // PRIVACY: names only — no other student fields anywhere on this page.
  const groups = await prisma.classGroup.findMany({
    where: { teacherId: user.id, isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      enrolments: {
        where: { status: "ACTIVE" },
        orderBy: { student: { firstName: "asc" } },
        select: { student: { select: { id: true, firstName: true, lastName: true } } },
      },
    },
  });

  const myStudents = new Map<string, { id: string; firstName: string; lastName: string }>();
  for (const g of groups) {
    for (const e of g.enrolments) myStudents.set(e.student.id, e.student);
  }

  const selectedStudent = studentParam ? myStudents.get(studentParam) ?? null : null;

  const board = selectedStudent
    ? await prisma.boardMessage.findMany({
        where: { studentId: selectedStudent.id },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
          createdAt: true,
          authorRole: true,
          broadcastId: true,
          author: { select: { firstName: true, lastName: true } },
        },
      })
    : [];

  if (groups.length === 0) {
    return (
      <div>
        <PageHeader title="Message boards" subtitle="Write on your students' message boards." />
        <EmptyState
          icon={MessageSquare}
          title="No classes assigned yet"
          hint="Message boards appear once you have classes with enrolled students."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Message boards"
        subtitle="Every student has a permanent board — write to one student, or to a whole class at once."
      />

      <div className="mb-6">
        <BroadcastForm groups={groups.map((g) => ({ id: g.id, name: g.name }))} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="card max-h-[36rem] overflow-y-auto p-4">
          {groups.map((g) => (
            <div key={g.id} className="mb-4 last:mb-0">
              <p className="mb-1.5 px-2 text-xs font-extrabold uppercase tracking-wide text-ink-soft">
                {g.name}
              </p>
              {g.enrolments.length === 0 ? (
                <p className="px-2 text-sm text-ink-soft">No students</p>
              ) : (
                <ul>
                  {g.enrolments.map((e) => (
                    <li key={e.student.id}>
                      <Link
                        href={`/teacher/messages?student=${e.student.id}`}
                        className={clsx(
                          "block rounded-lg px-2 py-1.5 text-sm font-semibold transition",
                          selectedStudent?.id === e.student.id
                            ? "bg-green-100 text-green-900"
                            : "text-ink-soft hover:bg-green-50 hover:text-green-900"
                        )}
                      >
                        {e.student.firstName} {e.student.lastName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </aside>

        <section className="card p-6">
          {!selectedStudent ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
              <MessageSquare className="h-10 w-10 text-green-600/40" />
              <p className="mt-3 font-bold text-green-900">Select a student</p>
              <p className="mt-1 text-sm text-ink-soft">Choose a student on the left to open their board.</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg">
                {selectedStudent.firstName} {selectedStudent.lastName}&rsquo;s board
              </h2>
              <div className="mt-4 max-h-[26rem] space-y-3 overflow-y-auto pr-1">
                {board.length === 0 ? (
                  <p className="text-sm text-ink-soft">No messages on this board yet.</p>
                ) : (
                  board.map((m) => (
                    <div
                      key={m.id}
                      className={clsx(
                        "rounded-xl border p-4",
                        m.authorRole === "STUDENT"
                          ? "border-green-900/10 bg-white"
                          : "border-gold-300/60 bg-gold-100/40"
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-green-900">
                          {m.author.firstName} {m.author.lastName}
                          {m.broadcastId && (
                            <span className="badge badge-neutral ml-2">Class broadcast</span>
                          )}
                        </p>
                        <span className="flex items-center gap-2 text-xs text-ink-soft">
                          <StatusBadge status={m.authorRole} />
                          {formatDateTime(m.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink">{m.body}</p>
                    </div>
                  ))
                )}
              </div>
              <MessageComposer studentId={selectedStudent.id} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
