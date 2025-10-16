import OfferLayout from "@/components/offerings/OfferLayout";
import InfoCard from "@/components/offerings/InfoCard";
import CourseCards from "@/components/offerings/CourseCards";

export default function IslamicStudiesPage() {
  return (
    <OfferLayout
      title="Islamic Studies Diploma"
      imageUrl="/images/islamicstudies.png"
      quote={(
        <blockquote className="mt-4 border-l-4 border-[--brand-gold] pl-4 text-neutral-700">
          “And whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him.” (Sunan Ibn Majah, 223)
        </blockquote>
      )}
    >
      <InfoCard title="About the Program">
        Comprehensive online program designed to immerse students in key Islamic disciplines across two years.
      </InfoCard>
      <InfoCard title="Benefits of an Online Diploma">
        <ul className="list-disc pl-5">
          <li>Accessible expertise from qualified scholars</li>
          <li>Structured curriculum across Qur’anic studies, Hadith, Fiqh and history</li>
        </ul>
      </InfoCard>
      <InfoCard title="Areas of Study">
        <CourseCards courses={[
          { title: "Qur’anic Studies" },
          { title: "Hadith" },
          { title: "Fiqh" },
          { title: "Islamic History" },
        ]} />
      </InfoCard>
    </OfferLayout>
  );
}


