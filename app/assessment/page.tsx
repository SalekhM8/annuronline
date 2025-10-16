import SubmissionForm from "@/components/forms/SubmissionForm";

export default function AssessmentPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Free Assessment</h1>
      <p className="mt-2 text-neutral-700">Tell us a few details and we’ll schedule your free assessment.</p>
      <div className="mt-6">
        <SubmissionForm type="ASSESSMENT" />
      </div>
    </div>
  );
}


