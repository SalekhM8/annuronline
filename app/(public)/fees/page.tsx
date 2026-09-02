import Link from "next/link";
import type { Metadata } from "next";
import { Check, Receipt, CalendarClock, ShieldAlert, Banknote } from "lucide-react";
import { PageHero, CtaBand } from "../_components/shared";

export const metadata: Metadata = {
  title: "Fees — An-Nur Academy",
  description:
    "Simple, transparent fees: group classes £48/month, weekend Arabic £38/month, one-to-one £15/hour, and free Weekly Tafsir. Collected monthly by direct debit.",
};

const PLANS = [
  {
    name: "Group classes",
    price: "£48",
    per: "per month",
    schedule: "Monday – Thursday",
    highlight: false,
    points: [
      "5 classes every week",
      "Includes a weekly revision class",
      "Qa'idah, Tajweed, Islamic Studies and more",
      "Separate classes for adults and children",
    ],
  },
  {
    name: "Weekend Arabic group",
    price: "£38",
    per: "per month",
    schedule: "Saturday & Sunday",
    highlight: false,
    points: [
      "2 classes every week",
      "Arabic Language programme",
      "Grammar, vocabulary and comprehension",
      "Ideal alongside work or school",
    ],
  },
  {
    name: "One-to-one",
    price: "£15",
    per: "per hour",
    schedule: "Times to suit you",
    highlight: true,
    points: [
      "All subjects — including Hifz (1:1 only)",
      "A teacher's full attention",
      "Pace and schedule built around you",
      "Adults and children",
    ],
  },
];

const FAQS = [
  {
    q: "How are fees collected?",
    a: "By direct debit only, set up securely from the link in your welcome email. Fees are collected on the 1st of each month — if a different date suits you better, we can adjust it for you.",
  },
  {
    q: "Will I get an invoice?",
    a: "Yes. An invoice is emailed each month before collection, and a receipt is emailed once payment is received — so your records are always complete.",
  },
  {
    q: "What happens if a payment fails?",
    a: "Nothing dramatic. You have a 7-day grace period to bring the payment up to date. If it remains unpaid after 7 days, portal access is paused until payment is made — and restored straight away afterwards. If you're experiencing difficulty, talk to us: we are always happy to help.",
  },
  {
    q: "Are there any joining or assessment fees?",
    a: "No. The 20-minute placement assessment is completely free, and there are no registration or joining fees. You pay only your monthly class fee.",
  },
  {
    q: "How much is counselling?",
    a: "Counselling sessions with Mufti Ateiq are one hour long and priced on enquiry — contact us and we will discuss what you need. Sessions are confidential, in person or online.",
  },
  {
    q: "Is the Weekly Tafsir really free?",
    a: "Completely. It is open to everyone — enrolled or not — as our gift to the community. Just get in touch and we'll send you the joining details.",
  },
];

export default function FeesPage() {
  return (
    <>
      <PageHero
        eyebrow="Fees"
        title="Simple, honest pricing"
        intro="No joining fees, no hidden extras, and a free assessment before you commit. Just clear monthly fees collected by direct debit."
      />

      {/* Plans */}
      <section className="container-px pb-14">
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={p.highlight ? "card-gold flex flex-col p-8" : "card flex flex-col p-8"}
            >
              <p className="eyebrow">{p.schedule}</p>
              <h2 className="mt-2 text-2xl">{p.name}</h2>
              <p className="mt-4">
                <span className="font-heading text-4xl text-green-900">{p.price}</span>{" "}
                <span className="text-sm font-semibold text-ink-soft">{p.per}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" /> {pt}
                  </li>
                ))}
              </ul>
              <Link href="/enrol" className={p.highlight ? "btn-primary mt-8" : "btn-outline mt-8"}>
                Enrol now
              </Link>
            </div>
          ))}
        </div>

        {/* Free / on-enquiry rows */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="card flex items-start gap-4 p-7">
            <span className="badge badge-gold mt-1 shrink-0">Free</span>
            <div>
              <h3 className="text-lg">Weekly Tafsir</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Open to everyone, enrolled or not. Led weekly by Mufti Ateiq-ur Rehman.{" "}
                <Link href="/courses/weekly-tafsir" className="font-bold text-green-700 hover:underline">
                  Find out more
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="card flex items-start gap-4 p-7">
            <span className="badge badge-green mt-1 shrink-0">On enquiry</span>
            <div>
              <h3 className="text-lg">Counselling</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Confidential one-hour sessions with Mufti Ateiq — personal, youth, marriage, and
                benefits &amp; finance.{" "}
                <Link href="/counselling" className="font-bold text-green-700 hover:underline">
                  Book a session
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How billing works */}
      <section className="bg-cream-deep py-14">
        <div className="container-px">
          <div className="mb-10 text-center">
            <p className="eyebrow">How billing works</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Set up once, then forget about it</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="card p-7">
              <Banknote className="h-6 w-6 text-green-700" />
              <h3 className="mt-3 text-lg">Direct debit only</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Your welcome email includes a secure link to set up your monthly direct debit — no
                cards to remember, no manual payments.
              </p>
            </div>
            <div className="card p-7">
              <CalendarClock className="h-6 w-6 text-green-700" />
              <h3 className="mt-3 text-lg">Collected on the 1st</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Fees are collected on the 1st of each month. Need a different date? Just ask — we
                can adjust it for you.
              </p>
            </div>
            <div className="card p-7">
              <Receipt className="h-6 w-6 text-green-700" />
              <h3 className="mt-3 text-lg">Invoice &amp; receipt</h3>
              <p className="mt-2 text-sm text-ink-soft">
                An invoice is emailed each month, and a receipt follows every successful payment —
                automatically.
              </p>
            </div>
            <div className="card p-7">
              <ShieldAlert className="h-6 w-6 text-green-700" />
              <h3 className="mt-3 text-lg">7-day grace period</h3>
              <p className="mt-2 text-sm text-ink-soft">
                If a payment can&rsquo;t be collected, you have 7 days to put it right before portal
                access is paused. It&rsquo;s restored the moment payment is made.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-px py-14">
        <div className="mb-8 text-center">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-2 text-3xl md:text-4xl">Frequently asked</h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="card group px-6 py-4">
              <summary className="cursor-pointer list-none font-heading text-lg text-green-900 marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-gold-600 transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
