import OfferLayout from "@/components/offerings/OfferLayout";
import InfoCard from "@/components/offerings/InfoCard";
import CourseCards from "@/components/offerings/CourseCards";

export default function QuranPage() {
  return (
    <OfferLayout
      title="Quran Classes Online With Tajweed"
      imageUrl="/images/quran.png"
      quote={(
        <blockquote className="mt-4 border-l-4 border-[--brand-gold] pl-4 text-neutral-700">
          Iqra’ bismi rabbika allathee khalaq — “Read in the name of your Lord who created.” (Surah Al‑‘Alaq 96:1)
        </blockquote>
      )}
    >
      <InfoCard title="About the Classes">
        Our Quran classes cater to all levels with a strong emphasis on Tajweed for beautiful, correct recitation.
      </InfoCard>
      <InfoCard title="Course Offerings">
        <CourseCards courses={[
          { title: "Qaidah for Beginners" },
          { title: "Basic Quran Reading" },
          { title: "Advanced Quran Recitation" },
          { title: "Quran Memorization (Hifz)" },
          { title: "Tafsir Classes" },
        ]} />
      </InfoCard>
      <InfoCard title="Why Learn Tajweed With Us?">
        Tajweed deepens your spiritual connection with the Quran. We cover makhārij, ṣifāt, madd and waqf, progressing from fundamentals to mastery.
      </InfoCard>
    </OfferLayout>
  );
}


