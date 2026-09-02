"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

type Item = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsBell() {
  const [items, setItems] = useState<Item[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/account/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      await fetch("/api/account/notifications", { method: "PATCH" }).catch(() => {});
      setUnread(0);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-green-900/10 transition-transform hover:scale-105"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
      >
        <Bell className="h-5 w-5 text-green-800" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[--danger] px-1 text-[0.65rem] font-extrabold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="card absolute right-0 top-12 z-50 max-h-96 w-80 overflow-y-auto p-2">
          {items.length === 0 ? (
            <p className="p-4 text-center text-sm text-ink-soft">No notifications yet.</p>
          ) : (
            items.map((n) => {
              const inner = (
                <div className={`rounded-lg p-3 ${n.isRead ? "" : "bg-green-50"}`}>
                  <p className="text-sm font-bold text-green-900">{n.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{n.body}</p>
                  <p className="mt-1 text-[0.68rem] font-semibold text-ink-soft/70">
                    {new Date(n.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              );
              return n.link ? (
                <Link key={n.id} href={n.link} onClick={() => setOpen(false)} className="block hover:opacity-80">
                  {inner}
                </Link>
              ) : (
                <div key={n.id}>{inner}</div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
