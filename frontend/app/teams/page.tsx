/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter, MoreHorizontal, Plus, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";

export default function TeamsPage() {
  const { activeOrganizationId } = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const { data: teamsRes, isLoading } = useQuery({
    queryKey: ['teams', activeOrganizationId],
    queryFn: () => api.teams.list(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const rawTeams = teamsRes?.data?.data || teamsRes?.data || [];
  const allTeams = Array.isArray(rawTeams) ? rawTeams : [];

  const filteredTeams = allTeams.filter((t: any) => {
    const matchesQuery = t.name.toLowerCase().includes(query.toLowerCase());
    return matchesQuery; // We can add filter logic later if needed
  });

  return (
    <WorkspaceShell title="Teams">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Teams</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Build clear ownership around the work that matters.</p>
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700">
            <Plus size={17} />New team
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total teams</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allTeams.length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72">
              <Search size={15} className="text-muted-foreground" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search teams" 
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
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold">Members</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredTeams.map((row: any) => {
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`size-2.5 rounded-full bg-violet-600`} />
                          <p className="font-semibold">{row.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {row.description || "No description"}
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {row.teamMembers?.length || 0} members
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="rounded-md p-1.5 text-muted-foreground opacity-0 hover:bg-muted group-hover:opacity-100" aria-label={`More options for ${row.name}`}>
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && filteredTeams.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No teams found.</div>
            )}
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}