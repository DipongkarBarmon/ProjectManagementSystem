/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter, Plus, Search, Loader2, Pencil, Trash2, UserRoundCog, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ProjectsPage() {
  const { activeOrganizationId, organizations } = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [managedProjectId, setManagedProjectId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [assignedTeams, setAssignedTeams] = useState<Record<string, any[]>>({});
  const [assignedManagers, setAssignedManagers] = useState<Record<string, any>>({});
  const [showManagerField, setShowManagerField] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", startDate: "", endDate: "", status: "PLANNING" });
  const queryClient = useQueryClient();
  const teamStorageKey = activeOrganizationId ? `project-teams:${activeOrganizationId}` : "";

  useEffect(() => {
    if (!teamStorageKey) return;
    try {
      const saved = window.localStorage.getItem(teamStorageKey);
      if (saved) {
        // Hydrate the assignment shown in the table from the browser cache.
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAssignedTeams(Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, Array.isArray(value) ? value : value ? [value] : []])));
      }
    } catch {
      // Ignore invalid local project-team cache and use the server data.
    }
  }, [teamStorageKey]);
  const managerStorageKey = activeOrganizationId ? `project-managers:${activeOrganizationId}` : "";
  useEffect(() => {
    if (!managerStorageKey) return;
    try {
      const saved = window.localStorage.getItem(managerStorageKey);
      if (saved) {
        // Hydrate the manager shown in the table from the browser cache.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAssignedManagers(JSON.parse(saved));
      }
    } catch {
      // Ignore invalid local manager cache.
    }
  }, [managerStorageKey]);

  const { data: projectsRes, isLoading } = useQuery({
    queryKey: ['projects', activeOrganizationId],
    queryFn: () => api.projects.list(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });
  const { data: membersRes } = useQuery({
    queryKey: ["organization-members", activeOrganizationId],
    queryFn: () => api.members.list(activeOrganizationId!),
    enabled: !!activeOrganizationId,
  });
  const { data: teamsRes } = useQuery({
    queryKey: ["teams", activeOrganizationId],
    queryFn: () => api.teams.list(activeOrganizationId!, { limit: 100 }),
    enabled: !!activeOrganizationId,
  });
  const organizationMembers = membersRes?.data?.data || membersRes?.data || [];
  const teamPayload = teamsRes?.data;
  const teams = Array.isArray(teamPayload)
    ? teamPayload
    : Array.isArray(teamPayload?.data)
      ? teamPayload.data
      : Array.isArray(teamsRes?.data?.data)
        ? teamsRes.data.data
        : [];
  const activeOrganization = organizations.find((organization) => organization.id === activeOrganizationId);
  const memberOrganization = organizationMembers.find((member: any) => member.organization?.id === activeOrganizationId)?.organization;
  const activeOrganizationName = activeOrganization?.name || memberOrganization?.name || "Current organization";
  const { data: managedProjectRes, isLoading: isManagedProjectLoading } = useQuery({
    queryKey: ["project", activeOrganizationId, managedProjectId],
    queryFn: () => api.projects.get(activeOrganizationId!, managedProjectId!),
    enabled: !!activeOrganizationId && !!managedProjectId,
  });
  const managedProject = managedProjectRes?.data;
  const projectMembers = managedProject?.projectMembers || [];
  const projectTeams = managedProjectId ? assignedTeams[managedProjectId] || [] : [];
  const selectedTeam = projectTeams.find((team: any) => team.id === selectedTeamId) || projectTeams[0];

  const projectActionMutation = useMutation({
    mutationFn: async ({ memberId }: { memberId: string }) => {
      return api.projects.assignManager(activeOrganizationId!, managedProjectId!, memberId);
    },
    onSuccess: () => {
      toast.success("Project manager assigned");
      const manager = managerCandidates.find((member: any) => (member.user?.id || member.userId) === selectedMemberId);
      if (managedProjectId && manager) {
        setAssignedManagers((current) => {
          const next = { ...current, [managedProjectId]: manager.user || manager };
          if (managerStorageKey) window.localStorage.setItem(managerStorageKey, JSON.stringify(next));
          return next;
        });
      }
      setSelectedMemberId("");
      queryClient.invalidateQueries({ queryKey: ["project", activeOrganizationId, managedProjectId] });
      queryClient.invalidateQueries({ queryKey: ["projects", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const assignTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      const response = await api.teams.get(activeOrganizationId!, teamId);
      const teamPayload = response?.data;
      const team = teamPayload?.data || teamPayload;
      const teamMembers = Array.isArray(team?.members)
        ? team.members
        : Array.isArray(team?.teamMembers)
          ? team.teamMembers
          : [];
      const userIds = teamMembers
        .map((member: any) => member.userId || member.user?.id || member.id)
        .filter(Boolean);
      const existingMemberIds = new Set(projectMembers.map((member: any) => member.userId || member.user?.id));
      const newUserIds = userIds.filter((userId: string) => !existingMemberIds.has(userId));
      await Promise.all(newUserIds.map((userId: string) => api.projects.addMember(activeOrganizationId!, managedProjectId!, userId)));
      return { count: newUserIds.length, team };
    },
    onSuccess: ({ count, team }) => {
      toast.success(count ? `${count} team member${count === 1 ? "" : "s"} assigned` : "This team has no members");
      if (managedProjectId) {
        setAssignedTeams((current) => {
          const currentTeams = current[managedProjectId] || [];
          const next = {
            ...current,
            [managedProjectId]: currentTeams.some((item: any) => item.id === team.id)
              ? currentTeams
              : [...currentTeams, team],
          };
          if (teamStorageKey) window.localStorage.setItem(teamStorageKey, JSON.stringify(next));
          return next;
        });
      }
      setSelectedTeamId("");
      queryClient.invalidateQueries({ queryKey: ["project", activeOrganizationId, managedProjectId] });
      queryClient.invalidateQueries({ queryKey: ["projects", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const managerCandidates = organizationMembers.filter((member: any) =>
    member.organizationRole === "PROJECT_MANAGER"
  );
  const roleLabel = (role?: string) => (role || "MEMBER").replace(/_/g, " ");
  const getTeamMemberUser = (member: any) => member.user || member;

  const rawProjects = projectsRes?.data?.data || projectsRes?.data || [];
  const allProjects = Array.isArray(rawProjects) ? rawProjects : [];

  const filteredProjects = allProjects.filter((p: any) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const statusLabel = p.status.replace(/_/g, ' ');
    const matchesFilter = filter === "All" || statusLabel.toLowerCase() === filter.toLowerCase();
    return matchesQuery && matchesFilter;
  });

  const activeProjectsCount = allProjects.filter((p: any) => p.status !== 'ARCHIVED').length;
  const maxProjects = activeOrganization?.subscription?.plan?.maxProjects ?? null;
  const projectLimitReached = maxProjects !== null && activeProjectsCount >= maxProjects;

  const createMutation = useMutation({
    mutationFn: () => api.projects.create(activeOrganizationId!, {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
    }),
    onSuccess: () => {
      toast.success("Project created");
      setForm({ name: "", description: "", startDate: "", endDate: "", status: "PLANNING" });
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["projects", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: (projectId: string) => api.projects.delete(activeOrganizationId!, projectId),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: () => api.projects.update(activeOrganizationId!, editingProject.id, {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      status: form.status,
    }),
    onSuccess: () => {
      toast.success("Project updated");
      setEditingProject(null);
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["projects", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function openEdit(project: any) {
    setEditingProject(project);
    setForm({
      name: project.name || "",
      description: project.description || "",
      startDate: project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : "",
      endDate: project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : "",
      status: project.status || "PLANNING",
    });
    setIsCreateOpen(true);
  }

  function openManage(projectId: string) {
    setManagedProjectId(projectId);
    setSelectedMemberId("");
    setSelectedTeamId("");
    setShowManagerField(false);
  }

  return (
    <WorkspaceShell title="Projects">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Projects</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Keep every initiative visible, focused, and moving forward.</p>
          </div>
          <button disabled={projectLimitReached} onClick={() => setIsCreateOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            <Plus size={17} />New project
          </button>
        </div>
        {projectLimitReached && <p className="mt-3 text-sm text-amber-600">Your {activeOrganization?.subscription?.plan?.name || "Free"} plan allows up to {maxProjects} active projects. Upgrade to create more.</p>}

        {isCreateOpen && (
          <form onSubmit={(event) => { event.preventDefault(); if (editingProject) updateMutation.mutate(); else createMutation.mutate(); }} className="mt-6 rounded-xl border bg-card p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">Project name
                <input name="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter project name" className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground" />
              </label>
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">Description
                <textarea name="description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe this project" rows={3} className="resize-y rounded-lg border bg-background px-3 py-2 text-sm text-foreground" />
              </label>
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">Start date
                <input name="startDate" type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground" />
              </label>
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">End date
                <input name="endDate" type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground" />
              </label>
              {editingProject && <label className="grid gap-1 text-xs font-medium text-muted-foreground">Status
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground">
                  <option value="PLANNING">Planning</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => { setIsCreateOpen(false); setEditingProject(null); }} className="rounded-lg border px-3 py-2 text-sm">Cancel</button>
              <button disabled={createMutation.isPending || updateMutation.isPending} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{createMutation.isPending || updateMutation.isPending ? "Saving..." : editingProject ? "Save changes" : "Create project"}</button>
            </div>
          </form>
        )}

        {managedProjectId && (
          <section className="mt-6 rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="font-semibold">Project team</h2><p className="mt-1 text-sm text-muted-foreground">Assign a team and manager for <span className="font-medium text-foreground">{activeOrganizationName}</span>.</p></div>
              <button onClick={() => setManagedProjectId(null)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close project members"><X size={16} /></button>
            </div>
            {isManagedProjectLoading ? <Loader2 className="mt-5 animate-spin text-muted-foreground" size={20} /> : (
              <>
                {showManagerField && <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <select name="projectManager" value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)} className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm">
                    <option value="">Select project manager</option>
                    {managerCandidates.map((member: any) => {
                      const user = member.user || member;
                      return <option key={user.id} value={user.id}>{user.name || user.email} ({roleLabel(member.organizationRole)})</option>;
                    })}
                  </select>
                  <button disabled={!selectedMemberId || projectActionMutation.isPending} onClick={() => projectActionMutation.mutate({ memberId: selectedMemberId })} className="inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"><UserRoundCog size={15} /> Assign manager</button>
                </div>}
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <select value={selectedTeamId} onChange={(event) => setSelectedTeamId(event.target.value)} className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm">
                    <option value="">Select another team to assign</option>
                    {teams.filter((team: any) => !projectTeams.some((assigned: any) => assigned.id === team.id)).map((team: any) => <option key={team.id} value={team.id}>{team.name}</option>)}
                  </select>
                  <button disabled={!selectedTeamId || assignTeamMutation.isPending} onClick={() => assignTeamMutation.mutate(selectedTeamId)} className="inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"><Users size={15} /> {assignTeamMutation.isPending ? "Assigning..." : "Assign team"}</button>
                </div>
                {projectTeams.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{projectTeams.map((team: any) => <button key={team.id} type="button" onClick={() => setSelectedTeamId(team.id)} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20">{team.name}</button>)}</div>}
                <div className="mt-4 divide-y rounded-lg border">
                  {(selectedTeam?.members || projectMembers).length === 0 ? <p className="p-4 text-sm text-muted-foreground">No team members assigned yet.</p> : (selectedTeam?.members || projectMembers).map((member: any) => {
                    const teamUser = getTeamMemberUser(member);
                    const teamUserId = member.userId || teamUser.id;
                    const organizationMember = organizationMembers.find((item: any) => (item.user?.id || item.userId) === member.userId);
                    const isManager = assignedManagers[managedProjectId || ""]?.id === teamUserId;
                    return <div key={teamUserId} className="flex items-center justify-between gap-3 p-3"><div><p className="text-sm font-medium">{teamUser.name || teamUser.email || "Member"}</p><p className="text-xs text-muted-foreground">{teamUser.email}</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">{isManager ? "MANAGER" : roleLabel(organizationMember?.organizationRole || member.organizationRole)}</span></div></div>;
                  })}
                </div>
              </>
            )}
          </section>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Active projects</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : activeProjectsCount}</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total projects</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allProjects.length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72">
              <Search size={15} className="text-muted-foreground" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search projects" 
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {["All", "Active"].map((item) => (
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
            <table className="w-full min-w-162.5 text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Team</th>
                  <th className="px-5 py-3 font-semibold">Progress</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredProjects.map((row: any) => {
                  const progress = row.progress || 0;
                  const statusLabel = row.status.replace(/_/g, ' ');
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`size-2.5 rounded-full bg-blue-600`} />
                          <div>
                            <p className="font-semibold">{row.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{row.description || "No description"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {assignedTeams[row.id]?.length ? <div className="flex flex-wrap items-center gap-2">{assignedTeams[row.id].map((team: any) => <button key={team.id} type="button" onClick={() => { setManagedProjectId(row.id); setSelectedTeamId(team.id); setShowManagerField(false); }} className="font-medium text-primary hover:underline">{team.name}</button>)}<button type="button" onClick={() => { setManagedProjectId(row.id); setShowManagerField(true); }} className="rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-muted">{assignedManagers[row.id]?.name || "Manager"}</button></div> : "No team assigned"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-28 rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs font-semibold">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.updatedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(row)} className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-muted"><Pencil size={13} /> Edit</button>
                          <button onClick={() => openManage(row.id)} className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-muted"><Users size={13} /> Team</button>
                          <button onClick={() => { if (window.confirm(`Delete ${row.name} permanently? This cannot be undone.`)) permanentDeleteMutation.mutate(row.id); }} disabled={permanentDeleteMutation.isPending} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><Trash2 size={13} /> Delete</button>
                          </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && filteredProjects.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No projects found.</div>
            )}
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}