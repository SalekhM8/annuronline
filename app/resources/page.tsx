export default function ResourcesPage() {
  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto">
      {/* 📚 HERO */}
      <div className="text-center space-y-6">
        <div className="text-7xl">📚</div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text">
          Islamic Resources! 🌟
        </h1>
        <p className="text-2xl md:text-3xl text-[--brand-green-dark] font-semibold">
          Free Learning Materials & Tools! ✨
        </p>
      </div>

      {/* 🎯 COMING SOON */}
      <div className="fun-box-green text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-playful text-center">
          🚀 Coming Soon!
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          We're preparing <span className="font-bold text-[--brand-gold-light]">amazing resources</span> for you! 📖
        </p>
        <p className="text-xl md:text-2xl leading-relaxed text-center">
          Check back soon for <span className="font-bold text-[--brand-gold-light]">FREE downloads</span>, study guides, and learning tools! 🎓
        </p>
      </div>

      {/* 📝 PLACEHOLDER SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="fun-card text-center space-y-4">
          <div className="text-6xl float">📖</div>
          <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
            Study Guides
          </h3>
          <p className="text-lg text-[--brand-green-dark]">
            Downloadable guides for Quran, Arabic & Islamic Studies
          </p>
        </div>
        
        <div className="fun-card text-center space-y-4">
          <div className="text-6xl float">🎵</div>
          <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
            Audio Resources
          </h3>
          <p className="text-lg text-[--brand-green-dark]">
            Recitation practice & Tajweed examples
          </p>
        </div>

        <div className="fun-card text-center space-y-4">
          <div className="text-6xl float">📝</div>
          <h3 className="text-2xl font-bold text-playful text-[--brand-green]">
            Worksheets
          </h3>
          <p className="text-lg text-[--brand-green-dark]">
            Practice materials for students of all ages
          </p>
        </div>

        <div className="fun-card text-center space-y-4">
          <div className="text-6xl float">📊</div>
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
        <h2 className="text-3xl md:text-4xl font-bold text-playful text-[--brand-green-dark]">
          Want Something Specific? 🤔
        </h2>
        <p className="text-xl text-[--brand-green-dark] font-semibold">
          Let us know what resources would help YOU the most!
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="mailto:info@annur.online" className="btn-fun text-xl px-10 py-5">
            📧 Email Us
          </a>
          <a href="https://wa.me/447724343150" target="_blank" rel="noopener noreferrer" className="btn-fun-gold text-xl px-10 py-5">
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}

