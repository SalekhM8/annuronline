export default function AboutPage() {
  return (
    <div className="py-10 space-y-10">
      {/* Mission statement */}
      <div className="mx-auto max-w-5xl rounded-2xl border border-[--brand-gold]/30 p-6 ring-1 ring-[--brand-gold]/20" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }}>
        <h1 className="text-2xl font-semibold text-[--foreground]">Our Mission</h1>
        <p className="mt-2 text-neutral-800">At An‑Nur Academy, our mission is to make Islamic education accessible to all, helping students build a strong connection with their faith from anywhere in the world. We focus on nurturing Taqwa (awareness of Allah), instilling core Islamic values, and equipping learners to live their faith confidently in today’s world.</p>
        <p className="mt-3 text-neutral-800">Guided by four key principles — Tawheed (Oneness of Allah), Taqwa, Ilm (knowledge), and Amal (action) — our programs aim to be both informative and transformative.</p>
        <div className="mt-4 rounded-xl border border-[--brand-gold]/30 p-4" style={{ background: 'color-mix(in oklab, var(--brand-gold), white 90%)' }}>
          <div className="text-center text-xl font-semibold tracking-tight text-[--foreground]">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</div>
          <div className="mt-1 text-center text-sm italic text-neutral-800">“Read! In the name of your Lord who created.” (Surah Al‑‘Alaq 96:1)</div>
        </div>
        <p className="mt-3 text-neutral-800">Since 2020, we’ve offered flexible, high‑quality online courses led by experienced Scholars and Huffaaz. From foundational Qaidah and Quran lessons to advanced Hifdh and Islamic Studies, our curriculum serves students of all ages and levels.</p>
      </div>
      {/* Hero image with CTA overlay */}
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl ring-1 ring-[--brand-gold]/30">
        <div className="h-[420px] bg-[url('/images/islamicstudies.png')] bg-cover bg-center" />
        <div className="absolute inset-0 z-10 cta-overlay" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="rounded-2xl bg-white/85 px-6 py-5 text-center shadow-md ring-1 ring-[--brand-gold]/30 backdrop-blur">
            <div className="text-base font-semibold text-[--foreground]">Ready to Join?</div>
            <div className="mt-3 flex justify-center gap-3">
              <a href="/assessment" className="btn-primary">Book Free Assessment</a>
              <a href="/enroll" className="btn-secondary">Enroll</a>
            </div>
          </div>
        </div>
      </div>

      {/* Structured content grid */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="Our Approach" tone="green">
          <p>
            At An‑Nur Academy, we provide a holistic, enriching experience centred on four principles: Personalised Learning, Qualified Instructors, Interactive & Engaging teaching, and a Vision to Inspire and Nurture.
          </p>
          <p className="mt-3 font-semibold italic text-[--foreground]">
            “Those who were given knowledge are raised by degrees.” — Surah Al‑Mujadila 58:11
          </p>
        </Card>
        <Card title="Personalised Learning" tone="gold">
          <p>
            Each student receives individual attention at their pace. Flexible online classes make learning from home simple — join a group or choose 1:1 lessons.
          </p>
        </Card>
        <Card title="Interactive & Engaging" tone="green">
          <p>
            We encourage active participation through multimedia resources, guided discussion, and practical application to build a lasting love for learning.
          </p>
          <p className="mt-3 font-semibold italic text-[--foreground]">
            “Seeking knowledge is an obligation upon every Muslim.” — Sunan Ibn Majah
          </p>
        </Card>
        <Card title="Qualified Instructors" tone="gold">
          <p>
            Our teachers are experienced across Quran, Arabic, and Islamic Studies — passionate, empathetic, and committed to student success.
          </p>
          <p className="mt-3 font-semibold italic text-[--foreground]">
            “I was only sent as a teacher.” — Sahih Muslim
          </p>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, tone = "green" }: { title: string; children: React.ReactNode; tone?: "green" | "gold" }) {
  return (
    <div
      className="rounded-2xl border border-[--brand-gold]/30 p-6 ring-1 ring-[--brand-gold]/20"
      style={{
        background:
          tone === "gold"
            ? "color-mix(in oklab, var(--brand-gold), white 90%)"
            : "color-mix(in oklab, var(--brand-green), white 92%)",
      }}
    >
      <h3 className="font-semibold text-[--brand-green]">{title}</h3>
      <div className="mt-2 text-neutral-800">{children}</div>
    </div>
  );
}



