import Link from "next/link";
import { BookOpen, Star, Target, GraduationCap, Brain, Lightbulb, Rocket, Globe, Mic2, CircleDot, Minus, Pause } from "lucide-react";

export default function QuranPage() {
  const courses = [
    { title: "Qaidah for Beginners", Icon: Target, description: "Start from the basics!" },
    { title: "Basic Quran Reading", Icon: BookOpen, description: "Read with confidence!" },
    { title: "Advanced Recitation", Icon: Star, description: "Perfect your recitation!" },
    { title: "Quran Memorization (Hifz)", Icon: Brain, description: "Memorize beautifully!" },
    { title: "Tafsir Classes", Icon: Lightbulb, description: "Understand deeply!" },
  ];

  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/quran.png)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 📖 HERO TITLE */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <BookOpen className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
          <Star className="w-12 h-12" fill="currentColor" />
          Quran Classes Online
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
          <Target className="w-8 h-8" />
          Learn to read, recite and understand the Quran
        </p>
      </div>

      {/* 🎨 QURANIC VERSE */}
      <div className="fun-box-white space-y-6">
        <div className="text-center space-y-4">
          <div className="arabic-text text-3xl md:text-5xl">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </div>
          <p className="text-xl md:text-2xl italic text-brand-green-dark font-semibold">
            &ldquo;Read in the name of your Lord who created.&rdquo;
          </p>
          <p className="text-lg text-[--brand-gold-dark] font-bold">
            (Surah Al-&lsquo;Alaq, 96:1)
          </p>
        </div>
      </div>

      {/* 🎯 ABOUT THE CLASSES */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center flex items-center justify-center gap-3 relative z-10">
          <BookOpen className="w-12 h-12 text-white" />
          About Our Classes
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          Our <span className="font-bold text-[--brand-gold-light]">Quran classes</span> are suitable for <span className="font-bold text-[--brand-gold-light]">all levels</span>
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          With a strong emphasis on <span className="font-bold text-[--brand-gold-light]">Tajweed</span> for beautiful and correct recitation
        </p>
      </div>

      {/* 🎓 COURSE OPTIONS */}
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text flex items-center justify-center gap-3">
          <Target className="w-12 h-12 text-brand-green" />
          Choose Your Course
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div 
              key={course.title}
              className="fun-card"
            >
              <div className="text-center space-y-4">
                <div className="float flex justify-center">
                  <course.Icon className="w-16 h-16 text-brand-green" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-playful text-brand-green">
                  {course.title}
                </h3>
                <p className="text-lg text-brand-green-dark font-semibold">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ WHY TAJWEED? */}
      <div className="fun-box-gold space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark text-center flex items-center justify-center gap-3 relative z-10">
          <Mic2 className="w-12 h-12" />
          Why Learn Tajweed?
        </h2>
        <p className="text-xl md:text-2xl text-brand-green-dark leading-relaxed text-center relative z-10">
          <span className="font-bold">Tajweed</span> deepens your <span className="font-bold text-brand-green">spiritual connection</span> with the Quran
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 relative z-10">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Mic2 className="w-12 h-12 text-brand-green" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-brand-green">Makhārij</p>
            <p className="text-sm text-brand-green-dark">Articulation points</p>
          </div>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <CircleDot className="w-12 h-12 text-brand-green" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-brand-green">Ṣifāt</p>
            <p className="text-sm text-brand-green-dark">Characteristics</p>
          </div>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Minus className="w-12 h-12 text-brand-green" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-brand-green">Madd</p>
            <p className="text-sm text-brand-green-dark">Elongation</p>
          </div>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Pause className="w-12 h-12 text-brand-green" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-brand-green">Waqf</p>
            <p className="text-sm text-brand-green-dark">Stopping rules</p>
          </div>
        </div>
        <p className="text-xl text-center text-brand-green-dark font-bold pt-4 relative z-10">
          From <span className="text-brand-green">beginner</span> to <span className="text-brand-green">mastery</span>
        </p>
      </div>

      {/* 🎓 CTA */}
      <div className="fun-box-white text-center space-y-8 py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-playful gradient-text flex items-center justify-center gap-3 relative z-10">
          <Rocket className="w-12 h-12 text-brand-green" />
          Ready to Start?
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
          Group & 1-to-1 classes • Segregated • Worldwide
          <Star className="w-5 h-5 text-brand-gold" fill="currentColor" />
        </p>
      </div>
    </div>
    </>
  );
}


