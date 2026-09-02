"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Menu, X, Globe } from "lucide-react";
import { BrandMark } from "@/components/site/Brand";
import type { NavSection } from "@/lib/nav";

export default function PortalShell({
  sections,
  userName,
  roleLabel,
  children,
}: {
  sections: NavSection[];
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {sections.map((section, i) => (
        <div key={i}>
          {section.title && (
            <p className="px-3 pb-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-cream/40">
              {section.title}
            </p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const active =
                item.href === pathname ||
                (item.href.split("/").length > 2 && pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx("sidebar-link", active && "active")}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const sidebarInner = (
    <>
      <div className="flex items-center gap-3 border-b border-cream/10 px-5 py-5">
        <BrandMark className="h-9 w-9" />
        <div className="leading-tight">
          <p className="font-heading text-base text-cream">An&#8209;Nur Academy</p>
          <p className="text-xs font-bold uppercase tracking-wider text-gold-300">{roleLabel}</p>
        </div>
      </div>
      {nav}
      <div className="border-t border-cream/10 p-4">
        <p className="mb-2 truncate px-2 text-sm font-semibold text-cream/70">{userName}</p>
        <div className="flex items-center gap-1">
          <Link href="/" className="sidebar-link flex-1">
            <Globe className="h-4 w-4" /> Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="sidebar-link flex-1 text-left"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-green-950 lg:flex">
        {sidebarInner}
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-green-950 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <BrandMark className="h-8 w-8" />
          <span className="font-heading text-cream">An&#8209;Nur Academy</span>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="p-1 text-cream" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
          <aside
            className="absolute inset-y-0 left-0 flex w-72 flex-col bg-green-950 pt-14"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarInner}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1 px-5 pb-16 pt-20 lg:ml-64 lg:px-10 lg:pt-10">{children}</main>
    </div>
  );
}
