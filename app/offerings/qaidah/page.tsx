import Link from "next/link";
import SubmissionForm from "@/components/forms/SubmissionForm";

export default function QaidahPage() {
  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🔤 HERO */}
      <div className="text-center space-y-6">
        <div className="text-7xl">🔤</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Qaidah Classes! 📖
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Build Strong Foundations in Arabic Reading! 🌟
        </p>
      </div>

      {/* 📚 ABOUT */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center">
          🎯 Perfect for Beginners!
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Learn to <span className="font-bold text-[--brand-gold-light]">recognize letters</span>, <span className="font-bold text-[--brand-gold-light]">sounds</span>, and <span className="font-bold text-[--brand-gold-light]">rules</span> to prepare for fluent Quran reading! 📖✨
        </p>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark]">
          Ready to Start? 🚀
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5">
            📋 FREE Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5">
            🎓 Enroll NOW
          </Link>
        </div>
      </div>

      {/* 📝 ENROLLMENT FORM */}
      <div className="mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-center gradient-text mb-8">
          Or Enroll Right Now! 📋
        </h2>
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
  );
}


