import Link from "next/link";
import SubmissionForm from "@/components/forms/SubmissionForm";
import { Heart, Star, BookOpen, GraduationCap, Rocket, Sparkles } from "lucide-react";

export default function NaseehaPage() {
  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/dua.jpg)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 💚 HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Heart className="w-20 h-20 text-brand-green" fill="currentColor" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text text-center">
          Naseeha Classes
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold text-center">
          Spiritual guidance for personal growth
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/assessment" className="btn-fun text-lg px-8 py-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-white" fill="currentColor" />
            Free Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-lg px-8 py-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-green-dark" />
            Enrol Now
          </Link>
        </div>
      </div>

      {/* 🎯 ABOUT */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center relative z-10">
          Rooted in Quran & Sunnah
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          Get <span className="font-bold text-[--brand-gold-light]">uplifting, practical guidance</span> tailored to youth and adults
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          Sessions designed for <span className="font-bold text-[--brand-gold-light]">personal & spiritual growth</span>
        </p>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark text-center relative z-10">
          Get Guidance Today
        </h2>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5 flex items-center gap-3">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
            Free Consultation
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-brand-green-dark" />
            Book Session
          </Link>
        </div>
      </div>

      {/* 📝 ENROLLMENT FORM */}
      <div className="mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-center gradient-text mb-8 flex items-center justify-center gap-2">
          <BookOpen className="w-10 h-10 text-brand-green" />
          Book your session
        </h2>
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
    </>
  );
}


