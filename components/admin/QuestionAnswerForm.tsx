"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callApi } from "./api";

/** Answer / publish / reject an Ask-the-Mufti question. */
export default function QuestionAnswerForm({
  questionId,
  initialAnswer,
  initialPublished,
  status,
}: {
  questionId: string;
  initialAnswer: string | null;
  initialPublished: boolean;
  status: string;
}) {
  const router = useRouter();
  const [answer, setAnswer] = useState(initialAnswer ?? "");
  const [publish, setPublish] = useState(initialPublished);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(action: "answer" | "reject") {
    if (action === "answer" && !answer.trim()) {
      setError("Write an answer first");
      return;
    }
    setBusy(action);
    setError(null);
    try {
      await callApi(`/api/admin/questions/${questionId}`, "PATCH", {
        action,
        answer: action === "answer" ? answer.trim() : undefined,
        publish: action === "answer" ? publish : undefined,
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        className="textarea"
        rows={4}
        placeholder="Write the Mufti's answer…"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
        Publish anonymously on the website
      </label>
      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy !== null}
          onClick={() => submit("answer")}
        >
          {busy === "answer" ? "Saving…" : status === "PENDING" ? "Save answer & email asker" : "Update answer"}
        </button>
        {status !== "REJECTED" && (
          <button
            type="button"
            className="btn btn-danger"
            disabled={busy !== null}
            onClick={() => submit("reject")}
          >
            {busy === "reject" ? "Working…" : "Reject"}
          </button>
        )}
      </div>
    </div>
  );
}
