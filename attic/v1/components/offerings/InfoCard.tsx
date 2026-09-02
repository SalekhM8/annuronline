import { ReactNode } from "react";

export default function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-[--muted] p-6 shadow-md ring-1 ring-[--brand-gold]/30">
      <h3 className="font-semibold text-[--brand-green]">{title}</h3>
      <div className="mt-2 text-neutral-800">{children}</div>
    </div>
  );
}


