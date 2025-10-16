import SubmissionForm from "@/components/forms/SubmissionForm";

export default function CounsellingPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Faith‑based Counselling</h1>
      <p className="mt-4 max-w-3xl text-neutral-700">
        Families, couples, adults and youth. Compassionate, confidential support.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="prose max-w-none">
          <p>Book an initial consultation and we will match you with an experienced counsellor.</p>
        </div>
        <div>
          <SubmissionForm type="ENROLLMENT" />
        </div>
      </div>
    </div>
  );
}


