import SubmissionForm from "@/components/forms/SubmissionForm";

export default function EnrollPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Enroll</h1>
      <p className="mt-2 text-neutral-700">Fill in your details and course preferences.</p>
      <div className="mt-6">
        <SubmissionForm type="ENROLLMENT" />
      </div>
    </div>
  );
}


