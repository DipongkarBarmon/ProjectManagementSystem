/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, ArrowLeft, Calendar, User, Clock, AlertCircle, Paperclip, Send, Trash2 } from "lucide-react";
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
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const commentsQuery = useQuery({
    queryKey: ["comments", activeOrganizationId, task?.projectId, taskId],
    queryFn: () => api.comments.list(activeOrganizationId!, task.projectId, taskId as string),
    enabled: !!activeOrganizationId && !!task?.projectId && !!taskId,
  });
  const attachmentsQuery = useQuery({
    queryKey: ["attachments", activeOrganizationId, task?.projectId, taskId],
    queryFn: () => api.attachments.list(activeOrganizationId!, task.projectId, taskId as string),
    enabled: !!activeOrganizationId && !!task?.projectId && !!taskId,
  });
  const commentMutation = useMutation({
    mutationFn: () => api.comments.create(activeOrganizationId!, task.projectId, taskId as string, comment.trim()),
    onSuccess: () => { setComment(""); queryClient.invalidateQueries({ queryKey: ["comments", activeOrganizationId, task?.projectId, taskId] }); },
    onError: (error: Error) => toast.error(error.message),
  });
  const uploadMutation = useMutation({
    mutationFn: () => api.attachments.upload(activeOrganizationId!, task.projectId, taskId as string, selectedFiles!),
    onSuccess: () => { setSelectedFiles(null); queryClient.invalidateQueries({ queryKey: ["attachments", activeOrganizationId, task?.projectId, taskId] }); toast.success("Files uploaded"); },
    onError: (error: Error) => toast.error(error.message),
  });
  const deleteAttachmentMutation = useMutation({
    mutationFn: (attachmentId: string) => api.attachments.delete(activeOrganizationId!, task.projectId, attachmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", activeOrganizationId, task?.projectId, taskId] }),
    onError: (error: Error) => toast.error(error.message),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => 
      api.tasks.update(activeOrganizationId!, task.projectId, taskId as string, { status: newStatus }),
    onMutate: async (newStatus: string) => {
      await queryClient.cancelQueries({ queryKey: ['task', taskId, activeOrganizationId] });
      const previousTask = queryClient.getQueryData(['task', taskId, activeOrganizationId]);
      
      queryClient.setQueryData(['task', taskId, activeOrganizationId], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: { ...old.data, status: newStatus }
        };
      });
      
      return { previousTask };
    },
    onError: (error: any, newStatus, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(['task', taskId, activeOrganizationId], context.previousTask);
      }
      toast.error(error.message || "Failed to update status");
    },
    onSuccess: () => {
      toast.success("Task status updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId, activeOrganizationId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', activeOrganizationId] });
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

            <div className="pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              <form onSubmit={(event) => { event.preventDefault(); if (comment.trim()) commentMutation.mutate(); }} className="mb-4 flex gap-2">
                <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={2} placeholder="Write a comment..." className="min-w-0 flex-1 resize-y rounded-lg border bg-background px-3 py-2 text-sm" />
                <button disabled={commentMutation.isPending || !comment.trim()} className="self-end rounded-lg bg-primary p-2 text-primary-foreground disabled:opacity-50" aria-label="Add comment"><Send size={16} /></button>
              </form>
              <div className="space-y-3">
                {(commentsQuery.data?.data || []).map((item: any) => (
                  <div key={item.id} className="rounded-xl border bg-card p-4">
                    <div className="flex justify-between text-xs text-muted-foreground"><span className="font-medium text-foreground">{item.user?.name || item.author?.name || "Member"}</span><span>{item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy h:mm a") : ""}</span></div>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{item.content}</p>
                  </div>
                ))}
                {!commentsQuery.isLoading && !(commentsQuery.data?.data || []).length && <p className="rounded-xl border p-4 text-center text-sm text-muted-foreground">No comments yet.</p>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold"><Paperclip size={16} /> Attachments</h3>
              <input type="file" name="files" multiple onChange={(event) => setSelectedFiles(event.target.files)} className="w-full text-xs" />
              <button onClick={() => selectedFiles && uploadMutation.mutate()} disabled={!selectedFiles?.length || uploadMutation.isPending} className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{uploadMutation.isPending ? "Uploading..." : "Upload files"}</button>
              <div className="mt-3 space-y-2">
                {(attachmentsQuery.data?.data || []).map((file: any) => <div key={file.id} className="flex items-center justify-between gap-2 text-xs"><a href={file.url} target="_blank" rel="noreferrer" className="truncate text-primary hover:underline">{file.originalName || file.fileName || "Attachment"}</a><button onClick={() => deleteAttachmentMutation.mutate(file.id)} className="text-red-600" aria-label="Delete attachment"><Trash2 size={14} /></button></div>)}
              </div>
            </div>
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
