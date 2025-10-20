import Link from "next/link";
import { BookMarked, BookOpen, Mic2, PenTool, Brain, Layers, Heart, Handshake, GraduationCap, Star, Target } from "lucide-react";

const offerings = [
  { title: "Islamic Studies", href: "/offerings/islamic-studies", Icon: BookMarked, imageUrl: "/images/islamicstudies.png", description: "Diploma program!" },
  { title: "Quran", href: "/offerings/quran", Icon: BookOpen, imageUrl: "/images/quran.png", description: "Read & recite beautifully!" },
  { title: "Tajweed", href: "/offerings/tajweed", Icon: Mic2, imageUrl: "/images/tajweed.png", description: "Perfect pronunciation!" },
  { title: "Learn Arabic", href: "/offerings/arabic", Icon: PenTool, imageUrl: "/images/learnarabic.png", description: "Master the language!" },
  { title: "Hifz (Memorization)", href: "/offerings/hifz", Icon: Brain, imageUrl: "/images/quran.png", description: "Memorize the Quran!" },
  { title: "Qaidah", href: "/offerings/qaidah", Icon: Layers, imageUrl: "/images/quran.png", description: "Start from basics!" },
  { title: "Naseeha", href: "/offerings/naseeha", Icon: Heart, imageUrl: "/images/islamicstudies.png", description: "Spiritual guidance!" },
  { title: "Counselling", href: "/offerings/counselling", Icon: Handshake, imageUrl: "/images/tasbeeh.png", description: "Faith-based support!" },
];

export default function OfferingsPage() {
  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🎓 HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <GraduationCap className="w-20 h-20 md:w-24 md:h-24 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3 flex-wrap">
          <Star className="w-12 h-12" fill="currentColor" />
          All Our Courses
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
          <Target className="w-8 h-8" />
          Choose what you&apos;d like to learn
        </p>
      </div>

      {/* 📚 COURSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerings.map((offering, idx) => (
          <Link 
            key={offering.href}
            href={offering.href}
            className={idx % 3 === 0 ? "fun-box-green text-white" : idx % 3 === 1 ? "fun-box-gold text-brand-green-dark" : "fun-box-white text-brand-green-dark"}
          >
            <div className="space-y-4">
              {/* Image */}
                <div className="h-40 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/40">
                <img 
                  src={offering.imageUrl} 
                  alt={offering.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Content */}
              <div className="text-center space-y-3 relative z-10">
                <div className="float flex justify-center">
                  <offering.Icon className="w-16 h-16" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-playful">
                  {offering.title}
                </h2>
                <p className="text-lg font-semibold">
                  {offering.description}
                </p>
                <div className="text-sm font-bold uppercase tracking-wide">
                  Click to Learn More →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 🚀 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark flex items-center justify-center gap-3 relative z-10">
          <Star className="w-12 h-12" fill="currentColor" />
          Ready to Start?
        </h2>
        <p className="text-xl text-brand-green-dark font-semibold flex items-center justify-center gap-2 relative z-10">
          <Target className="w-6 h-6" />
          Not sure which course? Get a free assessment
        </p>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5 flex items-center gap-3">
            <Star className="w-6 h-6" fill="currentColor" />
            Free Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5 flex items-center gap-3">
            <GraduationCap className="w-6 h-6" />
            Enrol Now
          </Link>
        </div>
      </div>
    </div>
  );
}


