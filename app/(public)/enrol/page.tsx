import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { PageHero } from "../_components/shared";
import EnrolForm from "./EnrolForm";

export const metadata: Metadata = {
  title: "Enrol — An-Nur Academy",
  description:
    "Apply to enrol at An-Nur Academy. Tell us about yourself or your child, choose your courses, and we'll take care of the rest.",
};

export default function EnrolPage() {
  return (
    <>
      <PageHero
        eyebrow="Enrolment"
        title="Begin your journey"
        intro="Tell us a little about yourself — or your child — and choose your courses. We'll review your application and guide you through every step from there."
      >
        <p className="mx-auto mt-5 flex max-w-xl items-center justify-center gap-2 text-sm font-semibold text-ink-soft">
          <CalendarCheck className="h-4 w-4 text-green-700" />
          Not sure of your level?{" "}
          <Link href="/assessment" className="font-bold text-green-700 hover:underline">
            Book a free 20-minute assessment first
          </Link>
        </p>
      </PageHero>

      <section className="container-px pb-20">
        <div className="mx-auto max-w-3xl">
          <EnrolForm />
        </div>
      </section>
    </>
  );
}
