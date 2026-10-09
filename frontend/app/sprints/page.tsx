"use client";

import { Filter, MoreHorizontal, Plus, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";

export default function SprintsPage() {
  const { activeOrganizationId } = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', activeOrganizationId],
    queryFn: () => api.projects.list(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const allProjects = Array.isArray(projectsRes?.data?.data || projectsRes?.data) ? (projectsRes?.data?.data || projectsRes?.data) : [];

  useEffect(() => {
    if (allProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(allProjects[0].id);
    }
  }, [allProjects, selectedProjectId]);

  const { data: sprintsRes, isLoading: sprintsLoading } = useQuery({
    queryKey: ['sprints', activeOrganizationId, selectedProjectId],
    queryFn: () => api.sprints.list(activeOrganizationId!, selectedProjectId),
    enabled: !!activeOrganizationId && !!selectedProjectId
  });

  const rawSprints = sprintsRes?.data?.data || sprintsRes?.data || [];
  const allSprints = Array.isArray(rawSprints) ? rawSprints : [];

  const filteredSprints = allSprints.filter((s: any) => {
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
    const statusLabel = s.status ? s.status.replace(/_/g, ' ') : '';
    const matchesFilter = filter === "All" || statusLabel.toLowerCase() === filter.toLowerCase();
    return matchesQuery && matchesFilter;
  });

  return (
    <WorkspaceShell title="Sprints">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Sprints</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Plan a realistic slice of work and finish it together.</p>
          </div>
          <button 
            disabled={!selectedProjectId}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={17} />New sprint
          </button>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <label className="text-sm font-medium">Select Project:</label>
          <select 
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={projectsLoading || allProjects.length === 0}
          >
            <option value="" disabled>Select a project</option>
            {allProjects.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {projectsLoading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72">
              <Search size={15} className="text-muted-foreground" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search sprints" 
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
                disabled={!selectedProjectId}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {["All", "PLANNED", "ACTIVE", "COMPLETED"].map((item) => (
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
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Timeline</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y">
                {sprintsLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredSprints.map((row: any) => {
                  const statusLabel = row.status ? row.status.replace(/_/g, ' ') : 'PLANNED';
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`size-2.5 rounded-full bg-amber-500`} />
                          <div>
                            <p className="font-semibold">{row.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{row.goal || "No goal specified"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {row.startDate ? format(new Date(row.startDate), 'MMM d') : '?'} - {row.endDate ? format(new Date(row.endDate), 'MMM d, yyyy') : '?'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
                          {statusLabel}
                        </span>
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
            {!sprintsLoading && (!selectedProjectId || filteredSprints.length === 0) && (
              <div className="p-12 text-center text-sm text-muted-foreground">
                {!selectedProjectId ? "Select a project to view its sprints." : "No sprints found."}
              </div>
            )}
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}