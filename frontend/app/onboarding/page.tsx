/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowRight, Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState("");
  const [loading, setLoading] = useState(false);
  const { setActiveOrganizationId } = useWorkspaceStore();

  async function handleCreateWorkspace() {
    if (!workspace.trim()) return;
    setLoading(true);
    try {
      const name = workspace.trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const res = await api.organizations.create({ name, slug });
      if (res.success && res.data) {
        toast.success("Workspace created successfully");
        // We set the active organization ID directly
        // The WorkspaceProvider on /dashboard will pick it up and refetch the orgs list
        setActiveOrganizationId(res.data.id);
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create workspace");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap size={17} fill="currentColor" />
          </span>
          TaskFlow
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[220px_1fr] lg:items-start">
          <aside>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Getting started</p>
            <div className="mt-5 space-y-4">
              <p className="flex items-center gap-3 text-sm font-medium">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
                Workspace
              </p>
            </div>
          </aside>
          <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Set up your workspace</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Give your team a clear home for projects, tasks, and decisions.</p>
            
            <label className="mt-8 block text-sm font-medium">
              Workspace name
              <input 
                value={workspace} 
                onChange={(event) => setWorkspace(event.target.value)} 
                className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" 
                placeholder="Acme Software" 
                disabled={loading}
              />
            </label>
            
            <div className="mt-8 flex justify-end">
              <button 
                disabled={!workspace.trim() || loading} 
                onClick={handleCreateWorkspace} 
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Create Workspace <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}