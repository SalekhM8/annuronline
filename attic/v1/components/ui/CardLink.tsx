import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  title: string;
  description?: string;
  imageUrl?: string;
  children?: ReactNode;
};

export default function CardLink({ href, title, description, imageUrl, children }: Props) {
  return (
    <Link href={href} className="card card-hover-glow group">
      <div
        className="absolute inset-0 -z-10 opacity-25 blur-[2px] transition-opacity group-hover:opacity-40"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="p-10 md:p-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 rounded-full bg-[--brand-gold]" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {description && <p className="mt-4 text-sm text-neutral-700">{description}</p>}
        {children}
      </div>
    </Link>
  );
}


