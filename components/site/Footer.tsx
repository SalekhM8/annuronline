import Link from "next/link";
import { Instagram, Facebook, Youtube, Music, Link as LinkIcon, Mail, Phone, Earth } from "lucide-react";
import { BrandLockup } from "@/components/site/Brand";

export default function Footer() {
  return (
    <footer className="mt-24 bg-green-950 text-cream">
      <div className="container-px grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <BrandLockup dark />
          <p className="text-sm leading-relaxed text-cream/70">
            A UK-based online Islamic academy. Qualified teachers, first-language English, serving
            students worldwide.
          </p>
          <div className="space-y-1.5 text-sm text-cream/80">
            <p className="flex items-center gap-2"><Earth className="h-4 w-4 text-gold-500" /> UK-based • worldwide access</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-500" /> info@an-nur.online</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-500" /> +44 7724 343150</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-heading text-lg text-gold-300">Courses</h3>
          <div className="flex flex-col gap-2 text-sm text-cream/80">
            <Link className="hover:text-gold-300" href="/courses/qaidah">Qa&apos;idah</Link>
            <Link className="hover:text-gold-300" href="/courses/tajweed">Tajweed</Link>
            <Link className="hover:text-gold-300" href="/courses/arabic">Arabic Language</Link>
            <Link className="hover:text-gold-300" href="/courses/hifz">Hifz</Link>
            <Link className="hover:text-gold-300" href="/courses/islamic-studies">Islamic Studies</Link>
            <Link className="hover:text-gold-300" href="/courses/weekly-tafsir">Weekly Tafsir</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-heading text-lg text-gold-300">Academy</h3>
          <div className="flex flex-col gap-2 text-sm text-cream/80">
            <Link className="hover:text-gold-300" href="/about">About us</Link>
            <Link className="hover:text-gold-300" href="/fees">Fees</Link>
            <Link className="hover:text-gold-300" href="/assessment">Free assessment</Link>
            <Link className="hover:text-gold-300" href="/counselling">Counselling</Link>
            <Link className="hover:text-gold-300" href="/donate">Donate</Link>
            <Link className="hover:text-gold-300" href="/policies">Safeguarding &amp; data protection</Link>
            <Link className="hover:text-gold-300" href="/login">Portal login</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-heading text-lg text-gold-300">Follow us</h3>
          <div className="flex flex-col gap-2 text-sm text-cream/80">
            <a className="flex items-center gap-2 hover:text-gold-300" href="https://www.instagram.com/an_nuracademy" target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" /> Instagram</a>
            <a className="flex items-center gap-2 hover:text-gold-300" href="https://www.tiktok.com/@annuracademy" target="_blank" rel="noopener noreferrer"><Music className="h-4 w-4" /> TikTok</a>
            <a className="flex items-center gap-2 hover:text-gold-300" href="https://youtube.com/@an-nur.academy" target="_blank" rel="noopener noreferrer"><Youtube className="h-4 w-4" /> YouTube</a>
            <a className="flex items-center gap-2 hover:text-gold-300" href="https://www.facebook.com/An-NurAcademy" target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /> Facebook</a>
            <a className="flex items-center gap-2 hover:text-gold-300" href="https://linktr.ee/AnNur_Academy" target="_blank" rel="noopener noreferrer"><LinkIcon className="h-4 w-4" /> Linktree</a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} An-Nur Academy • Made with care for the Ummah
      </div>
    </footer>
  );
}
