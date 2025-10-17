import Link from "next/link";
import { BookMarked, BookOpen, Mic2, PenTool, GraduationCap, Users, Globe, Rocket, Star, Target, Award } from "lucide-react";

export default function Home() {
  const courses = [
    { title: "Islamic Studies", href: "/offerings/islamic-studies", Icon: BookMarked, color: "green", imageUrl: "/images/islamicstudies.png" },
    { title: "Quran", href: "/offerings/quran", Icon: BookOpen, color: "gold", imageUrl: "/images/quran.png" },
    { title: "Tajweed", href: "/offerings/tajweed", Icon: Mic2, color: "green", imageUrl: "/images/tajweed.png" },
    { title: "Learn Arabic", href: "/offerings/arabic", Icon: PenTool, color: "gold", imageUrl: "/images/learnarabic.png" },
  ];

  return (
    <div className="pb-24 space-y-16">
      {/* 🎉 HERO SECTION */}
      <section className="fun-box-white space-y-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[--brand-green] px-5 py-2 text-sm font-bold border-2 border-[--brand-gold]/40 shadow-lg text-[--brand-gold-light]">
              <Globe className="w-5 h-5" />
              <span>UK-based • Worldwide Access!</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playful leading-tight">
              <span className="gradient-text">Learn Quran, Arabic & Islam</span> with <span className="text-[--brand-green]">Experienced Teachers</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold gradient-text flex items-center justify-center gap-3 flex-wrap">
              <Star className="w-7 h-7 inline" fill="currentColor" />
              Personalised lessons for <span className="font-bold">all ages</span> and <span className="font-bold">all levels</span>
              <Rocket className="w-7 h-7 inline" />
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/assessment" className="btn-fun text-lg px-8 py-4 flex items-center gap-2">
                <Star className="w-5 h-5" fill="currentColor" />
                Free Assessment
              </Link>
              <Link href="/enroll" className="btn-fun-gold text-lg px-8 py-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Enrol Now
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden border-2 border-[--brand-green]/30 shadow-2xl">
              <img 
                src="/images/mainheroannur.png" 
                alt="Islamic Learning" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[--brand-green]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-white text-2xl font-bold text-playful drop-shadow-lg flex items-center justify-center gap-2">
                  <Star className="w-6 h-6" fill="currentColor" />
                  Join Our Global Family!
                  <Star className="w-6 h-6" fill="currentColor" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 WHY CHOOSE US - Fun Facts */}
      <section className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text flex items-center justify-center gap-3">
          <Star className="w-12 h-12" fill="currentColor" />
          Why Choose An-Nur Academy?
          <Star className="w-12 h-12" fill="currentColor" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <GraduationCap className="w-20 h-20 text-[--brand-green]" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
              Qualified Teachers
            </h3>
            <p className="text-lg text-[--brand-green-dark]">
              Learn from experienced <span className="font-bold">Scholars & Huffaaz</span> who speak English!
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <Target className="w-20 h-20 text-[--brand-gold]" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
              Flexible Learning
            </h3>
            <p className="text-lg text-[--brand-green-dark]">
              Choose <span className="font-bold">group</span> or <span className="font-bold">1-to-1</span> classes that fit your schedule
            </p>
          </div>
          <div className="fun-card text-center space-y-4">
            <div className="float flex justify-center">
              <Globe className="w-20 h-20 text-[--brand-green]" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
              Worldwide Access
            </h3>
            <p className="text-lg text-[--brand-green-dark]">
              Study from <span className="font-bold">anywhere</span> in the world!
            </p>
          </div>
        </div>
      </section>

      {/* 📚 OUR MAIN COURSES */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
            <GraduationCap className="w-12 h-12" />
            Our Courses
          </h2>
          <p className="text-xl text-[--brand-green-dark] font-semibold flex items-center justify-center gap-2">
            <Star className="w-6 h-6" fill="currentColor" />
            Choose what you&apos;d like to learn
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
                <div className="h-48 rounded-2xl overflow-hidden border-2 border-white/60 shadow-xl">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="space-y-3 text-center relative z-10">
                  <div className="flex justify-center">
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
            <Target className="w-6 h-6" />
            View All Courses
          </Link>
        </div>
      </section>

      {/* 🎉 SPECIAL FEATURES */}
      <section className="fun-box-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center gradient-text flex items-center justify-center gap-3">
          <Award className="w-12 h-12" fill="currentColor" />
          What Makes Us Special?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Users className="w-16 h-16 text-[--brand-green]" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-[--brand-green]">All Ages Welcome</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Star className="w-16 h-16 text-[--brand-gold]" fill="currentColor" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-[--brand-green]">Free Assessment</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Users className="w-16 h-16 text-[--brand-green]" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-[--brand-green]">Segregated Classes</p>
          </div>
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Globe className="w-16 h-16 text-[--brand-gold]" strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-[--brand-green]">100% Online</p>
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      <section className="fun-box-gold text-center space-y-8 py-12">
        <div className="space-y-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-playful text-[--brand-green-dark] flex items-center justify-center gap-3">
            <Rocket className="w-12 h-12 md:w-16 md:h-16" />
            Ready to Begin?
          </h2>
          <p className="text-2xl md:text-3xl font-semibold text-[--brand-green-dark] flex items-center justify-center gap-3 flex-wrap">
            <Star className="w-8 h-8" fill="currentColor" />
            Start your Islamic learning journey today
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <Link href="/assessment" className="btn-fun text-xl px-12 py-6 flex items-center gap-3">
            <Star className="w-6 h-6" fill="currentColor" />
            Book Free Assessment
          </Link>
          <Link href="/enroll" className="btn-fun-gold text-xl px-12 py-6 flex items-center gap-3">
            <GraduationCap className="w-6 h-6" />
            Enrol Now
          </Link>
        </div>
        <p className="text-lg text-[--brand-green-dark] font-semibold pt-4 flex items-center justify-center gap-2 flex-wrap relative z-10">
          <Globe className="w-6 h-6" />
          Join students from around the world
          <Star className="w-6 h-6" fill="currentColor" />
        </p>
      </section>
    </div>
  );
}
