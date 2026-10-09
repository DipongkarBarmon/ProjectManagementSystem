"use client";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Calendar, User, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const router = useRouter();
  const { activeOrganizationId } = useWorkspaceStore();
  const queryClient = useQueryClient();

  const { data: taskRes, isLoading } = useQuery({
    queryKey: ['task', taskId, activeOrganizationId],
    queryFn: () => api.tasks.getById(activeOrganizationId!, taskId as string),
    enabled: !!activeOrganizationId && !!taskId
  });

  const task = taskRes?.data;

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => 
      api.tasks.update(activeOrganizationId!, task.projectId, taskId as string, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', activeOrganizationId] });
      toast.success("Task status updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update status");
    }
  });

  if (isLoading) {
    return (
      <WorkspaceShell title="Task">
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      </WorkspaceShell>
    );
  }

  if (!task) {
    return (
      <WorkspaceShell title="Task Not Found">
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <AlertCircle size={48} className="text-red-500" />
          <h2 className="text-xl font-semibold">Task not found</h2>
          <Link href="/tasks" className="text-primary hover:underline">Return to tasks</Link>
        </div>
      </WorkspaceShell>
    );
  }

  const statusLabel = task.status.replace(/_/g, ' ');
  const statuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE'];

  return (
    <WorkspaceShell title={task.title}>
      <main className="mx-auto max-w-5xl p-5 sm:p-8">
        <Link href="/tasks" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Back to tasks
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{task.project?.name || 'Project'}</span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs font-semibold text-muted-foreground">{task.priority} Priority</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              {task.description ? (
                <p className="whitespace-pre-wrap leading-relaxed">{task.description}</p>
              ) : (
                <p className="text-muted-foreground italic">No description provided.</p>
              )}
            </div>

            {/* Comments placeholder */}
            <div className="pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              <div className="rounded-xl border bg-card p-4 text-center text-sm text-muted-foreground">
                Comments are coming soon.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><Clock size={14} /> Status</p>
                  <select 
                    value={task.status}
                    onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                    disabled={updateStatusMutation.isPending}
                    className="w-full rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><User size={14} /> Assignee</p>
                  <div className="flex items-center gap-2 text-sm">
                    {task.assignee ? (
                      <>
                        <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-[9px] font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                          {task.assignee.name.substring(0, 2).toUpperCase()}
                        </span>
                        <span>{task.assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><Calendar size={14} /> Created</p>
                  <p className="text-sm">{format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}
