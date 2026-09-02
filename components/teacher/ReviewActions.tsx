"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Headphones, RotateCcw } from "lucide-react";

export default function ReviewActions({
  submissionId,
  status,
}: {
  submissionId: string;
  status: "SUBMITTED" | "UNDER_REVIEW";
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "UNDER_REVIEW" | "PASS" | "REPEAT") {
    if (action === "REPEAT" && !feedback.trim()) {
      setError("Feedback is required when asking the student to repeat.");
      return;
    }
    setBusy(action);
    setError(null);
    try {
      const res = await fetch(`/api/teacher/assessments/${submissionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, feedback: feedback.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not update the submission");
      setFeedback("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-4 border-t border-green-900/10 pt-4">
      <label className="label" htmlFor={`feedback-${submissionId}`}>
        Feedback <span className="font-normal text-ink-soft">(optional for pass, required for repeat)</span>
      </label>
      <textarea
        id={`feedback-${submissionId}`}
        className="textarea"
        rows={2}
        maxLength={2000}
        placeholder="Notes on tajweed, fluency, corrections…"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {status === "SUBMITTED" && (
          <button
            type="button"
            className="btn-outline px-4! py-2! text-sm"
            disabled={busy !== null}
            onClick={() => act("UNDER_REVIEW")}
          >
            <Headphones className="h-4 w-4" />
            {busy === "UNDER_REVIEW" ? "Updating…" : "Mark under review"}
          </button>
        )}
        <button
          type="button"
          className="btn-primary px-4! py-2! text-sm"
          disabled={busy !== null}
          onClick={() => act("PASS")}
        >
          <CheckCircle2 className="h-4 w-4" />
          {busy === "PASS" ? "Passing…" : "Pass (issues certificate)"}
        </button>
        <button
          type="button"
          className="btn-danger px-4! py-2! text-sm"
          disabled={busy !== null}
          onClick={() => act("REPEAT")}
        >
          <RotateCcw className="h-4 w-4" />
          {busy === "REPEAT" ? "Sending…" : "Ask to repeat"}
        </button>
        {error && <span className="form-error mt-0!">{error}</span>}
      </div>
    </div>
  );
}
