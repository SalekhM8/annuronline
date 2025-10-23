"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Handshake, Star, MessageCircle, Send, CheckCircle } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  counsellingType: z.enum(["family", "marriage", "individual"]).refine((val) => val !== undefined, { message: "Please select a type" }),
  deliveryMethod: z.enum(["in-person", "online"]).refine((val) => val !== undefined, { message: "Please select a method" }),
  message: z.string().optional(),
});

type CounsellingValues = z.infer<typeof schema>;

export default function CounsellingBookingPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CounsellingValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
  });

  async function onSubmit(values: CounsellingValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ENROLLMENT",
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          courses: "Faith-based Counselling",
          preferences: `Type: ${values.counsellingType}, Method: ${values.deliveryMethod}`,
          comments: values.message,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8">
      {/* 🤝 HERO */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Handshake className="w-20 h-20 text-brand-green" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-playful gradient-text text-center">
          Book Counselling
        </h1>
        <p className="text-xl md:text-2xl text-brand-green-dark font-semibold text-center">
          Confidential support for your journey
        </p>
      </div>

      {/* 🎯 INFO BOX */}
      <div className="fun-box-green text-white text-center space-y-4">
        <h2 className="text-3xl font-bold text-playful flex items-center justify-center gap-3 relative z-10">
          <Star className="w-10 h-10 text-white" fill="currentColor" />
          Professional Counselling Services
        </h2>
        <p className="text-xl leading-relaxed relative z-10">
          Book your <span className="font-bold text-[--brand-gold-light]">confidential consultation</span> with our experienced counsellors
        </p>
      </div>

      {/* 📝 COUNSELLING FORM */}
      <div className="fun-box-white space-y-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          {/* 👤 PERSONAL INFO */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-playful text-brand-green">
              Your Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-brand-green-dark">Full Name *</label>
                <input 
                  className="mt-2 w-full rounded-2xl border-2 border-[--brand-gold]/40 p-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[--brand-green]/30 focus:border-[--brand-green]/60 transition-all shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
                  placeholder="Your name" 
                  {...register("fullName")} 
                />
                {errors.fullName && <p className="mt-1 text-xs font-bold text-red-600">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-brand-green-dark">Email *</label>
                <input 
                  className="mt-2 w-full rounded-2xl border-2 border-[--brand-gold]/40 p-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[--brand-green]/30 focus:border-[--brand-green]/60 transition-all shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
                  type="email" 
                  placeholder="your@email.com" 
                  {...register("email")} 
                />
                {errors.email && <p className="mt-1 text-xs font-bold text-red-600">{errors.email.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-bold text-brand-green-dark">Phone</label>
                <input 
                  className="mt-2 w-full rounded-2xl border-2 border-[--brand-gold]/40 p-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[--brand-green]/30 focus:border-[--brand-green]/60 transition-all shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
                  placeholder="+44..." 
                  {...register("phone")} 
                />
              </div>
            </div>
          </div>

          {/* 🤝 COUNSELLING TYPE */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-playful text-brand-green">
              Counselling Details
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-bold text-brand-green-dark">What type of counselling do you prefer? *</label>
                <select 
                  className="mt-2 w-full rounded-2xl border-2 border-[--brand-gold]/40 p-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[--brand-green]/30 focus:border-[--brand-green]/60 transition-all shadow-sm cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
                  {...register("counsellingType")}
                >
                  <option value="">Please select</option>
                  <option value="family">Family Counselling</option>
                  <option value="marriage">Marriage Counselling</option>
                  <option value="individual">Individual Counselling</option>
                </select>
                {errors.counsellingType && <p className="mt-1 text-xs font-bold text-red-600">{errors.counsellingType.message}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-brand-green-dark">Prefer in-person or online? *</label>
                <select 
                  className="mt-2 w-full rounded-2xl border-2 border-[--brand-gold]/40 p-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[--brand-green]/30 focus:border-[--brand-green]/60 transition-all shadow-sm cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
                  {...register("deliveryMethod")}
                >
                  <option value="">Please select</option>
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                </select>
                {errors.deliveryMethod && <p className="mt-1 text-xs font-bold text-red-600">{errors.deliveryMethod.message}</p>}
              </div>
            </div>
          </div>

          {/* 💬 MORE INFO */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-playful text-brand-green">
              Tell Us More
            </h3>
            <div>
              <label className="text-sm font-bold text-brand-green-dark">What are you hoping to achieve?</label>
              <textarea 
                className="mt-2 w-full rounded-2xl border-2 border-[--brand-gold]/40 p-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[--brand-green]/30 focus:border-[--brand-green]/60 transition-all shadow-sm"
                style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
                rows={4} 
                placeholder="Share your goals and what you'd like support with..."
                {...register("message")} 
              />
            </div>
          </div>

          {/* 🚀 SUBMIT */}
          <div className="pt-4 space-y-4">
            <button 
              className="btn-fun w-full text-2xl py-6 flex items-center justify-center gap-3" 
              type="submit" 
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <MessageCircle className="w-6 h-6 animate-pulse" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Book Counselling Session
                </>
              )}
            </button>
            {status === "success" && (
              <div className="fun-box-green text-white text-center p-4">
                <p className="text-xl font-bold flex items-center justify-center gap-3 relative z-10">
                  <CheckCircle className="w-8 h-8" />
                  Thank you! We&apos;ll be in touch soon!
                </p>
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-500 text-white text-center p-4 rounded-2xl">
                <p className="text-lg font-bold">Oops! Something went wrong. Please try again!</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

