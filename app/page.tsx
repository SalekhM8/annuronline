import Link from "next/link";

export default function Home() {
  const courses = [
    { title: "Islamic Studies", href: "/offerings/islamic-studies", emoji: "📚", color: "green", imageUrl: "/images/islamicstudies.png" },
    { title: "Quran", href: "/offerings/quran", emoji: "📖", color: "gold", imageUrl: "/images/quran.png" },
    { title: "Tajweed", href: "/offerings/tajweed", emoji: "🎙️", color: "green", imageUrl: "/images/tajweed.png" },
    { title: "Learn Arabic", href: "/offerings/arabic", emoji: "✍️", color: "gold", imageUrl: "/images/learnarabic.png" },
  ];

  return (
    <div className="pb-24 space-y-16">
      {/* 🎉 HERO SECTION */}
      <section className="fun-box-white space-y-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[--brand-green] px-5 py-2 text-sm font-bold border-4 border-[--brand-gold] shadow-lg">
              <span className="text-[--brand-gold-light]">🌍 UK-based • Worldwide Access!</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playful leading-tight">
              <span className="gradient-text">Learn Quran, Arabic & Islam</span> with <span className="text-[--brand-green]">Amazing Teachers!</span> 🎓
            </h1>
            <p className="text-xl md:text-2xl font-semibold">
              <span className="gradient-text">✨ Personalized lessons for <span className="font-black">ALL ages</span> and <span className="font-black">ALL levels!</span> 🚀</span>
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/assessment" className="btn-fun text-lg px-8 py-4">
                ⭐ FREE Assessment
              </Link>
              <Link href="/enroll" className="btn-fun-gold text-lg px-8 py-4">
                🎓 Enroll NOW
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden border-8 border-[--brand-green] shadow-2xl">
              <img 
                src="/images/mainheroannur.png" 
                alt="Islamic Learning" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[--brand-green]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-white text-2xl font-bold text-playful drop-shadow-lg">
                  Join Our Global Family! 🌟
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 WHY CHOOSE US - Fun Facts */}
      <section className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          Why Choose An-Nur? 🤔✨
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fun-card text-center space-y-4">
            <div className="text-7xl float">👨‍🏫</div>
            <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
              Qualified Teachers
            </h3>
            <p className="text-lg text-[--brand-green-dark]">
              Learn from experienced <span className="font-bold">Scholars & Huffaaz</span> who speak English! 🗣️
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="text-7xl float">🎯</div>
            <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
              Flexible Learning
            </h3>
            <p className="text-lg text-[--brand-green-dark]">
              Choose <span className="font-bold">Group</span> or <span className="font-bold">1:1</span> classes that fit YOUR schedule! ⏰
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="text-7xl float">🌍</div>
            <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
              Worldwide Access
            </h3>
            <p className="text-lg text-[--brand-green-dark]">
              Study from <span className="font-bold">anywhere</span> in the world! 🚀
            </p>
          </div>
        </div>
      </section>

      {/* 📚 OUR MAIN COURSES */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-playful gradient-text">
            Our Amazing Courses! 🎓
          </h2>
          <p className="text-xl text-[--brand-green-dark] font-semibold">
            Pick what YOU want to learn! 🌟
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Link 
              key={course.href} 
              href={course.href}
              className={course.color === "green" ? "fun-box-green text-white" : "fun-box-gold text-[--brand-green-dark]"}
            >
              <div className="space-y-4">
                {/* Image at top */}
                <div className="h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="space-y-3 text-center">
                  <div className="text-6xl">{course.emoji}</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-playful">
                    {course.title}
                  </h3>
                  <p className="text-lg font-semibold">
                    Click to learn more! →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center pt-6">
          <Link href="/offerings" className="btn-fun text-xl px-10 py-5">
            🎯 View ALL Courses
          </Link>
        </div>
      </section>

      {/* 🎉 SPECIAL FEATURES */}
      <section className="fun-box-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          What Makes Us Special? ⭐
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="text-6xl">👦👧</div>
            <p className="text-lg font-bold text-[--brand-green]">All Ages Welcome!</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">🆓</div>
            <p className="text-lg font-bold text-[--brand-green]">FREE Assessment</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">👥</div>
            <p className="text-lg font-bold text-[--brand-green]">Segregated Classes</p>
          </div>
          <div className="text-center space-y-3">
            <div className="text-6xl">💯</div>
            <p className="text-lg font-bold text-[--brand-green]">100% Online</p>
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      <section className="fun-box-gold text-center space-y-8 py-12">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-playful text-[--brand-green-dark]">
            Ready to Begin? 🚀
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-[--brand-green-dark]">
            Start your Islamic learning journey TODAY! ✨
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/assessment" className="btn-fun text-xl px-12 py-6">
            📋 Book FREE Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-12 py-6">
            🎓 Enroll NOW!
          </Link>
        </div>
        <p className="text-lg text-[--brand-green-dark] font-semibold pt-4">
          🌍 Join students from all around the world! 🌟
        </p>
      </section>
    </div>
  );
}
