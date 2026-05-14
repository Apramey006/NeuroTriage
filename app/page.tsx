import {
  Image as ImageIcon,
  UserCheck,
  Pill,
  ClipboardCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import { formatRelative } from "@/lib/time";
import DashboardStats from "@/components/DashboardStats";
import PriorityQueue from "@/components/PriorityQueue";

const KIND_ICON = {
  imaging: ImageIcon,
  consult: UserCheck,
  treatment: Pill,
  admit: ClipboardCheck,
  alert: AlertTriangle,
} as const;

const KIND_TONE = {
  imaging:
    "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  consult:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  treatment:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  admit:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  alert:
    "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
} as const;

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_0%,rgba(225,29,72,0.10),transparent_70%)] dark:bg-[radial-gradient(120%_60%_at_100%_0%,rgba(251,113,133,0.18),transparent_70%)]"
        />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                <Sparkles className="h-2.5 w-2.5" />
                AI assist
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live · 4 patients tracked
              </span>
            </div>
            <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
              Code Stroke Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              AI-prioritized triage queue · explainable rankings · scan top to
              bottom.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Auto-updating
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Door-to-needle:{" "}
              <span className="tabular font-semibold text-slate-900 dark:text-slate-100">
                42m
              </span>{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                −6m
              </span>
            </div>
          </div>
        </div>
      </section>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PriorityQueue />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Recent Activity
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Last 60 min
            </span>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_ACTIVITY.map((evt, i) => {
              const Icon = KIND_ICON[evt.kind];
              return (
                <li
                  key={evt.id}
                  className="flex gap-3 px-5 py-3.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  style={{
                    animation: `var(--animate-fade-in)`,
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  <div
                    className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${KIND_TONE[evt.kind]}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800 dark:text-slate-200">
                      {evt.message}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="tabular font-medium text-slate-600 dark:text-slate-300">
                        {evt.mrn}
                      </span>
                      <span>·</span>
                      <span>{formatRelative(evt.timestamp)}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
