"use client";

import { useEffect, useState } from "react";
import { formatMinutes } from "@/lib/time";
import {
  computeLkwCategory,
  LKW_CATEGORY_LABEL,
} from "@/lib/triage-logic";

const SEGMENTS = [
  { label: "tPA", from: 0, to: 270, color: "bg-emerald-400" },
  { label: "Extended IV", from: 270, to: 360, color: "bg-amber-400" },
  { label: "EVT window", from: 360, to: 1440, color: "bg-sky-400" },
  { label: "Outside", from: 1440, to: 1800, color: "bg-slate-300" },
];

const TICKS = [
  { at: 270, label: "4.5h" },
  { at: 360, label: "6h" },
  { at: 1440, label: "24h" },
];

const SCALE_MAX = 1800; // 30h on the timeline

interface Props {
  lkwMinutes: number | null;
  compact?: boolean;
}

export default function LkwTimeline({ lkwMinutes, compact = false }: Props) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const cat = computeLkwCategory(lkwMinutes);
  const isUnknown = lkwMinutes === null;
  const clamped = isUnknown ? 0 : Math.min(SCALE_MAX, lkwMinutes);
  const pct = (clamped / SCALE_MAX) * 100;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Time since LKW
            </span>
            <span className="tabular text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isUnknown
                ? "Unknown"
                : lkwMinutes !== null
                  ? formatMinutes(lkwMinutes)
                  : "—"}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
            {LKW_CATEGORY_LABEL[cat]}
          </span>
        </div>
      )}

      <div className="relative">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {SEGMENTS.map((s) => {
            const width = ((s.to - s.from) / SCALE_MAX) * 100;
            const active =
              !isUnknown &&
              lkwMinutes !== null &&
              lkwMinutes >= s.from &&
              lkwMinutes < s.to;
            return (
              <div
                key={s.label}
                className={`${s.color} ${active ? "opacity-100" : "opacity-30"} transition-opacity`}
                style={{ width: `${width}%` }}
                title={s.label}
              />
            );
          })}
        </div>

        {!isUnknown && lkwMinutes !== null && (
          <div
            className="absolute -top-1 h-4 w-0.5 -translate-x-1/2 bg-slate-900 dark:bg-slate-100"
            style={{ left: `${pct}%` }}
            aria-hidden
          >
            <span className="absolute -top-1.5 left-1/2 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-slate-900 ring-2 ring-white dark:bg-slate-100 dark:ring-slate-900">
              <span className="h-1 w-1 rounded-full bg-white dark:bg-slate-900" />
            </span>
          </div>
        )}

        <div className="relative mt-1.5 h-3">
          {TICKS.map((t) => (
            <div
              key={t.at}
              className="absolute -translate-x-1/2 text-[10px] font-medium text-slate-500 tabular dark:text-slate-400"
              style={{ left: `${(t.at / SCALE_MAX) * 100}%` }}
            >
              {t.label}
            </div>
          ))}
          <div className="absolute right-0 text-[10px] font-medium text-slate-400 tabular dark:text-slate-500">
            30h+
          </div>
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-4 gap-1.5">
          {SEGMENTS.map((s) => {
            const active =
              !isUnknown &&
              lkwMinutes !== null &&
              lkwMinutes >= s.from &&
              lkwMinutes < s.to;
            return (
              <div
                key={s.label}
                className={`rounded-md border px-2 py-1.5 text-[10px] transition ${
                  active
                    ? "border-slate-300 bg-white text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${s.color}`}
                  />
                  <span className="font-semibold">{s.label}</span>
                </div>
                <div className="tabular text-[10px] text-slate-500 dark:text-slate-400">
                  {formatMinutes(s.from)}–
                  {s.to >= 1800 ? "30h+" : formatMinutes(s.to)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
