"use client";

import { ArrowRight, Bell, CheckCircle2, CircleCheck, ChevronDown, FolderKanban, ListTodo, LogOut, Moon, PlayCircle, Sparkles, Sun, Target, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store/auth-store";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

const features = [
  [FolderKanban, "Projects with direction", "Keep milestones, owners, and progress visible without the noise."],
  [ListTodo, "Tasks that move", "Turn large initiatives into clear work with priorities and due dates."],
  [Users, "Teams in sync", "Give every teammate a clear place to collaborate and contribute."],
];

type NotificationItem = {
  id: string;
  title?: string;
  type?: string;
  message?: string;
  description?: string;
  isRead?: boolean;
};

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();
  const activeOrganizationId = useWorkspaceStore((state) => state.activeOrganizationId);
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: ["notifications", activeOrganizationId],
    queryFn: () => api.notifications.list(activeOrganizationId!),
    enabled: isAuthenticated && !!activeOrganizationId,
  });
  const dashboardHref = user?.platformRole === "SUPER_ADMIN" ? "/admin" : "/dashboard";
  const dark = mounted && resolvedTheme === "dark";
  const notifications = notificationsQuery.data?.data || [];
  const unreadCount = notifications.filter((notification: NotificationItem) => !notification.isRead).length;

  useEffect(() => {
    // next-themes resolves the browser theme after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      if (!controlsRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeMenus);
    return () => document.removeEventListener("pointerdown", closeMenus);
  }, []);
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  async function logout() {
    await api.auth.logout().catch(() => undefined);
    useAuthStore.getState().logout();
    router.push("/login");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur-xl">
        <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-blue-500/20"><Zap size={18} fill="currentColor" /></span>
            TaskFlow
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#why-taskflow" className="transition-colors hover:text-foreground">Why TaskFlow</a>
          </div>
          <div ref={controlsRef} className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <>
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen((open) => !open);
                  setIsProfileOpen(false);
                }}
                className="relative flex size-10 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
              >
                <Bell size={17} />
                {!!unreadCount && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-blue-600" />}
              </button>
              <button
                type="button"
                onClick={() => setTheme(dark ? "light" : "dark")}
                className="flex size-10 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle theme"
              >
                {mounted ? (dark ? <Sun size={17} /> : <Moon size={17} />) : <span className="size-[17px]" />}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-[11rem] top-16 z-50 w-80 rounded-xl border bg-card p-1.5 shadow-xl">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <span className="text-sm font-semibold">Notifications</span>
                    {!!unreadCount && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await api.notifications.markAllRead(activeOrganizationId!);
                            await queryClient.invalidateQueries({ queryKey: ["notifications", activeOrganizationId] });
                          } catch {
                            // Keep the notification menu open when marking read fails.
                          }
                        }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <div className="max-h-64 space-y-1 overflow-y-auto">
                    {notifications.map((notification: NotificationItem) => (
                      <div key={notification.id} className={`rounded-lg p-2 text-xs ${notification.isRead ? "text-muted-foreground" : "bg-blue-50 dark:bg-blue-950/30"}`}>
                        <p className="font-medium text-foreground">{notification.title || notification.type || "Notification"}</p>
                        <p className="mt-1">{notification.message || notification.description}</p>
                      </div>
                    ))}
                    {!notificationsQuery.isLoading && !notifications.length && <p className="p-4 text-center text-xs text-muted-foreground">You are all caught up.</p>}
                  </div>
                </div>
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen((open) => !open);
                    setIsNotificationsOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                    {initials}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border bg-card p-1.5 shadow-xl" role="menu">
                    <div className="px-2.5 py-2 text-xs text-muted-foreground">
                      Signed in as <span className="font-semibold text-foreground">{user.email}</span>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm hover:bg-muted"
                      role="menuitem"
                    >
                      <ArrowRight size={15} /> Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      role="menuitem"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Sign in</Link>
                <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-blue-700 hover:shadow-md">Get started <ArrowRight size={15} /></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[radial-gradient(circle_at_70%_20%,rgba(37,99,235,.18),transparent_38%),radial-gradient(circle_at_10%_10%,rgba(14,165,233,.12),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm"><Sparkles size={13} /> A calmer way to ship work</div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Your team’s work, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">finally in sync.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">TaskFlow connects projects, tasks, sprints, and people in one focused workspace—so everyone knows what matters next.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-500/20 hover:bg-blue-700">Start for free <ArrowRight size={16} /></Link>
              <Link href="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-card px-6 text-sm font-semibold hover:bg-muted"><PlayCircle size={16} className="text-primary" /> Go to dashboard</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" />Built for teams</span><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" />Projects to done</span><span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" />Simple collaboration</span></div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border bg-slate-950 p-4 shadow-2xl shadow-blue-900/20 sm:min-h-[500px] sm:p-7">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[.07] p-4 text-white backdrop-blur-md sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-300">Workspace overview</p><p className="mt-2 text-xl font-semibold">Launch campaign</p></div><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">On track</span></div>
              <div className="mt-7 h-2 rounded-full bg-white/10"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" /></div><div className="mt-2 flex justify-between text-xs text-slate-400"><span>24 of 31 tasks complete</span><span>78%</span></div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-400">Active sprint</p><p className="mt-2 text-lg font-semibold">Sprint 06</p><p className="mt-1 text-xs text-emerald-300">8 tasks in progress</p></div><div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-400">Team pulse</p><p className="mt-2 text-lg font-semibold">Everything clear</p><p className="mt-1 text-xs text-blue-300">12 teammates aligned</p></div></div>
            </div>
            <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/[.05] p-4 text-white"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300"><Target size={16} /></span><div><p className="text-sm font-semibold">Next up</p><p className="text-xs text-slate-400">Review campaign analytics with the team</p></div><CircleCheck size={18} className="ml-auto text-emerald-300" /></div></div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="max-w-2xl"><p className="text-sm font-semibold text-primary">Everything in one rhythm</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Less chasing. More meaningful progress.</h2><p className="mt-4 leading-7 text-muted-foreground">TaskFlow gives every project a home and every teammate a clear next step.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">{features.map(([Icon, title, description]) => <div key={title as string} className="rounded-2xl border bg-background p-6 transition-transform hover:-translate-y-1"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300"><Icon size={19} /></span><h3 className="mt-5 font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description as string}</p></div>)}</div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div><p className="text-sm font-semibold text-primary">How TaskFlow works</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">A simple path from plan to progress.</h2><p className="mt-4 leading-7 text-muted-foreground">Set up your workspace once, then let your team focus on the work instead of searching for it.</p><Link href="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Create your workspace <ArrowRight size={15} /></Link></div>
          <div className="grid gap-4 sm:grid-cols-3">{[["01", "Create a workspace", "Bring your projects and people together."], ["02", "Plan the work", "Break goals into tasks, sprints, and owners."], ["03", "Ship with clarity", "Track progress and keep every update visible."]].map(([number, title, description]) => <div key={number} className="rounded-2xl border bg-card p-5"><span className="text-sm font-bold text-primary">{number}</span><h3 className="mt-8 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></div>)}</div>
        </div>
      </section>

      <section id="why-taskflow" className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-semibold text-blue-300">Ready when you are</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Give your team a better way to work.</h2></div><Link href="/register" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 hover:bg-blue-50">Start using TaskFlow <ArrowRight size={16} /></Link></div>
      </section>

      <footer className="border-t bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 font-bold text-white">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500 text-white"><Zap size={16} fill="currentColor" /></span>
                TaskFlow
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Projects, people, and progress in one calm workspace built for teams that want to keep moving.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Explore</p>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <a href="#features" className="block transition-colors hover:text-white">Features</a>
                <a href="#how-it-works" className="block transition-colors hover:text-white">How it works</a>
                <a href="#why-taskflow" className="block transition-colors hover:text-white">Why TaskFlow</a>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Get started</p>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <Link href="/login" className="block transition-colors hover:text-white">Sign in</Link>
                <Link href="/register" className="block transition-colors hover:text-white">Create account</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} TaskFlow. All rights reserved.</span>
            <span>Make the work visible. Keep the momentum.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}