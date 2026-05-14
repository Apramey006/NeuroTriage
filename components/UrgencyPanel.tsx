"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Droplet,
  Hospital,
  Ambulance,
  Brain,
  Siren,
  Target,
  Activity,
  Flag,
  Plus,
  Minus,
  ListChecks,
} from "lucide-react";
import type { IntakeForm } from "@/lib/intake";
import {
  assess,
  LKW_CATEGORY_LABEL,
  LKW_CATEGORY_TONE,
  TIER_STYLES,
  type GlucoseFlag,
  type LvoConcernLevel,
} from "@/lib/triage-logic";
import LkwTimeline from "./LkwTimeline";

const LVO_STYLE: Record<
  LvoConcernLevel,
  { bg: string; text: string; ring: string }
> = {
  None: { bg: "bg-slate-100", text: "text-slate-600 dark:text-slate-300", ring: "ring-slate-200" },
  Low: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  Moderate: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    ring: "ring-amber-300",
  },
  High: { bg: "bg-rose-100", text: "text-rose-800", ring: "ring-rose-200" },
};

const GLUCOSE_LABEL: Record<GlucoseFlag, string> = {
  "critical-low": "Critical hypoglycemia",
  low: "Low — possible mimic",
  normal: "Within normal range",
  high: "Hyperglycemic",
  none: "Not measured",
};

const GLUCOSE_TONE: Record<GlucoseFlag, string> = {
  "critical-low": "bg-rose-100 text-rose-800 ring-rose-200",
  low: "bg-amber-50 text-amber-800 ring-amber-200",
  normal: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  high: "bg-amber-50 text-amber-800 ring-amber-200",
  none: "bg-slate-100 text-slate-600 dark:text-slate-300 ring-slate-200",
};

