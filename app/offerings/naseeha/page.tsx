import SubmissionForm from "@/components/forms/SubmissionForm";

export default function NaseehaPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Naseeha Classes and Courses</h1>
      <p className="mt-4 max-w-3xl text-neutral-700">Guidance rooted in Quran and Sunnah for personal growth.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="prose max-w-none">
          <p>Uplifting, practical sessions tailored to youth and adults.</p>
        </div>
        <div>
          <SubmissionForm type="ENROLLMENT" />
        </div>
      </div>
    </div>
  );
}


