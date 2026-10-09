/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useAuthStore } from "@/lib/store/auth-store";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { Loader2, CreditCard, User, Building } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { activeOrganizationId, organizations } = useWorkspaceStore();
  
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name || "");

  const updateProfileMutation = useMutation({
    mutationFn: () => api.auth.updateProfile({ name }),
    onSuccess: (res) => {
      useAuthStore.setState({ user: res.data.user });
      queryClient.invalidateQueries();
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const activeOrg = organizations.find((o:any) => o.id === activeOrganizationId);
  const isOrgAdmin = activeOrg?.myRole === 'OWNER' || activeOrg?.myRole === 'ORG_ADMIN';
  const planName = activeOrg?.subscription?.plan?.name || "Free";

  return (
    <WorkspaceShell title="Settings">
      <main className="mx-auto max-w-4xl p-5 sm:p-8">
        <div>
          <p className="text-sm font-medium text-primary">Manage</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Settings</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Shape your workspace and personal preferences.</p>
        </div>

        <div className="mt-10 space-y-10">
          {/* User Profile */}
          <section>
            <div className="flex items-center gap-2 border-b pb-2 mb-6">
              <User size={18} className="text-muted-foreground" />
              <h2 className="text-lg font-semibold">My Profile</h2>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email}
                    className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 opacity-70" 
                    disabled 
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">Email cannot be changed.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => updateProfileMutation.mutate()} 
                  disabled={updateProfileMutation.isPending || !name.trim() || name === user?.name}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>

          {/* Workspace Settings */}
          {activeOrg && (
            <section>
              <div className="flex items-center gap-2 border-b pb-2 mb-6">
                <Building size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-semibold">Workspace Settings</h2>
              </div>
              <div className="rounded-xl border bg-card p-6">
                {!isOrgAdmin ? (
                  <p className="text-sm text-muted-foreground">You do not have permission to modify workspace settings.</p>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium">Workspace Name</label>
                      <input 
                        type="text" 
                        defaultValue={activeOrg.name}
                        className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 max-w-sm block" 
                        readOnly
                      />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-50 cursor-not-allowed">
                        Update Workspace
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Billing & Subscription */}
          {activeOrg && (
            <section>
              <div className="flex items-center gap-2 border-b pb-2 mb-6">
                <CreditCard size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-semibold">Billing & Subscription</h2>
              </div>
              <div className="rounded-xl border bg-card p-6">
                {!isOrgAdmin ? (
                  <p className="text-sm text-muted-foreground">You do not have permission to view billing details.</p>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-primary">{planName} Plan</p>
                      <p className="text-sm text-muted-foreground mt-1">You are currently on the {planName.toLowerCase()} tier.</p>
                    </div>
                    <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                      {planName.toUpperCase() === "FREE" ? "Upgrade Plan" : "Change Plan"}
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </main>
    </WorkspaceShell>
  );
}