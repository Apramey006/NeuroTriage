"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Trash2,
  Brain,
  RefreshCcw,
  Activity,
  Target,
  Droplet,
  Plus,
  Minus,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { usePatients } from "@/lib/store";
import { formatMinutes } from "@/lib/time";
import {
  assess,
  LKW_CATEGORY_LABEL,
  LKW_CATEGORY_TONE,
  TIER_STYLES,
  type RankFactor,
  type Tier,
} from "@/lib/triage-logic";
import LkwTimeline from "./LkwTimeline";

const LKW_TONE_DARK: Record<string, string> = {
  "0-4.5h":
    "dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
  "4.5-6h":
    "dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
  "6-24h": "dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30",
  ">24h":
    "dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700",
  unknown:
    "dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30",
};

export default function PriorityQueue() {
  const { patients, hydrated, removePatient, resetSeed } = usePatients();
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const ranked = useMemo(() => {
    return [...patients]
      .map((p) => ({ p, a: assess(p.intake, now) }))
      .sort((x, y) => {
        const r = y.a.ranking.score - x.a.ranking.score;
        if (r !== 0) return r;
        const xm = x.a.lkwMinutes ?? Number.POSITIVE_INFINITY;
        const ym = y.a.lkwMinutes ?? Number.POSITIVE_INFINITY;
        return xm - ym;
      });
  }, [patients, now]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 ring-1 ring-slate-200 dark:from-slate-800 dark:to-slate-900 dark:ring-slate-700">
            <Brain className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="flex flex-col leading-tight">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Priority Queue
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <Sparkles className="h-2.5 w-2.5 text-rose-500 dark:text-rose-400" />
              Ranked by AI · {hydrated ? ranked.length : "…"} patients
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={resetSeed}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {!hydrated && (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="flex items-start gap-4 px-5 py-5 shimmer"
            >
              <div className="h-10 w-12 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-2 w-48 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-1.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {hydrated && ranked.length === 0 && (
        <div className="px-5 py-14 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No patients in the queue.
          </p>
          <Link
            href="/triage/new"
            className="mt-3 inline-flex items-center rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            + Add first patient
          </Link>
        </div>
      )}

      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {ranked.map(({ p, a }, idx) => {
          const t = TIER_STYLES[a.tier];
          const isStat = a.tier === "STAT";
          return (
            <li
              key={p.id}
              className="group relative"
              style={{
                animation: `var(--animate-fade-in)`,
                animationDelay: `${idx * 50}ms`,
              }}
            >
              {isStat && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-rose-500 to-rose-700"
                />
              )}
              <Link
                href={`/triage/${p.id}`}
                className="block px-5 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-start gap-4">
                  <div className="flex w-12 flex-col items-center gap-1.5 pt-0.5">
                    <span className="tabular text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      #{idx + 1}
                    </span>
                    <TierBadge tier={a.tier} pulse={isStat} />
                    <span className="tabular text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {a.ranking.score}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="tabular text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        {p.mrn}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {p.intake.age || "—"}/
                        {p.intake.sex ? p.intake.sex[0] : "—"}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">
                        ·
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {p.intake.arrivalMode || "Unknown arrival"}
                      </span>
                      <span
                        className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${LKW_CATEGORY_TONE[a.lkwCategory].bg} ${LKW_CATEGORY_TONE[a.lkwCategory].text} ${LKW_CATEGORY_TONE[a.lkwCategory].ring} ${LKW_TONE_DARK[a.lkwCategory] ?? ""}`}
                      >
                        {LKW_CATEGORY_LABEL[a.lkwCategory]}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Chip
                        icon={Activity}
                        label={a.fastPositive ? "FAST +" : "FAST −"}
                        tone={
                          a.fastPositive
                            ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30"
                            : "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"
                        }
                      />
                      <Chip
                        icon={Target}
                        label={`LVO ${a.lvoConcern}`}
                        tone={
                          a.lvoConcern === "High"
                            ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30"
                            : a.lvoConcern === "Moderate" ||
                                a.lvoConcern === "Low"
                              ? "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30"
                              : "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"
                        }
                      />
                      <Chip
                        label={`NIHSS ${
                          p.intake.nihssEstimate === ""
                            ? "—"
                            : p.intake.nihssEstimate
                        }`}
                        tone="bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                      />
                      {(a.glucoseFlag === "critical-low" ||
                        a.glucoseFlag === "low") && (
                        <Chip
                          icon={Droplet}
                          label={
                            a.glucoseFlag === "critical-low"
                              ? "Hypoglycemia!"
                              : "Glucose low"
                          }
                          tone="bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30"
                        />
                      )}
                      <span className="ml-auto tabular text-[10px] text-slate-400 dark:text-slate-500">
                        {a.lkwMinutes === null
                          ? "LKW unknown"
                          : `${formatMinutes(a.lkwMinutes)} since LKW`}
                      </span>
                    </div>

                    <div className="mt-3">
                      <LkwTimeline lkwMinutes={a.lkwMinutes} compact />
                    </div>

                    <ReasoningBlock
                      factors={a.ranking.topReasons}
                      tier={a.tier}
                    />
                  </div>

                  <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400" />
                </div>
              </Link>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm(`Remove ${p.mrn} from the queue?`)) {
                    removePatient(p.id);
                  }
                }}
                className="absolute right-12 top-4 hidden h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 group-hover:grid"
                aria-label="Remove patient"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function TierBadge({ tier, pulse }: { tier: Tier; pulse: boolean }) {
  const t = TIER_STYLES[tier];
  return (
    <span
      className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-[10px] font-bold tracking-wider transition ${t.solid} ${
        pulse ? "tier-stat-glow" : ""
      }`}
    >
      {t.label}
    </span>
  );
}

function ReasoningBlock({
  factors,
  tier,
}: {
  factors: RankFactor[];
  tier: Tier;
}) {
  if (factors.length === 0) return null;
  const t = TIER_STYLES[tier];
  const softDark =
    tier === "STAT"
      ? "dark:bg-rose-500/5 dark:border-rose-500/20"
      : tier === "URGENT"
        ? "dark:bg-amber-500/5 dark:border-amber-500/20"
        : "dark:bg-sky-500/5 dark:border-sky-500/20";
  const textDark =
    tier === "STAT"
      ? "dark:text-rose-300"
      : tier === "URGENT"
        ? "dark:text-amber-300"
        : "dark:text-sky-300";
  return (
    <div
      className={`mt-3 rounded-lg border ${t.accent} ${t.soft} ${softDark} px-3 py-2`}
    >
      <div className="flex items-center gap-1.5">
        <Sparkles className={`h-2.5 w-2.5 ${t.text} ${textDark}`} />
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${t.text} ${textDark}`}
        >
          Why ranked here
        </span>
      </div>
      <ul className="mt-1.5 space-y-1">
        {factors.map((f, i) => {
          const positive = f.points > 0;
          const isMimic = f.kind === "mimic";
          return (
            <li key={i} className="flex items-start gap-2 text-[11px]">
              <span
                className={`mt-1 grid h-3 w-3 shrink-0 place-items-center rounded-full ${
                  isMimic
                    ? "bg-rose-200 text-rose-800 dark:bg-rose-500/30 dark:text-rose-200"
                    : positive
                      ? "bg-white text-slate-700 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600"
                      : "bg-amber-200 text-amber-800 dark:bg-amber-500/30 dark:text-amber-200"
                }`}
              >
                {isMimic ? (
                  <AlertTriangle className="h-2 w-2" />
                ) : positive ? (
                  <Plus className="h-2 w-2" strokeWidth={3} />
                ) : (
                  <Minus className="h-2 w-2" strokeWidth={3} />
                )}
              </span>
              <span className="flex-1 leading-snug text-slate-700 dark:text-slate-300">
                <span className="font-semibold">{f.label}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {" "}
                  · {f.detail}
                </span>
              </span>
              <span
                className={`tabular shrink-0 font-semibold ${
                  isMimic
                    ? "text-rose-700 dark:text-rose-300"
                    : positive
                      ? "text-slate-700 dark:text-slate-200"
                      : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {positive ? "+" : ""}
                {f.points}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Chip({
  icon: Icon,
  label,
  tone,
}: {
  icon?: typeof Activity;
  label: string;
  tone: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${tone}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
}
