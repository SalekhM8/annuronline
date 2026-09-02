import type { Metadata } from "next";
import { HeartHandshake, Users, Gem, PiggyBank, Lock, Clock3, MapPin } from "lucide-react";
import { PageHero, VerseBlock } from "../_components/shared";
import CounsellingForm from "./CounsellingForm";

export const metadata: Metadata = {
  title: "Counselling — An-Nur Academy",
  description:
    "Confidential, faith-based counselling with Mufti Ateiq-ur Rehman — personal, youth, marriage, and benefits & finance guidance. One-hour sessions, in person or online.",
};

const TYPES = [
  {
    icon: HeartHandshake,
    title: "Personal",
    body: "Anxiety, grief, faith struggles, life decisions — a private space to talk things through with someone grounded in both deen and real life.",
  },
  {
    icon: Users,
    title: "Youth",
    body: "Guidance for young Muslims navigating identity, school, friendships and faith — with an approach that listens first.",
  },
  {
    icon: Gem,
    title: "Marriage",
    body: "For couples and those preparing for marriage — communication, rights and responsibilities, and reconciliation, from Islamic principles.",
  },
  {
    icon: PiggyBank,
    title: "Benefits & Finance",
    body: "Practical help with UK benefits, debt and financial worries, combined with Islamic guidance on halal earnings and provision.",
  },
];

export default function CounsellingPage() {
  return (
    <>
      <PageHero
        eyebrow="Faith-based counselling"
        title="Someone to talk to, who understands both worlds"
        intro="One-hour confidential sessions with Mufti Ateiq-ur Rehman — where the wisdom of the deen meets a compassionate, listening ear. In person or online."
      />

      <section className="container-px pb-12">
        <VerseBlock
          arabic="أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
          translation="Truly, in the remembrance of Allah do hearts find rest."
          reference="Surah Ar-Ra'd 13:28"
        />
      </section>

      <section className="container-px pb-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => (
            <div key={t.title} className="card p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                <t.icon className="h-5 w-5 text-green-800" />
              </div>
              <h3 className="mt-4 text-lg">{t.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-px pb-12">
        <div className="card-gold flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-around md:p-10">
          <p className="flex items-center gap-3 font-semibold text-green-900">
            <Clock3 className="h-5 w-5 text-gold-700" /> One-hour sessions
          </p>
          <p className="flex items-center gap-3 font-semibold text-green-900">
            <MapPin className="h-5 w-5 text-gold-700" /> In person or online
          </p>
          <p className="flex items-center gap-3 font-semibold text-green-900">
            <Lock className="h-5 w-5 text-gold-700" /> Strictly confidential
          </p>
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          Session fees are discussed on enquiry — cost should never be the reason you don&rsquo;t
          reach out.
        </p>
      </section>

      <section className="container-px pb-20">
        <div className="mx-auto max-w-3xl">
          <CounsellingForm />
        </div>
      </section>
    </>
  );
}
