/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowUpRight, CreditCard, DollarSign, ShieldCheck, Users, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import Link from "next/link";

export default function AdminPage() {
  const { data: orgsRes, isLoading: isLoadingOrgs } = useQuery({
    queryKey: ['admin_organizations'],
    queryFn: () => api.admin.organizations.list(),
  });

  const { data: subsRes, isLoading: isLoadingSubs } = useQuery({
    queryKey: ['admin_subscriptions'],
    queryFn: () => api.admin.subscriptions(),
  });

  const { data: paymentsRes, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['admin_payments'],
    queryFn: () => api.admin.payments(),
  });

  const isLoading = isLoadingOrgs || isLoadingSubs || isLoadingPayments;

  const orgs = orgsRes?.data?.data || orgsRes?.data || [];
  const orgsArray = Array.isArray(orgs) ? orgs : [];
  
  const subs = subsRes?.data?.data || subsRes?.data || [];
  const subsArray = Array.isArray(subs) ? subs : [];
  
  const payments = paymentsRes?.data?.data || paymentsRes?.data || [];
  const paymentsArray = Array.isArray(payments) ? payments : [];

  const pendingPaymentsCount = paymentsArray.filter((p: any) => p.status === 'PENDING').length;
  const activeSubsCount = subsArray.filter((s: any) => s.status === 'ACTIVE').length;
  
  // Calculate revenue from SUCCESS payments
  const totalRevenue = paymentsArray
    .filter((p: any) => p.status === 'SUCCESS')
    .reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);

  const recentPayments = [...paymentsArray]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminShell title="Overview">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-600">Platform control</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Admin overview</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Monitor plans, subscriptions, and payment activity.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            <ShieldCheck size={14} /> Super admin
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-card p-5">
            <DollarSign size={18} className="text-emerald-600" />
            <p className="mt-4 text-xs text-muted-foreground">Total revenue</p>
            <p className="mt-1 text-2xl font-semibold">
              {isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : `৳${totalRevenue.toLocaleString()}`}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <Users size={18} className="text-blue-600" />
            <p className="mt-4 text-xs text-muted-foreground">Active organizations</p>
            <p className="mt-1 text-2xl font-semibold">
              {isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : orgsArray.length}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <CreditCard size={18} className="text-violet-600" />
            <p className="mt-4 text-xs text-muted-foreground">Active subscriptions</p>
            <p className="mt-1 text-2xl font-semibold">
              {isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : activeSubsCount}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <ShieldCheck size={18} className="text-amber-600" />
            <p className="mt-4 text-xs text-muted-foreground">Pending payments</p>
            <p className="mt-1 text-2xl font-semibold">
              {isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : pendingPaymentsCount}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-semibold">Recent payments</h2>
                <p className="mt-1 text-xs text-muted-foreground">Latest platform transactions</p>
              </div>
              <Link href="/admin/payments" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="divide-y">
              {isLoading ? (
                <div className="p-12 text-center flex justify-center">
                  <Loader2 size={24} className="animate-spin text-muted-foreground" />
                </div>
              ) : recentPayments.length > 0 ? (
                recentPayments.map((p: any) => {
                  const name = p.organization?.name || "Unknown";
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-5 py-4">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                        {name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">৳{p.amount}</p>
                        <p className={`mt-0.5 text-[11px] ${p.status === "PENDING" ? "text-amber-600" : p.status === "SUCCESS" ? "text-emerald-600" : "text-red-600"}`}>
                          {p.status}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">No recent payments.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AdminShell>
  );
}