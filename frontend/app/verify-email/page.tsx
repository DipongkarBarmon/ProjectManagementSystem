"use client";

import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api-client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try { const result = await api.auth.verifyEmail({ email, otp }); localStorage.setItem("taskflow_session", JSON.stringify(result.data ?? { authenticated: true })); router.push("/onboarding"); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Verification failed."); }
    finally { setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10"><div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300"><Mail size={21} /></div><h1 className="mt-5 text-2xl font-semibold tracking-tight">Verify your email</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">We sent a six-digit code to finish creating your TaskFlow account.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-medium">Email address<input required value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></label><label className="block text-sm font-medium">Verification code<input required value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" maxLength={6} className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-center text-lg tracking-[0.3em] outline-none focus:ring-2 focus:ring-primary/30" placeholder="000000" /></label>{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p>}<button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-blue-700 disabled:opacity-60">{loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}Verify email <ArrowRight size={16} /></button></form><Link href="/login" className="mt-6 block text-center text-xs font-medium text-primary hover:underline">Back to sign in</Link></div></main>;
}