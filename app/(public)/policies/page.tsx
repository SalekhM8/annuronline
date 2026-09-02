import type { Metadata } from "next";
import { ShieldCheck, Lock } from "lucide-react";
import { PageHero } from "../_components/shared";

export const metadata: Metadata = {
  title: "Safeguarding & Data Protection — An-Nur Academy",
  description:
    "An-Nur Academy's data protection notice (UK GDPR) and child protection & safeguarding policy, in plain English.",
};

export default function PoliciesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our policies"
        title="Safeguarding & data protection"
        intro="Plain-English explanations of how we protect your information and, above all, how we protect the children in our care."
      />

      <section className="container-px pb-20">
        <div className="mx-auto max-w-3xl space-y-10">
          {/* ---------------- Data protection ---------------- */}
          <article id="data-protection" className="card scroll-mt-24 p-8 md:p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                <Lock className="h-5 w-5 text-green-800" />
              </div>
              <h2 className="text-2xl md:text-3xl">Data protection notice</h2>
            </div>

            <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink-soft">
              <p>
                An-Nur Academy (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is based in the United Kingdom
                and processes personal data in accordance with the UK General Data Protection
                Regulation (UK GDPR) and the Data Protection Act 2018. This notice explains, in
                plain English, what we collect and why.
              </p>

              <div>
                <h3 className="text-lg text-green-900">What we collect</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>
                    <strong>Enquiries and applications</strong> — name, email address, phone
                    number, and the details you give us when you enrol, book an assessment, request
                    counselling or ask a question.
                  </li>
                  <li>
                    <strong>Students</strong> — enrolment details, class attendance, learning
                    progress and, for children, the name and contact details of a parent or
                    guardian.
                  </li>
                  <li>
                    <strong>Payments</strong> — direct debit mandates are set up and held by our
                    regulated payment provider; we do not store your bank details on this website.
                  </li>
                  <li>
                    <strong>Portal use</strong> — login records for students and teachers, kept for
                    safeguarding and account security.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg text-green-900">Why we use it</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>To respond to your enquiry, application or booking (contract / pre-contract steps).</li>
                  <li>To run classes, track progress, issue certificates and manage fees (contract).</li>
                  <li>To keep children safe and meet our safeguarding duties (legal obligation / legitimate interests).</li>
                  <li>To send invoices, receipts and essential service emails (contract).</li>
                </ul>
                <p className="mt-2">
                  We do not sell your data, and we do not use it for third-party marketing. We
                  share it only with the service providers who make the academy run (such as our
                  email and payment providers), under contracts that protect it.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-green-900">How long we keep it</h3>
                <p className="mt-2">
                  Enquiry data is kept only as long as needed to deal with your enquiry. Student
                  records are kept for the duration of enrolment and for a limited period
                  afterwards for legal, financial and safeguarding purposes, then deleted.
                </p>
              </div>

              <div>
                <h3 className="text-lg text-green-900">Your rights</h3>
                <p className="mt-2">Under UK GDPR you have the right to:</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>access a copy of the personal data we hold about you;</li>
                  <li>have inaccurate data corrected, or incomplete data completed;</li>
                  <li>ask us to delete your data where there is no lawful reason to keep it;</li>
                  <li>restrict or object to certain processing;</li>
                  <li>receive your data in a portable format;</li>
                  <li>
                    complain to the Information Commissioner&rsquo;s Office (ICO) at{" "}
                    <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-700 hover:underline">
                      ico.org.uk
                    </a>{" "}
                    if you believe we have mishandled your data.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg text-green-900">Contact us about your data</h3>
                <p className="mt-2">
                  Email{" "}
                  <a href="mailto:info@an-nur.online" className="font-semibold text-green-700 hover:underline">
                    info@an-nur.online
                  </a>{" "}
                  or call +44 7724 343150 for any data request or question. We aim to respond to
                  all rights requests within one month.
                </p>
              </div>
            </div>
          </article>

          {/* ---------------- Safeguarding ---------------- */}
          <article id="safeguarding" className="card scroll-mt-24 p-8 md:p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100">
                <ShieldCheck className="h-5 w-5 text-gold-700" />
              </div>
              <h2 className="text-2xl md:text-3xl">Child protection &amp; safeguarding</h2>
            </div>

            <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink-soft">
              <p>
                Nothing at An-Nur Academy matters more than the safety of the children entrusted to
                us. Our safeguarding approach is built into how classes run, not bolted on
                afterwards.
              </p>

              <div>
                <h3 className="text-lg text-green-900">How our classes are structured</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>
                    <strong>Segregated classes.</strong> Classes are appropriately segregated —
                    children learn separately from adults, and classes are arranged with proper
                    Islamic etiquette between genders.
                  </li>
                  <li>
                    <strong>No private contact.</strong> Teachers never contact students outside
                    the student portal. All teacher–student messages go through the portal message
                    board, where every message is permanently recorded and cannot be edited or
                    deleted.
                  </li>
                  <li>
                    <strong>Guardian access.</strong> Parents and guardians of child students can
                    access their child&rsquo;s portal — including messages, attendance and progress
                    — so nothing about their child&rsquo;s education is hidden from them.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg text-green-900">Our staff</h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                  <li>
                    We are committed to DBS (Disclosure and Barring Service) checks for all staff
                    who work with children, alongside careful recruitment and references.
                  </li>
                  <li>
                    Teachers receive clear safeguarding expectations as a condition of teaching
                    with us, and teaching quality and conduct are regularly observed and reviewed.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg text-green-900">Reporting a concern</h3>
                <p className="mt-2">
                  If you have any concern about a child&rsquo;s safety or wellbeing — or about the
                  conduct of anyone connected to the academy — please contact us immediately at{" "}
                  <a href="mailto:info@an-nur.online" className="font-semibold text-green-700 hover:underline">
                    info@an-nur.online
                  </a>{" "}
                  or +44 7724 343150. Every concern is taken seriously, handled sensitively, and
                  escalated to the appropriate statutory authorities where necessary. If you
                  believe a child is in immediate danger, contact the police on 999 first.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
