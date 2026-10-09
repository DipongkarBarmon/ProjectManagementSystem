/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { format } from "date-fns";

export default function AdminActivityPage() {
  const { data: activityRes, isLoading } = useQuery({
    queryKey: ['admin_activity'],
    queryFn: () => api.admin.activity.list(),
  });

  const rawActivity = activityRes?.data?.data || activityRes?.data || [];
  const allActivity = Array.isArray(rawActivity) ? rawActivity : [];

  return (
    <AdminShell title="Activity Logs">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-600">Platform</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Global Activity Logs</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Audit trail for the entire platform.</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                  <th className="px-5 py-3 font-semibold">Entity</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : allActivity.map((row: any) => {
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-primary">{row.actor?.name || "Unknown"}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                         <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {row.action}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {row.entityType} ({row.entityId.substring(0, 8)}...)
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {row.description}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.createdAt), 'MMM d, yyyy h:mm a')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && allActivity.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No activity logs found.</div>
            )}
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
