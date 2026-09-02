import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Users, UserRound } from "lucide-react";
import { COURSES } from "./course-data";
import { PageHero, CtaBand } from "../_components/shared";

export const metadata: Metadata = {
  title: "Courses — An-Nur Academy",
  description:
    "Qa'idah, Tajweed, Arabic Language, Hifz, Islamic Studies and free Weekly Tafsir — live online courses taught by qualified UK-based teachers.",
};

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our courses"
        title="A structured path for every student"
        intro="Six live online courses, for children and adults, in group classes and one-to-one — all taught by qualified teachers who speak English as a first language."
      />

      <section className="container-px pb-8">
        <div className="grid gap-6 md:grid-cols-2">
          {COURSES.map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)] sm:flex-row"
            >
              <div className="relative sm:w-2/5 sm:shrink-0">
                <img
                  src={c.image}
                  alt={c.title}
                  className="aspect-[16/10] h-full w-full object-cover sm:aspect-auto"
                />
                {c.isFree && (
                  <span className="badge badge-gold absolute left-3 top-3">Free · open to all</span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl">{c.title}</h2>
                  <span className="arabic text-lg text-gold-700">{c.arabicTitle}</span>
                </div>
                <p className="mt-2 flex-1 text-sm text-ink-soft">{c.tagline}</p>
                <p className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-soft">
                  {c.slug === "hifz" ? (
                    <>
                      <UserRound className="h-4 w-4 text-green-700" /> One-to-one only
                    </>
                  ) : c.isFree ? (
                    <>
                      <Users className="h-4 w-4 text-green-700" /> Open weekly gathering
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 text-green-700" /> Group &amp; one-to-one
                    </>
                  )}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-green-700">
                  Explore course{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
