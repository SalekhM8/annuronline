import Link from "next/link";
import { BookMarked, BookOpen, MessageCircle, PenTool, Brain, Layers, Heart, Handshake, GraduationCap, Star, Target } from "lucide-react";

const offerings = [
  { title: "Islamic Studies", href: "/offerings/islamic-studies", Icon: BookMarked, imageUrl: "/images/islamicstudies.tiff", description: "Diploma programme!" },
  { title: "Quran", href: "/offerings/quran", Icon: BookOpen, imageUrl: "/images/quran.png", description: "Read & recite beautifully!" },
  { title: "Tajweed", href: "/offerings/tajweed", Icon: MessageCircle, imageUrl: "/images/tajweed.jpg", description: "Perfect pronunciation!" },
  { title: "Learn Arabic", href: "/offerings/arabic", Icon: PenTool, imageUrl: "/images/arabic.jpg", description: "Master the language!" },
  { title: "Hifz (Memorisation)", href: "/offerings/hifz", Icon: Brain, imageUrl: "/images/hifz.tiff", description: "Memorise the Quran!" },
  { title: "Qaidah", href: "/offerings/qaidah", Icon: Layers, imageUrl: "/images/ahsanulqawaid.webp", description: "Start from basics!" },
  { title: "Naseeha", href: "/offerings/naseeha", Icon: Heart, imageUrl: "/images/dua.jpg", description: "Spiritual guidance!" },
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
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text text-center">
          All Our Courses
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold text-center">
          Choose what you&apos;d like to learn
        </p>
      </div>

      {/* 📚 COURSE GRID */}
      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
        {offerings.map((offering, idx) => {
          // Pattern: gold, white, green, gold, white, green
          let colorClass = "";
          const pattern = idx % 3;
          if (pattern === 0) colorClass = "fun-box-gold text-brand-green-dark";
          else if (pattern === 1) colorClass = "fun-box-white text-brand-green-dark";
          else colorClass = "fun-box-green text-white";
          
          return (
          <Link 
            key={offering.href}
            href={offering.href}
            className={`${colorClass} w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]`}
          >
            <div className="space-y-4">
              {/* Image */}
                <div className="h-40 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/40">
                <img 
                  src={offering.imageUrl} 
                  alt={offering.title}
                  className={`w-full h-full object-cover`}
                  style={{}}
                />
              </div>
              {/* Content */}
              <div className="text-center space-y-3 relative z-10">
                {/* Hide icon on mobile, show on desktop */}
                <div className="hidden md:flex float justify-center">
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
          );
        })}
      </div>

      {/* 🚀 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark text-center relative z-10">
          Ready to Start?
        </h2>
        <p className="text-xl text-brand-green-dark font-semibold text-center relative z-10">
          Not sure which course? Book a free assessment
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


