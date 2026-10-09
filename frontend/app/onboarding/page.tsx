/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowRight, Zap, Loader2, Building2, Sparkles, CheckCircle2 } from "lucide-react";
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
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left side - Dark/Brand side */}
      <div className="relative hidden flex-col bg-zinc-950 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950" />
        
        {/* Logo at the top */}
        <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Zap size={18} fill="currentColor" />
          </span>
          TaskFlow
        </div>

        {/* Content perfectly centered */}
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-semibold leading-[1.1] tracking-tight">
              The foundation for your team's best work.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-zinc-400">
              Create a dedicated workspace where your team can collaborate, track progress, and ship faster.
            </p>

            <div className="mt-12 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-blue-500" size={22} />
                <span className="text-base font-medium text-zinc-300">Unlimited projects and tasks</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-blue-500" size={22} />
                <span className="text-base font-medium text-zinc-300">Real-time collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-blue-500" size={22} />
                <span className="text-base font-medium text-zinc-300">Advanced team permissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form side */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center gap-2 text-xl font-bold tracking-tight lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Zap size={18} fill="currentColor" />
            </span>
            TaskFlow
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            <Sparkles size={14} /> Almost there!
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Set up your workspace</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Give your team a clear home for projects, tasks, and decisions. You can always change this later.
          </p>
          
          <div className="mt-10 space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 size={16} className="text-muted-foreground" />
                Workspace name
              </label>
              <input 
                value={workspace} 
                onChange={(event) => setWorkspace(event.target.value)} 
                className="h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10" 
                placeholder="e.g. Acme Software" 
                disabled={loading}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateWorkspace();
                }}
              />
            </div>
            
            <button 
              disabled={!workspace.trim() || loading} 
              onClick={handleCreateWorkspace} 
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Create Workspace 
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}