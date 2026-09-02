import { redirect } from "next/navigation";
import clsx from "clsx";
import { MessageSquare } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { EmptyState, PageHeader } from "@/components/portal/ui";
import MessageComposer from "@/components/student/MessageComposer";

export default async function MessagesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Only this student's own board. The board is immutable — no edit or
  // delete controls exist anywhere (client requirement).
  const messages = await prisma.boardMessage.findMany({
    where: { studentId: userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      body: true,
      authorId: true,
      authorRole: true,
      createdAt: true,
      author: { select: { firstName: true, lastName: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Message board"
        subtitle="A permanent record of messages between you and the academy — nothing here can be edited or deleted"
      />

      <div className="space-y-4">
        {messages.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Your board is empty"
            hint="Messages from your teacher and the academy will appear here, and you can post your own below."
          />
        ) : (
          <div className="space-y-3">
            {messages.map((m) => {
              const mine = m.authorId === userId;
              const roleLabel = mine ? "You" : m.authorRole === "TEACHER" ? "Teacher" : "Admin";
              return (
                <article
                  key={m.id}
                  className={clsx("card p-4", mine && "border-gold-300 bg-gold-100/40")}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-green-900">
                      {mine ? "You" : `${m.author.firstName} ${m.author.lastName}`}
                    </p>
                    <span
                      className={clsx(
                        "badge",
                        mine ? "badge-gold" : m.authorRole === "TEACHER" ? "badge-green" : "badge-neutral"
                      )}
                    >
                      {roleLabel}
                    </span>
                    <span className="ml-auto text-xs font-semibold text-ink-soft">
                      {formatDateTime(m.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">{m.body}</p>
                </article>
              );
            })}
          </div>
        )}

        <MessageComposer />
      </div>
    </div>
  );
}
