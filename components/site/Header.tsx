"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { BrandLockup } from "@/components/site/Brand";

const COURSES = [
  { href: "/courses/qaidah", label: "Qa'idah" },
  { href: "/courses/tajweed", label: "Tajweed" },
  { href: "/courses/arabic", label: "Arabic Language" },
  { href: "/courses/hifz", label: "Hifz" },
  { href: "/courses/islamic-studies", label: "Islamic Studies" },
  { href: "/courses/weekly-tafsir", label: "Weekly Tafsir" },
];

const NAV = [
  { href: "/about", label: "About" },
  { href: "/fees", label: "Fees" },
  { href: "/shop", label: "Shop" },
  { href: "/resources", label: "Resources" },
  { href: "/ask-the-mufti", label: "Ask the Mufti" },
  { href: "/donate", label: "Donate" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-green-900/10 bg-cream/90 backdrop-blur-md">
      <div className="container-px flex items-center justify-between py-3">
        <Link href="/" aria-label="An-Nur Academy home">
          <BrandLockup compact />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setCoursesOpen(true)}
            onMouseLeave={() => setCoursesOpen(false)}
          >
            <button
              className={clsx(
                "flex items-center gap-1 text-sm font-bold transition-colors",
                pathname.startsWith("/courses") ? "text-green-700" : "text-ink hover:text-green-700"
              )}
              aria-expanded={coursesOpen}
            >
              Courses <ChevronDown className="h-4 w-4" />
            </button>
            {coursesOpen && (
              <div className="card absolute left-0 top-full w-56 p-2">
                {COURSES.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-green-50 hover:text-green-800"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-bold transition-colors",
                pathname === item.href ? "text-green-700" : "text-ink hover:text-green-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login" className="btn-ghost text-sm">
            Portal login
          </Link>
          <Link href="/assessment" className="btn-outline text-sm">
            Free assessment
          </Link>
          <Link href="/enrol" className="btn-gold text-sm">
            Enrol now
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-green-900 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-green-900/10 bg-cream lg:hidden">
          <div className="container-px space-y-1 py-4">
            <p className="eyebrow px-3 pt-1">Courses</p>
            {COURSES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-green-50"
              >
                {c.label}
              </Link>
            ))}
            <div className="divider-dot my-2" />
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-bold text-ink hover:bg-green-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Link href="/enrol" onClick={() => setOpen(false)} className="btn-gold w-full">
                Enrol now
              </Link>
              <Link href="/assessment" onClick={() => setOpen(false)} className="btn-outline w-full">
                Free assessment
              </Link>
              <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost w-full">
                Portal login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
