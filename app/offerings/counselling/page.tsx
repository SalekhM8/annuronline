import Link from "next/link";
import SubmissionForm from "@/components/forms/SubmissionForm";
import { Handshake, Star, Target, BookOpen, Rocket, Heart, Users } from "lucide-react";

export default function CounsellingPage() {
  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/tasbeeh.png)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🤝 HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Handshake className="w-20 h-20 text-[--brand-green]" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
          <Heart className="w-12 h-12" fill="currentColor" />
          Faith-Based Counselling
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold flex items-center justify-center gap-2">
          <Star className="w-8 h-8" fill="currentColor" />
          Compassionate, confidential support
        </p>
      </div>

      {/* 💚 ABOUT */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center flex items-center justify-center gap-3 relative z-10">
          <Users className="w-12 h-12" />
          For Everyone
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          Supporting <span className="font-bold text-[--brand-gold-light]">families, couples, adults & youth</span> with compassion
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          <span className="font-bold text-[--brand-gold-light]">100% Confidential</span> • Professional • Caring
        </p>
      </div>

      {/* 🎯 HOW IT WORKS */}
      <div className="fun-box-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text flex items-center justify-center gap-3 relative z-10">
          <Target className="w-12 h-12" />
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <BookOpen className="w-14 h-14 text-[--brand-green]" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-[--brand-green]">1. Book</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Schedule an <span className="font-bold">initial consultation</span>
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Handshake className="w-14 h-14 text-[--brand-gold]" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-[--brand-green]">2. Match</h3>
            <p className="text-lg text-[--brand-green-dark]">
              We match you with an <span className="font-bold">experienced counsellor</span>
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Heart className="w-14 h-14 text-[--brand-green]" fill="currentColor" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-[--brand-green]">3. Grow</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Start your journey to <span className="font-bold">healing & growth</span>
            </p>
          </div>
        </div>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark] flex items-center justify-center gap-3 relative z-10">
          <Rocket className="w-12 h-12" />
          Take the First Step
        </h2>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5 flex items-center gap-3">
            <Star className="w-6 h-6" fill="currentColor" />
            Free Consultation
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5 flex items-center gap-3">
            <Handshake className="w-6 h-6" />
            Book Session
          </Link>
        </div>
      </div>

      {/* 📝 BOOKING FORM */}
      <div className="mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-center gradient-text mb-8 flex items-center justify-center gap-2">
          <BookOpen className="w-10 h-10" />
          Book your session
        </h2>
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
    </>
  );
}


