/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Loader2, ArrowLeft, Calendar, User, Clock, AlertCircle, Paperclip, Send, Trash2, Edit2, UploadCloud, Activity } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const activitiesQuery = useQuery({
    queryKey: ["activities", activeOrganizationId, "TASK", taskId],
    queryFn: () => api.activity.listForEntity(activeOrganizationId!, "TASK", taskId as string),
    enabled: !!activeOrganizationId && !!taskId,
  });
  const commentMutation = useMutation({
    mutationFn: () => api.comments.create(activeOrganizationId!, task.projectId, taskId as string, comment.trim()),
    onSuccess: () => { setComment(""); queryClient.invalidateQueries({ queryKey: ["comments", activeOrganizationId, task?.projectId, taskId] }); },
    onError: (error: Error) => toast.error(error.message),
  });
  const uploadMutation = useMutation({
    mutationFn: () => api.attachments.upload(activeOrganizationId!, task.projectId, taskId as string, selectedFiles!),
    onSuccess: () => { 
      setSelectedFiles(null); 
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["attachments", activeOrganizationId, task?.projectId, taskId] }); 
      toast.success("Files uploaded"); 
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const deleteAttachmentMutation = useMutation({
    mutationFn: (attachmentId: string) => api.attachments.delete(activeOrganizationId!, task.projectId, attachmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", activeOrganizationId, task?.projectId, taskId] }),
    onError: (error: Error) => toast.error(error.message),
  });
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) => 
      api.comments.update(activeOrganizationId!, task.projectId, commentId, content),
    onSuccess: () => { 
      setEditingCommentId(null); 
      setEditContent(""); 
      queryClient.invalidateQueries({ queryKey: ["comments", activeOrganizationId, task?.projectId, taskId] }); 
      toast.success("Comment updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => api.comments.delete(activeOrganizationId!, task.projectId, commentId),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["comments", activeOrganizationId, task?.projectId, taskId] }); 
      toast.success("Comment deleted");
    },
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

            <div className="pt-8 border-t mt-12">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Paperclip size={20} /> Attachments</h3>
              <div className="rounded-xl border bg-card p-5 mb-8">
                
                <div className="mb-4">
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 border-muted-foreground/25 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to choose files</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">You can select multiple files</p>
                    </div>
                    <input id="file-upload" ref={fileInputRef} type="file" name="files" multiple onChange={(event) => {
                      if (event.target.files) {
                        if (selectedFiles && selectedFiles.length > 0) {
                          const dt = new DataTransfer();
                          for (let i = 0; i < selectedFiles.length; i++) dt.items.add(selectedFiles[i]);
                          for (let i = 0; i < event.target.files.length; i++) dt.items.add(event.target.files[i]);
                          setSelectedFiles(dt.files);
                        } else {
                          setSelectedFiles(event.target.files);
                        }
                      }
                    }} className="hidden" />
                  </label>
                </div>
                
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mb-4 text-sm font-medium text-foreground bg-muted/30 p-3 rounded-lg border">
                    <p>{selectedFiles.length} file(s) selected ready to upload.</p>
                  </div>
                )}

                <button onClick={() => selectedFiles && uploadMutation.mutate()} disabled={!selectedFiles?.length || uploadMutation.isPending} className="w-full sm:w-auto rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2">
                  {uploadMutation.isPending ? (
                    <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                  ) : (
                    <><UploadCloud size={16} /> Upload files</>
                  )}
                </button>
                
                {attachmentsQuery.data?.data && attachmentsQuery.data.data.length > 0 && (
                  <div className="mt-6 space-y-3 pt-6 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Uploaded Files</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {attachmentsQuery.data.data.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                          <a href={file.url} target="_blank" rel="noreferrer" className="truncate text-sm font-medium text-primary hover:underline flex-1">{file.originalName || file.fileName || "Attachment"}</a>
                          <button onClick={() => { if (window.confirm('Delete this attachment?')) deleteAttachmentMutation.mutate(file.id); }} className="text-muted-foreground hover:text-red-600 transition-colors shrink-0 p-1" aria-label="Delete attachment"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!attachmentsQuery.isLoading && !(attachmentsQuery.data?.data || []).length && (
                  <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                    <p>No attachments yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 border-t mt-12">
              <h3 className="text-lg font-semibold mb-6">Comments</h3>
              
              <div className="space-y-4 mb-8">
                {(commentsQuery.data?.data || []).map((item: any) => (
                  <div key={item.id} className="rounded-xl border bg-card p-4 group relative">
                    <div className="mb-2 flex justify-between items-start text-xs text-muted-foreground">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground text-sm">{item.user?.name || item.author?.name || "Member"}</span>
                          {item.user?.memberships?.[0]?.organizationRole && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                              {item.user.memberships[0].organizationRole.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                        <span>{item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy h:mm a") : ""}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingCommentId(item.id); setEditContent(item.content); }} className="hover:text-primary p-1 bg-muted/50 rounded"><Edit2 size={14} /></button>
                        <button onClick={() => deleteCommentMutation.mutate(item.id)} className="hover:text-red-500 p-1 bg-red-500/10 rounded"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {editingCommentId === item.id ? (
                      <div className="mt-3 flex flex-col gap-2">
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full resize-y rounded border bg-background px-3 py-2 text-sm" rows={3} />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingCommentId(null)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">Cancel</button>
                          <button onClick={() => updateCommentMutation.mutate({ commentId: item.id, content: editContent })} disabled={updateCommentMutation.isPending || !editContent.trim()} className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50">Save</button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{item.content}</p>
                    )}
                  </div>
                ))}
                {!commentsQuery.isLoading && !(commentsQuery.data?.data || []).length && (
                  <div className="rounded-xl border p-8 text-center text-muted-foreground bg-muted/20">
                    <p>No comments yet.</p>
                  </div>
                )}
              </div>

              <div className="rounded-xl border bg-card p-4">
                <h4 className="font-medium text-sm mb-3">Add a comment</h4>
                <form onSubmit={(event) => { event.preventDefault(); if (comment.trim()) commentMutation.mutate(); }} className="flex flex-col gap-3">
                  <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} placeholder="Write a comment..." className="w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <button disabled={commentMutation.isPending || !comment.trim()} className="self-end rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50" aria-label="Add comment">
                    <span className="flex items-center gap-2"><Send size={16} /> Send comment</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-8 border-t mt-12">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Activity size={20} /> Activity History</h3>
              
              <div className="space-y-4 mb-8">
                {activitiesQuery.isLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : (activitiesQuery.data?.data || []).length > 0 ? (
                  <div className="relative pl-4 border-l border-muted">
                    {(activitiesQuery.data.data).map((activity: any) => (
                      <div key={activity.id} className="mb-6 relative">
                        <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm">
                            <span className="font-semibold">{activity.actor?.name || "Someone"}</span> {activity.description}
                          </p>
                          <span className="text-xs text-muted-foreground mt-1">
                            {format(new Date(activity.createdAt), "MMM d, yyyy h:mm a")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border p-8 text-center text-muted-foreground bg-muted/20">
                    <p>No activity yet.</p>
                  </div>
                )}
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
