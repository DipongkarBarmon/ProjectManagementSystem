/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Activity, Bell, Building2, ChevronDown, FolderKanban, LayoutDashboard, ListTodo, LogOut, MailPlus, Menu, Moon, Settings, ShieldCheck, Sun, Users, X, Zap, Tag, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { api } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpgradeModal } from "./upgrade-modal";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Sprints", href: "/sprints", icon: Zap },
  { label: "Labels", href: "/labels", icon: Tag },
  { label: "Comments", href: "/comments", icon: MessageSquare },
];

const management = [
  { label: "Organizations", href: "/organizations", icon: Building2 },
  { label: "Invitations", href: "/invitations", icon: MailPlus },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Members", href: "/members", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Admin", href: "/admin", icon: ShieldCheck, role: "SUPER_ADMIN" },
];

export function WorkspaceShell({ children, title }: { children: ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dark = mounted && resolvedTheme === "dark";

  const [sidebarWidth, setSidebarWidth] = useState(248);
  const isResizing = useRef(false);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    if (isResizing.current) {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 450) {
        setSidebarWidth(newWidth);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const { user, logout: storeLogout } = useAuthStore();
  const { activeOrganizationId, organizations, setActiveOrganizationId } = useWorkspaceStore();
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: ["notifications", activeOrganizationId],
    queryFn: () => api.notifications.list(activeOrganizationId!),
    enabled: !!activeOrganizationId,
  });
  const markAllReadMutation = useMutation({
    mutationFn: () => api.notifications.markAllRead(activeOrganizationId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", activeOrganizationId] }),
    onError: (error: Error) => toast.error(error.message),
  });
  const [isOrganizationOpen, setIsOrganizationOpen] = useState(false);
  const activeOrganization = organizations.find((organization) => organization.id === activeOrganizationId);
  const isOrganizationAdmin = activeOrganization?.myRole === "OWNER" || activeOrganization?.myRole === "ORG_ADMIN";

  async function logout() {
    try {
      await api.auth.logout();
    } catch (e) {
      // Ignore if logout fails
    }
    storeLogout();
    router.push("/login");
  }

  function navClass(href: string) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-blue-50 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
  }

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const navItems = (items: typeof navigation) => 
    items
      .filter(item => !('role' in item) || item.role === user?.platformRole)
      .map(({ label, href, icon: Icon }) => (
        <Link key={href} href={href} onClick={() => setOpen(false)} className={navClass(href)}>
          <Icon size={17} />{label}
        </Link>
      ));

  return (
    <div 
      className="min-h-screen bg-background text-foreground"
      style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
    >
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-width)] flex-col border-r bg-card px-4 py-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          {/* Resize Handle */}
          <div 
            onMouseDown={startResizing}
            className="absolute -right-1 top-0 z-50 h-full w-2 cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500 transition-colors" 
          />
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Zap size={17} fill="currentColor" /></span>
              <span><span className="block text-[15px] font-bold tracking-tight">TaskFlow</span><span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Workspace</span></span>
            </Link>
            <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Close navigation"><X size={17} /></button>
          </div>
          <div className="mt-8 rounded-lg border bg-muted/50 p-2">
            <button
              onClick={() => setIsOrganizationOpen((open) => !open)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-card"
              aria-expanded={isOrganizationOpen}
              aria-label="Select organization"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                {(activeOrganization?.name || "MY").slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">{activeOrganization?.name || "Select organization"}</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {activeOrganization?.myRole?.replace(/_/g, " ") || "No organization selected"}
                </span>
              </span>
              <ChevronDown size={15} className="text-muted-foreground" />
            </button>
            {isOrganizationOpen && (
              <div className="mt-2 space-y-1 border-t pt-2">
                {organizations.length === 0 ? (
                  <Link
                    href="/organizations"
                    onClick={() => setIsOrganizationOpen(false)}
                    className="block rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-card hover:text-foreground"
                  >
                    Create an organization
                  </Link>
                ) : (
                  organizations.map((organization) => (
                    <button
                      key={organization.id}
                      onClick={() => {
                        setActiveOrganizationId(organization.id);
                        setIsOrganizationOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-card ${
                        organization.id === activeOrganizationId ? "bg-card font-semibold" : ""
                      }`}
                    >
                      <span className="truncate">{organization.name}</span>
                      <span className="ml-2 shrink-0 text-[10px] text-muted-foreground">
                        {organization.myRole.replace(/_/g, " ")}
                      </span>
                    </button>
                  ))
                )}
                <Link
                  href="/organizations"
                  onClick={() => setIsOrganizationOpen(false)}
                  className="block rounded-md px-2 py-1.5 text-xs text-primary hover:bg-card"
                >
                  Manage organizations
                </Link>
              </div>
            )}
          </div>
          <nav className="mt-8 space-y-1" aria-label="Workspace navigation">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
            {navItems(navigation)}
            <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Manage</p>
            {navItems(management.filter((item) =>
              (item.href !== "/organizations" && item.href !== "/invitations") || isOrganizationAdmin
            ))}
          </nav>
          <div className="relative mt-auto border-t pt-4">
            
            {/* Profile Popover */}
            {isProfileOpen && (
              <div className="absolute bottom-full left-0 mb-3 w-64 rounded-xl border bg-card p-1.5 shadow-xl dark:border-zinc-800">
                <div className="px-2.5 py-2 text-xs text-muted-foreground">
                  Signed in as <br />
                  <span className="font-semibold text-foreground">{user?.email || user?.name || "User"}</span>
                </div>
                <div className="my-1 h-px bg-border" />
                <Link href="/settings" className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm hover:bg-muted">
                  <Settings size={15} /> Settings
                </Link>
                <div className="my-1 h-px bg-border" />
                <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <LogOut size={15} /> Log out
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border-2 border-blue-600 bg-background p-1.5 text-left transition-all hover:bg-muted/50 dark:border-blue-500"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[12px] font-bold text-white">
                  {getInitials(user?.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold leading-tight">{user?.name || "User"}</span>
                  <span className="block truncate text-[11px] text-muted-foreground mt-0.5">Free</span>
                </span>
              </button>
              <button 
                onClick={() => setIsUpgradeOpen(true)}
                className="shrink-0 rounded-full border bg-card px-3.5 py-2.5 text-[11px] font-semibold transition-colors hover:bg-muted"
              >
                Upgrade
              </button>
            </div>
          </div>
        </aside>
        {open && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
        <div className="lg:pl-[var(--sidebar-width)]">
          <header className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b bg-background/90 px-5 backdrop-blur-md sm:px-8">
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Open navigation"><Menu size={20} /></button>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <span>Workspace</span><span>/</span><span className="font-medium text-foreground">{title}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setIsNotificationsOpen((value) => !value)} className="relative flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground" aria-label="Notifications">
                <Bell size={17} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-blue-600" />
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-20 top-14 z-50 w-80 rounded-xl border bg-card p-3 shadow-xl">
                  <div className="flex items-center justify-between border-b pb-2"><h3 className="text-sm font-semibold">Notifications</h3><button onClick={() => markAllReadMutation.mutate()} className="text-xs text-primary hover:underline">Mark all read</button></div>
                  <div className="max-h-80 space-y-1 overflow-auto pt-2">
                    {(notificationsQuery.data?.data || []).map((notification: any) => <div key={notification.id} className={`rounded-lg p-2 text-xs ${notification.isRead ? "text-muted-foreground" : "bg-blue-50 dark:bg-blue-950/30"}`}><p className="font-medium text-foreground">{notification.title || notification.type || "Notification"}</p><p className="mt-1">{notification.message || notification.description}</p></div>)}
                    {!notificationsQuery.isLoading && !(notificationsQuery.data?.data || []).length && <p className="p-4 text-center text-xs text-muted-foreground">You are all caught up.</p>}
                  </div>
                </div>
              )}
              <button onClick={() => setTheme(dark ? "light" : "dark")} className="flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground" aria-label="Toggle theme">
                {mounted ? (dark ? <Sun size={17} /> : <Moon size={17} />) : <span className="size-[17px]" />}
              </button>
              <button onClick={logout} className="hidden items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-xs font-semibold sm:flex" title="Log out">
                <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-[9px] font-bold text-amber-700">
                  {getInitials(user?.name)}
                </span>
                <span className="truncate max-w-[100px]">{user?.name?.split(" ")[0] || "User"}</span>
                <LogOut size={14} className="text-muted-foreground" />
              </button>
            </div>
          </header>
          {children}
      </div>
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </div>
  );
}