/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter, MailPlus, MoreHorizontal, Plus, Search, Loader2, Send, X } from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";
import { toast } from "sonner";

export default function MembersPage() {
  const { activeOrganizationId } = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const { data: membersRes, isLoading } = useQuery({
    queryKey: ['members', activeOrganizationId],
    queryFn: () => api.members.list(activeOrganizationId!, { limit: 100 }),
    enabled: !!activeOrganizationId
  });

  const rawMembers = membersRes?.data || [];
  const allMembers = Array.isArray(rawMembers) ? rawMembers : [];

  const filteredMembers = allMembers.filter((m: any) => {
    const name = m.user?.name || "";
    const email = m.user?.email || "";
    const matchesQuery = name.toLowerCase().includes(query.toLowerCase()) || email.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || m.organizationRole === filter;
    return matchesQuery && matchesFilter;
  });

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  async function sendInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeOrganizationId) {
      toast.error("Select an organization before inviting a member.");
      return;
    }

    setIsSendingInvite(true);
    try {
      await api.invitations.send(activeOrganizationId, {
        email: inviteEmail.trim(),
        organizationRole: inviteRole,
      });
      toast.success("Invitation sent successfully.");
      setInviteEmail("");
      setInviteRole("MEMBER");
      setIsInviteOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send invitation.");
    } finally {
      setIsSendingInvite(false);
    }
  }

  return (
    <WorkspaceShell title="Members">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Manage</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Members</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Invite people, manage access, and see who owns what.</p>
          </div>
          <button onClick={() => setIsInviteOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700">
            <Plus size={17} />Invite member
          </button>
        </div>

        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <form onSubmit={sendInvitation} className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold"><MailPlus size={18} /> Invite member</h2>
                <button type="button" onClick={() => setIsInviteOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close invite dialog">
                  <X size={18} />
                </button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Send an invitation to join this organization.</p>
              <label className="mt-5 block text-sm font-medium">
                Email address
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="teammate@example.com"
                  className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <label className="mt-4 block text-sm font-medium">
                Role
                <select value={inviteRole} onChange={(event) => setInviteRole(event.target.value)} className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm">
                  <option value="ORG_ADMIN">Organization member</option>
                  <option value="PROJECT_MANAGER">Project manager</option>
                  <option value="TEAM_LEAD">Team leader</option>
                  <option value="MEMBER">Member</option>
                </select>
              </label>
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => setIsInviteOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit" disabled={isSendingInvite} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                  <Send size={15} /> {isSendingInvite ? "Sending..." : "Send invite"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total members</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allMembers.length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72">
              <Search size={15} className="text-muted-foreground" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search members" 
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {["All", "ORG_ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "MEMBER"].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => setFilter(item)} 
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${filter === item ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                  >
                    {item === "ORG_ADMIN" ? "Organization member" :
                      item === "PROJECT_MANAGER" ? "Project manager" :
                        item === "TEAM_LEAD" ? "Team leader" :
                          item === "MEMBER" ? "Member" : item}
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
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredMembers.map((row: any) => {
                  const userName = row.user?.name || "Unknown User";
                  const userEmail = row.user?.email || "";
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {getInitials(userName)}
                          </span>
                          <div>
                            <p className="font-semibold">{userName}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">
                          {(row.organizationRole || "MEMBER").replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {row.joinedAt ? format(new Date(row.joinedAt), 'MMM d, yyyy') : "—"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="rounded-md p-1.5 text-muted-foreground opacity-0 hover:bg-muted group-hover:opacity-100" aria-label={`More options for ${userName}`}>
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && filteredMembers.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No members found.</div>
            )}
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}