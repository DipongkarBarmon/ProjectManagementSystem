/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter, MoreHorizontal, Plus, Search, Loader2, Pencil, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";
import { toast } from "sonner";

export default function TeamsPage() {
  const { activeOrganizationId } = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [membersModalTeam, setMembersModalTeam] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const queryClient = useQueryClient();

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

  const saveMutation = useMutation({
    mutationFn: () => editingTeam
      ? api.teams.update(activeOrganizationId!, editingTeam.id, form)
      : api.teams.create(activeOrganizationId!, form),
    onSuccess: () => {
      toast.success(editingTeam ? "Team updated" : "Team created");
      setIsCreateOpen(false);
      setEditingTeam(null);
      setForm({ name: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["teams", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (teamId: string) => api.teams.delete(activeOrganizationId!, teamId),
    onSuccess: () => {
      toast.success("Team deleted");
      queryClient.invalidateQueries({ queryKey: ["teams", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const { data: orgMembersRes } = useQuery({
    queryKey: ['members', activeOrganizationId],
    queryFn: () => api.members.list(activeOrganizationId!),
    enabled: !!activeOrganizationId && !!membersModalTeam
  });
  const orgMembers = Array.isArray(orgMembersRes?.data?.data || orgMembersRes?.data) ? (orgMembersRes?.data?.data || orgMembersRes?.data) : [];

  const { data: teamMembersRes } = useQuery({
    queryKey: ['team-members', activeOrganizationId, membersModalTeam?.id],
    queryFn: () => api.teams.members(activeOrganizationId!, membersModalTeam?.id),
    enabled: !!activeOrganizationId && !!membersModalTeam?.id
  });
  const teamMembers = Array.isArray(teamMembersRes?.data?.data || teamMembersRes?.data) ? (teamMembersRes?.data?.data || teamMembersRes?.data) : [];

  const addMemberMutation = useMutation({
    mutationFn: (userId: string) => api.teams.addMember(activeOrganizationId!, membersModalTeam.id, userId),
    onSuccess: () => {
      toast.success("Member added");
      queryClient.invalidateQueries({ queryKey: ["team-members", activeOrganizationId, membersModalTeam.id] });
      queryClient.invalidateQueries({ queryKey: ["teams", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => api.teams.removeMember(activeOrganizationId!, membersModalTeam.id, userId),
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["team-members", activeOrganizationId, membersModalTeam.id] });
      queryClient.invalidateQueries({ queryKey: ["teams", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const addLeaderMutation = useMutation({
    mutationFn: (userId: string) => api.teams.addLeader(activeOrganizationId!, membersModalTeam.id, userId),
    onSuccess: (data, variables) => {
      toast.success("Team leader assigned");
      queryClient.invalidateQueries({ queryKey: ["teams", activeOrganizationId] });
      // Update local state so UI reflects immediately without closing modal
      setMembersModalTeam((prev: any) => ({ ...prev, teamLeadId: variables }));
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function openCreate() {
    setEditingTeam(null);
    setForm({ name: "", description: "" });
    setIsCreateOpen(true);
  }

  function openEdit(team: any) {
    setEditingTeam(team);
    setForm({ name: team.name || "", description: team.description || "" });
    setIsCreateOpen(true);
  }

  return (
    <WorkspaceShell title="Teams">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Teams</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Build clear ownership around the work that matters.</p>
          </div>
          <button onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700">
            <Plus size={17} />New team
          </button>
        </div>

        {isCreateOpen && (
          <form onSubmit={(event) => { event.preventDefault(); saveMutation.mutate(); }} className="mt-6 rounded-xl border bg-card p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">Team name
                <input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter team name" className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground" />
              </label>
              <label className="grid gap-1 text-xs font-medium text-muted-foreground">Description
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe this team" rows={3} className="resize-y rounded-lg border bg-background px-3 py-2 text-sm text-foreground" />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-lg border px-3 py-2 text-sm">Cancel</button>
              <button disabled={saveMutation.isPending} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{saveMutation.isPending ? "Saving..." : editingTeam ? "Save changes" : "Create team"}</button>
            </div>
          </form>
        )}

        {membersModalTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-xl border bg-card p-6 shadow-lg min-h-[400px] flex flex-col">
              <h2 className="text-xl font-semibold">Manage Members</h2>
              <p className="text-sm text-muted-foreground">{membersModalTeam.name}</p>
              
              <div className="mt-4 flex gap-2">
                <select id="member-select" className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm" defaultValue="">
                  <option value="" disabled>Select member to add...</option>
                  {orgMembers
                    .filter((om: any) => {
                      const alreadyInSomeTeam = om.user?.teamMembers && om.user.teamMembers.length > 0;
                      const inThisTeam = teamMembers.some((tm: any) => (tm.userId || tm.user?.id || tm.id) === (om.userId || om.user?.id || om.id));
                      return !alreadyInSomeTeam && !inThisTeam;
                    })
                    .map((m: any) => {
                      const name = m.user?.name || m.user?.email || m.name || m.email;
                      const role = m.organizationRole ? ` (${m.organizationRole.replace(/_/g, ' ')})` : '';
                      return (
                        <option key={m.userId || m.user?.id || m.id} value={m.userId || m.user?.id || m.id}>
                          {name}{role}
                        </option>
                      );
                    })}
                </select>
                <button 
                  onClick={() => {
                    const select = document.getElementById('member-select') as HTMLSelectElement;
                    if (select.value) {
                      addMemberMutation.mutate(select.value);
                      select.value = "";
                    }
                  }} 
                  disabled={addMemberMutation.isPending}
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Add
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-2 overflow-y-auto flex-1">
                {teamMembers.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No members assigned to this team.</p>
                  </div>
                ) : (
                  teamMembers.map((member: any) => {
                    const id = member.userId || member.user?.id || member.id;
                    const name = member.user?.name || member.user?.email || member.name || member.email;
                    const isLeader = id === membersModalTeam.teamLeadId;
                    return (
                      <div key={id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">{name}</div>
                          {isLeader ? (
                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Team Leader</span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Member</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => removeMemberMutation.mutate(id)} disabled={removeMemberMutation.isPending} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="mt-6 flex justify-end pt-4 border-t">
                <button onClick={() => setMembersModalTeam(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Close</button>
              </div>
            </div>
          </div>
        )}

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
            <table className="w-full min-w-162.5 text-left text-sm">
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
                        {row._count?.members ?? row.teamMembers?.length ?? 0} members
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setMembersModalTeam(row)} className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-muted"><Users size={13} /> Members</button>
                          <button onClick={() => openEdit(row)} className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-muted"><Pencil size={13} /> Edit</button>
                          <button onClick={() => { if (window.confirm(`Delete ${row.name} permanently? This cannot be undone.`)) deleteMutation.mutate(row.id); }} disabled={deleteMutation.isPending} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><Trash2 size={13} /> Delete</button>
                        </div>
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