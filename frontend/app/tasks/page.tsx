"use client";

import { Filter, MoreHorizontal, Plus, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";
import Link from "next/link";

export default function TasksPage() {
  const { activeOrganizationId } = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const { data: tasksRes, isLoading } = useQuery({
    queryKey: ['tasks', activeOrganizationId],
    queryFn: () => api.tasks.listAll(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const rawTasks = tasksRes?.data?.data || tasksRes?.data || [];
  const allTasks = Array.isArray(rawTasks) ? rawTasks : [];

  const filteredTasks = allTasks.filter((t: any) => {
    const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase());
    const statusLabel = t.status.replace(/_/g, ' ');
    const matchesFilter = filter === "All" || statusLabel.toLowerCase() === filter.toLowerCase();
    return matchesQuery && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-emerald-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'IN_REVIEW': return 'bg-amber-500';
      case 'BLOCKED': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <WorkspaceShell title="Tasks">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Tasks</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Your team's work, organized by priority and momentum.</p>
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700">
            <Plus size={17} />New task
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total tasks</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allTasks.length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72">
              <Search size={15} className="text-muted-foreground" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search tasks" 
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {["All", "TODO", "IN PROGRESS", "IN REVIEW", "DONE"].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => setFilter(item)} 
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${filter === item ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button className="rounded-lg border p-2 text-muted-foreground hover:bg-muted" aria-label="Filter">
                <Filter size={15} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Project</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredTasks.map((row: any) => {
                  const statusLabel = row.status.replace(/_/g, ' ');
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30 cursor-pointer">
                      <td className="px-5 py-4">
                        <Link href={`/tasks/${row.id}`} className="flex items-center gap-3">
                          <span className={`size-2.5 rounded-full ${getStatusColor(row.status)}`} />
                          <div>
                            <p className="font-semibold hover:underline">{row.title}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {row.project?.name || "Unknown"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {row.priority}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.updatedAt), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && filteredTasks.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No tasks found.</div>
            )}
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}