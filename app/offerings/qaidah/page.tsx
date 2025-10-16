import SubmissionForm from "@/components/forms/SubmissionForm";

export default function QaidahPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Qaidah</h1>
      <p className="mt-4 max-w-3xl text-neutral-700">Strong foundations in Arabic reading for beginners.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="prose max-w-none">
          <p>Recognise letters, sounds and rules to prepare for fluent Quran reading.</p>
        </div>
        <div>
          <SubmissionForm type="ENROLLMENT" />
        </div>
      </div>
    </div>
  );
}


