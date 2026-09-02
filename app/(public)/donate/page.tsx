import type { Metadata } from "next";
import { GraduationCap, BookOpen, Users, Landmark, Mail, MessageCircle } from "lucide-react";
import { PageHero } from "../_components/shared";

export const metadata: Metadata = {
  title: "Donate — An-Nur Academy",
  description:
    "Support An-Nur Academy: your sadaqah funds subsidised places, free learning resources and the free weekly Tafsir open to the whole community.",
};

const IMPACT = [
  {
    icon: GraduationCap,
    title: "Subsidised places",
    body: "Some families simply cannot afford fees. Your donations quietly cover class places for students in hardship, so no one is turned away from sacred knowledge.",
  },
  {
    icon: BookOpen,
    title: "Free resources",
    body: "Our study guides — on salaah, tajweed and the kalimahs — are written, designed and given away free. Donations keep them free for everyone, everywhere.",
  },
  {
    icon: Users,
    title: "The weekly Tafsir",
    body: "Every week the community gathers, free of charge, to journey through the Qur'an with Mufti Ateiq. Your support keeps that door open to all.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Support the academy"
        title="Give light, and it keeps giving"
        intro="An-Nur Academy is more than its fee-paying classes. Behind the scenes, donations carry students through hardship, keep our resources free, and hold open the doors of the weekly Tafsir."
      />

      {/* Sadaqah jariyah framing */}
      <section className="container-px pb-12">
        <div className="card-gold px-6 py-10 text-center md:px-16">
          <p className="eyebrow">Sadaqah jariyah</p>
          <h2 className="mt-3 text-2xl md:text-3xl">Charity that outlives you</h2>
          <p className="mx-auto mt-4 max-w-2xl italic text-ink-soft">
            &ldquo;When a person dies, his deeds come to an end except three: ongoing charity,
            beneficial knowledge, or a righteous child who prays for him.&rdquo;
          </p>
          <p className="eyebrow mt-3">Sahih Muslim 1631 — narrated by Abu Hurairah (رضي الله عنه)</p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-ink-soft">
            A donation to Islamic education gathers two of the three: it is ongoing charity that
            plants beneficial knowledge. Every verse a sponsored child recites, every rule of
            tajweed a student applies, continues in your scale — long after the gift is forgotten.
          </p>
        </div>
      </section>

      {/* Where it goes */}
      <section className="container-px pb-14">
        <div className="mb-8 text-center">
          <p className="eyebrow">Where your giving goes</p>
          <h2 className="mt-2 text-3xl">Three doors your donation opens</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {IMPACT.map((i) => (
            <div key={i.title} className="card p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <i.icon className="h-6 w-6 text-green-800" />
              </div>
              <h3 className="mt-4 text-xl">{i.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{i.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to give */}
      <section className="container-px pb-20">
        <div className="mb-8 text-center">
          <p className="eyebrow">How to give</p>
          <h2 className="mt-2 text-3xl">Two simple ways</h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="card p-8">
            <div className="flex items-center gap-3">
              <Landmark className="h-6 w-6 text-green-700" />
              <h3 className="text-xl">Bank transfer</h3>
            </div>
            <div className="mt-5 space-y-2 rounded-xl bg-green-50 p-5 text-sm">
              <p><span className="font-bold text-green-900">Account name:</span> An-Nur Academy</p>
              <p><span className="font-bold text-green-900">Sort code:</span> 00-00-00</p>
              <p><span className="font-bold text-green-900">Account number:</span> 00000000</p>
              <p><span className="font-bold text-green-900">Reference:</span> DONATION</p>
            </div>
            <p className="mt-4 text-xs font-semibold text-gold-700">
              Bank details to be confirmed — please contact us before transferring, and we will
              send you the verified account details directly.
            </p>
          </div>
          <div className="card p-8">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-green-700" />
              <h3 className="text-xl">Speak to us</h3>
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              Whether you&rsquo;d like to make a one-off gift, sponsor a student&rsquo;s place
              monthly, or give zakat (we&rsquo;ll advise on eligibility) — message us and we&rsquo;ll
              arrange it personally.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="mailto:info@an-nur.online?subject=Donation%20enquiry"
                className="btn-primary"
              >
                <Mail className="h-4 w-4" /> Email us
              </a>
              <a
                href="https://wa.me/447724343150"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-soft">
          May Allah accept your giving and multiply it for you. We do not process card payments on
          this website — all donations are arranged personally by bank transfer.
        </p>
      </section>
    </>
  );
}
