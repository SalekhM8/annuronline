import { ReactNode } from "react";
import Link from "next/link";

type Props = {
  title: string;
  quote?: ReactNode;
  imageUrl: string;
  children: ReactNode; // left column content
};

export default function OfferLayout({ title, quote, imageUrl, children }: Props) {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {quote}
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">{children}</div>
        <div className="relative min-h-[520px] overflow-hidden rounded-3xl bg-white/70 shadow-lg ring-1 ring-[--brand-gold]/25">
          <div className="absolute inset-0" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="cta-overlay relative z-10 flex h-full w-full items-center justify-center p-6">
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link href="/enroll" className="btn-primary text-lg px-8 py-3">Enroll</Link>
              <Link href="/assessment" className="btn-secondary text-lg px-8 py-3">Free Assessment</Link>
            </div>
            <div className="absolute bottom-6 left-6">
              <div className="rounded-full bg-white/80 px-3 py-1 text-xs text-[--brand-green] ring-1 ring-[--brand-gold]/40">Segregated • Group & 1:1 • Worldwide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


