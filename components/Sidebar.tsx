"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Activity,
  Sparkles,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/triage/new", label: "New Triage", icon: PlusCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:flex">
      <div className="flex h-[68px] items-center gap-2.5 border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white shadow-sm shadow-rose-600/30">
          <Activity className="h-4 w-4" strokeWidth={2.6} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            NeuroTriage
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Stroke decision support
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white shadow-sm dark:bg-slate-50 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  active
                    ? ""
                    : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200"
                }`}
              />
              {label}
              {active && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Stroke team on call
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            Dr. R. Patel · Neurology
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Dr. M. Chen · Interventional
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/60 px-2.5 py-2 dark:border-rose-500/20 dark:bg-rose-500/5">
          <Sparkles className="h-3 w-3 shrink-0 text-rose-600 dark:text-rose-400" />
          <p className="text-[10px] leading-snug text-rose-800 dark:text-rose-300">
            AI assist active — rankings update in real time
          </p>
        </div>
      </div>
    </aside>
  );
}
