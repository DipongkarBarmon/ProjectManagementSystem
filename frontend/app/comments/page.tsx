"use client";

import { Loader2, MessageSquare, Search } from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { format } from "date-fns";
import Link from "next/link";

export default function CommentsPage() {
  const { activeOrganizationId } = useWorkspaceStore();
  const [query, setQuery] = useState("");

  const { data: commentsRes, isLoading } = useQuery({
    queryKey: ['global-comments', activeOrganizationId],
    queryFn: () => api.comments.listGlobal(activeOrganizationId!),
    enabled: !!activeOrganizationId
  });

  const allComments = commentsRes?.data || [];
  
  const filteredComments = allComments.filter((c: any) => {
    return c.content.toLowerCase().includes(query.toLowerCase()) || 
           (c.task?.title || "").toLowerCase().includes(query.toLowerCase());
  });

  if (isLoading) {
    return (
      <WorkspaceShell title="Comments">
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell title="Comments">
      <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Comments</h1>
            <p className="text-sm text-muted-foreground">View recent comments across your projects.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-primary sm:max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search comments..." className="flex-1 border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filteredComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-card">
              <div className="rounded-full bg-muted p-4"><MessageSquare className="h-8 w-8 text-muted-foreground" /></div>
              <h3 className="mt-4 text-base font-semibold">No comments found</h3>
              <p className="mt-1 text-sm text-muted-foreground">There are no comments matching your search criteria.</p>
            </div>
          ) : (
            filteredComments.map((comment: any) => (
              <div key={comment.id} className="rounded-xl border bg-card p-4 transition-all hover:shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-xs">
                      {comment.user?.name ? comment.user.name.substring(0, 2).toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{comment.user?.name || "Member"}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <span>Project: {comment.task?.project?.name || "Unknown"}</span>
                        <span>•</span>
                        <Link href={`/tasks/${comment.taskId}`} className="hover:text-primary hover:underline">
                          Task: {comment.task?.title || "Unknown Task"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-11">
                  <p className="whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
