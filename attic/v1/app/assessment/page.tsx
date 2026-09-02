import SubmissionForm from "@/components/forms/SubmissionForm";
import { Star, Target, Sparkles } from "lucide-react";

export default function AssessmentPage() {
  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8">
      {/* 📋 HERO */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Star className="w-20 h-20 text-brand-green" fill="currentColor" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
          <Sparkles className="w-12 h-12 text-brand-gold" />
          Free Assessment
        </h1>
        <p className="text-xl md:text-2xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
          <Target className="w-7 h-7 text-brand-green" />
          Let&apos;s find the perfect course for you
        </p>
      </div>

      {/* 🎯 INFO BOX */}
      <div className="fun-box-green text-white text-center space-y-4">
        <h2 className="text-3xl font-bold text-playful flex items-center justify-center gap-3 relative z-10">
          <Star className="w-10 h-10 text-white" fill="currentColor" />
          What&apos;s an Assessment?
        </h2>
        <p className="text-xl leading-relaxed relative z-10">
          A <span className="font-bold text-[--brand-gold-light]">free consultation</span> to understand your goals and find the <span className="font-bold text-[--brand-gold-light]">best course</span> for you
        </p>
      </div>

      {/* 📝 FORM */}
      <div className="mt-8">
        <SubmissionForm type="ASSESSMENT" />
      </div>
    </div>
  );
}


