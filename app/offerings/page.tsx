import Link from "next/link";

const offerings = [
  { title: "Islamic Studies", href: "/offerings/islamic-studies", emoji: "📚", imageUrl: "/images/islamicstudies.png", description: "Diploma program!" },
  { title: "Quran", href: "/offerings/quran", emoji: "📖", imageUrl: "/images/quran.png", description: "Read & recite beautifully!" },
  { title: "Tajweed", href: "/offerings/tajweed", emoji: "🎵", imageUrl: "/images/tajweed.png", description: "Perfect pronunciation!" },
  { title: "Learn Arabic", href: "/offerings/arabic", emoji: "✍️", imageUrl: "/images/learnarabic.png", description: "Master the language!" },
  { title: "Hifz (Memorization)", href: "/offerings/hifz", emoji: "🧠", imageUrl: "/images/hifz.jpg", description: "Memorize the Quran!" },
  { title: "Qaidah", href: "/offerings/qaidah", emoji: "🔤", imageUrl: "/images/qaidah.jpg", description: "Start from basics!" },
  { title: "Naseeha", href: "/offerings/naseeha", emoji: "💚", imageUrl: "/images/naseeha.jpg", description: "Spiritual guidance!" },
  { title: "Counselling", href: "/offerings/counselling", emoji: "🤝", imageUrl: "/images/counselling.jpg", description: "Faith-based support!" },
];

export default function OfferingsPage() {
  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🎓 HERO */}
      <div className="text-center space-y-6">
        <div className="text-7xl">🎓</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          All Our Courses! 🌟
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Pick What YOU Want to Learn! ✨
        </p>
      </div>

      {/* 📚 COURSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerings.map((offering, idx) => (
          <Link 
            key={offering.href}
            href={offering.href}
            className={idx % 3 === 0 ? "fun-box-green text-white" : idx % 3 === 1 ? "fun-box-gold text-[--brand-green-dark]" : "fun-box-white text-[--brand-green-dark]"}
          >
            <div className="space-y-4 text-center">
              <div className="text-7xl float">{offering.emoji}</div>
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
          </Link>
        ))}
      </div>

      {/* 🚀 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark]">
          Ready to Start? 🚀
        </h2>
        <p className="text-xl text-[--brand-green-dark] font-semibold">
          Not sure which course? Get a FREE assessment! 🎯
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5">
            📋 FREE Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5">
            🎓 Enroll NOW
          </Link>
        </div>
      </div>
    </div>
  );
}


