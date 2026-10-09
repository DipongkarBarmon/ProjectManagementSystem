"use client";

import { WorkspaceShell } from "@/components/workspace-shell";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { Loader2, Activity as ActivityIcon, CheckCircle2, MessageSquare, Paperclip, UserPlus, Edit, Plus, Trash, UserCircle2 } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

type ActivityItem = {
  id: string;
  action?: string;
  description?: string;
  entityType?: string;
  actor?: { name?: string };
  details?: {
    task?: { title?: string };
    project?: { name?: string };
    sprint?: { name?: string };
  };
  createdAt: string;
};

export default function ActivityPage() {
  const { activeOrganizationId } = useWorkspaceStore();

  const activitiesQuery = useQuery({
    queryKey: ["activities", activeOrganizationId],
    queryFn: () => api.activity.list(activeOrganizationId!),
    enabled: !!activeOrganizationId,
  });

  return (
    <WorkspaceShell title="Activity">
      <main className="mx-auto max-w-4xl p-5 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px] flex items-center gap-2">
            <ActivityIcon size={28} /> Activity Log
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            A clear history of the decisions and changes in your workspace.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          {activitiesQuery.isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>
          ) : (activitiesQuery.data?.data || []).length > 0 ? (
            <div className="relative pl-6 border-l-2 border-muted/50 ml-4">
              {(activitiesQuery.data?.data || []).map((activity: ActivityItem) => {
                
                // Helper to get Icon based on Action
                const getIcon = () => {
                  switch (activity.action) {
                    case 'CREATED': return <Plus size={14} className="text-emerald-500" />;
                    case 'UPDATED': return <Edit size={14} className="text-blue-500" />;
                    case 'DELETED': return <Trash size={14} className="text-red-500" />;
                    case 'COMMENTED': return <MessageSquare size={14} className="text-violet-500" />;
                    case 'ATTACHED': return <Paperclip size={14} className="text-amber-500" />;
                    case 'ASSIGNED': return <UserPlus size={14} className="text-indigo-500" />;
                    case 'STATUS_CHANGED': return <CheckCircle2 size={14} className="text-teal-500" />;
                    case 'JOINED': return <UserCircle2 size={14} className="text-emerald-500" />;
                    default: return <ActivityIcon size={14} className="text-muted-foreground" />;
                  }
                };

                // Helper to format Date nicely
                const formatTime = (dateStr: string) => {
                  const date = new Date(dateStr);
                  if (isToday(date)) return `Today at ${format(date, "h:mm a")}`;
                  if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
                  return format(date, "MMM d, yyyy 'at' h:mm a");
                };

                // Helper to render the natural sentence
                const renderSentence = () => {
                  let contextText = "";

                  if (activity.entityType === "TASK" && activity.details?.task) {
                    contextText = ` task "${activity.details.task.title}"`;
                    if (activity.details.project) {
                      contextText += ` in project "${activity.details.project.name}"`;
                    }
                  } else if (activity.entityType === "PROJECT" && activity.details?.project) {
                    contextText = ` project "${activity.details.project.name}"`;
                  } else if (activity.entityType === "SPRINT" && activity.details?.sprint) {
                    contextText = ` sprint "${activity.details.sprint.name}"`;
                    if (activity.details.project) {
                      contextText += ` in project "${activity.details.project.name}"`;
                    }
                  }

                  const description = activity.description || "";
                  
                  // Convert description like "Task created" to lowercase if we are prepending the actor name
                  // Some descriptions are "Uploaded attachments: x". We can just use it directly.
                  // E.g. "Dipongkar Uploaded attachments: x on task Y"
                  
                  return (
                    <p className="text-[15px] leading-relaxed">
                      <span className="font-semibold text-foreground">{activity.actor?.name || "System"}</span>{" "}
                      <span className="text-muted-foreground">
                        {description.toLowerCase()}
                      </span>
                      {contextText && (
                        <span className="text-foreground">
                          {" on"} <span className="font-medium">{contextText}</span>
                        </span>
                      )}
                    </p>
                  );
                };

                return (
                  <div key={activity.id} className="mb-8 relative group">
                    <div className="absolute -left-[34px] top-1 w-7 h-7 rounded-full bg-background border-2 border-muted flex items-center justify-center group-hover:border-primary/50 transition-colors z-10 shadow-sm">
                      {getIcon()}
                    </div>
                    <div className="flex flex-col ml-2">
                      {renderSentence()}
                      <span className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                        {formatTime(activity.createdAt)}
                        {activity.details?.sprint && (
                          <>
                            <span>•</span>
                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] uppercase font-medium">Sprint: {activity.details.sprint.name}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <ActivityIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground mb-1">No activity yet</p>
              <p className="text-sm">Activities will appear here when you or your team take actions.</p>
            </div>
          )}
        </div>
      </main>
    </WorkspaceShell>
  );
}