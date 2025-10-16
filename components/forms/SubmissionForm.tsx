"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  type: z.enum(["ASSESSMENT", "ENROLLMENT"]),
  fullName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  forWhom: z.string().optional(),
  studentName: z.string().optional(),
  relationship: z.string().optional(),
  age: z.coerce.number().int().min(1).max(120).optional(),
  gender: z.string().optional(),
  courses: z.array(z.string()).min(1, "Select at least one"),
  preferences: z.string().optional(),
  comments: z.string().optional(),
  heardAbout: z.string().optional(),
});

export type SubmissionValues = z.infer<typeof schema>;

export default function SubmissionForm({ type = "ASSESSMENT" as SubmissionValues["type"] }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionValues>({
    // Relax type to satisfy resolver generics in CI builds
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as unknown as any,
    defaultValues: { type, courses: [] },
  });

  const onPointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }, []);

  async function onSubmit(values: SubmissionValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset({ type, courses: [] });
    } catch (e) {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl p-6 shadow-lg ring-1 ring-[--brand-gold]/30 backdrop-blur" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} onPointerMove={onPointer}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" value={type} {...register("type")} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Full Name *</label>
            <input className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} {...register("fullName")} />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Email *</label>
            <input className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} type="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} {...register("phone")} />
          </div>
          <div>
            <label className="text-sm font-medium">Is this for you or someone else?</label>
            <select className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} {...register("forWhom")}>
              <option value="">Please select</option>
              <option value="self">Myself</option>
              <option value="someone">Someone else</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Student Name (if different)</label>
            <input className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} {...register("studentName")} />
          </div>
          <div>
            <label className="text-sm font-medium">Relationship to student</label>
            <input className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} {...register("relationship")} />
          </div>
          <div>
            <label className="text-sm font-medium">Age</label>
            <input className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} type="number" {...register("age")} />
          </div>
          <div>
            <label className="text-sm font-medium">Gender</label>
            <select className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} {...register("gender")}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

          <div className="mt-2">
          <div className="text-sm font-medium">Which course(s) are you interested in? *</div>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Qaidah",
              "Quran",
              "Hifz",
              "Tajweed",
              "Islamic Studies",
              "Naseeha",
              "Faith-based Counselling",
              "Arabic",
            ].map((c) => (
              <label key={c} className="flex items-center gap-3 rounded-full p-2 ring-1 ring-[--brand-gold]/20" style={{ background: 'color-mix(in oklab, var(--brand-gold), white 90%)' }}>
                <input className="accent-[--brand-green]" type="checkbox" value={c} {...register("courses")} />
                <span className="text-sm">{c}</span>
              </label>
            ))}
          </div>
          {errors.courses && <p className="mt-1 text-xs text-red-600">{errors.courses.message}</p>}
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Preferences (group/1:1, days, times, availability)</label>
          <textarea className="mt-1 w-full rounded-2xl border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} rows={4} {...register("preferences")} />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium">Additional comments</label>
          <textarea className="mt-1 w-full rounded-2xl border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} rows={3} {...register("comments")} />
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium">How did you hear about us?</label>
          <input className="mt-1 w-full rounded-full border border-[--brand-gold]/30 p-3 ring-1 ring-[--brand-gold]/30 focus:outline-none focus:ring-[--brand-gold]" style={{ background: 'color-mix(in oklab, var(--brand-green), white 92%)' }} {...register("heardAbout")} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="btn-primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
          {status === "success" && <span className="text-sm text-[--color-brand]">Thank you! We will be in touch.</span>}
          {status === "error" && <span className="text-sm text-red-600">Something went wrong. Please try again.</span>}
        </div>
      </form>
    </div>
  );
}


