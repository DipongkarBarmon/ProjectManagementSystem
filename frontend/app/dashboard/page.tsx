"use client";

import { ArrowUpRight, CheckCircle2, FolderKanban, ListTodo, Plus, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { format, formatDistanceToNow } from "date-fns";

function Stat({ label, value, icon: Icon, tone, loading }: { label: string; value: string | number; icon: typeof FolderKanban; tone: string; loading?: boolean }) { 
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold">
            {loading ? <Loader2 size={18} className="animate-spin text-muted-foreground mt-1" /> : value}
          </p>
        </div>
        <span className={`flex size-9 items-center justify-center rounded-lg ${tone}`}>
          <Icon size={17} />
        </span>
      </div>
    </div>
  ); 
}

export default function DashboardPage() { 
  const { activeOrganizationId } = useWorkspaceStore();
  const { user } = useAuthStore();

  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats', activeOrganizationId],
    queryFn: () => api.dashboard.getStats(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ['dashboard', 'projects', activeOrganizationId],
    queryFn: () => api.projects.list(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const { data: activityRes, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity', activeOrganizationId],
    queryFn: () => api.activity.list(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const stats = statsRes?.data || { activeProjects: 0, openTasks: 0, completedTasks: 0, teamMembers: 0 };
  
  // Try to safely extract projects, fallback to empty array
  // If backend wraps in .data or not, we handle both
  const rawProjects = projectsRes?.data?.data || projectsRes?.data || [];
  const projects = Array.isArray(rawProjects) ? rawProjects.slice(0, 5) : [];

  const rawActivity = activityRes?.data?.data || activityRes?.data || [];
  const activities = Array.isArray(rawActivity) ? rawActivity.slice(0, 5) : [];

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <WorkspaceShell title="Dashboard">
      <main className="mx-auto max-w-[1440px] p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-sm font-medium text-primary">{today}</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Good morning, {firstName}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Here is what is happening across your workspace.</p>
          </div>
          <Link href="/tasks" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700">
            <Plus size={17} />Create task
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Active projects" value={stats.activeProjects} loading={statsLoading} icon={FolderKanban} tone="bg-blue-50 text-blue-600" />
          <Stat label="Open tasks" value={stats.openTasks} loading={statsLoading} icon={ListTodo} tone="bg-violet-50 text-violet-600" />
          <Stat label="Completed" value={stats.completedTasks} loading={statsLoading} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" />
          <Stat label="Team members" value={stats.teamMembers} loading={statsLoading} icon={Users} tone="bg-amber-50 text-amber-600" />
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">Project overview</h2>
                <p className="mt-1 text-xs text-muted-foreground">Progress across active work</p>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="divide-y">
              {projectsLoading ? (
                <div className="flex justify-center p-8"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
              ) : projects.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No active projects</div>
              ) : (
                projects.map((project: any) => {
                  // Mock a progress value if backend doesn't provide it yet
                  const progress = project.progress || Math.floor(Math.random() * 100);
                  const color = project.color || "bg-blue-600";
                  
                  return (
                    <div key={project.id} className="px-5 py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className={`size-2.5 shrink-0 rounded-full ${color}`} />
                          <span className="truncate text-sm font-semibold">{project.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{progress}%</span>
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                        <span>{project.status.replace(/_/g, ' ')}</span>
                        <span>{format(new Date(project.updatedAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Recent activity</h2>
                <p className="mt-1 text-xs text-muted-foreground">Latest workspace updates</p>
              </div>
              <Link href="/activity" className="text-xs font-semibold text-primary">View all</Link>
            </div>
            <div className="mt-6 space-y-5 text-xs leading-5">
              {activityLoading ? (
                <div className="flex justify-center p-4"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
              ) : activities.length === 0 ? (
                <div className="text-center text-muted-foreground">No recent activity</div>
              ) : (
                activities.map((act: any) => (
                  <p key={act.id}>
                    <strong>{act.user?.name || 'User'}</strong> {act.action.toLowerCase().replace(/_/g, ' ')} <strong>{act.entityType}</strong>
                    <span className="block text-muted-foreground">{formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}</span>
                  </p>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </WorkspaceShell>
  ); 
}