import type { Metadata } from "next";
import { Clock3, HeartHandshake, ClipboardCheck } from "lucide-react";
import { PageHero } from "../_components/shared";
import AssessmentForm from "./AssessmentForm";

export const metadata: Metadata = {
  title: "Free Assessment — An-Nur Academy",
  description:
    "Book a free 20-minute placement assessment with an An-Nur Academy teacher — no cost, no obligation, for adults and children.",
};

const POINTS = [
  {
    icon: Clock3,
    title: "Just 20 minutes",
    body: "A relaxed conversation and a short reading check with a qualified teacher — online, at a time that suits you.",
  },
  {
    icon: ClipboardCheck,
    title: "Find your true level",
    body: "We listen, assess gently, and recommend exactly the right course and starting point — no guesswork.",
  },
  {
    icon: HeartHandshake,
    title: "No cost, no pressure",
    body: "The assessment is completely free and there's no obligation to enrol. It's simply the right way to begin.",
  },
];

export default function AssessmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Free assessment"
        title="Every journey begins with 20 minutes"
        intro="Before any student joins a class, we meet them. A free, friendly 20-minute assessment tells us your level — and tells you whether we're the right fit."
      />

      <section className="container-px pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} className="card p-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <p.icon className="h-6 w-6 text-green-800" />
              </div>
              <h3 className="mt-4 text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px pb-20">
        <div className="mx-auto max-w-3xl">
          <AssessmentForm />
        </div>
      </section>
    </>
  );
}
