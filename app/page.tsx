"use client";

import Link from "next/link";
import { BookMarked, BookOpen, MessageCircle, PenTool, GraduationCap, Users, Earth, Rocket, Star, Target, Award } from "lucide-react";
import { useState, useEffect } from "react";

function FlagRotation() {
  const flags = [
    { url: "/images/america.png", name: "USA" },
    { url: "/images/unitedkingdom.png", name: "UK" },
    { url: "/images/canada.png", name: "Canada" },
    { url: "/images/southamerica.png", name: "South America" },
  ];
  const [currentFlag, setCurrentFlag] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlag((prev) => (prev + 1) % flags.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [flags.length]);

  return (
    <div className="relative">
      <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/30">
        {/* Flag images with crossfade */}
        {flags.map((flag, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentFlag === idx ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={flag.url}
              alt={flag.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        {/* Text overlay - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-xl md:text-2xl font-bold text-playful drop-shadow-2xl text-center px-6">
            <span className="flex items-center justify-center gap-2 flex-wrap">
              <Star className="w-5 h-5 text-[--brand-gold-light]" fill="currentColor" />
              Join Our Global Family!
              <Star className="w-5 h-5 text-[--brand-gold-light]" fill="currentColor" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const courses = [
    { title: "Islamic Studies", href: "/offerings/islamic-studies", Icon: BookMarked, color: "green", imageUrl: "/images/islamicstudies.tiff" },
    { title: "Quran", href: "/offerings/quran", Icon: BookOpen, color: "gold", imageUrl: "/images/quran.png" },
    { title: "Tajweed", href: "/offerings/tajweed", Icon: MessageCircle, color: "green", imageUrl: "/images/tajweed.jpg" },
    { title: "Learn Arabic", href: "/offerings/arabic", Icon: PenTool, color: "gold", imageUrl: "/images/arabic.jpg" },
  ];

  return (
    <div className="pb-24 space-y-16">
      {/* 🎉 HERO SECTION */}
      <section className="fun-box-white space-y-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex justify-center md:inline-flex items-center gap-2 rounded-full bg-[--brand-green] px-5 py-2 text-sm font-bold border-2 border-[--brand-gold]/40 shadow-lg text-[--brand-gold-light]">
              <Earth className="w-5 h-5" />
              <span>UK-based • Worldwide Access!</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playful leading-tight">
              <span className="gradient-text">Learn Quran, Arabic & Islam</span> with <span className="text-brand-green">Experienced Teachers</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold gradient-text flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <Star className="w-7 h-7 inline text-brand-gold" fill="currentColor" />
              Personalised lessons for <span className="font-bold">all ages</span> and <span className="font-bold">all levels</span>
              <Rocket className="w-7 h-7 inline text-brand-green" />
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
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
          <FlagRotation />
        </div>
      </section>

      {/* 🎯 WHY CHOOSE US - Fun Facts */}
      <section className="space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold text-playful text-center gradient-text flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          <Star className="w-10 h-10 md:w-12 md:h-12 text-brand-gold" fill="currentColor" />
          <span>Why Choose An-Nur Academy?</span>
          <Star className="w-10 h-10 md:w-12 md:h-12 text-brand-gold" fill="currentColor" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <GraduationCap className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-playful text-brand-green">
              Qualified Teachers
            </h3>
            <p className="text-lg text-brand-green-dark text-playful">
              Learn from experienced <span className="font-bold">Scholars & Huffaaz</span> who speak English!
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <Target className="w-20 h-20 text-brand-gold" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-playful text-brand-green">
              Flexible Learning
            </h3>
            <p className="text-lg text-brand-green-dark text-playful">
              Choose <span className="font-bold">group</span> or <span className="font-bold">1-to-1</span> classes that fit your schedule
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <Earth className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-playful text-brand-green">
              Worldwide Access
            </h3>
            <p className="text-lg text-brand-green-dark text-playful">
              Study from <span className="font-bold">anywhere</span> in the world!
            </p>
          </div>
        </div>
      </section>

      {/* 📚 OUR MAIN COURSES */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
            <GraduationCap className="w-12 h-12 text-brand-green" />
            Our Courses
          </h2>
          <p className="text-xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-brand-gold" fill="currentColor" />
            Choose what you&apos;d like to learn
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Link 
              key={course.href} 
              href={course.href}
              className={course.color === "green" ? "fun-box-green text-white" : "fun-box-gold text-brand-green-dark"}
            >
              <div className="space-y-4">
                {/* Image at top */}
                <div className="h-48 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/40">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="space-y-3 text-center relative z-10">
                  {/* Hide icon on mobile, show on desktop */}
                  <div className="hidden md:flex justify-center">
                    <course.Icon className="w-16 h-16" strokeWidth={2.5} />
                  </div>
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
          <Link href="/offerings" className="btn-fun text-xl px-10 py-5 flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-white" />
            View All Courses
          </Link>
        </div>
      </section>

      {/* 🎉 SPECIAL FEATURES */}
      <section className="fun-box-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text flex items-center justify-center gap-3">
          <Award className="w-12 h-12 text-brand-gold" fill="currentColor" />
          What Makes Us Special?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Users className="w-16 h-16 text-brand-green" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-brand-green">All Ages Welcome</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Star className="w-16 h-16 text-brand-gold" fill="currentColor" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-brand-green">Free Assessment</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Users className="w-16 h-16 text-brand-green" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-brand-green">Segregated Classes</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Earth className="w-16 h-16 text-brand-gold" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-brand-green">100% Online</p>
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      <section className="fun-box-gold text-center space-y-8 py-12">
        <div className="space-y-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-playful text-brand-green-dark flex items-center justify-center gap-3">
            <Rocket className="w-12 h-12 md:w-16 md:h-16 text-brand-green" />
            Ready to Begin?
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-brand-green-dark flex items-center justify-center gap-3 flex-wrap">
            <Star className="w-8 h-8 text-brand-gold" fill="currentColor" />
            Start your Islamic learning journey today
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <Link href="/assessment" className="btn-fun text-xl px-12 py-6 flex items-center gap-3">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
            Book Free Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-12 py-6 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-brand-green-dark" />
            Enrol Now
          </Link>
        </div>
        <p className="text-lg text-brand-green-dark font-semibold pt-4 flex items-center justify-center gap-2 flex-wrap relative z-10">
          <Earth className="w-6 h-6 text-brand-green" />
          Join students from around the world
          <Star className="w-6 h-6 text-brand-gold" fill="currentColor" />
        </p>
      </section>
    </div>
  );
}
