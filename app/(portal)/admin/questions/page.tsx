import { HelpCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState, StatusBadge } from "@/components/portal/ui";
import { formatDateTime } from "@/lib/utils";
import QuestionAnswerForm from "@/components/admin/QuestionAnswerForm";

export default async function QuestionsPage() {
  const [pending, handled] = await Promise.all([
    prisma.muftiQuestion.findMany({
      where: { status: "PENDING" },
      orderBy: { askedAt: "asc" },
      take: 100,
    }),
    prisma.muftiQuestion.findMany({
      where: { status: { in: ["ANSWERED", "PUBLISHED", "REJECTED"] } },
      orderBy: { answeredAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Ask the Mufti"
        subtitle="Moderate incoming questions — answers can be published anonymously on the website"
      />

      <section>
        <h2 className="mb-3 text-xl">Awaiting answer ({pending.length})</h2>
        {pending.length === 0 ? (
          <EmptyState icon={HelpCircle} title="No pending questions" hint="New questions from the website appear here." />
        ) : (
          <div className="space-y-4">
            {pending.map((q) => (
              <div key={q.id} className="card p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-ink-soft">
                    From <span className="font-bold">{q.name ?? "Anonymous"}</span> ({q.email}) ·{" "}
                    {formatDateTime(q.askedAt)}
                  </p>
                  <StatusBadge status={q.status} />
                </div>
                <p className="mb-4 whitespace-pre-wrap font-semibold text-green-900">{q.question}</p>
                <QuestionAnswerForm
                  questionId={q.id}
                  initialAnswer={q.answer}
                  initialPublished={false}
                  status={q.status}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xl">Answered & published</h2>
        {handled.length === 0 ? (
          <EmptyState icon={HelpCircle} title="Nothing answered yet" />
        ) : (
          <div className="space-y-2">
            {handled.map((q) => (
              <details key={q.id} className="card p-4">
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate font-semibold text-green-900">
                    {q.question.length > 100 ? `${q.question.slice(0, 100)}…` : q.question}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={q.status} />
                    <span className="text-xs text-ink-soft">
                      {q.answeredAt ? formatDateTime(q.answeredAt) : formatDateTime(q.askedAt)}
                    </span>
                  </span>
                </summary>
                <div className="mt-3">
                  <p className="mb-1 text-xs text-ink-soft">
                    From {q.name ?? "Anonymous"} ({q.email}) · asked {formatDateTime(q.askedAt)}
                  </p>
                  <p className="mb-4 whitespace-pre-wrap text-sm font-semibold text-green-900">{q.question}</p>
                  <QuestionAnswerForm
                    questionId={q.id}
                    initialAnswer={q.answer}
                    initialPublished={q.status === "PUBLISHED"}
                    status={q.status}
                  />
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
