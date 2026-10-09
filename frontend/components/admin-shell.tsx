/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Activity, Bell, LayoutDashboard, LogOut, Menu, Moon, ShieldCheck, Sun, Users, X, CreditCard, Building, Banknote, ListPlus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { api } from "@/lib/api-client";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Organizations", href: "/admin/organizations", icon: Building },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Plans", href: "/admin/plans", icon: ListPlus },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Payments", href: "/admin/payments", icon: Banknote },
  { label: "Activity Logs", href: "/admin/activity", icon: Activity },
];

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
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
    const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
  }

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r bg-card px-4 py-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-2">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white"><ShieldCheck size={17} fill="currentColor" /></span>
              <span><span className="block text-[15px] font-bold tracking-tight">TaskFlow</span><span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600">Platform Admin</span></span>
            </Link>
            <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Close navigation"><X size={17} /></button>
          </div>
          
          <nav className="mt-8 space-y-1" aria-label="Admin navigation">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Admin Portal</p>
            {navigation.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={navClass(href)}>
                <Icon size={17} />{label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t pt-4">
            <Link href="/" className="mb-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              ← Return to Workspace
            </Link>
            <div className="flex items-center gap-3 px-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700">
                {getInitials(user?.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">{user?.name || "Admin"}</span>
                <span className="block text-[11px] text-muted-foreground">Super Admin</span>
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
              <span>Admin Portal</span><span>/</span><span className="font-medium text-foreground">{title}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setDark(!dark)} className="flex size-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground" aria-label="Toggle theme">
                {dark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
