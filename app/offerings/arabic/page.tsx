import Link from "next/link";

export default function ArabicPage() {
  const courses = [
    { title: "Beginner Arabic", emoji: "🔤", level: "Beginner", description: "Start from the alphabet!" },
    { title: "Intermediate Arabic", emoji: "📖", level: "Intermediate", description: "Build your skills!" },
    { title: "Advanced Arabic", emoji: "🏆", level: "Advanced", description: "Master the language!" },
    { title: "Conversational Arabic", emoji: "💬", level: "All Levels", description: "Speak fluently!" },
    { title: "Arabic for Islamic Studies", emoji: "📚", level: "Special", description: "For religious texts!" },
  ];

  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* ✍️ HERO */}
      <div className="text-center space-y-6">
        <div className="text-7xl">✍️</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Learn Arabic! 🌟
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Master the Language of the Quran! 📖✨
        </p>
      </div>

      {/* 📖 QURANIC VERSE */}
      <div className="fun-box-white space-y-6">
        <div className="text-center space-y-4">
          <div className="arabic-text text-3xl md:text-5xl">
            إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ
          </div>
          <p className="text-xl md:text-2xl italic text-[--brand-green-dark] font-semibold">
            "Indeed, We have sent it down as an Arabic Qur'an<br />that you might understand."
          </p>
          <p className="text-lg text-[--brand-gold-dark] font-bold">
            (Surah Yusuf, 12:2)
          </p>
        </div>
      </div>

      {/* 🎯 WHY LEARN ARABIC */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center">
          🎯 Why Learn Arabic?
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Connect <span className="font-bold text-[--brand-gold-light]">DEEPER</span> with the <span className="font-bold text-[--brand-gold-light]">Quran & Sunnah</span> by reading texts in their original language! 📖
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Get a <span className="font-bold text-[--brand-gold-light]">richer understanding</span> of Islamic knowledge! 💡✨
        </p>
      </div>

      {/* 🌟 WHAT YOU'LL LEARN */}
      <div className="fun-box-gold space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark] text-center">
          🌟 Build a Strong Foundation!
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="text-6xl">🔤</div>
            <h3 className="text-xl font-bold text-[--brand-green]">Alphabet</h3>
            <p className="text-sm text-[--brand-green-dark]">Master the letters!</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">📖</div>
            <h3 className="text-xl font-bold text-[--brand-green]">Reading</h3>
            <p className="text-sm text-[--brand-green-dark]">Read Arabic texts!</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">✍️</div>
            <h3 className="text-xl font-bold text-[--brand-green]">Writing</h3>
            <p className="text-sm text-[--brand-green-dark]">Write beautifully!</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">💬</div>
            <h3 className="text-xl font-bold text-[--brand-green]">Speaking</h3>
            <p className="text-sm text-[--brand-green-dark]">Speak fluently!</p>
          </div>
        </div>
        <p className="text-2xl text-center text-[--brand-green-dark] font-bold pt-4">
          From <span className="text-[--brand-green]">basics</span> to <span className="text-[--brand-green]">advanced grammar!</span> 🚀
        </p>
      </div>

      {/* 🎓 COURSE OPTIONS */}
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          Pick Your Perfect Level! 📊
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => (
            <div 
              key={course.title}
              className="fun-card"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-6xl float">{course.emoji}</div>
                  <div className="px-4 py-2 rounded-full bg-[--brand-green] text-white font-bold text-sm">
                    {course.level}
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-playful text-[--brand-green]">
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

      {/* 💡 BENEFITS */}
      <div className="fun-box-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          What You'll Gain! 💪
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">📖</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">Read Quran</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Understand the <span className="font-bold">original text!</span>
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-6xl">📚</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">Study Hadith</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Read <span className="font-bold">authentic sources!</span>
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-6xl">💬</div>
            <h3 className="text-2xl font-bold text-[--brand-green]">Connect</h3>
            <p className="text-lg text-[--brand-green-dark]">
              Communicate with <span className="font-bold">millions!</span>
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-[--brand-green-dark]">
          Start Learning Arabic Today! 🚀
        </h2>
        <p className="text-xl text-[--brand-green-dark] font-semibold">
          From alphabet to fluency - we'll guide you all the way! ✨
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