export default function UrgencyPanel({ form }: { form: IntakeForm }) {
  const a = assess(form);
  const t = TIER_STYLES[a.tier];
  const lvoStyle = LVO_STYLE[a.lvoConcern];
  const lkwTone = LKW_CATEGORY_TONE[a.lkwCategory];
  const isStat = a.tier === "STAT";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`flex items-start gap-3 px-5 py-4 ${
          isStat
            ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white"
            : "border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
        }`}
      >
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
            isStat
              ? "bg-white/20 text-white tier-stat-glow"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          <Siren className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isStat ? "text-white/80" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Decision Support
            </span>
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold tracking-wider ${t.solid}`}
            >
              {t.label}
            </span>
            <span
              className={`tabular text-[10px] font-medium ${
                isStat ? "text-white/80" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              score {a.ranking.score}
            </span>
          </div>
          <h3
            className={`mt-1 text-base font-semibold ${
              isStat ? "text-white" : "text-slate-900 dark:text-slate-50"
            }`}
          >
            {a.fastPositive
              ? "Suspected acute ischemic stroke"
              : a.tier === "ROUTINE"
                ? "No stroke-alert criteria met"
                : "Atypical or non-FAST presentation"}
          </h3>
          {isStat && (
            <p className="mt-0.5 text-sm text-white/90">
              Activate code stroke — proceed with imaging and notify
              intervention now.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4">
        <StatChip
          icon={Activity}
          label="FAST"
          value={a.fastPositive ? "Positive" : "Negative"}
          tone={
            a.fastPositive
              ? "bg-rose-50 text-rose-800 ring-rose-200"
              : "bg-emerald-50 text-emerald-700 ring-emerald-200"
          }
        />
        <StatChip
          icon={Target}
          label="LVO concern"
          value={`${a.lvoConcern}${a.lvoFeatureCount > 0 ? ` · ${a.lvoFeatureCount}/4` : ""}`}
          tone={`${lvoStyle.bg} ${lvoStyle.text} ${lvoStyle.ring}`}
        />
        <StatChip
          icon={Droplet}
          label="Glucose"
          value={GLUCOSE_LABEL[a.glucoseFlag]}
          tone={GLUCOSE_TONE[a.glucoseFlag]}
        />
        <StatChip
          icon={Brain}
          label="LKW window"
          value={LKW_CATEGORY_LABEL[a.lkwCategory]}
          tone={`${lkwTone.bg} ${lkwTone.text} ${lkwTone.ring}`}
        />
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <LkwTimeline lkwMinutes={a.lkwMinutes} />
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Ranking rationale
          </h4>
          <span className="ml-auto tabular text-[11px] font-medium text-slate-500 dark:text-slate-400">
            total {a.ranking.score}
          </span>
        </div>
        {a.ranking.factors.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Insufficient data to rank — complete intake fields above.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {a.ranking.factors.map((f, i) => {
              const positive = f.points > 0;
              const isMimic = f.kind === "mimic";
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm ${
                    isMimic
                      ? "border-rose-200 bg-rose-50/60"
                      : positive
                        ? "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                        : "border-amber-200 bg-amber-50/60"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                      isMimic
                        ? "bg-rose-600 text-white"
                        : positive
                          ? "bg-slate-900 text-white"
                          : "bg-amber-500 text-white"
                    }`}
                  >
                    {isMimic ? (
                      <AlertTriangle className="h-2.5 w-2.5" />
                    ) : positive ? (
                      <Plus className="h-3 w-3" strokeWidth={3} />
                    ) : (
                      <Minus className="h-3 w-3" strokeWidth={3} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {f.label}
                      </span>
                    </div>
                    <p className="text-xs leading-snug text-slate-600 dark:text-slate-300">
                      {f.detail}
                    </p>
                  </div>
                  <span
                    className={`tabular shrink-0 text-sm font-bold ${
                      isMimic
                        ? "text-rose-700"
                        : positive
                          ? "text-slate-900 dark:text-slate-100"
                          : "text-amber-700"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {f.points}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-0 border-t border-slate-100 dark:border-slate-800 lg:grid-cols-2">
        <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Neuro red flags
            </h4>
          </div>
          {a.neuroRedFlags.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No deficits flagged.</p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {a.neuroRedFlags.map((f) => (
                <li
                  key={f}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-800 ring-1 ring-inset ring-rose-200"
                >
                  <span className="h-1 w-1 rounded-full bg-rose-500" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          {a.glucoseFlag === "critical-low" && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>Critical hypoglycemia.</strong> Treat with D50 before
                imaging — focal deficit may resolve and represent a stroke
                mimic.
              </span>
            </div>
          )}
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Hospital className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Destination
            </h4>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                a.destination.destination === "CSC"
                  ? "bg-rose-50 text-rose-800 ring-rose-200"
                  : a.destination.destination === "PSC"
                    ? "bg-sky-50 text-sky-800 ring-sky-200"
                    : "bg-slate-100 text-slate-700 ring-slate-200"
              }`}
            >
              <Ambulance className="h-3 w-3" />
              {a.destination.destination === "Either"
                ? "Nearest stroke-ready"
                : a.destination.destination}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {a.destination.rationale}
          </p>
          <div className="mt-2 flex gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              PSC:{" "}
              <span className="tabular font-medium text-slate-700">
                {form.transportPscMinutes === ""
                  ? "—"
                  : `${form.transportPscMinutes} min`}
              </span>
            </span>
            <span>
              CSC:{" "}
              <span className="tabular font-medium text-slate-700">
                {form.transportCscMinutes === ""
                  ? "—"
                  : `${form.transportCscMinutes} min`}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Suggested workflow
          </h4>
          <span className="ml-auto text-[11px] text-slate-400">
            {a.workflow.length} steps
          </span>
        </div>
        {a.workflow.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No specific actions — reassess if symptoms evolve.
          </p>
        ) : (
          <ol className="mt-3 space-y-2">
            {a.workflow.map((step, i) => (
              <li
                key={step.id}
                className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
                  step.urgent
                    ? "border-rose-200 bg-rose-50/60"
                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                    step.urgent
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {step.label}
                    </span>
                    {step.urgent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 transition dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div
        className={`mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${tone}`}
      >
        {value}
      </div>
    </div>
  );
}
