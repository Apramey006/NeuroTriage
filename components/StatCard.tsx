import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  trend?: { value: string; positive?: boolean };
  icon: LucideIcon;
  tone?: "default" | "rose" | "amber" | "emerald";
  pulse?: boolean;
}

const TONES = {
  default:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  amber:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  emerald:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
} as const;

export default function StatCard({
  label,
  value,
  hint,
  trend,
  icon: Icon,
  tone = "default",
  pulse = false,
}: Props) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <div
          className={`grid h-8 w-8 place-items-center rounded-lg ${TONES[tone]} ${
            pulse ? "tier-stat-glow" : ""
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="tabular text-[34px] font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-50">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.positive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}
