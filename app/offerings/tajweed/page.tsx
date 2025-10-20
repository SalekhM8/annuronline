import Link from "next/link";
import { Mic2, Star, TrendingUp, Trophy, Brain, Target, BookOpen, GraduationCap, Rocket, Globe } from "lucide-react";

export default function TajweedPage() {
  const courses = [
    { title: "Introduction to Tajweed", Icon: Star, level: "Beginner", description: "Start your Tajweed journey" },
    { title: "Intermediate Tajweed", Icon: TrendingUp, level: "Intermediate", description: "Level up your skills" },
    { title: "Advanced Tajweed", Icon: Trophy, level: "Advanced", description: "Master the art" },
    { title: "Tajweed for Hifz Students", Icon: Brain, level: "Special", description: "Perfect for memorisers" },
  ];

  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/tajweed.png)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 🎙️ HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Mic2 className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
          <Star className="w-12 h-12" fill="currentColor" />
          Tajweed Classes
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
          <Target className="w-8 h-8" />
          Recite the Quran beautifully
        </p>
      </div>

      {/* 📖 QURANIC VERSE */}
      <div className="fun-box-white space-y-6">
        <div className="text-center space-y-4">
          <div className="arabic-text text-3xl md:text-5xl">
            وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
          </div>
          <p className="text-xl md:text-2xl italic text-brand-green-dark font-semibold">
            &ldquo;And recite the Qur&apos;an with measured recitation.&rdquo;
          </p>
          <p className="text-lg text-[--brand-gold-dark] font-bold">
            (Surah Al-Muzzammil, 73:4)
          </p>
        </div>
      </div>

      {/* 🎯 WHY TAJWEED */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center flex items-center justify-center gap-3 relative z-10">
          <Target className="w-12 h-12 text-white" />
          Why Tajweed Matters
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          Learn <span className="font-bold text-[--brand-gold-light]">precise recitation</span> with proper pronunciation
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 relative z-10">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Mic2 className="w-14 h-14" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold">Makhārij</p>
            <p className="text-sm">Articulation points</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Star className="w-14 h-14" fill="currentColor" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold">Ṣifāt</p>
            <p className="text-sm">Characteristics</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <TrendingUp className="w-14 h-14" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold">Madd</p>
            <p className="text-sm">Elongation rules</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <BookOpen className="w-14 h-14" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold">Waqf</p>
            <p className="text-sm">Stopping rules</p>
          </div>
        </div>
      </div>

      {/* 🎓 COURSE LEVELS */}
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text flex items-center justify-center gap-3">
          <Target className="w-12 h-12" />
          Choose Your Level
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => (
            <div 
              key={course.title}
              className={idx % 2 === 0 ? "fun-box-gold text-brand-green-dark" : "fun-box-green text-white"}
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="float flex">
                    <course.Icon className="w-16 h-16" strokeWidth={2.5} />
                  </div>
                  <div className={`px-4 py-2 rounded-full font-bold text-sm ${idx % 2 === 0 ? 'bg-[--brand-green] text-white' : 'bg-[--brand-gold] text-brand-green-dark'}`}>
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
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text flex items-center justify-center gap-3 relative z-10">
          <BookOpen className="w-12 h-12" />
          What You&apos;ll Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Target className="w-14 h-14 text-brand-green" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Fundamentals</h3>
            <p className="text-lg text-brand-green-dark">
              Build a <span className="font-bold">strong foundation</span> from day one
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <TrendingUp className="w-14 h-14 text-brand-gold" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Practice</h3>
            <p className="text-lg text-brand-green-dark">
              <span className="font-bold">Regular practice</span> with expert feedback
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Trophy className="w-14 h-14 text-brand-green" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Mastery</h3>
            <p className="text-lg text-brand-green-dark">
              Progress to <span className="font-bold">complete mastery</span>
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 CTA */}
      <div className="fun-box-gold text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark flex items-center justify-center gap-3 relative z-10">
          <Rocket className="w-12 h-12 text-brand-green" />
          Start Your Tajweed Journey
        </h2>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <Link href="/assessment" className="btn-fun text-xl px-10 py-5 flex items-center gap-3">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
            Free Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-10 py-5 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-brand-green-dark" />
            Enrol Now
          </Link>
        </div>
        <p className="text-lg text-brand-green-dark font-semibold flex items-center justify-center gap-3 flex-wrap relative z-10">
          <Globe className="w-5 h-5 text-brand-green" />
          Expert teachers • Flexible times • All levels welcome
          <Star className="w-5 h-5 text-brand-gold" fill="currentColor" />
        </p>
      </div>
    </div>
    </>
  );
}


