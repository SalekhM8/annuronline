import Link from "next/link";

export default function TajweedPage() {
  const courses = [
    { title: "Introduction to Tajweed", emoji: "🌟", level: "Beginner", description: "Start your Tajweed journey!" },
    { title: "Intermediate Tajweed", emoji: "📈", level: "Intermediate", description: "Level up your skills!" },
    { title: "Advanced Tajweed", emoji: "🏆", level: "Advanced", description: "Master the art!" },
    { title: "Tajweed for Hifz Students", emoji: "🧠", level: "Special", description: "Perfect for memorizers!" },
  ];

  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🎵 HERO */}
      <div className="text-center space-y-6">
        <div className="text-7xl">🎵</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Tajweed Classes! ✨
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Recite the Quran Beautifully! 🌟
        </p>
      </div>

      {/* 📖 QURANIC VERSE */}
      <div className="fun-box-white space-y-6">
        <div className="text-center space-y-4">
          <div className="arabic-text text-3xl md:text-5xl">
            وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
          </div>
          <p className="text-xl md:text-2xl italic text-[--brand-green-dark] font-semibold">
            &ldquo;And recite the Qur&apos;an with measured recitation.&rdquo;
          </p>
          <p className="text-lg text-[--brand-gold-dark] font-bold">
            (Surah Al-Muzzammil, 73:4)
          </p>
        </div>
      </div>

      {/* 🎯 WHY TAJWEED */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center">
          🎯 Why Tajweed Matters!
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Learn <span className="font-bold text-[--brand-gold-light]">PRECISE recitation</span> with proper pronunciation! 🎵
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          <div className="text-center space-y-3">
            <div className="text-6xl">👄</div>
            <p className="text-xl font-bold">Makhārij</p>
            <p className="text-sm">Letter articulation points</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">✨</div>
            <p className="text-xl font-bold">Ṣifāt</p>
            <p className="text-sm">Letter characteristics</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">➖</div>
            <p className="text-xl font-bold">Madd</p>
            <p className="text-sm">Elongation rules</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">⏸️</div>
            <p className="text-xl font-bold">Waqf</p>
            <p className="text-sm">Stopping rules</p>
          </div>
        </div>
      </div>

      {/* 🎓 COURSE LEVELS */}
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          Choose Your Level! 📊
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => (
            <div 
              key={course.title}
              className={idx % 2 === 0 ? "fun-box-gold text-[--brand-green-dark]" : "fun-box-green text-white"}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-6xl float">{course.emoji}</div>
                  <div className={`px-4 py-2 rounded-full font-bold text-sm ${idx % 2 === 0 ? 'bg-[--brand-green] text-white' : 'bg-[--brand-gold] text-[--brand-green-dark]'}`}>
                    {course.level}
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-playful">
                  {course.title}
                </h3>
                <p className="text-lg font-semibold">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ CURRICULUM HIGHLIGHT */}
      <div className="fun-box-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          What You&apos;ll Learn! 📚
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">Fundamentals</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Build a <span className="font-bold">strong foundation</span> from day one!
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-6xl">📈</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">Practice</h3>
            <p className="text-lg text-[--brand-green-dark]">
              <span className="font-bold">Regular practice</span> with expert feedback!
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-6xl">🏆</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">Mastery</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Progress to <span className="font-bold">complete mastery!</span>
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark]">
          Start Your Tajweed Journey! 🚀
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
          🌍 Expert Teachers • Flexible Times • All Levels Welcome! ✨
        </p>
      </div>
    </div>
  );
}


