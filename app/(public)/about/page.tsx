import type { Metadata } from "next";
import { Globe2, HeartHandshake, BookOpenText, Sparkles, Footprints } from "lucide-react";
import { PageHero, CtaBand, VerseBlock } from "../_components/shared";

export const metadata: Metadata = {
  title: "About Us — An-Nur Academy",
  description:
    "An-Nur Academy is a UK-based online Islamic academy founded by Mufti Ateiq-ur Rehman, teaching Qur'an, Arabic and Islamic Studies to students worldwide.",
};

const PRINCIPLES = [
  {
    icon: Sparkles,
    title: "Tawheed",
    arabic: "التوحيد",
    body: "Everything begins with knowing Allah. Sound belief, taught from authentic sources, is the root from which all our teaching grows.",
  },
  {
    icon: HeartHandshake,
    title: "Taqwa",
    arabic: "التقوى",
    body: "Knowledge is a trust. We teach with God-consciousness — honesty in our dealings, care in our classrooms, and humility before what we teach.",
  },
  {
    icon: BookOpenText,
    title: "Ilm",
    arabic: "العلم",
    body: "Seeking knowledge is an obligation on every Muslim. We make sacred knowledge clear, structured and reachable — for a child of five or an adult of seventy.",
  },
  {
    icon: Footprints,
    title: "Amal",
    arabic: "العمل",
    body: "Knowledge that is not lived is a lamp unlit. Every course points beyond the lesson — towards practice, character and a life of worship.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About An-Nur Academy"
        title="Light upon light, one student at a time"
        intro="An-Nur means 'the light'. We exist to carry the light of sacred knowledge to every home that seeks it — clearly taught, warmly delivered, and true to its sources."
      />

      <section className="container-px pb-16">
        <VerseBlock
          arabic="اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ"
          translation="Allah is the Light of the heavens and the earth."
          reference="Surah An-Nur 24:35"
        />
      </section>

      {/* Mission */}
      <section className="container-px pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-8 md:p-10">
            <p className="eyebrow">Our mission</p>
            <h2 className="mt-2 text-3xl">Sacred knowledge, without barriers</h2>
            <p className="mt-4 text-ink-soft">
              Too many Muslims in the West grew up between two difficulties: teachers of deep
              knowledge who could not explain it in the language their students think in, or
              fluent speakers without grounding in the classical sciences. An-Nur Academy was
              founded to close that gap.
            </p>
            <p className="mt-3 text-ink-soft">
              Every one of our teachers is qualified in what they teach <em>and</em> speaks
              English as a first language. Lessons are live, structured and personal — Qa&rsquo;idah,
              Tajweed, Arabic, Hifz and Islamic Studies, for children and adults, in group classes
              and one-to-one.
            </p>
          </div>
          <div className="card p-8 md:p-10">
            <p className="eyebrow">From the UK, to the world</p>
            <h2 className="mt-2 text-3xl">Rooted here, reaching everywhere</h2>
            <p className="mt-4 text-ink-soft">
              We are based in the United Kingdom, and our classes are attended by students across
              the UK, Europe, North America and beyond. Because everything runs online — live
              classes, a student portal, progress tracking and certificates — distance is no
              barrier to a structured Islamic education.
            </p>
            <p className="mt-4 flex items-center gap-2 font-semibold text-green-800">
              <Globe2 className="h-5 w-5" /> UK-based · students worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Founder message */}
      <section className="container-px pb-16">
        <div className="card-green p-8 md:p-14">
          <p className="eyebrow text-gold-300">A message from the founder</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Assalamu alaikum wa rahmatullah</h2>
          <div className="mt-6 max-w-3xl space-y-4 text-cream/85">
            <p>
              When I began teaching, I met the same story again and again: parents who longed for
              their children to love the Qur&rsquo;an but could not find a teacher who spoke to
              them in their own language; adults who carried a quiet ache of things never learned,
              too embarrassed to sit in a children&rsquo;s class. The knowledge was there. The
              bridge was missing.
            </p>
            <p>
              An-Nur Academy is that bridge. We teach the way the scholars taught — with sanad,
              patience and precision — but we explain the way you think: in clear English, at your
              level, without judgement. Whether you are five or seventy-five, whether you are
              starting with the alphabet or completing your hifz, there is a seat for you here.
            </p>
            <p>
              My door, and the doors of all our teachers, are open. Come with your questions.
              Come with your children. Come as you are — and let us walk towards the light
              together.
            </p>
          </div>
          <div className="mt-8">
            <p className="font-heading text-xl text-gold-300">Mufti Ateiq-ur Rehman</p>
            <p className="text-sm text-cream/70">Founder &amp; Principal, An-Nur Academy</p>
          </div>
        </div>
      </section>

      {/* Four principles */}
      <section className="container-px pb-8">
        <div className="mb-10 text-center">
          <p className="eyebrow">What guides us</p>
          <h2 className="mt-2 text-3xl md:text-4xl">Four principles</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="card p-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <p.icon className="h-6 w-6 text-green-800" />
              </div>
              <p className="arabic mt-4 text-xl text-gold-700">{p.arabic}</p>
              <h3 className="mt-1 text-xl">{p.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
