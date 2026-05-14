"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Bell, Menu, Sparkles, Activity } from "lucide-react";
import { formatClock, formatDate } from "@/lib/time";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:border-slate-800 dark:bg-slate-950/85 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="flex h-[68px] items-center gap-3 px-4 lg:px-8">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 md:hidden">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-sm">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </div>
        </div>

        <div className="hidden flex-col leading-tight md:flex">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              NeuroTriage
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              <Sparkles className="h-2.5 w-2.5" />
              AI Assist
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            AI-assisted stroke workflow prioritization
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden flex-col items-end leading-tight md:flex">
            <span className="tabular text-sm font-semibold text-slate-900 dark:text-slate-100">
              {now ? formatClock(now) : "--:--:--"}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {now ? formatDate(now) : ""}
            </span>
          </div>

          <span className="hidden h-8 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

          <ThemeToggle />

          <button
            type="button"
            className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          </button>

          <Link
            href="/triage/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-b from-rose-500 to-rose-600 px-3.5 text-sm font-semibold text-white shadow-sm shadow-rose-600/20 transition hover:from-rose-500 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/40 dark:from-rose-500 dark:to-rose-600"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Patient
          </Link>
        </div>
      </div>
    </header>
  );
}
