import OfferLayout from "@/components/offerings/OfferLayout";
import InfoCard from "@/components/offerings/InfoCard";
import CourseCards from "@/components/offerings/CourseCards";

export default function TajweedPage() {
  return (
    <OfferLayout
      title="Tajweed"
      imageUrl="/images/tajweed.png"
      quote={(
        <blockquote className="mt-4 border-l-4 border-[--brand-gold] pl-4 text-neutral-700">
          Warattilil‑qur’āna tartīlā — “And recite the Qur’an with measured recitation.” (Surah Al‑Muzzammil 73:4)
        </blockquote>
      )}
    >
      <InfoCard title="Curriculum">
        Learn precise recitation: makhārij, ṣifāt, madd, waqf; from fundamentals to mastery.
      </InfoCard>
      <InfoCard title="Course Options">
        <CourseCards courses={[
          { title: "Introduction to Tajweed" },
          { title: "Intermediate Tajweed" },
          { title: "Advanced Tajweed" },
          { title: "Tajweed for Hifz Students" },
        ]} />
      </InfoCard>
    </OfferLayout>
  );
}


