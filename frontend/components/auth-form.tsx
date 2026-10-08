"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ArrowRight, Eye, EyeOff, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/api-client";

function GoogleSignIn({ onError, onSuccess }: { onError: (message: string) => void; onSuccess: (token: string) => void }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) return <button type="button" onClick={() => onError("Google sign-in is not configured yet. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to frontend/.env.local.")} className="mt-4 flex h-11 w-full items-center justify-center gap-3 rounded-lg border bg-card text-sm font-semibold hover:bg-muted"><span className="text-base font-bold text-red-500">G</span>Continue with Google</button>;
  return <GoogleOAuthProvider clientId={clientId}><div className="mt-4 flex justify-center"><GoogleLogin onSuccess={(response) => response.credential ? onSuccess(response.credential) : onError("Google did not return an identity token.")} onError={() => onError("Google sign-in could not be completed.")} /></div></GoogleOAuthProvider>;
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isLogin = mode === "login";

  function completeAuth(data: unknown) {
    localStorage.setItem("taskflow_session", JSON.stringify(data ?? { authenticated: true }));
    let role = "USER";
    if (typeof data === "object" && data !== null && "user" in data) {
      const userData = (data as any).user;
      if (userData && typeof userData.platformRole === "string") {
        role = userData.platformRole;
      }
    }
    router.push(role === "SUPER_ADMIN" ? "/admin" : "/dashboard");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    try {
      if (isLogin) {
        const result = await api.auth.login(payload);
        completeAuth(result.data);
      } else {
        const result = await api.auth.register(formData);
        router.push(`/verify-email?email=${encodeURIComponent(payload.email)}`);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(token: string) {
    setLoading(true);
    setError("");
    try { const result = await api.auth.google(token); completeAuth(result.data); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Google sign-in failed."); } finally { setLoading(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-5 sm:py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap size={17} fill="currentColor" />
            </span>
            TaskFlow
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-primary">Welcome to TaskFlow</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{isLogin ? "Sign in to your workspace" : "Create your workspace account"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{isLogin ? "Continue where your team left off." : "Start organizing your work in minutes."}</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-medium">{isLogin ? "Email address" : "Name"}<input required name={isLogin ? "email" : "name"} type={isLogin ? "email" : "text"} autoComplete={isLogin ? "email" : "name"} className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder={isLogin ? "you@company.com" : "Your name"} /></label>
            {!isLogin && <label className="block text-sm font-medium">Email address<input required name="email" type="email" autoComplete="email" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@company.com" /></label>}
            {!isLogin && <label className="block text-sm font-medium">Avatar<input name="avatar" type="file" accept="image/*" className="mt-2 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-background" /></label>}
            <label className="block text-sm font-medium">Password<div className="relative mt-2"><input required name="password" type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"} className="h-11 w-full rounded-lg border bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Use 8+ characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
            {isLogin && <div className="flex justify-end"><Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link></div>}
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p>}
            <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-blue-700 disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}{isLogin ? "Sign in" : "Create account"}<ArrowRight size={16} /></button>
          </form>
          <GoogleSignIn onError={setError} onSuccess={handleGoogle} />
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && <div className="my-5 flex items-center gap-3 text-[11px] text-muted-foreground"><span className="h-px flex-1 bg-border" />or continue with Google<span className="h-px flex-1 bg-border" /></div>}
          <p className="mt-7 text-center text-sm text-muted-foreground">{isLogin ? "New to TaskFlow?" : "Already have an account?"} <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-primary hover:underline">{isLogin ? "Create an account" : "Sign in"}</Link></p>
        </div>
      </div>
    </main>
  );
}