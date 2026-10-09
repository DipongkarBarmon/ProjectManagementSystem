"use client";

import { Activity, Bell, ChevronDown, FolderKanban, LayoutDashboard, ListTodo, LogOut, Menu, Moon, Settings, ShieldCheck, Sun, Users, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { api } from "@/lib/api-client";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Sprints", href: "/sprints", icon: Zap },
];

const management = [
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Members", href: "/members", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Admin", href: "/admin", icon: ShieldCheck, role: "SUPER_ADMIN" },
];

export function WorkspaceShell({ children, title }: { children: ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  const { user, logout: storeLogout } = useAuthStore();

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
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r bg-card px-4 py-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Zap size={17} fill="currentColor" /></span>
              <span><span className="block text-[15px] font-bold tracking-tight">TaskFlow</span><span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Workspace</span></span>
            </Link>
            <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Close navigation"><X size={17} /></button>
          </div>
          <div className="mt-8 rounded-lg border bg-muted/50 p-2">
            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-card">
              <span className="flex size-7 items-center justify-center rounded-md bg-slate-900 text-[11px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">MY</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">My Organizations</span>
                <span className="block text-[11px] text-muted-foreground">View all</span>
              </span>
              <ChevronDown size={15} className="text-muted-foreground" />
            </button>
          </div>
          <nav className="mt-8 space-y-1" aria-label="Workspace navigation">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
            {navItems(navigation)}
            <p className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Manage</p>
            {navItems(management)}
          </nav>
          <div className="mt-auto border-t pt-4">
            <div className="flex items-center gap-3 px-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-700">
                {getInitials(user?.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">{user?.name || "User"}</span>
                <span className="block text-[11px] text-muted-foreground">{user?.platformRole === "SUPER_ADMIN" ? "Super Admin" : "User"}</span>
              </span>
              <button onClick={logout} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600" aria-label="Log out" title="Log out"><LogOut size={15} /></button>
            </div>
          </div>
        </aside>
        {open && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
        <div className="lg:pl-[248px]">
          <header className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b bg-background/90 px-5 backdrop-blur-md sm:px-8">
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Open navigation"><Menu size={20} /></button>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <span>Workspace</span><span>/</span><span className="font-medium text-foreground">{title}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="relative flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground" aria-label="Notifications">
                <Bell size={17} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-blue-600" />
              </button>
              <button onClick={() => setDark(!dark)} className="flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground" aria-label="Toggle theme">
                {dark ? <Sun size={17} /> : <Moon size={17} />}
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
      </div>
    </div>
  );
}