"use client";

import {
  Building2,
  Check,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WorkspaceShell } from "@/components/workspace-shell";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

type Organization = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  createdAt?: string;
  subscription?: { plan?: { name?: string } | null } | null;
};

type Member = {
  id: string;
  user?: { id: string; name?: string; email?: string; profilePicture?: string | null };
  organizationRole: string;
  joinedAt?: string;
};

const roles = ["ORG_ADMIN", "MANAGER", "TEAM_LEAD", "MEMBER", "GUEST"];

function unwrap<T>(value: unknown): T {
  const data = value?.data;
  return (data?.data ?? data ?? []) as T;
}

function initials(name?: string) {
  return name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "OR";
}

export default function OrganizationsPage() {
  const queryClient = useQueryClient();
  const { organizations, activeOrganizationId, setActiveOrganizationId, setOrganizations } = useWorkspaceStore();
  const [selectedId, setSelectedId] = useState<string | null>(activeOrganizationId);
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [logo, setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: organizationsResponse, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => api.organizations.list({ limit: 100 }),
  });

  const allOrganizations = useMemo(
    () => unwrap<Organization[]>(organizationsResponse).filter((organization) => organization?.id),
    [organizationsResponse],
  );
  const availableOrganizations = allOrganizations.length ? allOrganizations : organizations;
  const effectiveSelectedId = selectedId ?? availableOrganizations[0]?.id ?? null;
  const selectedOrganization = availableOrganizations.find((organization) => organization.id === effectiveSelectedId) ?? null;

  const { data: membersResponse, isLoading: membersLoading } = useQuery({
    queryKey: ["organization-members", effectiveSelectedId],
    queryFn: () => api.members.list(effectiveSelectedId!, { limit: 100 }),
    enabled: Boolean(effectiveSelectedId),
  });
  const members = unwrap<Member[]>(membersResponse);

  useEffect(() => {
    if (effectiveSelectedId) setActiveOrganizationId(effectiveSelectedId);
  }, [effectiveSelectedId, setActiveOrganizationId]);

  function beginEdit(organization: Organization) {
    setForm({
      name: organization.name,
      slug: organization.slug,
      description: organization.description ?? "",
    });
    setEditing(true);
  }

  async function refreshOrganizations() {
    await queryClient.invalidateQueries({ queryKey: ["organizations"] });
    const current = useWorkspaceStore.getState().organizations;
    if (current.length) setOrganizations(current);
  }

  async function saveOrganization() {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Organization name and slug are required.");
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        const response = await api.organizations.create({
          name: form.name.trim(),
          slug: form.slug.trim().toLowerCase(),
          description: form.description.trim() || undefined,
          logo: logo ?? undefined,
        });
        const createdData = unwrap<Record<string, unknown>>(response);
        const nestedOrganization = createdData.organizationWithMembers;
        const created = nestedOrganization && typeof nestedOrganization === "object"
          ? nestedOrganization as Organization
          : createdData.organization && typeof createdData.organization === "object"
            ? createdData.organization as Organization
            : null;
        if (created?.id) setSelectedId(created.id);
        toast.success("Organization created.");
      } else if (effectiveSelectedId) {
        await api.organizations.updateInfo(effectiveSelectedId, {
          name: form.name.trim(),
          slug: form.slug.trim().toLowerCase(),
          description: form.description.trim(),
        });
        toast.success("Organization updated.");
      }
      setIsCreating(false);
      setEditing(false);
      setLogo(null);
      await refreshOrganizations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save organization.");
    } finally {
      setSaving(false);
    }
  }

  async function updateLogo() {
    if (!effectiveSelectedId || !logo) return;
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("logo", logo);
      await api.organizations.updateLogo(effectiveSelectedId, payload);
      toast.success("Organization logo updated.");
      setLogo(null);
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update logo.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteOrganization() {
    if (!effectiveSelectedId || !window.confirm("Delete this organization? This cannot be undone.")) return;
    setSaving(true);
    try {
      await api.organizations.delete(effectiveSelectedId);
      toast.success("Organization deleted.");
      setSelectedId(null);
      setActiveOrganizationId(null);
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete organization.");
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(memberId: string, role: string) {
    if (!effectiveSelectedId) return;
    try {
      await api.members.updateRole(effectiveSelectedId, memberId, { role });
      await queryClient.invalidateQueries({ queryKey: ["organization-members", effectiveSelectedId] });
      toast.success("Member role updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update member role.");
    }
  }

  async function removeMember(memberId: string) {
    if (!effectiveSelectedId || !window.confirm("Remove this member from the organization?")) return;
    try {
      await api.members.remove(effectiveSelectedId, memberId);
      await queryClient.invalidateQueries({ queryKey: ["organization-members", effectiveSelectedId] });
      toast.success("Member removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove member.");
    }
  }

  function startCreate() {
    setForm({ name: "", slug: "", description: "" });
    setLogo(null);
    setIsCreating(true);
    setEditing(true);
  }

  return (
    <WorkspaceShell title="Organizations">
      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Manage</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Organizations</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Create workspaces, update their details, and manage members.</p>
          </div>
          <button onClick={startCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700">
            <Plus size={17} /> Create organization
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[280px_1fr]">
          <section className="rounded-xl border bg-card p-3">
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your organizations</p>
              <Building2 size={16} className="text-muted-foreground" />
            </div>
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" size={22} /></div>
            ) : allOrganizations.length === 0 ? (
              <p className="p-5 text-center text-sm text-muted-foreground">No organizations yet.</p>
            ) : (
              <div className="space-y-1">
                {allOrganizations.map((organization) => (
                  <button
                    key={organization.id}
                    onClick={() => setSelectedId(organization.id)}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${selectedId === organization.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                  >
                    {organization.logo ? <img src={organization.logo} alt="" className="size-9 rounded-lg object-cover" /> : <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{initials(organization.name)}</span>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{organization.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{organization.subscription?.plan?.name ?? "Free"}</span>
                    </span>
                    {selectedId === organization.id && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </section>

          <div className="space-y-6">
            {editing ? (
              <section className="rounded-xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{isCreating ? "Create organization" : "Edit organization"}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Keep the workspace information clear and recognizable.</p>
                  </div>
                  <button onClick={() => setEditing(false)} className="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Cancel"><X size={18} /></button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium">Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 h-10 w-full rounded-lg border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary/30" placeholder="Acme Software" /></label>
                  <label className="text-sm font-medium">Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-2 h-10 w-full rounded-lg border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-primary/30" placeholder="acme-software" /></label>
                  <label className="text-sm font-medium sm:col-span-2">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 min-h-24 w-full rounded-lg border bg-background p-3 font-normal outline-none focus:ring-2 focus:ring-primary/30" placeholder="What does this workspace manage?" /></label>
                  <label className="text-sm font-medium sm:col-span-2">Logo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setLogo(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-lg border bg-background p-2 text-sm font-normal" /></label>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button onClick={() => setEditing(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
                  <button onClick={saveOrganization} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Save size={16} />{saving ? "Saving..." : "Save organization"}</button>
                </div>
              </section>
            ) : selectedOrganization ? (
              <>
                <section className="rounded-xl border bg-card p-6">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div className="flex items-center gap-4">
                      {selectedOrganization.logo ? <img src={selectedOrganization.logo} alt="" className="size-16 rounded-xl object-cover" /> : <span className="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">{initials(selectedOrganization.name)}</span>}
                      <div><h2 className="text-xl font-semibold">{selectedOrganization.name}</h2><p className="text-sm text-muted-foreground">@{selectedOrganization.slug}</p><p className="mt-2 text-sm text-muted-foreground">{selectedOrganization.description || "No description added."}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => beginEdit(selectedOrganization)} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"><Pencil size={15} /> Edit</button>
                      <button onClick={deleteOrganization} disabled={saving} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"><Trash2 size={15} /> Delete</button>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-5">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"><ImagePlus size={15} /> Choose logo<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => setLogo(event.target.files?.[0] ?? null)} /></label>
                    {logo && <><span className="text-sm text-muted-foreground">{logo.name}</span><button onClick={updateLogo} disabled={saving} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving ? "Uploading..." : "Upload logo"}</button></>}
                  </div>
                </section>

                <section className="overflow-hidden rounded-xl border bg-card">
                  <div className="flex items-center justify-between border-b p-5"><div><h2 className="flex items-center gap-2 font-semibold"><Users size={18} /> Members</h2><p className="mt-1 text-sm text-muted-foreground">Manage roles and organization access.</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{members.length}</span></div>
                  {membersLoading ? <div className="flex justify-center p-10"><Loader2 className="animate-spin text-muted-foreground" size={22} /></div> : members.length === 0 ? <p className="p-10 text-center text-sm text-muted-foreground">No members found.</p> : <div className="divide-y">{members.map((member) => <div key={member.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">{initials(member.user?.name)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{member.user?.name || "Unknown user"}</p><p className="truncate text-xs text-muted-foreground">{member.user?.email}</p></div></div><div className="flex items-center gap-2"><select value={member.organizationRole} onChange={(event) => changeRole(member.user?.id ?? member.id, event.target.value)} disabled={member.organizationRole === "OWNER"} className="rounded-lg border bg-background px-2 py-2 text-xs"><option value="OWNER">OWNER</option>{roles.map((role) => <option key={role} value={role}>{role.replace("_", " ")}</option>)}</select>{member.organizationRole !== "OWNER" && <button onClick={() => removeMember(member.user?.id ?? member.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Remove member"><Trash2 size={15} /></button>}</div></div>)}</div>}
                </section>
              </>
            ) : (
              <section className="rounded-xl border border-dashed bg-card p-12 text-center"><Building2 className="mx-auto text-muted-foreground" size={32} /><h2 className="mt-3 font-semibold">Select an organization</h2><p className="mt-1 text-sm text-muted-foreground">Choose a workspace or create your first organization.</p></section>
            )}
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}
