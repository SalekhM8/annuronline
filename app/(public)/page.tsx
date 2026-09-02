import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarCheck,
  GraduationCap,
  Users,
  UserRound,
  BookOpen,
  MessageCircleHeart,
  Globe2,
  BadgeCheck,
  Landmark,
} from "lucide-react";
import { COURSES } from "./courses/course-data";
import { CtaBand } from "./_components/shared";

export const metadata: Metadata = {
  title: "An-Nur Academy — Online Islamic Education from the UK",
  description:
    "Qur'an, Tajweed, Arabic, Hifz and Islamic Studies taught online by qualified UK-based teachers who speak English as a first language. Serving students worldwide.",
};

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Book a free assessment",
    body: "A friendly 20-minute session with a teacher to find your level — no cost, no commitment.",
  },
  {
    icon: BadgeCheck,
    title: "Receive your welcome email",
    body: "We place you in the right class and send a welcome email with a secure direct debit set-up link.",
  },
  {
    icon: GraduationCap,
    title: "Choose your class times",
    body: "Sign in to your student portal, pick class times that suit you, and begin your journey.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="container-px grid items-center gap-10 pb-16 pt-14 md:pt-20 lg:grid-cols-2">
        <div>
          <p className="arabic text-2xl text-gold-700">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p className="eyebrow mt-5">UK-based · serving students worldwide</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl lg:text-[3.4rem]">
            Sacred knowledge, taught with clarity
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Qur&rsquo;an, Arabic and Islamic Studies — taught by{" "}
            <strong className="text-green-900">qualified teachers who speak English as a first
            language</strong>, based in the UK and serving students across the world.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/enrol" className="btn-gold">
              Enrol now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/assessment" className="btn-outline">
              <CalendarCheck className="h-4 w-4" /> Free assessment
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft">
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-green-700" /> Qualified teachers
            </span>
            <span className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-green-700" /> Worldwide access
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-700" /> Adults &amp; children
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="card overflow-hidden">
            <img
              src="/images/mainheroannur.png"
              alt="Students learning the Qur'an online with An-Nur Academy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ---------- Courses ---------- */}
      <section className="container-px py-16">
        <div className="mb-10 text-center">
          <p className="eyebrow">Our courses</p>
          <h2 className="mt-2 text-3xl md:text-4xl">Six paths, one destination</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
            Structured courses for every stage — from a child&rsquo;s first letters to memorising
            the entire Qur&rsquo;an.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="card group overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <div className="relative">
                <img
                  src={c.image}
                  alt={c.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {c.isFree && (
                  <span className="badge badge-gold absolute right-3 top-3">Free · open to all</span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl">{c.title}</h3>
                  <span className="arabic text-lg text-gold-700">{c.arabicTitle}</span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{c.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-green-700">
                  Explore course <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="bg-cream-deep py-16">
        <div className="container-px">
          <div className="mb-10 text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Three simple steps</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="card p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <s.icon className="h-6 w-6 text-green-800" />
                </div>
                <p className="eyebrow mt-4">Step {i + 1}</p>
                <h3 className="mt-1 text-xl">{s.title}</h3>
                <p className="mt-3 text-sm text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- For everyone ---------- */}
      <section className="container-px py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-8 md:p-10">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-green-700" />
              <h3 className="text-2xl">Adults &amp; children</h3>
            </div>
            <p className="mt-4 text-ink-soft">
              It is never too early — or too late — to learn. Children study in structured,
              age-appropriate classes that build love for the deen alongside knowledge. Adults
              study separately, at their own level, with teachers who understand that starting (or
              restarting) as a grown-up takes courage.
            </p>
            <p className="mt-3 text-ink-soft">
              All classes are segregated appropriately, and parents of younger students can follow
              progress through the guardian view of our student portal.
            </p>
          </div>
          <div className="card p-8 md:p-10">
            <div className="flex items-center gap-3">
              <UserRound className="h-6 w-6 text-green-700" />
              <h3 className="text-2xl">Group or one-to-one</h3>
            </div>
            <p className="mt-4 text-ink-soft">
              Group classes run Monday to Thursday with a weekly revision class included, and
              weekend groups for Arabic — motivating, affordable, and full of shared energy.
              Prefer complete focus? One-to-one lessons put a teacher&rsquo;s full attention on
              you, for any subject, at times that fit your life.
            </p>
            <p className="mt-3 text-ink-soft">
              Hifz al-Qur&rsquo;an is taught one-to-one only, because memorisation deserves a
              personal guide.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Weekly Tafsir callout ---------- */}
      <section className="container-px py-8">
        <div className="card-gold flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:p-10">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-800">
            <BookOpen className="h-7 w-7 text-gold-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl">Weekly Tafsir — free and open to everyone</h3>
            <p className="mt-2 text-ink-soft">
              Every week our principal, Mufti Ateiq-ur Rehman, leads a live journey through the
              meanings of the Qur&rsquo;an. You don&rsquo;t need to be enrolled — the whole
              community is invited, wherever you are in the world.
            </p>
          </div>
          <Link href="/courses/weekly-tafsir" className="btn-primary shrink-0">
            Join the tafsir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---------- Founder teaser ---------- */}
      <section className="container-px py-16">
        <div className="card-green grid gap-8 p-8 md:p-12 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <Landmark className="h-8 w-8 text-gold-300" />
          </div>
          <div>
            <p className="eyebrow text-gold-300">A message from our founder</p>
            <h3 className="mt-2 text-2xl md:text-3xl">
              &ldquo;Knowledge is light — and every believer deserves a clear path to it.&rdquo;
            </h3>
            <p className="mt-3 text-cream/80">
              Mufti Ateiq-ur Rehman, Principal of An-Nur Academy, on why we teach the way we do.
            </p>
          </div>
          <Link href="/about" className="btn-gold shrink-0">
            Read his message <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---------- Counselling pointer ---------- */}
      <section className="container-px pb-8">
        <div className="card flex flex-col items-start gap-5 p-8 md:flex-row md:items-center">
          <MessageCircleHeart className="h-8 w-8 shrink-0 text-green-700" />
          <div className="flex-1">
            <h3 className="text-xl">Faith-based counselling</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Confidential one-hour sessions with Mufti Ateiq — personal, youth, marriage, and
              benefits &amp; finance guidance, in person or online.
            </p>
          </div>
          <Link href="/counselling" className="btn-outline shrink-0 text-sm">
            Learn more
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
