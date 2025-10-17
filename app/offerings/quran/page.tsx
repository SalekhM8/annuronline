import Link from "next/link";

export default function QuranPage() {
  const courses = [
    { title: "Qaidah for Beginners", emoji: "🔤", description: "Start from the basics!" },
    { title: "Basic Quran Reading", emoji: "📖", description: "Read with confidence!" },
    { title: "Advanced Recitation", emoji: "🎵", description: "Perfect your recitation!" },
    { title: "Quran Memorization (Hifz)", emoji: "🧠", description: "Memorize beautifully!" },
    { title: "Tafsir Classes", emoji: "💡", description: "Understand deeply!" },
  ];

  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 📖 HERO TITLE */}
      <div className="text-center space-y-6">
        <div className="text-7xl">📖</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Quran Classes Online! ✨
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Learn to Read, Recite & Understand the Quran! 🌟
        </p>
      </div>

      {/* 🎨 QURANIC VERSE */}
      <div className="fun-box-white space-y-6">
        <div className="text-center space-y-4">
          <div className="arabic-text text-3xl md:text-5xl">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </div>
          <p className="text-xl md:text-2xl italic text-[--brand-green-dark] font-semibold">
            &ldquo;Read in the name of your Lord who created.&rdquo;
          </p>
          <p className="text-lg text-[--brand-gold-dark] font-bold">
            (Surah Al-&lsquo;Alaq, 96:1)
          </p>
        </div>
      </div>

      {/* 🎯 ABOUT THE CLASSES */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center">
          📚 About Our Classes
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Our <span className="font-bold text-[--brand-gold-light]">Quran classes</span> are perfect for <span className="font-bold text-[--brand-gold-light]">ALL levels!</span> 🎓
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          We put <span className="font-bold text-[--brand-gold-light]">extra focus on Tajweed</span> so you can recite the Quran <span className="font-bold text-[--brand-gold-light]">beautifully and correctly!</span> 🎵✨
        </p>
      </div>

      {/* 🎓 COURSE OPTIONS */}
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          Pick Your Perfect Course! 🎯
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => (
            <div 
              key={course.title}
              className={idx % 2 === 0 ? "fun-card" : "fun-card"}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl float">{course.emoji}</div>
                <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
                  {course.title}
                </h3>
                <p className="text-lg text-[--brand-green-dark] font-semibold">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ WHY TAJWEED? */}
      <div className="fun-box-gold space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark] text-center">
          🎵 Why Learn Tajweed With Us?
        </h2>
        <p className="text-xl md:text-2xl text-[--brand-green-dark] leading-relaxed text-center">
          <span className="font-bold">Tajweed</span> deepens your <span className="font-bold text-[--brand-green]">spiritual connection</span> with the Quran! 💚
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="text-center space-y-2">
            <div className="text-5xl">👄</div>
            <p className="text-lg font-bold text-[--brand-green]">Makhārij</p>
            <p className="text-sm text-[--brand-green-dark]">(Letter Points)</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-5xl">✨</div>
            <p className="text-lg font-bold text-[--brand-green]">Ṣifāt</p>
            <p className="text-sm text-[--brand-green-dark]">(Characteristics)</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-5xl">➖</div>
            <p className="text-lg font-bold text-[--brand-green]">Madd</p>
            <p className="text-sm text-[--brand-green-dark]">(Elongation)</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-5xl">⏸️</div>
            <p className="text-lg font-bold text-[--brand-green]">Waqf</p>
            <p className="text-sm text-[--brand-green-dark]">(Stopping Rules)</p>
          </div>
        </div>
        <p className="text-xl text-center text-[--brand-green-dark] font-bold pt-4">
          From <span className="text-[--brand-green]">beginner</span> to <span className="text-[--brand-green]">master!</span> 🚀
        </p>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-white text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful gradient-text">
          Ready to Start? 🚀
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5">
            📋 FREE Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5">
            🎓 Enroll NOW
          </Link>
        </div>
        <p className="text-lg text-[--brand-green-dark] font-semibold">
          🌍 Group & 1:1 Classes • Segregated • Worldwide! ✨
        </p>
      </div>
    </div>
  );
}


