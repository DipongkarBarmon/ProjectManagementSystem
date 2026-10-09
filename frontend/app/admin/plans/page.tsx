/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2, Plus, Edit } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { format } from "date-fns";

export default function AdminPlansPage() {
  const { data: plansRes, isLoading } = useQuery({
    queryKey: ['admin_plans'],
    queryFn: () => api.admin.plans.list ? api.admin.plans.list() : Promise.resolve({ data: [] }), // Fallback just in case
  });

  const rawPlans = plansRes?.data?.data || plansRes?.data || [];
  const allPlans = Array.isArray(rawPlans) ? rawPlans : [];

  return (
    <AdminShell title="Plans">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-600">Billing</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Plans</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Configure subscription tiers and limits.</p>
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700">
            <Plus size={17} />Create Plan
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total plans</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allPlans.length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Plan Name</th>
                  <th className="px-5 py-3 font-semibold">Price (Monthly)</th>
                  <th className="px-5 py-3 font-semibold">Member Limit</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : allPlans.map((row: any) => {
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">{row.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium">
                        ৳{row.price}
                      </td>
                      <td className="px-5 py-4">
                        {row.memberLimit === -1 ? 'Unlimited' : row.memberLimit}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-4 text-right">
                         <button className="rounded-md p-1.5 text-muted-foreground opacity-0 hover:bg-muted group-hover:opacity-100" aria-label="Edit plan">
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && allPlans.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No plans found.</div>
            )}
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
