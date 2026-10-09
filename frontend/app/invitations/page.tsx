"use client";

import { Ban, Loader2, MailPlus, RefreshCw, Send } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WorkspaceShell } from "@/components/workspace-shell";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

type Invitation = {
  id: string;
  email: string;
  organizationRole: string;
  status: string;
  expiresAt: string;
  createdAt: string;
};

function unwrap<T>(value: unknown): T {
  const data = (value as { data?: unknown } | undefined)?.data;
  return ((data as { data?: unknown } | undefined)?.data ?? data ?? []) as T;
}

export default function InvitationsPage() {
  const queryClient = useQueryClient();
  const { activeOrganizationId } = useWorkspaceStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [sending, setSending] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["organization-invitations", activeOrganizationId],
    queryFn: () => api.invitations.list(activeOrganizationId!, { limit: 100 }),
    enabled: Boolean(activeOrganizationId),
  });
  const invitations = unwrap<Invitation[]>(data);

  async function sendInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeOrganizationId || !email.trim()) return;
    setSending(true);
    try {
      await api.invitations.send(activeOrganizationId, { email: email.trim(), organizationRole: role });
      toast.success("Invitation sent successfully.");
      setEmail("");
      await queryClient.invalidateQueries({ queryKey: ["organization-invitations", activeOrganizationId] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send invitation.");
    } finally {
      setSending(false);
    }
  }

  async function cancelInvitation(invitationId: string) {
    if (!activeOrganizationId || !window.confirm("Cancel this invitation?")) return;
    try {
      await api.invitations.cancel(activeOrganizationId, invitationId);
      toast.success("Invitation cancelled.");
      await queryClient.invalidateQueries({ queryKey: ["organization-invitations", activeOrganizationId] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel invitation.");
    }
  }

  return (
    <WorkspaceShell title="Invitations">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Manage</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Invitations</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Invite people to your active organization and manage pending access.</p>
          </div>
          <button onClick={() => refetch()} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"><RefreshCw size={15} /> Refresh</button>
        </div>

        {!activeOrganizationId ? (
          <div className="mt-8 rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">Select an organization before managing invitations.</div>
        ) : (
          <>
            <form onSubmit={sendInvitation} className="mt-8 rounded-xl border bg-card p-5">
              <h2 className="flex items-center gap-2 font-semibold"><MailPlus size={18} /> Send invitation</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@example.com" className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <select value={role} onChange={(event) => setRole(event.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
                  <option value="ORG_ADMIN">Organization member</option>
                  <option value="PROJECT_MANAGER">Project manager</option>
                  <option value="TEAM_LEAD">Team leader</option>
                  <option value="MEMBER">Member</option>
                </select>
                <button disabled={sending} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Send size={15} /> {sending ? "Sending..." : "Send invite"}</button>
              </div>
            </form>

            <section className="mt-6 overflow-hidden rounded-xl border bg-card">
              <div className="border-b p-5"><h2 className="font-semibold">Invitation history</h2><p className="mt-1 text-sm text-muted-foreground">Pending, accepted, expired, and cancelled invitations.</p></div>
              {isLoading ? <div className="flex justify-center p-12"><Loader2 className="animate-spin text-muted-foreground" size={22} /></div> : invitations.length === 0 ? <div className="p-12 text-center text-sm text-muted-foreground">No invitations found.</div> : <div className="divide-y">{invitations.map((invitation) => <div key={invitation.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{invitation.email}</p><p className="mt-1 text-xs text-muted-foreground">{invitation.organizationRole.replace("_", " ")} · Expires {new Date(invitation.expiresAt).toLocaleDateString()}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${invitation.status === "PENDING" ? "bg-amber-100 text-amber-700" : invitation.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{invitation.status}</span>{invitation.status === "PENDING" && <button onClick={() => cancelInvitation(invitation.id)} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"><Ban size={14} /> Cancel</button>}</div>)}</div>}
            </section>
          </>
        )}
      </main>
    </WorkspaceShell>
  );
}
