"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

/**
 * Generic one-click admin action: POST/PATCH a JSON body to an admin API
 * route, then refresh the server components on the page.
 */
export default function ActionButton({
  label,
  url,
  method = "POST",
  body,
  confirmText,
  className = "btn btn-outline",
  doneLabel,
}: {
  label: string;
  url: string;
  method?: "POST" | "PATCH" | "DELETE";
  body?: unknown;
  confirmText?: string;
  className?: string;
  doneLabel?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setError(null);
    try {
      await callApi(url, method, body);
      setDone(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" className={className} disabled={busy} onClick={run}>
        {busy ? "Working…" : done && doneLabel ? doneLabel : label}
      </button>
      {error && <span className="text-xs font-semibold text-red-700">{error}</span>}
    </span>
  );
}
