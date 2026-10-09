"use client";

import { Filter, MoreHorizontal, Search, Loader2, ShieldOff, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const queryClient = useQueryClient();

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['admin_users'],
    queryFn: () => api.admin.users.list(),
  });

  const rawUsers = usersRes?.data?.data || usersRes?.data || [];
  const allUsers = Array.isArray(rawUsers) ? rawUsers : [];

  const filteredUsers = allUsers.filter((u: any) => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" 
      ? true 
      : filter === "Blocked" 
        ? u.status === "BLOCKED" 
        : u.platformRole === filter;
    return matchesQuery && matchesFilter;
  });

  const blockMutation = useMutation({
    mutationFn: (id: string) => api.admin.users.block(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      toast.success("User block status updated");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update block status");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      toast.success("User soft deleted");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete user");
    }
  });

  const handleBlock = (user: any) => {
    if (confirm(`Are you sure you want to ${user.status === 'BLOCKED' ? 'unblock' : 'block'} ${user.name}?`)) {
      blockMutation.mutate(user.id);
    }
  };

  const handleDelete = (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.name}? This action is destructive.`)) {
      deleteMutation.mutate(user.id);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <AdminShell title="Users">
      <main className="mx-auto max-w-6xl p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-600">Management</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Users</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Manage platform accounts across all organizations.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">Total users</p>
            <p className="mt-2 text-2xl font-semibold">{isLoading ? <Loader2 size={24} className="animate-spin text-muted-foreground" /> : allUsers.length}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72">
              <Search size={15} className="text-muted-foreground" />
              <input 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search users" 
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {["All", "USER", "SUPER_ADMIN", "Blocked"].map((item) => (
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
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Platform Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : filteredUsers.map((row: any) => {
                  return (
                    <tr key={row.id} className="group hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {getInitials(row.name)}
                          </span>
                          <div>
                            <p className="font-semibold">{row.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${row.platformRole === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {row.platformRole.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                         <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${row.status === 'BLOCKED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {format(new Date(row.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleBlock(row)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-amber-600" title={row.status === 'BLOCKED' ? "Unblock user" : "Block user"}>
                            {row.status === 'BLOCKED' ? <ShieldAlert size={16} /> : <ShieldOff size={16} />}
                          </button>
                          <button onClick={() => handleDelete(row)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600" title="Delete user">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!isLoading && filteredUsers.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">No users found.</div>
            )}
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
