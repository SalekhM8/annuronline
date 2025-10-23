import { Star, Target, BookOpen, GraduationCap, Zap, Rocket, Earth, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Background Image */}
      <div className="page-bg-image" style={{ backgroundImage: 'url(/images/islamicstudies.tiff)' }} />
      
      <div className="py-10 space-y-10 max-w-6xl mx-auto">
      {/* 🎉 PLAYFUL HERO TITLE */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3 flex-wrap">
          <BookOpen className="w-14 h-14 text-brand-green" />
          About Us
          <Star className="w-12 h-12 text-brand-gold" fill="currentColor" />
        </h1>
        <p className="text-2xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
          <Star className="w-6 h-6 text-brand-gold" fill="currentColor" />
          Who we are and what we do
        </p>
      </div>

      {/* 🎯 OUR MISSION - Big Fun Box */}
      <div className="fun-box-green text-white space-y-6">
        <div className="text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-playful mb-4 flex items-center justify-center gap-3">
            <Target className="w-12 h-12 text-white" />
            Our Mission
          </h2>
        </div>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10 flex items-center justify-center gap-2 flex-wrap">
          <Earth className="w-7 h-7 text-white" />
          At <span className="font-bold text-[--brand-gold-light]">An‑Nur Academy</span>, our mission is to make <span className="font-bold">Islamic education accessible to all</span>, helping students build a <span className="font-bold text-[--brand-gold-light]">strong connection with their faith</span> from anywhere in the world.
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          We focus on nurturing <span className="font-bold text-[--brand-gold-light]">Taqwa</span> (awareness of Allah), instilling core <span className="font-bold">Islamic values</span>, and equipping learners to live their faith confidently in today&apos;s world!
        </p>
      </div>

      {/* 🌟 FOUR KEY PRINCIPLES */}
      <div className="fun-box-gold space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark text-center flex items-center justify-center gap-3 relative z-10">
          <Star className="w-12 h-12 text-brand-green" fill="currentColor" />
          Four Key Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="fun-box-white text-center space-y-3">
            <div className="flex justify-center">
              <Star className="w-14 h-14 text-brand-green" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Tawheed</h3>
            <p className="text-lg text-brand-green-dark">Oneness of Allah</p>
          </div>
          <div className="fun-box-white text-center space-y-3">
            <div className="flex justify-center">
              <Heart className="w-14 h-14 text-brand-green" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Taqwa</h3>
            <p className="text-lg text-brand-green-dark">Awareness & Fear of Allah</p>
          </div>
          <div className="fun-box-white text-center space-y-3">
            <div className="flex justify-center">
              <BookOpen className="w-14 h-14 text-brand-green" />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Ilm</h3>
            <p className="text-lg text-brand-green-dark">Knowledge</p>
          </div>
          <div className="fun-box-white text-center space-y-3">
            <div className="flex justify-center">
              <Zap className="w-14 h-14 text-brand-green" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold text-brand-green">Amal</h3>
            <p className="text-lg text-brand-green-dark">Action</p>
          </div>
        </div>
        <p className="text-2xl text-center text-brand-green-dark font-bold relative z-10 flex items-center justify-center gap-2 flex-wrap">
          <Rocket className="w-8 h-8 text-brand-green" />
          Our programmes aim to be both <span className="text-brand-green">informative</span> and <span className="text-brand-green">transformative</span>
        </p>
      </div>

      {/* 📖 QURANIC VERSE */}
      <div className="fun-box-white space-y-6">
        <div className="text-center space-y-4 relative z-10">
          <div className="flex justify-center">
            <BookOpen className="w-16 h-16 text-brand-green" strokeWidth={2.5} />
          </div>
          <div className="arabic-text text-3xl md:text-4xl">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </div>
          <p className="text-xl md:text-2xl italic text-brand-green-dark font-semibold">
            &ldquo;Read! In the name of your Lord who created.&rdquo;
          </p>
          <p className="text-lg text-[--brand-gold-dark] font-bold">
            (Surah Al-&lsquo;Alaq, 96:1)
          </p>
        </div>
      </div>

      {/* 🎓 SINCE 2020 */}
      <div className="fun-box-green text-white space-y-6">
        <div className="text-center space-y-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-playful flex items-center justify-center gap-3">
            <GraduationCap className="w-12 h-12 text-white" />
            Since 2020
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed">
            We&apos;ve offered <span className="font-bold text-[--brand-gold-light]">flexible, high-quality</span> online courses led by experienced <span className="font-bold text-[--brand-gold-light]">Scholars and Huffaaz</span>
          </p>
          <p className="text-xl md:text-2xl leading-relaxed">
            From foundational <span className="font-bold text-[--brand-gold-light]">Qaidah</span> and <span className="font-bold text-[--brand-gold-light]">Quran</span> lessons to advanced <span className="font-bold text-[--brand-gold-light]">Hifdh</span> and <span className="font-bold text-[--brand-gold-light]">Islamic Studies</span>, our curriculum serves students of <span className="font-bold text-[--brand-gold-light]">all ages and levels</span>
          </p>
        </div>
      </div>

      {/* 🎉 FUN FEATURES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="fun-card text-center space-y-4">
          <div className="float flex justify-center">
            <Target className="w-16 h-16 text-brand-green" strokeWidth={2.5} />
          </div>
            <h3 className="text-2xl font-bold text-playful text-brand-green">
            Personalised Learning
          </h3>
          <p className="text-lg text-brand-green-dark">
            Each student receives individual attention at their own pace
          </p>
        </div>
        <div className="fun-card text-center space-y-4">
          <div className="float flex justify-center">
            <GraduationCap className="w-16 h-16 text-brand-gold" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-playful text-brand-green">
            Qualified Teachers
          </h3>
            <p className="text-lg text-brand-green-dark">
            Experienced Scholars & Huffaaz dedicated to student success
          </p>
        </div>
        <div className="fun-card text-center space-y-4">
          <div className="float flex justify-center">
            <Zap className="w-16 h-16 text-brand-green" fill="currentColor" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-playful text-brand-green">
            Interactive & Fun
          </h3>
            <p className="text-lg text-brand-green-dark">
            Engaging lessons that make learning enjoyable
          </p>
        </div>
      </div>

      {/* 🚀 CALL TO ACTION */}
      <div className="fun-box-gold text-center space-y-6 py-12">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-brand-green-dark flex items-center justify-center gap-3 relative z-10">
          <Rocket className="w-12 h-12 text-brand-green" />
          Ready to Start Your Journey?
        </h2>
        <p className="text-2xl text-brand-green-dark font-semibold flex items-center justify-center gap-3 flex-wrap relative z-10">
          <Earth className="w-8 h-8 text-brand-green" />
          Join thousands of students worldwide
          <Star className="w-8 h-8 text-brand-gold" fill="currentColor" />
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-8 relative z-10">
          <a href="/assessment" className="btn-fun text-xl px-10 py-5 flex items-center gap-3">
            <Star className="w-6 h-6 text-white" fill="currentColor" />
            Free Assessment
          </a>
          <a href="/enroll" className="btn-fun-gold text-xl px-10 py-5 flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-brand-green-dark" />
            Enrol Now
          </a>
        </div>
      </div>
    </div>
    </>
  );
}



