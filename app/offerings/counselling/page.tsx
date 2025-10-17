import Link from "next/link";
import SubmissionForm from "@/components/forms/SubmissionForm";

export default function CounsellingPage() {
  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/tasbeeh.png)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🤝 HERO */}
      <div className="text-center space-y-6">
        <div className="text-7xl">🤝</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Faith-Based Counselling! 💚
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Compassionate, Confidential Support! 🌟
        </p>
      </div>

      {/* 💚 ABOUT */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center">
          🌟 For Everyone!
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Supporting <span className="font-bold text-[--brand-gold-light]">families, couples, adults & youth</span> with compassion! 💚
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          <span className="font-bold text-[--brand-gold-light]">100% Confidential</span> • Professional • Caring 🤝
        </p>
      </div>

      {/* 🎯 HOW IT WORKS */}
      <div className="fun-box-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          How It Works! 📋
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">📝</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">1. Book</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Schedule an <span className="font-bold">initial consultation</span>
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-6xl">🤝</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">2. Match</h3>
            <p className="text-lg text-[--brand-green-dark]">
              We match you with an <span className="font-bold">experienced counsellor</span>
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-6xl">💚</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">3. Grow</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Start your journey to <span className="font-bold">healing & growth!</span>
            </p>
          </div>
        </div>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark]">
          Take the First Step! 🚀
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5">
            📋 FREE Consultation
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5">
            🤝 Book Session
          </Link>
        </div>
      </div>

      {/* 📝 BOOKING FORM */}
      <div className="mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-center gradient-text mb-8">
          Book Your Session! 📋
        </h2>
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
    </>
  );
}


