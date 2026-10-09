"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Your payment could not be completed.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171717] px-6 text-white">
      <section className="w-full max-w-lg rounded-3xl bg-[#212121] p-8 text-center shadow-2xl sm:p-12">
        <XCircle className="mx-auto h-20 w-20 text-red-400" strokeWidth={1.5} />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-red-400">Payment failed</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Your plan was not changed</h1>
        <p className="mt-4 text-zinc-400">{message} No plan was activated. Please try the payment again.</p>
        <Link href="/settings" className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90">
          Return to settings
        </Link>
      </section>
    </main>
  );
}
