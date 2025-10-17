"use client";

import { useState } from "react";
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
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fun-box-white space-y-6">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" value={type} {...register("type")} />
        
        {/* 👤 PERSONAL INFO */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-playful text-[--brand-green] flex items-center gap-2">
            <span className="text-3xl">👤</span> Your Info
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Full Name *</label>
              <input 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                placeholder="Your name" 
                {...register("fullName")} 
              />
              {errors.fullName && <p className="mt-1 text-xs font-bold text-red-600">⚠️ {errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Email *</label>
              <input 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                type="email" 
                placeholder="your@email.com" 
                {...register("email")} 
              />
              {errors.email && <p className="mt-1 text-xs font-bold text-red-600">⚠️ {errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Phone</label>
              <input 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                placeholder="+44..." 
                {...register("phone")} 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">This is for...</label>
              <select 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white cursor-pointer" 
                {...register("forWhom")}
              >
                <option value="">Please select</option>
                <option value="self">🙋 Myself</option>
                <option value="someone">👥 Someone else</option>
              </select>
            </div>
          </div>
        </div>

        {/* 👶 STUDENT INFO */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-playful text-[--brand-green] flex items-center gap-2">
            <span className="text-3xl">👶</span> Student Info
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Student Name (if different)</label>
              <input 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                placeholder="Student's name" 
                {...register("studentName")} 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Relationship</label>
              <input 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                placeholder="Parent, Guardian, etc." 
                {...register("relationship")} 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Age</label>
              <input 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                type="number" 
                placeholder="Age" 
                {...register("age")} 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Gender</label>
              <select 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white cursor-pointer" 
                {...register("gender")}
              >
                <option value="">Select</option>
                <option value="male">👨 Male</option>
                <option value="female">👩 Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* 📚 COURSES */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-playful text-[--brand-green] flex items-center gap-2">
            <span className="text-3xl">📚</span> Pick Your Courses! *
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Qaidah", emoji: "🔤" },
              { name: "Quran", emoji: "📖" },
              { name: "Hifz", emoji: "🧠" },
              { name: "Tajweed", emoji: "🎵" },
              { name: "Islamic Studies", emoji: "📚" },
              { name: "Naseeha", emoji: "💚" },
              { name: "Faith-based Counselling", emoji: "🤝" },
              { name: "Arabic", emoji: "✍️" },
            ].map((c) => (
              <label key={c.name} className="option-card flex items-center gap-3 cursor-pointer bg-[--fun-bg-2]">
                <input 
                  className="w-5 h-5 accent-[--brand-green] cursor-pointer" 
                  type="checkbox" 
                  value={c.name} 
                  {...register("courses")} 
                />
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-sm font-bold text-[--brand-green-dark]">{c.name}</span>
              </label>
            ))}
          </div>
          {errors.courses && <p className="mt-2 text-sm font-bold text-red-600">⚠️ {errors.courses.message}</p>}
        </div>

        {/* 💬 MORE INFO */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-playful text-[--brand-green] flex items-center gap-2">
            <span className="text-3xl">💬</span> Tell Us More!
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Preferences (group/1:1, days, times, availability)</label>
              <textarea 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                rows={4} 
                placeholder="Tell us your preferences..."
                {...register("preferences")} 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">Additional Comments</label>
              <textarea 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                rows={3} 
                placeholder="Any questions or comments?"
                {...register("comments")} 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[--brand-green-dark]">How did you hear about us?</label>
              <input 
                className="mt-2 w-full rounded-2xl border-4 border-[--brand-gold] p-4 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[--brand-green]/30 transition-all bg-white" 
                placeholder="Social media, friend, etc." 
                {...register("heardAbout")} 
              />
            </div>
          </div>
        </div>

        {/* 🚀 SUBMIT */}
        <div className="pt-4 space-y-4">
          <button 
            className="btn-fun w-full text-2xl py-6" 
            type="submit" 
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "⏳ Sending..." : "🚀 Send Message!"}
          </button>
          {status === "success" && (
            <div className="fun-box-green text-white text-center p-4">
              <p className="text-xl font-bold">✅ Thank you! We&apos;ll be in touch soon! 🎉</p>
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-500 text-white text-center p-4 rounded-2xl">
              <p className="text-lg font-bold">❌ Oops! Something went wrong. Please try again!</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}


