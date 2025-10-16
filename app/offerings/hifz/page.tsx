import SubmissionForm from "@/components/forms/SubmissionForm";

export default function HifzPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Quran Memorisation (Hifz)</h1>
      <p className="mt-4 max-w-3xl text-neutral-700">
        Personalised memorisation plans with focus on consistency and tajweed.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="prose max-w-none">
          <p>Structured support and regular revision cycles for lasting memorisation.</p>
        </div>
        <div>
          <SubmissionForm type="ENROLLMENT" />
        </div>
      </div>
    </div>
  );
}


