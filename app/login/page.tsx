"use client";

import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { BrandLockup } from "@/components/site/Brand";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Incorrect email or password.");
      setBusy(false);
      return;
    }
    const session = await getSession();
    const role = session?.user?.role;
    const from = params.get("from");
    const home = role === "ADMIN" ? "/admin" : role === "TEACHER" ? "/teacher" : "/student";
    router.push(from && from.startsWith(home) ? from : home);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full">
        <LogIn className="h-4 w-4" />
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm">
        <Link href="/forgot-password" className="font-semibold text-green-700 hover:underline">
          Forgotten your password?
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLockup />
        </div>
        <div className="card p-8">
          <h1 className="mb-1 text-center text-2xl">Portal sign in</h1>
          <p className="mb-6 text-center text-sm text-ink-soft">
            Students, teachers and admin sign in here.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">
          Not enrolled yet?{" "}
          <Link href="/enrol" className="font-bold text-green-700 hover:underline">
            Enrol now
          </Link>{" "}
          or{" "}
          <Link href="/assessment" className="font-bold text-green-700 hover:underline">
            book a free assessment
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
