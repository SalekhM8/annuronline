import SubmissionForm from "@/components/forms/SubmissionForm";

export default function EnrollPage() {
  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8">
      {/* 🎓 HERO */}
      <div className="text-center space-y-4">
        <div className="text-7xl">🎓</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Enroll Now! 🚀
        </h1>
        <p className="text-xl md:text-2xl text-[--brand-green-dark] font-semibold">
          Join Our Global Learning Family! 🌍✨
        </p>
      </div>

      {/* 🎉 INFO BOX */}
      <div className="fun-box-gold text-center space-y-4">
        <h2 className="text-3xl font-bold text-playful text-[--brand-green-dark]">
          🌟 Ready to Begin?
        </h2>
        <p className="text-xl leading-relaxed text-[--brand-green-dark]">
          Fill in your details and we'll get you started on your <span className="font-bold text-[--brand-green]">Islamic learning journey!</span> 🎯
        </p>
      </div>

      {/* 📝 FORM */}
      <div className="mt-8">
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
  );
}


