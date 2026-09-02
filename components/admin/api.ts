"use client";

/** Small client-side JSON fetch helper for admin API calls. */
export async function callApi<T = Record<string, unknown>>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : "Request failed");
  }
  return data as T;
}

/** Pounds string ("15" / "15.50") → integer pence, or null when blank. */
export function poundsToPence(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number.parseFloat(trimmed);
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}
