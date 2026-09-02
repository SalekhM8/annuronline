import SubmissionForm from "@/components/forms/SubmissionForm";
import { GraduationCap, Rocket, Earth, Star } from "lucide-react";

export default function EnrollPage() {
  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8">
      {/* 🎓 HERO */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <GraduationCap className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
          <Rocket className="w-12 h-12 text-brand-green" />
          Enrol Now
        </h1>
        <p className="text-xl md:text-2xl text-brand-green-dark font-semibold flex items-center justify-center gap-3 flex-wrap">
          <Earth className="w-7 h-7 text-brand-green" />
          Join our global learning community
          <Star className="w-7 h-7 text-brand-gold" fill="currentColor" />
        </p>
      </div>

      {/* 🎉 INFO BOX */}
      <div className="fun-box-gold text-center space-y-4">
        <h2 className="text-3xl font-bold text-playful text-brand-green-dark flex items-center justify-center gap-3 relative z-10">
          <Star className="w-10 h-10 text-brand-green" fill="currentColor" />
          Ready to Begin?
        </h2>
        <p className="text-xl leading-relaxed text-brand-green-dark relative z-10">
          Fill in your details and we&apos;ll get you started on your <span className="font-bold text-brand-green">Islamic learning journey</span>
        </p>
      </div>

      {/* 📝 FORM */}
      <div className="mt-8">
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
  );
}


