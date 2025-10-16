import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-white/80">
      <div className="container-px mx-auto grid grid-cols-1 items-center justify-between gap-6 py-14 md:grid-cols-3">
        <div>
          <div className="text-lg font-semibold">An‑Nur Academy</div>
          <p className="mt-1 text-sm text-neutral-600">UK‑based. Accessible worldwide.</p>
        </div>
        <div className="flex justify-center gap-6">
          <Link className="text-sm hover:text-[--color-brand]" href="/privacy">Privacy</Link>
          <Link className="text-sm hover:text-[--color-brand]" href="/admin">Admin</Link>
        </div>
        <div className="flex justify-end gap-3">
          <a className="btn-secondary" href="/assessment">Book Free Assessment</a>
        </div>
      </div>
    </footer>
  );
}


