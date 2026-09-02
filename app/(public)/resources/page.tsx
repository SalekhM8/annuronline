import type { Metadata } from "next";
import { Download, BookOpen } from "lucide-react";
import { PageHero, CtaBand } from "../_components/shared";

export const metadata: Metadata = {
  title: "Free Resources — An-Nur Academy",
  description:
    "Download our free study guides by Maulana Ateiq-ur Rehman: Salaah Made Easy, Tajweed Made Easy and The Six Kalimahs Made Easy.",
};

const GUIDES = [
  {
    title: "Salaah Made Easy",
    pages: 25,
    cover: "/images/cover-salaah.png",
    pdf: "/resources/salaah-made-easy.pdf",
    blurb:
      "A clear, step-by-step guide to the prayer — wudhu, the positions, what to recite and what it means. Perfect for new Muslims, children, and anyone rebuilding their salaah.",
  },
  {
    title: "Tajweed Made Easy",
    pages: 35,
    cover: "/images/cover-tajweed.png",
    pdf: "/resources/tajweed-made-easy.pdf",
    blurb:
      "The essential rules of Qur'anic recitation explained in plain English — makharij, the rules of noon and meem, madd and more, with examples throughout.",
  },
  {
    title: "The Six Kalimahs Made Easy",
    pages: 13,
    cover: "/images/cover-six-kalimahs.png",
    pdf: "/resources/six-kalimahs-made-easy.pdf",
    blurb:
      "The six kalimahs with Arabic text, transliteration, translation and explanation — a concise companion for children learning them and adults revisiting them.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Free resources"
        title="Knowledge, freely given"
        intro="Three study guides written by our principal, Maulana Ateiq-ur Rehman — downloadable, printable, and completely free. Share them widely; that is what they are for."
      />

      <section className="container-px pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {GUIDES.map((g) => (
            <div key={g.title} className="card flex flex-col overflow-hidden">
              <div className="bg-cream-deep p-6">
                <img
                  src={g.cover}
                  alt={`${g.title} cover`}
                  className="mx-auto aspect-[3/4] w-full max-w-[240px] rounded-lg object-cover shadow-[var(--shadow-soft)]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-soft">
                  <BookOpen className="h-4 w-4 text-gold-600" /> {g.pages} pages · PDF
                </div>
                <h2 className="mt-2 text-xl">{g.title}</h2>
                <p className="mt-1 text-xs font-semibold text-ink-soft">
                  by Maulana Ateiq-ur Rehman
                </p>
                <p className="mt-3 flex-1 text-sm text-ink-soft">{g.blurb}</p>
                <a href={g.pdf} download className="btn-primary mt-5 w-full">
                  <Download className="h-4 w-4" /> Download free
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ink-soft">
          These guides are provided free for personal and educational use. Please share them as
          they are, without alteration.
        </p>
      </section>

      <CtaBand
        title="Ready to go beyond the books?"
        body="Guides start the journey; a teacher completes it. Join a live class with qualified teachers who explain everything in clear English."
      />
    </>
  );
}
