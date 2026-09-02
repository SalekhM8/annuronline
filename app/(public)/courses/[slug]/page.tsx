import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Users,
  PoundSterling,
  BookOpen,
} from "lucide-react";
import { COURSES, getCourse } from "../course-data";
import { VerseBlock, CtaBand } from "../../_components/shared";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course — An-Nur Academy" };
  return {
    title: `${course.title} — An-Nur Academy`,
    description: course.tagline,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const isTafsir = course.slug === "weekly-tafsir";

  return (
    <>
      {/* Hero */}
      <section className="container-px grid items-center gap-10 pb-14 pt-14 md:pt-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">
            {isTafsir ? "Free · open to everyone" : "Live online course"}
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4">
            <h1 className="text-4xl md:text-5xl">{course.title}</h1>
            <span className="arabic text-2xl text-gold-700">{course.arabicTitle}</span>
          </div>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">{course.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {isTafsir ? (
              <>
                <a href="mailto:info@an-nur.online?subject=Weekly%20Tafsir" className="btn-gold">
                  Ask to join the tafsir <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/enrol" className="btn-outline">
                  Explore full enrolment
                </Link>
              </>
            ) : (
              <>
                <Link href="/enrol" className="btn-gold">
                  Enrol now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/assessment" className="btn-outline">
                  <CalendarCheck className="h-4 w-4" /> Free assessment
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="card overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      {/* Verse */}
      <section className="container-px pb-14">
        <div className="card-gold px-6 py-10 md:px-12">
          <VerseBlock
            arabic={course.verseArabic}
            translation={course.verseTranslation}
            reference={course.verseRef}
          />
        </div>
      </section>

      {/* Description + who it's for */}
      <section className="container-px pb-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-8 lg:col-span-2 md:p-10">
            <p className="eyebrow">About this course</p>
            <h2 className="mt-2 text-3xl">
              {isTafsir ? "An open door to the Qur'an" : "What this course is"}
            </h2>
            {course.description.map((para) => (
              <p key={para.slice(0, 40)} className="mt-4 text-ink-soft">
                {para}
              </p>
            ))}
          </div>
          <div className="space-y-6">
            <div className="card p-7">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-700" />
                <h3 className="text-lg">Who it&rsquo;s for</h3>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{course.audience}</p>
            </div>
            <div className="card p-7">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-700" />
                <h3 className="text-lg">How it&rsquo;s taught</h3>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{course.formats}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="bg-cream-deep py-14">
        <div className="container-px">
          <div className="mb-10 text-center">
            <p className="eyebrow">The journey</p>
            <h2 className="mt-2 text-3xl md:text-4xl">
              {isTafsir ? "What each gathering holds" : "What you'll learn"}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {course.learn.map((m, i) => (
              <div key={m.title} className="card p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-extrabold text-green-800">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg">{m.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{m.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="container-px py-14">
        <div className="card p-8 md:p-10">
          <div className="flex items-center gap-2">
            <PoundSterling className="h-5 w-5 text-green-700" />
            <h2 className="text-2xl">Fees</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {course.fees.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-gold-600" />
                <p>
                  <span className="font-bold text-green-900">{f.label}:</span>{" "}
                  <span className="text-ink-soft">{f.detail}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-ink-soft">
            {isTafsir ? (
              <>
                The Weekly Tafsir is our gift to the community — there is nothing to pay and no
                enrolment required. See all academy fees on the{" "}
                <Link href="/fees" className="font-bold text-green-700 hover:underline">
                  fees page
                </Link>
                .
              </>
            ) : (
              <>
                Fees are collected monthly by direct debit. Full details, including how billing
                works, are on the{" "}
                <Link href="/fees" className="font-bold text-green-700 hover:underline">
                  fees page
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </section>

      {isTafsir ? (
        <section className="container-px pb-16">
          <div className="card-green px-6 py-12 text-center md:px-16">
            <p className="arabic text-2xl text-gold-300">{course.verseArabic}</p>
            <h2 className="mt-4 text-3xl">You are warmly invited</h2>
            <p className="mx-auto mt-4 max-w-2xl text-cream/80">
              Email or WhatsApp us and we will send you the joining details for the next
              gathering — no forms, no fee, no obligation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="mailto:info@an-nur.online?subject=Weekly%20Tafsir" className="btn-gold">
                Email us
              </a>
              <a
                href="https://wa.me/447724343150"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-cream/60 px-6 py-[0.7rem] text-[0.95rem] font-bold text-cream transition-colors hover:bg-white/10"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </section>
      ) : (
        <CtaBand
          title={`Ready to begin ${course.title}?`}
          body="Start with a free 20-minute assessment so we can place you in exactly the right class — or enrol directly if you already know what you need."
        />
      )}
    </>
  );
}
