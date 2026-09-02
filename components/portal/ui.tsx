import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "green",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "green" | "gold" | "neutral";
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          tone === "green" && "bg-green-100 text-green-800",
          tone === "gold" && "bg-gold-100 text-gold-700",
          tone === "neutral" && "bg-cream-deep text-ink-soft"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-extrabold uppercase tracking-wide text-ink-soft">
          {label}
        </p>
        <p className="text-xl font-extrabold text-green-900">{value}</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div className="card flex flex-col items-center justify-center p-12 text-center">
      <Icon className="h-10 w-10 text-green-600/40" />
      <p className="mt-3 font-bold text-green-900">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    {
      ACTIVE: "badge-ok",
      PAID: "badge-ok",
      PRESENT: "badge-ok",
      PASSED: "badge-ok",
      COMPLETED: "badge-ok",
      ANSWERED: "badge-ok",
      CONFIRMED: "badge-ok",
      PUBLISHED: "badge-ok",
      PENDING: "badge-gold",
      PENDING_PAYMENT: "badge-gold",
      SUBMITTED: "badge-gold",
      UNDER_REVIEW: "badge-gold",
      IN_PROGRESS: "badge-gold",
      LATE: "badge-gold",
      LOCKED: "badge-red",
      OVERDUE: "badge-red",
      FAILED: "badge-red",
      ABSENT: "badge-red",
      REPEAT: "badge-red",
      DECLINED: "badge-red",
      REJECTED: "badge-red",
      CANCELLED: "badge-neutral",
      EXPIRED: "badge-neutral",
      NOT_STARTED: "badge-neutral",
    }[status] ?? "badge-neutral";
  return <span className={clsx("badge", tone)}>{status.replaceAll("_", " ")}</span>;
}
