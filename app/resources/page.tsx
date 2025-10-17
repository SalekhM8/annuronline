import { BookOpen, Star, Rocket, FileText, Headphones, FileCheck, Presentation, Mail, MessageCircle, Target } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 📚 HERO */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <BookOpen className="w-20 h-20 text-[--brand-green]" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text flex items-center justify-center gap-3">
          <Star className="w-12 h-12" fill="currentColor" />
          Islamic Resources!
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold flex items-center justify-center gap-2">
          <Star className="w-8 h-8" fill="currentColor" />
          Free Learning Materials & Tools!
        </p>
      </div>

      {/* 🎯 COMING SOON */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center flex items-center justify-center gap-3 relative z-10">
          <Rocket className="w-12 h-12" />
          Coming Soon!
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10 flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7" />
          We&apos;re preparing <span className="font-bold text-[--brand-gold-light]">amazing resources</span> for you!
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center relative z-10">
          Check back soon for <span className="font-bold text-[--brand-gold-light]">FREE downloads</span>, study guides, and learning tools!
        </p>
      </div>

      {/* 📝 PLACEHOLDER SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="fun-card text-center space-y-4">
          <div className="float flex justify-center">
            <FileText className="w-16 h-16 text-[--brand-green]" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
            Study Guides
          </h3>
          <p className="text-lg text-[--brand-green-dark]">
            Downloadable guides for Quran, Arabic & Islamic Studies
          </p>
        </div>
        
        <div className="fun-card text-center space-y-4">
          <div className="float flex justify-center">
            <Headphones className="w-16 h-16 text-[--brand-gold]" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
            Audio Resources
          </h3>
          <p className="text-lg text-[--brand-green-dark]">
            Recitation practice & Tajweed examples
          </p>
        </div>

        <div className="fun-card text-center space-y-4">
          <div className="float flex justify-center">
            <FileCheck className="w-16 h-16 text-[--brand-green]" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
            Worksheets
          </h3>
          <p className="text-lg text-[--brand-green-dark]">
            Practice materials for students of all ages
          </p>
        </div>

        <div className="fun-card text-center space-y-4">
          <div className="float flex justify-center">
            <Presentation className="w-16 h-16 text-[--brand-gold]" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
            Presentations
          </h3>
          <p className="text-lg text-[--brand-green-dark]">
            Educational slides & visual materials
          </p>
        </div>
      </div>

      {/* 💬 CONTACT */}
      <div className="fun-box-gold text-center space-y-6 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-[--brand-green-dark] flex items-center justify-center gap-3 relative z-10">
          <Target className="w-10 h-10" />
          Want Something Specific?
        </h2>
        <p className="text-xl text-[--brand-green-dark] font-semibold relative z-10">
          Let us know what resources would help YOU the most!
        </p>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <a href="mailto:an-nuracademy@outlook.com" className="btn-fun text-xl px-10 py-5 flex items-center gap-3">
            <Mail className="w-6 h-6" />
            Email Us
          </a>
          <a href="https://wa.me/447724343150" target="_blank" rel="noopener noreferrer" className="btn-fun-gold text-xl px-10 py-5 flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}

