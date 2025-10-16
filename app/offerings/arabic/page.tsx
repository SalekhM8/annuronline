import OfferLayout from "@/components/offerings/OfferLayout";
import InfoCard from "@/components/offerings/InfoCard";
import CourseCards from "@/components/offerings/CourseCards";

export default function ArabicPage() {
  return (
    <OfferLayout
      title="Learn Arabic"
      imageUrl="/images/learnarabic.png"
      quote={(
        <blockquote className="mt-4 border-l-4 border-[--brand-gold] pl-4 text-neutral-700">
          Innā anzalnāhu qur’ānan ‘arabīyan la`allakum ta’qilūn — “Indeed, We have sent it down as an Arabic Qur’an that you might understand.” (Surah Yusuf 12:2)
        </blockquote>
      )}
    >
      <InfoCard title="Build a Strong Foundation">
        From the Arabic alphabet to advanced grammar and vocabulary, our curriculum helps you achieve fluency in reading, writing, and speaking.
      </InfoCard>
      <InfoCard title="Why Learn Arabic With Us?">
        Connect deeper with Quran and Sunnah by reading texts in the original language for a richer understanding of Islamic knowledge.
      </InfoCard>
      <InfoCard title="Course Options">
        <CourseCards courses={[
          { title: "Beginner Arabic" },
          { title: "Intermediate Arabic" },
          { title: "Advanced Arabic" },
          { title: "Conversational Arabic" },
          { title: "Arabic for Islamic Studies" },
        ]} />
      </InfoCard>
    </OfferLayout>
  );
}


