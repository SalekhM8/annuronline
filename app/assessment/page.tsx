import SubmissionForm from "@/components/forms/SubmissionForm";

export default function AssessmentPage() {
  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8">
      {/* 📋 HERO */}
      <div className="text-center space-y-4">
        <div className="text-7xl">📋</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          FREE Assessment! 🎉
        </h1>
        <p className="text-xl md:text-2xl text-[--brand-green-dark] font-semibold">
          Let&apos;s find the perfect course for YOU! ✨
        </p>
      </div>

      {/* 🎯 INFO BOX */}
      <div className="fun-box-green text-white text-center space-y-4">
        <h2 className="text-3xl font-bold text-playful">
          🌟 What&apos;s an Assessment?
        </h2>
        <p className="text-xl leading-relaxed">
          A <span className="font-bold text-[--brand-gold-light]">FREE consultation</span> to understand your goals and find the <span className="font-bold text-[--brand-gold-light]">best course</span> for you!
        </p>
      </div>

      {/* 📝 FORM */}
      <div className="mt-8">
        <SubmissionForm type="ASSESSMENT" />
      </div>
    </div>
  );
}


