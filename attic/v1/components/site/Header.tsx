"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { BookOpen, GraduationCap, ShoppingBag, Star, Handshake } from "lucide-react";

const nav = [
  { href: "/about", label: "About Us", Icon: BookOpen },
  { href: "/offerings", label: "Offerings", Icon: GraduationCap },
  { href: "/shop", label: "Shop", Icon: ShoppingBag },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 🌟 LARGE LOGO HERO - Only on homepage, always visible */}
      {pathname === "/" && (
        <div className="flex justify-center pt-8 pb-4">
          <div className="text-center">
            <img 
              src="/images/annurlogo-removebg-preview.png" 
              alt="An‑Nur Academy" 
              className="mx-auto h-48 w-48 md:h-56 md:w-56 rounded-3xl shadow-2xl" 
            />
            <h1 className="mt-4 text-2xl md:text-5xl font-bold text-playful gradient-text">
              An-Nur Academy
            </h1>
            <p className="mt-2 text-lg md:text-xl text-brand-green-dark font-semibold flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-brand-gold" fill="currentColor" />
              Learn Quran, Arabic & Islam Online
              <Star className="w-5 h-5 text-brand-gold" fill="currentColor" />
            </p>
          </div>
        </div>
      )}

      {/* 🎨 STICKY NAVBAR - GLASS MORPHISM */}
      <header className={clsx(
        "sticky top-0 z-50 transition-all duration-700 ease-out",
        scrolled 
          ? "shadow-2xl border-b border-[--brand-gold]/30" 
          : "border-b border-transparent"
      )}
        style={{
          background: scrolled 
            ? 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4))',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div className="container-px mx-auto">
          <div className={clsx(
            "flex items-center justify-between transition-all duration-500",
            scrolled ? "py-2" : "py-4"
          )}>
            {/* Logo - Small when scrolled */}
            <Link href="/" className="flex items-center gap-3 scale-bounce">
              <img 
                src="/images/annurlogo-removebg-preview.png" 
                alt="An‑Nur Academy" 
                className={clsx(
                  "rounded-xl shadow-lg transition-all duration-500",
                  scrolled ? "h-12 w-12" : "h-16 w-16"
                )} 
              />
              <span className={clsx(
                "font-bold text-playful gradient-text transition-all duration-500",
                scrolled ? "text-xl" : "text-2xl"
              )}>
                An‑Nur Academy
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {nav.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={clsx(
                    "text-lg font-bold text-playful transition-all duration-300 hover:scale-110 flex items-center gap-2",
                    pathname === item.href ? "text-brand-green" : "text-brand-green-dark hover:text-brand-gold"
                  )}
                >
                  <item.Icon className="w-5 h-5" strokeWidth={2.5} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* CTA Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/enroll" className="btn-fun-gold text-xs px-4 py-2 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-brand-green-dark" />
                Enrol
              </Link>
              <Link href="/assessment" className="btn-fun text-xs px-4 py-2 flex items-center gap-1">
                <Star className="w-3 h-3 text-white" fill="currentColor" />
                Assessment
              </Link>
              <Link href="/counselling-booking" className="btn-fun-white text-xs px-4 py-2 flex items-center gap-1">
                <Handshake className="w-3 h-3 text-brand-green-dark" />
                Counselling
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMenuOpen((v) => !v)} 
              className="md:hidden px-4 py-2 rounded-xl cursor-pointer transition-all hover:scale-105 text-brand-green font-bold text-2xl"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(0, 168, 107, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
              aria-label="Open menu" 
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* 📱 MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMenuOpen(false)}>
            <div 
              className="absolute top-20 right-4 left-4 p-6 max-w-sm mx-auto rounded-3xl shadow-2xl border border-white/40"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-3">
                {nav.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setMenuOpen(false)} 
                    className={clsx(
                      "flex items-center gap-3 rounded-2xl px-5 py-4 text-lg font-bold text-playful transition-all hover:scale-105",
                      pathname === item.href 
                        ? "bg-[--brand-green] text-white" 
                        : "bg-[--fun-bg-1] text-brand-green-dark hover:bg-[--brand-gold]"
                    )}
                  >
                    <item.Icon className="w-6 h-6" strokeWidth={2.5} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-6 space-y-3">
                <Link 
                  href="/enroll" 
                  onClick={() => setMenuOpen(false)} 
                  className="btn-fun-gold w-full text-center flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-brand-green-dark" />
                  Enrol Now
                </Link>
                <Link 
                  href="/assessment" 
                  onClick={() => setMenuOpen(false)} 
                  className="btn-fun w-full text-center flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5 text-white" fill="currentColor" />
                  Free Assessment
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}


