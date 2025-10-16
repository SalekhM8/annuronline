"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

const nav = [
  { href: "/about", label: "About Us" },
  { href: "/offerings", label: "Offerings" },
  { href: "/shop", label: "Shop" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-transparent">
      <div className="container-px mx-auto">
        <div className="mt-3 flex items-center justify-center">
          <div className="w-full max-w-4xl rounded-full bg-white/70 p-2 shadow-md ring-1 ring-[--brand-gold]/30 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            {/* Desktop nav */}
            <div className="hidden items-center justify-between px-4 md:flex">
              <Link href="/" className="flex items-center gap-3">
                <img src="/annurlogo.JPG" alt="An‑Nur Academy" className="h-9 w-9 rounded-sm" />
                <span className="text-sm font-semibold tracking-tight">An‑Nur Academy</span>
              </Link>
              <nav className="flex items-center gap-6">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className={clsx("text-sm font-medium text-neutral-700 transition-colors hover:text-[--color-brand]", pathname === item.href && "text-[--color-brand]")}>{item.label}</Link>
                ))}
              </nav>
              <div className="flex items-center gap-2">
                <Link href="/enroll" className="btn-secondary">Enroll</Link>
                <Link href="/assessment" className="btn-primary">Free Assessment</Link>
              </div>
            </div>
            {/* Mobile header */}
            <div className="relative flex items-center justify-between px-3 md:hidden">
              <div className="w-10" />
              <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
                <img src="/annurlogo.JPG" alt="An‑Nur Academy" className="h-9 w-9 rounded-sm" />
                <span className="text-sm font-semibold tracking-tight">An‑Nur Academy</span>
              </Link>
              <button onClick={() => setMenuOpen((v) => !v)} className="ml-auto cursor-pointer rounded-full bg-white/90 px-4 py-2 text-sm shadow-md ring-1 ring-[--brand-gold]/60 border border-[--brand-gold]/60 backdrop-blur hover:bg-white hover:ring-[--brand-gold]/80" aria-label="Open menu" aria-expanded={menuOpen}>☰</button>
              {menuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMenuOpen(false)}>
                  <div className="absolute right-3 top-16 w-64 rounded-2xl bg-white/90 p-4 shadow-xl ring-1 ring-[--brand-gold]/50 border border-[--brand-gold]/50 backdrop-blur" onClick={(e) => e.stopPropagation()}>
                    <nav className="grid gap-3">
                      {nav.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-[--muted]">
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link href="/enroll" onClick={() => setMenuOpen(false)} className="btn-secondary">Enroll</Link>
                      <Link href="/assessment" onClick={() => setMenuOpen(false)} className="btn-primary">Assessment</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


