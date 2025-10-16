import Link from "next/link";
import CardLink from "@/components/ui/CardLink";
import SubmissionForm from "@/components/forms/SubmissionForm";

export default function Home() {
  const cards = [
    { title: "Islamic Studies", href: "/offerings/islamic-studies", imageUrl: "/images/islamicstudies.png" },
    { title: "Quran", href: "/offerings/quran", imageUrl: "/images/quran.png" },
    { title: "Tajweed", href: "/offerings/tajweed", imageUrl: "/images/tajweed.png" },
    { title: "Learn Arabic", href: "/offerings/arabic", imageUrl: "/images/learnarabic.png" },
  ];

  return (
    <div className="pb-24">
      <section className="bg-soft relative overflow-hidden rounded-3xl p-10 ring-1 ring-[--brand-gold]/30">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[--border] bg-white/70 px-3 py-1 text-xs text-[--color-brand]">
              🌍 UK‑based • Accessible worldwide
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Learn with Qualified, English‑speaking Teachers</h1>
            <p className="mt-3 text-neutral-700">Simple, minimal, and focused learning in your timezone.</p>
            <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/assessment" className="btn-primary">Free Assessment</Link>
              <Link href="/enroll" className="btn-secondary">Enroll</Link>
            </div>
          </div>
          <div className="relative h-64 rounded-2xl bg-[url('/images/mainheroannur.png')] bg-cover bg-center shadow-lg ring-1 ring-[--brand-gold]/30" />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Our Main Services</h2>
          <Link href="/offerings" className="text-sm text-[--color-brand]">View all</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <CardLink key={c.href} href={c.href} title={c.title} imageUrl={c.imageUrl} description="Learn more" />
          ))}
        </div>
      </section>
    </div>
  );
}
