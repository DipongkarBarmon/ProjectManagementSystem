"use client";

import { Filter, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { format } from "date-fns";

export default function AdminOrganizationsPage() {
  const [query, setQuery] = useState("");

  const { data: orgsRes, isLoading } = useQuery({
    queryKey: ['admin_organizations'],
    queryFn: () => api.admin.organizations.list(),
  });

  const rawOrgs = orgsRes?.data?.data || orgsRes?.data || [];
  const allOrgs = Array.isArray(rawOrgs) ? rawOrgs : [];

  const filteredOrgs = allOrgs.filter((o: any) => {
    return o.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <AdminShell title="Organizations">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-600">Management</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Organizations</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Monitor and manage all tenant organizations.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total organizations</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allOrgs.length}</p>
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
              <button className="rounded-lg border p-2 text-muted-foreground hover:bg-muted" aria-label="Filter">
                <Filter size={15} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Subscription Plan</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredOrgs.map((row: any) => {
                  const planName = row.subscription?.plan?.name || "Free Trial";
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {row.name.substring(0, 2).toUpperCase()}
                          </span>
                          <p className="font-semibold">{row.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {planName}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.createdAt), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && filteredOrgs.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No organizations found.</div>
            )}
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
