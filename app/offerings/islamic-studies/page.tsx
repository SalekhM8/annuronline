import Link from "next/link";
import { BookMarked, BookOpen, Star, Scale, Building2, Target, GraduationCap, Earth, Rocket, Award, Brain, Zap, Heart } from "lucide-react";

export default function IslamicStudiesPage() {
  const subjects = [
    { title: "Qur'anic Studies", Icon: BookOpen, description: "Deep dive into Tafsir" },
    { title: "Hadith", Icon: BookMarked, description: "Learn the Prophet's teachings" },
    { title: "Fiqh", Icon: Scale, description: "Islamic jurisprudence" },
    { title: "Islamic History", Icon: Building2, description: "Our rich heritage" },
    { title: "Aqeedah", Icon: Star, description: "Core beliefs and creed" },
    { title: "Tasqiyah", Icon: Heart, description: "Spiritual purification and growth" },
  ];

  return (
    <>
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/islamicstudies.tiff)' }} />
      <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 📚 HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <BookMarked className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text text-center">
          Islamic Studies Diploma
        </h1>
        <p className="text-2xl md:text-3xl text-brand-green-dark font-semibold text-center">
          Deepen your Islamic knowledge
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/assessment" className="btn-fun text-lg px-8 py-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-white" fill="currentColor" />
            Free Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-lg px-8 py-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-green-dark" />
            Enrol Now
          </Link>
        </div>
      </div>

      {/* 📖 HADITH QUOTE */}
      <div className="fun-box-white space-y-6">
        <div className="text-center space-y-4 relative z-10">
          <div className="flex justify-center">
            <Star className="w-14 h-14 text-brand-green" fill="currentColor" strokeWidth={2.5} />
          </div>
          <div className="arabic-text text-3xl md:text-4xl">
            مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ
          </div>
          <p className="text-lg text-brand-gold-dark font-bold">
            (Sunan Ibn Majah, 223)
          </p>
        </div>
      </div>

      {/* 🎯 ABOUT THE PROGRAM */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center relative z-10">
          About the Programme
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          A <span className="font-bold text-[--brand-gold-light]">comprehensive online programme</span> designed to immerse students in key Islamic disciplines
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          Complete your diploma over <span className="font-bold text-[--brand-gold-light]">two years</span> with expert guidance
        </p>
      </div>

      {/* ⭐ WHY ONLINE DIPLOMA */}
      <div className="fun-box-gold space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark text-center relative z-10">
          Why Choose Our Diploma?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <GraduationCap className="w-16 h-16 text-brand-green" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">
              Expert Scholars
            </h3>
            <p className="text-lg text-brand-green-dark">
              Learn from <span className="font-bold">qualified scholars</span> with years of experience
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <BookOpen className="w-16 h-16 text-brand-gold" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">
              Structured Curriculum
            </h3>
            <p className="text-lg text-brand-green-dark">
              <span className="font-bold">Complete syllabus</span> covering all key areas
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <Earth className="w-16 h-16 text-brand-green" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">
              Study Anywhere
            </h3>
            <p className="text-lg text-brand-green-dark">
              <span className="font-bold">100% online</span> - study from home
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <Target className="w-16 h-16 text-brand-gold" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">
              Flexible Schedule
            </h3>
            <p className="text-lg text-brand-green-dark">
              Classes that <span className="font-bold">fit your life</span>
            </p>
          </div>
        </div>
      </div>

      {/* 📚 AREAS OF STUDY */}
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text">
          What You&apos;ll Study
        </h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {subjects.map((subject, idx) => (
            <div 
              key={subject.title}
              className={`${idx % 2 === 0 ? "fun-box-green text-white" : "fun-box-gold text-brand-green-dark"} w-full md:w-[calc(50%-0.75rem)]`}
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className="float flex">
                  <subject.Icon className="w-16 h-16" strokeWidth={2.5} />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-playful">
                    {subject.title}
                  </h3>
                  <p className="text-lg font-semibold">
                    {subject.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎓 PROGRAM BENEFITS */}
      <div className="fun-box-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text relative z-10">
          What You&apos;ll Gain
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Zap className="w-14 h-14 text-brand-green" fill="currentColor" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Confidence</h3>
            <p className="text-lg text-brand-green-dark">
              Live your faith with <span className="font-bold">confidence</span>
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Brain className="w-14 h-14 text-brand-gold" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Deep Knowledge</h3>
            <p className="text-lg text-brand-green-dark">
              <span className="font-bold">Comprehensive understanding</span> of Islam
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Award className="w-14 h-14 text-brand-green" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Diploma Certificate</h3>
            <p className="text-lg text-brand-green-dark">
              Get your <span className="font-bold">official diploma</span> on completion
            </p>
          </div>
        </div>
      </div>

    </div>
    </>
  );
}


