"use client";

import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace-shell";

const sections = {
  Projects: { eyebrow: "Workspace", description: "Keep every initiative visible, focused, and moving forward.", action: "New project" },
  Tasks: { eyebrow: "Workspace", description: "Your team's work, organized by priority and momentum.", action: "New task" },
  Teams: { eyebrow: "Workspace", description: "Build clear ownership around the work that matters.", action: "New team" },
  Sprints: { eyebrow: "Workspace", description: "Plan a realistic slice of work and finish it together.", action: "New sprint" },
  Activity: { eyebrow: "Manage", description: "A clear history of the decisions and changes in your workspace.", action: "Export activity" },
  Members: { eyebrow: "Manage", description: "Invite people, manage access, and see who owns what.", action: "Invite member" },
  Settings: { eyebrow: "Manage", description: "Shape your workspace and personal preferences.", action: "Save changes" },
} as const;

type SectionName = keyof typeof sections;
const rows = [
  { name: "E-commerce platform", detail: "18 tasks · 6 members", status: "In progress", progress: 72, accent: "bg-blue-600" },
  { name: "Mobile app redesign", detail: "12 tasks · 4 members", status: "In progress", progress: 46, accent: "bg-teal-600" },
  { name: "Marketing website", detail: "7 tasks · 3 members", status: "In review", progress: 88, accent: "bg-amber-500" },
  { name: "Internal operations", detail: "24 tasks · 8 members", status: "Planning", progress: 24, accent: "bg-violet-600" },
];

export function SectionView({ section }: { section: SectionName }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const config = sections[section];
  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()) && (filter === "All" || row.status === filter));

  return <WorkspaceShell title={section}><main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary">{config.eyebrow}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">{section}</h1><p className="mt-1.5 text-sm text-muted-foreground">{config.description}</p></div><button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-blue-700"><Plus size={17} />{config.action}</button></div><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">Active work</p><p className="mt-2 text-2xl font-semibold">12</p><p className="mt-2 text-xs text-emerald-600">+8.4% this month</p></div><div className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">On track</p><p className="mt-2 text-2xl font-semibold">84%</p><p className="mt-2 text-xs text-muted-foreground">Across this workspace</p></div><div className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">Due this week</p><p className="mt-2 text-2xl font-semibold">18</p><p className="mt-2 text-xs text-amber-600">Needs attention</p></div></div><div className="mt-6 overflow-hidden rounded-xl border bg-card"><div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3 sm:w-72"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${section.toLowerCase()}`} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></div><div className="flex items-center gap-2"><div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">{["All", "In progress", "In review"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${filter === item ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{item}</button>)}</div><button className="rounded-lg border p-2 text-muted-foreground hover:bg-muted" aria-label="Filter"><Filter size={15} /></button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">Name</th><th className="px-5 py-3 font-semibold">Progress</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Updated</th><th /></tr></thead><tbody className="divide-y">{filteredRows.map((row) => <tr key={row.name} className="group hover:bg-muted/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`size-2.5 rounded-full ${row.accent}`} /><div><p className="font-semibold">{row.name}</p><p className="mt-1 text-xs text-muted-foreground">{row.detail}</p></div></div></td><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="h-1.5 w-28 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${row.progress}%` }} /></div><span className="text-xs font-semibold">{row.progress}%</span></div></td><td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">{row.status}</span></td><td className="px-5 py-4 text-xs text-muted-foreground">Today, 10:24</td><td className="px-5 py-4"><button className="rounded-md p-1.5 text-muted-foreground opacity-0 hover:bg-muted group-hover:opacity-100" aria-label={`More options for ${row.name}`}><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table>{filteredRows.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No results found.</div>}</div></div></main></WorkspaceShell>;
}