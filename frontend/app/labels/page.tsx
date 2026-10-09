/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Filter, MoreHorizontal, Plus, Search, Loader2, Pencil, Trash2, Tag } from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";
import { toast } from "sonner";

export default function LabelsPage() {
  const { activeOrganizationId } = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<any>(null);
  const [form, setForm] = useState({ name: "", color: "#3B82F6" });
  const queryClient = useQueryClient();

  const { data: labelsRes, isLoading } = useQuery({
    queryKey: ['labels', activeOrganizationId],
    queryFn: () => api.labels.list(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const rawLabels = labelsRes?.data?.data || labelsRes?.data || [];
  const allLabels = Array.isArray(rawLabels) ? rawLabels : [];

  const filteredLabels = allLabels.filter((l: any) => {
    const matchesQuery = l.name.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  const saveMutation = useMutation({
    mutationFn: () => editingLabel
      ? api.labels.update(activeOrganizationId!, editingLabel.id, form)
      : api.labels.create(activeOrganizationId!, form),
    onSuccess: () => {
      toast.success(editingLabel ? "Label updated" : "Label created");
      setIsCreateOpen(false);
      setEditingLabel(null);
      setForm({ name: "", color: "#3B82F6" });
      queryClient.invalidateQueries({ queryKey: ["labels", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (labelId: string) => api.labels.delete(activeOrganizationId!, labelId),
    onSuccess: () => {
      toast.success("Label deleted");
      queryClient.invalidateQueries({ queryKey: ["labels", activeOrganizationId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function openCreate() {
    setEditingLabel(null);
    setForm({ name: "", color: "#3B82F6" });
    setIsCreateOpen(true);
  }

  function openEdit(label: any) {
    setEditingLabel(label);
    setForm({ name: label.name, color: label.color || "#3B82F6" });
    setIsCreateOpen(true);
  }

  if (isLoading) {
    return (
      <WorkspaceShell>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Labels</h1>
            <p className="text-sm text-muted-foreground">Manage labels for your tasks.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> New Label
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary sm:max-w-xs">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search labels..." className="flex-1 border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0" />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"><Filter className="h-4 w-4" /> Filter</button>
            <button className="inline-flex items-center justify-center rounded-lg border bg-background p-2 hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        </div>

        {isCreateOpen && (
          <form onSubmit={(event) => { event.preventDefault(); saveMutation.mutate(); }} className="mt-6 rounded-xl border bg-card p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium">Label name
                <input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter label name" className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground" />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">Color
                <div className="flex items-center gap-3">
                  <input type="color" required value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} className="h-9 w-9 rounded-md border bg-background p-0.5 cursor-pointer" />
                  <span className="text-sm text-muted-foreground font-mono">{form.color}</span>
                </div>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
              <button disabled={saveMutation.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{saveMutation.isPending ? "Saving..." : editingLabel ? "Save changes" : "Create label"}</button>
            </div>
          </form>
        )}

        <div className="mt-8 overflow-hidden rounded-xl border bg-card">
          {filteredLabels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3"><Tag className="h-6 w-6 text-muted-foreground" /></div>
              <h3 className="mt-4 text-sm font-semibold">No labels</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new label.</p>
              <button onClick={openCreate} className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"><Plus className="mr-1 h-4 w-4" /> New Label</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Color</th>
                    <th className="px-5 py-3 font-semibold">Created</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLabels.map((row: any) => (
                    <tr key={row.id} className="group hover:bg-muted/50">
                      <td className="px-5 py-4 font-medium">
                        <div className="flex items-center gap-2">
                           <span className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }}></span>
                           {row.name}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground uppercase">{row.color}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {format(new Date(row.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(row)} className="inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-muted"><Pencil size={13} /> Edit</button>
                          <button onClick={() => { if (window.confirm(`Delete label "${row.name}" permanently?`)) deleteMutation.mutate(row.id); }} disabled={deleteMutation.isPending} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><Trash2 size={13} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
