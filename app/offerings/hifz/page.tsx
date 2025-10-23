import Link from "next/link";
import SubmissionForm from "@/components/forms/SubmissionForm";
import { Brain, Star, Target, BookOpen, GraduationCap, Rocket, Repeat } from "lucide-react";

export default function HifzPage() {
  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/hifz.tiff)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🧠 HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Brain className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text text-center">
          Quran Memorisation (Hifz)
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold text-center">
          Become a Hafiz or Hafiza
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

      {/* 💚 ABOUT */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center relative z-10">
          Personalised Memorisation Plans
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          With focus on <span className="font-bold text-[--brand-gold-light]">consistency</span> and <span className="font-bold text-[--brand-gold-light]">perfect Tajweed</span>
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10 flex items-center justify-center gap-2 flex-wrap">
          <Repeat className="w-7 h-7 text-white" />
          <span className="font-bold text-[--brand-gold-light]">Structured support</span> and regular revision cycles for lasting memorisation
        </p>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark text-center relative z-10">
          Start Your Hifz Journey
        </h2>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5 flex items-center gap-3">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
            Free Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-brand-green-dark" />
            Enrol Now
          </Link>
        </div>
      </div>

      {/* 📝 ENROLLMENT FORM */}
      <div className="mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-center gradient-text mb-8 flex items-center justify-center gap-2">
          <BookOpen className="w-10 h-10 text-brand-green" />
          Or enrol for Hifz now
        </h2>
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
    </>
  );
}


