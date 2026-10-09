/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Mail, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export function PasswordRecoveryForm({ reset = false }: { reset?: boolean }) {
  const [step, setStep] = useState(reset ? 2 : 1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setMessage("");
    try { await api.auth.forgotPassword(email); setMessage("Reset code sent. Check your email, then enter it below."); setStep(2); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "The reset code could not be sent."); }
    finally { setLoading(false); }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setMessage("");
    try { 
      await api.auth.resetPassword({ email, otp, newPassword }); 
      setMessage("Password reset successfully. You can sign in now."); 
      toast.success("Password reset successfully!");
    }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "The password could not be reset."); }
    finally { setLoading(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-5 sm:py-10"><div className="w-full max-w-md"><Link href="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground sm:mb-8"><ArrowLeft size={16} />Back to sign in</Link><div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8"><div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300">{step === 2 ? <ShieldCheck size={21} /> : <Mail size={21} />}</div><div className="mt-5 flex items-center justify-between gap-3"><div><h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{step === 2 ? "Enter your reset code" : "Forgot your password?"}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{step === 2 ? "Use the OTP from your email and choose a new password." : "Enter your email and we will send you a secure reset code."}</p></div><span className="shrink-0 text-xs font-semibold text-muted-foreground">{step}/2</span></div>{step === 1 ? <form onSubmit={sendCode} className="mt-7 space-y-4"><label className="block text-sm font-medium">Email address<input required value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@company.com" /></label><button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-blue-700 disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}Send reset code<ArrowRight size={16} /></button></form> : <form onSubmit={resetPassword} className="mt-7 space-y-4"><label className="block text-sm font-medium">Email address<input required value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@company.com" /></label><label className="block text-sm font-medium">Verification code<input required value={otp} onChange={(event) => setOtp(event.target.value)} name="otp" inputMode="numeric" maxLength={6} className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-center text-lg tracking-[0.3em] outline-none focus:ring-2 focus:ring-primary/30" placeholder="000000" /></label><label className="block text-sm font-medium">New password<div className="relative mt-2"><input required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} name="newPassword" type={showPassword ? "text" : "password"} className="h-11 w-full rounded-lg border bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Use 8+ characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label><button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-blue-700 disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}Reset password<ArrowRight size={16} /></button><button type="button" onClick={() => { setStep(1); setMessage(""); setError(""); }} className="w-full text-xs font-medium text-primary hover:underline">Use a different email</button></form>}{error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p>}{message && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{message}</p>}<div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Zap size={13} className="text-primary" />TaskFlow account security</div></div></div></main>;
}