import Link from "next/link";
import SubmissionForm from "@/components/forms/SubmissionForm";
import { Layers, Star, Target, BookOpen, GraduationCap, Rocket } from "lucide-react";

export default function QaidahPage() {
  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/quran.png)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🔤 HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Layers className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
          <Star className="w-12 h-12" fill="currentColor" />
          Qaidah Classes
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
          <Target className="w-8 h-8" />
          Build strong foundations in Arabic reading
        </p>
      </div>

      {/* 📚 ABOUT */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center flex items-center justify-center gap-3 relative z-10">
          <Target className="w-12 h-12 text-white" />
          Perfect for Beginners
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          Learn to <span className="font-bold text-[--brand-gold-light]">recognise letters</span>, <span className="font-bold text-[--brand-gold-light]">sounds</span>, and <span className="font-bold text-[--brand-gold-light]">rules</span> to prepare for fluent Quran reading
        </p>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark flex items-center justify-center gap-3 relative z-10">
          <Rocket className="w-12 h-12 text-brand-green" />
          Ready to Start?
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
          Or enrol right now
        </h2>
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
    </>
  );
}


