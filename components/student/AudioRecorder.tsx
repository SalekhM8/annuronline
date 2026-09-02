"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, RotateCcw, Send, Square } from "lucide-react";

const MAX_SECONDS = 180; // 3 minutes

function formatTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Phase = "idle" | "recording" | "recorded" | "uploading" | "submitted";

/**
 * In-browser audio recorder for distance-learning assessments.
 * Records audio/webm via MediaRecorder, capped at 3 minutes, with
 * playback preview before submitting.
 */
export default function AudioRecorder({
  enrolmentId,
  moduleId,
  moduleTitle,
}: {
  enrolmentId: string;
  moduleId: string;
  moduleTitle: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);

  // Cleanup on unmount: stop tracks, timers and revoke the preview URL.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function startRecording() {
    setError(null);
    try {
      if (typeof MediaRecorder === "undefined") {
        throw new Error("Recording is not supported in this browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        blobRef.current = blob;
        setPreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setPhase("recorded");
      };

      secondsRef.current = 0;
      setSeconds(0);
      recorder.start(1000);
      setPhase("recording");

      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
        if (secondsRef.current >= MAX_SECONDS) {
          stopTimer();
          if (recorderRef.current?.state === "recording") recorderRef.current.stop();
        }
      }, 1000);
    } catch (err) {
      setError(
        err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
          ? "Microphone access was blocked — please allow it in your browser and try again."
          : err instanceof Error
            ? err.message
            : "Could not start recording"
      );
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setPhase("idle");
    }
  }

  function stopRecording() {
    stopTimer();
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  function discard() {
    blobRef.current = null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSeconds(0);
    secondsRef.current = 0;
    setError(null);
    setPhase("idle");
  }

  async function submit() {
    const blob = blobRef.current;
    if (!blob || phase === "uploading") return;
    setPhase("uploading");
    setError(null);
    try {
      const form = new FormData();
      form.append("enrolmentId", enrolmentId);
      form.append("moduleId", moduleId);
      form.append("durationSecs", String(seconds || secondsRef.current));
      form.append("audio", blob, "assessment.webm");

      const res = await fetch("/api/student/assessments", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");

      setPhase("submitted");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPhase("recorded");
    }
  }

  if (phase === "submitted") {
    return (
      <div className="card-gold p-5">
        <p className="font-bold text-green-900">Recording submitted, alhamdulillah.</p>
        <p className="mt-1 text-sm text-ink-soft">
          Your teacher will listen to it and either pass the module or ask you to repeat.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <p className="font-bold text-green-900">Record your answer — {moduleTitle}</p>
      <p className="mt-1 text-sm text-ink-soft">
        Recite or answer aloud, up to 3 minutes. You can listen back before submitting.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {phase === "idle" && (
          <button type="button" className="btn-primary" onClick={startRecording}>
            <Mic className="h-4 w-4" /> Start recording
          </button>
        )}

        {phase === "recording" && (
          <>
            <button type="button" className="btn-danger" onClick={stopRecording}>
              <Square className="h-4 w-4" /> Stop
            </button>
            <span className="inline-flex items-center gap-2 font-mono text-sm font-bold text-green-900">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--danger)]" />
              {formatTimer(seconds)} / {formatTimer(MAX_SECONDS)}
            </span>
          </>
        )}

        {(phase === "recorded" || phase === "uploading") && previewUrl && (
          <div className="w-full space-y-3">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls src={previewUrl} className="w-full" />
            <p className="text-xs text-ink-soft">Recording length: {formatTimer(seconds)}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-gold disabled:cursor-not-allowed disabled:opacity-50"
                onClick={submit}
                disabled={phase === "uploading"}
              >
                <Send className="h-4 w-4" /> {phase === "uploading" ? "Uploading…" : "Submit for review"}
              </button>
              <button
                type="button"
                className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
                onClick={discard}
                disabled={phase === "uploading"}
              >
                <RotateCcw className="h-4 w-4" /> Record again
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="form-error mt-3">{error}</p>}
    </div>
  );
}
