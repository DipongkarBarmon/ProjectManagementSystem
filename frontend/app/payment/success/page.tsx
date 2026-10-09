"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Your payment was completed successfully.";
  const planName = searchParams.get("plan") || "Pro";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171717] px-6 text-white">
      <section className="w-full max-w-lg rounded-3xl bg-[#212121] p-8 text-center shadow-2xl sm:p-12">
        <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-400" strokeWidth={1.5} />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Payment successful</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome to TaskFlow {planName}</h1>
        <p className="mt-4 text-zinc-400">{message} Your organization has been upgraded and your {planName} features are now available.</p>
        <Link href="/settings" className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90">
          Enjoy {planName}
        </Link>
      </section>
    </main>
  );
}
