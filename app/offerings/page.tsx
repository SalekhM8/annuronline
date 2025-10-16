import CardLink from "@/components/ui/CardLink";

const offerings = [
  { title: "Islamic Studies", href: "/offerings/islamic-studies", imageUrl: "/images/islamicstudies.png" },
  { title: "Quran", href: "/offerings/quran", imageUrl: "/images/quran.png" },
  { title: "Tajweed", href: "/offerings/tajweed", imageUrl: "/images/tajweed.png" },
  { title: "Learn Arabic", href: "/offerings/arabic", imageUrl: "/images/learnarabic.png" },
];

export default function OfferingsPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">Offerings</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {offerings.map((o) => (
          <CardLink key={o.href} title={o.title} href={o.href} description="Learn more" imageUrl={o.imageUrl} />
        ))}
      </div>
    </div>
  );
}


