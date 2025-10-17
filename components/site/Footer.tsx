import Link from "next/link";
import { BookOpen, GraduationCap, Package, Lock, Star, Instagram, Facebook, Youtube, Music, Building2, Globe, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-white border-t-8 border-[--brand-gold]">
      <div className="container-px mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* BRAND */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/annurlogo.JPG" alt="An-Nur Academy" className="h-16 w-16 rounded-2xl border-2 border-[--brand-gold]/30" />
              <div>
                <div className="text-2xl font-bold text-playful gradient-text">An‑Nur Academy</div>
                <p className="text-sm font-semibold text-[--brand-green-dark] flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" />
                  Islamic Learning Online
                </p>
              </div>
            </div>
            <div className="text-sm text-[--brand-green-dark] font-semibold space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" /> UK‑based • Accessible worldwide
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> an-nuracademy@outlook.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +44 7724 343150
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-playful text-[--brand-green]">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2" href="/about">
                <BookOpen className="w-4 h-4" /> About Us
              </Link>
              <Link className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2" href="/offerings">
                <GraduationCap className="w-4 h-4" /> All Courses
              </Link>
              <Link className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2" href="/resources">
                <BookOpen className="w-4 h-4" /> Resources
              </Link>
              <Link className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2" href="/shop">
                <Package className="w-4 h-4" /> Shop
              </Link>
              <Link className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2" href="/admin">
                <Lock className="w-4 h-4" /> Admin
              </Link>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-playful text-[--brand-green]">Follow Us!</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="https://www.instagram.com/an_nuracademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" /> Instagram
              </a>
              <a 
                href="https://www.tiktok.com/@annuracademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2"
              >
                <Music className="w-5 h-5" /> TikTok
              </a>
              <a 
                href="https://www.youtube.com/@An-NurAcademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2"
              >
                <Youtube className="w-5 h-5" /> YouTube
              </a>
              <a 
                href="https://www.facebook.com/An-NurAcademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2"
              >
                <Facebook className="w-5 h-5" /> Facebook
              </a>
            </div>
          </div>

          {/* USEFUL LINKS */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-playful text-[--brand-green]">Useful Links</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="https://ar-rashad.com/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[--brand-green-dark] hover:text-[--brand-gold] transition-all hover:scale-105 flex items-center gap-2"
              >
                <Building2 className="w-5 h-5" /> Ar-Rashad Academy
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-playful text-[--brand-green]">Start Learning!</h3>
            <div className="space-y-3">
              <Link href="/assessment" className="btn-fun w-full text-center flex items-center justify-center gap-2 py-4">
                <Star className="w-5 h-5" fill="currentColor" />
                Free Assessment
              </Link>
              <Link href="/enroll" className="btn-fun-gold w-full text-center flex items-center justify-center gap-2 py-4">
                <GraduationCap className="w-5 h-5" />
                Enrol Now
              </Link>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-10 pt-8 border-t-4 border-[--brand-gold]/30 text-center">
          <p className="text-sm font-semibold text-[--brand-green-dark]">
            © {new Date().getFullYear()} An-Nur Academy • Made with 💚 for the Ummah
          </p>
        </div>
      </div>
    </footer>
  );
}
