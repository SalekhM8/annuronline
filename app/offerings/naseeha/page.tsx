import Link from "next/link";
import SubmissionForm from "@/components/forms/SubmissionForm";

export default function NaseehaPage() {
  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/islamicstudies.png)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 💚 HERO */}
      <div className="text-center space-y-6">
        <div className="text-7xl">💚</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Naseeha Classes! 🌟
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Spiritual Guidance for Personal Growth! ✨
        </p>
      </div>

      {/* 🎯 ABOUT */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center">
          📖 Rooted in Quran & Sunnah
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Get <span className="font-bold text-[--brand-gold-light]">uplifting, practical guidance</span> tailored to youth and adults! 🙌
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Sessions designed for <span className="font-bold text-[--brand-gold-light]">personal & spiritual growth!</span> 🌱
        </p>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark]">
          Get Guidance Today! 🚀
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5">
            📋 FREE Consultation
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5">
            🎓 Book Session
          </Link>
        </div>
      </div>

      {/* 📝 ENROLLMENT FORM */}
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


