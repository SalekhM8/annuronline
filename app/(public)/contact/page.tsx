import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Music,
  Link as LinkIcon,
  Globe2,
  CalendarCheck,
} from "lucide-react";
import { PageHero } from "../_components/shared";

export const metadata: Metadata = {
  title: "Contact — An-Nur Academy",
  description:
    "Get in touch with An-Nur Academy by email, phone or WhatsApp. UK-based, serving students worldwide.",
};

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/an_nuracademy" },
  { icon: Music, label: "TikTok", href: "https://www.tiktok.com/@annuracademy" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@an-nur.academy" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/An-NurAcademy" },
  { icon: LinkIcon, label: "Linktree", href: "https://linktr.ee/AnNur_Academy" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="We'd love to hear from you"
        intro="Questions about courses, fees, enrolment — or anything at all. Message us and a real person will reply, usually within a working day."
      />

      <section className="container-px pb-12">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          <a href="mailto:info@an-nur.online" className="card group p-8 text-center transition-shadow hover:shadow-[var(--shadow-lift)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-800" />
            </div>
            <h2 className="mt-4 text-lg">Email</h2>
            <p className="mt-2 text-sm font-semibold text-green-700">info@an-nur.online</p>
            <p className="mt-1 text-xs text-ink-soft">Best for detailed enquiries</p>
          </a>
          <a href="tel:+447724343150" className="card group p-8 text-center transition-shadow hover:shadow-[var(--shadow-lift)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Phone className="h-6 w-6 text-green-800" />
            </div>
            <h2 className="mt-4 text-lg">Phone</h2>
            <p className="mt-2 text-sm font-semibold text-green-700">+44 7724 343150</p>
            <p className="mt-1 text-xs text-ink-soft">UK hours, Monday to Friday</p>
          </a>
          <a
            href="https://wa.me/447724343150"
            target="_blank"
            rel="noopener noreferrer"
            className="card group p-8 text-center transition-shadow hover:shadow-[var(--shadow-lift)]"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <MessageCircle className="h-6 w-6 text-green-800" />
            </div>
            <h2 className="mt-4 text-lg">WhatsApp</h2>
            <p className="mt-2 text-sm font-semibold text-green-700">Message us directly</p>
            <p className="mt-1 text-xs text-ink-soft">Usually the fastest reply</p>
          </a>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-ink-soft">
          <Globe2 className="h-4 w-4 text-green-700" /> Based in the United Kingdom · serving
          students worldwide
        </p>
      </section>

      {/* Quick pointers */}
      <section className="container-px pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="card-gold p-8 md:p-10">
            <h2 className="text-xl">Looking for something specific?</h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <Link href="/enrol" className="font-bold text-green-800 hover:underline">Enrolment</Link>
                <span className="text-ink-soft"> — apply online in a few minutes.</span>
              </p>
              <p>
                <Link href="/assessment" className="font-bold text-green-800 hover:underline">Free assessment</Link>
                <span className="text-ink-soft"> — book your 20-minute placement.</span>
              </p>
              <p>
                <Link href="/ask-the-mufti" className="font-bold text-green-800 hover:underline">Ask the Mufti</Link>
                <span className="text-ink-soft"> — religious questions, answered personally.</span>
              </p>
              <p>
                <Link href="/counselling" className="font-bold text-green-800 hover:underline">Counselling</Link>
                <span className="text-ink-soft"> — confidential one-hour sessions.</span>
              </p>
              <p>
                <Link href="/fees" className="font-bold text-green-800 hover:underline">Fees</Link>
                <span className="text-ink-soft"> — clear pricing and how billing works.</span>
              </p>
              <p>
                <Link href="/policies" className="font-bold text-green-800 hover:underline">Policies</Link>
                <span className="text-ink-soft"> — safeguarding and data protection.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Socials */}
      <section className="container-px pb-20 text-center">
        <p className="eyebrow">Follow us</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm"
            >
              <s.icon className="h-4 w-4" /> {s.label}
            </a>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-soft">
          <CalendarCheck className="h-4 w-4 text-green-700" /> New term enrolments are open all
          year round.
        </p>
      </section>
    </>
  );
}
