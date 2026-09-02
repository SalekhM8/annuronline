import type { Metadata } from "next";
import { MessageCircleQuestion } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PageHero, VerseBlock } from "../_components/shared";
import AskForm from "./AskForm";

export const metadata: Metadata = {
  title: "Ask the Mufti — An-Nur Academy",
  description:
    "Submit your questions on Islam to Mufti Ateiq-ur Rehman and read published answers. Every question is answered personally and treated in confidence.",
};

export const dynamic = "force-dynamic";

type PublishedQA = {
  id: string;
  question: string;
  answer: string | null;
  answeredAt: Date | null;
  askedAt: Date;
};

async function getPublishedQuestions(): Promise<PublishedQA[]> {
  try {
    return await prisma.muftiQuestion.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ answeredAt: "desc" }, { askedAt: "desc" }],
      select: { id: true, question: true, answer: true, answeredAt: true, askedAt: true },
      take: 50,
    });
  } catch (e) {
    console.error("Failed to load published questions:", e);
    return [];
  }
}

export default async function AskTheMuftiPage() {
  const published = await getPublishedQuestions();

  return (
    <>
      <PageHero
        eyebrow="Ask the Mufti"
        title="No question is too small"
        intro="Send your question directly to our principal, Mufti Ateiq-ur Rehman. Every question receives a considered, personal answer — and your identity is always kept private."
      />

      <section className="container-px pb-12">
        <VerseBlock
          arabic="فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ"
          translation="So ask the people of knowledge if you do not know."
          reference="Surah An-Nahl 16:43"
        />
      </section>

      <section className="container-px pb-16">
        <div className="mx-auto max-w-3xl">
          <AskForm />
        </div>
      </section>

      {published.length > 0 && (
        <section className="bg-cream-deep py-16">
          <div className="container-px">
            <div className="mb-10 text-center">
              <p className="eyebrow">From the archive</p>
              <h2 className="mt-2 text-3xl md:text-4xl">Questions &amp; answers</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-soft">
                A selection of previously asked questions, published anonymously so the whole
                community can benefit.
              </p>
            </div>
            <div className="mx-auto max-w-3xl space-y-6">
              {published.map((qa) => (
                <article key={qa.id} className="card p-7 md:p-9">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100">
                      <MessageCircleQuestion className="h-5 w-5 text-gold-700" />
                    </span>
                    <div>
                      <p className="eyebrow">Question</p>
                      <h3 className="mt-1 text-lg leading-snug">{qa.question}</h3>
                    </div>
                  </div>
                  {qa.answer && (
                    <div className="mt-5 border-l-2 border-gold-300 pl-5">
                      <p className="eyebrow">Answer</p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                        {qa.answer}
                      </p>
                      <p className="mt-4 text-xs font-semibold text-ink-soft">
                        — Mufti Ateiq-ur Rehman
                        {qa.answeredAt ? ` · ${formatDate(qa.answeredAt)}` : ""}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
