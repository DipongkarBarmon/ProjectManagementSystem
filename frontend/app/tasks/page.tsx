/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter, MoreHorizontal, Plus, Search, Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

export default function TasksPage() {
  const { activeOrganizationId } = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [form, setForm] = useState({ projectId: "", title: "", description: "", priority: "MEDIUM", status: "TODO", sprintId: "", assigneeId: "", dueDate: "" });
  const queryClient = useQueryClient();

  const { data: tasksRes, isLoading } = useQuery({
    queryKey: ['tasks', activeOrganizationId],
    queryFn: () => api.tasks.listAll(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const { data: projectsRes } = useQuery({
    queryKey: ["projects", activeOrganizationId],
    queryFn: () => api.projects.list(activeOrganizationId!),
    enabled: !!activeOrganizationId,
  });
  const projects = Array.isArray(projectsRes?.data?.data || projectsRes?.data) ? (projectsRes?.data?.data || projectsRes?.data) : [];

  const rawTasks = tasksRes?.data?.data || tasksRes?.data || [];
  const allTasks = Array.isArray(rawTasks) ? rawTasks : [];

  const { data: sprintsRes } = useQuery({
    queryKey: ['sprints', activeOrganizationId, form.projectId],
    queryFn: () => api.sprints.list(activeOrganizationId!, form.projectId),
    enabled: !!activeOrganizationId && !!form.projectId
  });
  const sprints = Array.isArray(sprintsRes?.data?.data || sprintsRes?.data) ? (sprintsRes?.data?.data || sprintsRes?.data) : [];

  const selectedProject = projects.find((p: any) => p.id === form.projectId);
  const projectMembers = selectedProject?.projectMembers || [];

  const filteredTasks = allTasks.filter((t: any) => {
    const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase());
    const statusLabel = t.status.replace(/_/g, ' ');
    const matchesFilter = filter === "All" || statusLabel.toLowerCase() === filter.toLowerCase();
    return matchesQuery && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-emerald-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'IN_REVIEW': return 'bg-amber-500';
      case 'BLOCKED': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const createMutation = useMutation({
    mutationFn: () => api.tasks.create(activeOrganizationId!, form.projectId, {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      sprintId: form.sprintId || undefined,
      assigneeId: form.assigneeId || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
    }),
    onSuccess: () => {
      toast.success("Task created");
      setForm({ projectId: "", title: "", description: "", priority: "MEDIUM", status: "TODO", sprintId: "", assigneeId: "", dueDate: "" });
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["tasks", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const editMutation = useMutation({
    mutationFn: () => api.tasks.update(activeOrganizationId!, form.projectId, editingTask.id, {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      status: form.status,
      sprintId: form.sprintId || undefined,
      assigneeId: form.assigneeId || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
    }),
    onSuccess: () => {
      toast.success("Task updated");
      setEditingTask(null);
      setIsCreateOpen(false);
      setForm({ projectId: "", title: "", description: "", priority: "MEDIUM", status: "TODO", sprintId: "", assigneeId: "", dueDate: "" });
      queryClient.invalidateQueries({ queryKey: ["tasks", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const openEdit = (task: any) => {
    setEditingTask(task);
    setForm({ 
      projectId: task.projectId || "",
      title: task.title || "", 
      description: task.description || "", 
      priority: task.priority || "MEDIUM",
      status: task.status || "TODO",
      sprintId: task.sprintId || "",
      assigneeId: task.assigneeId || "",
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ""
    });
    setIsCreateOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: ({ projectId, taskId }: { projectId: string; taskId: string }) => api.tasks.delete(activeOrganizationId!, projectId, taskId),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ projectId, taskId, status }: { projectId: string; taskId: string; status: string }) => 
      api.tasks.update(activeOrganizationId!, projectId, taskId, { status }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["tasks", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <WorkspaceShell title="Tasks">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Tasks</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Your team&apos;s work, organized by priority and momentum.</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700">
            <Plus size={17} />New task
          </button>
        </div>

        {isCreateOpen && (
          <form onSubmit={(event) => { event.preventDefault(); editingTask ? editMutation.mutate() : createMutation.mutate(); }} className="mt-6 rounded-xl border bg-card p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <select name="projectId" required disabled={!!editingTask} value={form.projectId} onChange={(event) => setForm({ ...form, projectId: event.target.value, sprintId: "", assigneeId: "" })} className="rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-50">
                <option value="">Select project</option>
                {projects.map((project: any) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
              <input name="title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Task title" className="rounded-lg border bg-background px-3 py-2 text-sm" />
              <textarea name="description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" rows={3} className="resize-y rounded-lg border bg-background px-3 py-2 text-sm" />
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <select name="priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="rounded-lg border bg-background px-3 py-2 text-sm">
                    {["LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                  </select>
                  {editingTask && (
                    <select name="status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-lg border bg-background px-3 py-2 text-sm">
                      {["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE", "CANCELLED"].map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
                    </select>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select name="sprintId" disabled={!form.projectId} value={form.sprintId} onChange={(event) => setForm({ ...form, sprintId: event.target.value })} className="rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-50">
                    <option value="">No sprint</option>
                    {sprints.map((sprint: any) => <option key={sprint.id} value={sprint.id}>{sprint.name}</option>)}
                  </select>
                  <select name="assigneeId" disabled={!form.projectId} value={form.assigneeId} onChange={(event) => setForm({ ...form, assigneeId: event.target.value })} className="rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-50">
                    <option value="">Unassigned</option>
                    {projectMembers.map((pm: any) => <option key={pm.user?.id} value={pm.user?.id}>{pm.user?.name || pm.user?.email}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                    Due Date
                    <input type="date" name="dueDate" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground" />
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => { setIsCreateOpen(false); setEditingTask(null); setForm({ projectId: "", title: "", description: "", priority: "MEDIUM", status: "TODO", sprintId: "", assigneeId: "", dueDate: "" }); }} className="rounded-lg border px-3 py-2 text-sm">Cancel</button>
              <button disabled={createMutation.isPending || editMutation.isPending} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{editingTask ? (editMutation.isPending ? "Updating..." : "Update task") : (createMutation.isPending ? "Creating..." : "Create task")}</button>
            </div>
          </form>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total tasks</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allTasks.length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72">
              <Search size={15} className="text-muted-foreground" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search tasks" 
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {["All", "TODO", "IN PROGRESS", "IN REVIEW", "DONE"].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => setFilter(item)} 
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${filter === item ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button className="rounded-lg border p-2 text-muted-foreground hover:bg-muted" aria-label="Filter">
                <Filter size={15} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Project</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredTasks.map((row: any) => {
                  const statusLabel = row.status.replace(/_/g, ' ');
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30 cursor-pointer">
                      <td className="px-5 py-4">
                        <Link href={`/tasks/${row.id}`} className="flex items-center gap-3">
                          <span className={`size-2.5 rounded-full ${getStatusColor(row.status)}`} />
                          <div>
                            <p className="font-semibold hover:underline">{row.title}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {row.project?.name || "Unknown"}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          className={`appearance-none rounded-full px-2.5 py-1 text-[11px] font-medium outline-none cursor-pointer hover:opacity-80 border-r-4 border-transparent
                            ${row.status === 'DONE' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' :
                              row.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300' :
                              row.status === 'IN_REVIEW' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' :
                              row.status === 'BLOCKED' ? 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300' :
                              'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300'
                            }`}
                          value={row.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateStatusMutation.mutate({ projectId: row.projectId, taskId: row.id, status: e.target.value });
                          }}
                          disabled={updateStatusMutation.isPending}
                        >
                          {["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE", "CANCELLED"].map((status) => (
                            <option key={status} value={status} className="bg-background text-foreground">{status.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {row.priority}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.updatedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-muted"><Pencil size={13} /> Edit</button>
                          <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete ${row.title}? This cannot be undone.`)) deleteMutation.mutate({ projectId: row.projectId, taskId: row.id }); }} disabled={deleteMutation.isPending} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><Trash2 size={13} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && filteredTasks.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No tasks found.</div>
            )}
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}