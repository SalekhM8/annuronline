import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";

/** Small page hero for inner pages. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="container-px pb-10 pt-14 text-center md:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mx-auto mt-3 max-w-3xl text-4xl md:text-5xl">{title}</h1>
      {intro && <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">{intro}</p>}
      {children}
    </section>
  );
}

/** Arabic verse with translation + reference, centred. */
export function VerseBlock({
  arabic,
  translation,
  reference,
}: {
  arabic: string;
  translation: string;
  reference: string;
}) {
  return (
    <figure className="mx-auto max-w-2xl text-center">
      <p className="arabic text-2xl leading-loose text-green-800 md:text-3xl">{arabic}</p>
      <figcaption className="mt-3">
        <p className="text-ink-soft italic">&ldquo;{translation}&rdquo;</p>
        <p className="eyebrow mt-2">{reference}</p>
      </figcaption>
    </figure>
  );
}

/** Closing call-to-action band. */
export function CtaBand({
  title = "Begin with a free assessment",
  body = "Every journey at An-Nur starts with a friendly 20-minute assessment — so we can place you or your child in exactly the right class.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="container-px py-16">
      <div className="card-green px-6 py-12 text-center md:px-16">
        <p className="arabic text-2xl text-gold-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h2 className="mt-4 text-3xl md:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-cream/80">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/enrol" className="btn-gold">
            Enrol now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-cream/60 px-6 py-[0.7rem] text-[0.95rem] font-bold text-cream transition-colors hover:bg-white/10"
          >
            <CalendarCheck className="h-4 w-4" /> Book a free assessment
          </Link>
        </div>
      </div>
    </section>
  );
}
