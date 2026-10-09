"use client";

import { Filter, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { format } from "date-fns";

export default function AdminSubscriptionsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const { data: subsRes, isLoading } = useQuery({
    queryKey: ['admin_subscriptions'],
    queryFn: () => api.admin.subscriptions ? api.admin.subscriptions() : Promise.resolve({ data: [] }),
  });

  const rawSubs = subsRes?.data?.data || subsRes?.data || [];
  const allSubs = Array.isArray(rawSubs) ? rawSubs : [];

  const filteredSubs = allSubs.filter((s: any) => {
    const orgName = s.organization?.name || "";
    const matchesQuery = orgName.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || s.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <AdminShell title="Subscriptions">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-600">Billing</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Subscriptions</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Monitor organization subscriptions and renewals.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Active Subscriptions</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allSubs.filter((s: any) => s.status === 'ACTIVE').length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72">
              <Search size={15} className="text-muted-foreground" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search organizations" 
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {["All", "ACTIVE", "CANCELED", "EXPIRED", "PAST_DUE"].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => setFilter(item)} 
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${filter === item ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                  >
                    {item.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
              <button className="rounded-lg border p-2 text-muted-foreground hover:bg-muted" aria-label="Filter">
                <Filter size={15} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Organization</th>
                  <th className="px-5 py-3 font-semibold">Plan</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Started</th>
                  <th className="px-5 py-3 font-semibold">Ends</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredSubs.map((row: any) => {
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">{row.organization?.name || "Unknown"}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                         <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {row.plan?.name || "Free"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${row.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300'}`}>
                          {row.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {row.startDate ? format(new Date(row.startDate), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {row.endDate ? format(new Date(row.endDate), 'MMM d, yyyy') : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && filteredSubs.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No subscriptions found.</div>
            )}
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
