import clsx from "clsx";

/** Eight-pointed star (rub el hizb) with crescent — the v2 brand mark. */
export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <rect x="14" y="14" width="36" height="36" rx="4" fill="#0e5540" />
      <rect x="14" y="14" width="36" height="36" rx="4" fill="#0a3d2e" transform="rotate(45 32 32)" />
      <circle cx="32" cy="32" r="12.5" fill="#d4af37" />
      <circle cx="35.5" cy="30.5" r="10" fill="#0a3d2e" />
      <circle cx="38.5" cy="29" r="7.5" fill="#d4af37" opacity="0" />
      <path
        d="M39 24.5a9 9 0 1 0 0 15 7.2 7.2 0 0 1 0-15z"
        fill="#faf7f0"
        opacity="0.95"
      />
    </svg>
  );
}

export function BrandLockup({
  dark = false,
  compact = false,
}: {
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark className={compact ? "h-9 w-9" : "h-11 w-11"} />
      <span className="leading-tight">
        <span
          className={clsx(
            "block font-heading font-semibold tracking-wide",
            compact ? "text-lg" : "text-xl",
            dark ? "text-cream" : "text-green-900"
          )}
        >
          An&#8209;Nur Academy
        </span>
        <span
          className={clsx("arabic block text-sm", dark ? "text-gold-300" : "text-gold-700")}
        >
          أكاديمية النور
        </span>
      </span>
    </span>
  );
}
