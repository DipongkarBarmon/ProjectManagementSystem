"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type BillingPlan } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [interval, setInterval] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [submittingPlanId, setSubmittingPlanId] = useState<string | null>(null);
  const { activeOrganizationId } = useWorkspaceStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["available-billing-plans"],
    queryFn: () => api.billing.availablePlans(),
    enabled: isOpen,
  });

  const plans = data?.data ?? [];

  const formatPrice = (plan: BillingPlan) => {
    const amount = Number(interval === "YEARLY" ? plan.priceYearly : plan.priceMonthly);
    if (plan.currency === "BDT") {
      return `৳${amount.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
    }
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: plan.currency || "BDT",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  async function startCheckout(plan: BillingPlan) {
    if (!activeOrganizationId) {
      window.alert("Select an organization before upgrading.");
      return;
    }

    const amount = Number(interval === "YEARLY" ? plan.priceYearly : plan.priceMonthly);
    if (amount <= 0) return;

    setSubmittingPlanId(plan.id);
    try {
      const response = await api.billing.upgrade(activeOrganizationId, {
        planId: plan.id,
        interval,
      });
      window.location.assign(response.data.bkashURL);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to start bKash checkout.");
      setSubmittingPlanId(null);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#171717] text-white">
      <div className="flex justify-end p-6">
        <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close upgrade dialog">
          <X size={24} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20 sm:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Choose a TaskFlow plan</h1>
          <p className="mt-4 text-base text-zinc-400">All prices are managed by your platform administrator and charged in Bangladeshi Taka through bKash.</p>
          <div className="mx-auto mt-8 flex w-fit items-center rounded-full bg-[#212121] p-1">
            <button onClick={() => setInterval("MONTHLY")} className={`rounded-full px-8 py-2 text-sm font-medium ${interval === "MONTHLY" ? "bg-[#333333] text-white" : "text-zinc-400 hover:text-white"}`}>Monthly</button>
            <button onClick={() => setInterval("YEARLY")} className={`rounded-full px-8 py-2 text-sm font-medium ${interval === "YEARLY" ? "bg-[#333333] text-white" : "text-zinc-400 hover:text-white"}`}>Yearly</button>
          </div>
        </div>

        {isLoading && <p className="mx-auto mt-12 max-w-4xl text-center text-zinc-400">Loading plans...</p>}
        {isError && <p className="mx-auto mt-12 max-w-4xl text-center text-red-300">Unable to load plans. Please try again.</p>}
        {!isLoading && !isError && (
          <div className="mx-auto mt-12 grid max-w-[1200px] gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const amount = Number(interval === "YEARLY" ? plan.priceYearly : plan.priceMonthly);
              const isFree = amount <= 0;
              return (
                <div key={plan.id} className="flex flex-col rounded-2xl bg-[#212121] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{plan.name}</h2>
                    {plan.name.toUpperCase() === "PRO" && <span className="rounded-full bg-blue-600/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">Recommended</span>}
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">{plan.description || `${plan.name} plan`}</h3>
                  <p className="mb-6 min-h-[60px] text-sm text-zinc-400">Flexible workspace limits and collaboration tools for your organization.</p>
                  <button onClick={() => startCheckout(plan)} disabled={isFree || submittingPlanId !== null} className="mb-6 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                    {submittingPlanId === plan.id && <Loader2 size={16} className="animate-spin" />}
                    {submittingPlanId === plan.id ? "Opening bKash..." : isFree ? "Included plan" : `Pay with bKash`}
                  </button>
                  <div className="mb-8 flex items-baseline">
                    <span className="text-4xl font-bold">{formatPrice(plan)}</span>
                    <span className="text-zinc-400">/{interval === "YEARLY" ? "year" : "month"}</span>
                  </div>
                  <ul className="flex flex-col gap-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-3"><Check size={18} className="shrink-0 text-zinc-400" /><span>{plan.maxProjects === null ? "Unlimited" : plan.maxProjects} projects</span></li>
                    <li className="flex items-start gap-3"><Check size={18} className="shrink-0 text-zinc-400" /><span>{plan.maxMembers === null ? "Unlimited" : plan.maxMembers} members</span></li>
                    <li className="flex items-start gap-3"><Check size={18} className="shrink-0 text-zinc-400" /><span>{plan.maxTeams === null ? "Unlimited" : plan.maxTeams} teams</span></li>
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
