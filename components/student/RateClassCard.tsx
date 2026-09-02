"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import clsx from "clsx";

/**
 * Anonymous end-of-class poll card. The rating is stored without any
 * link to the student's identity — only a one-way hash prevents
 * double voting.
 */
export default function RateClassCard({
  sessionId,
  groupName,
  topic,
  heldAtLabel,
}: {
  sessionId: string;
  groupName: string;
  topic: string | null;
  heldAtLabel: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (rating < 1 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/student/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, rating, comment: comment.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) {
          setDone(true); // already rated — treat as success
          return;
        }
        throw new Error(data?.error ?? "Something went wrong");
      }
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card-gold p-5">
        <p className="font-bold text-green-900">JazakAllahu khairan — your rating has been recorded.</p>
        <p className="mt-1 text-sm text-ink-soft">Ratings are anonymous: your name is never stored with your answer.</p>
      </div>
    );
  }

  return (
    <div className="card-gold p-5">
      <p className="eyebrow">Rate your last class</p>
      <p className="mt-1 font-bold text-green-900">
        {groupName}
        {topic ? ` — ${topic}` : ""}
      </p>
      <p className="text-sm text-ink-soft">{heldAtLabel} · your answer is anonymous</p>

      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Rating out of 5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={clsx(
                "h-7 w-7 transition-colors",
                (hover || rating) >= n ? "fill-gold-500 text-gold-600" : "text-gold-300"
              )}
            />
          </button>
        ))}
      </div>

      <textarea
        className="textarea mt-3"
        rows={2}
        maxLength={1000}
        placeholder="Any comments? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {error && <p className="form-error">{error}</p>}

      <button
        type="button"
        className="btn-gold mt-3 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={submit}
        disabled={rating < 1 || busy}
      >
        {busy ? "Sending…" : "Submit rating"}
      </button>
    </div>
  );
}
