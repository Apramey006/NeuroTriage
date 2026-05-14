"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Clock,
  Pill,
  Activity,
  Droplet,
  Gauge,
  Stethoscope,
  AlertTriangle,
  ChevronLeft,
  Siren,
  Brain,
  Target,
  Truck,
} from "lucide-react";
import Link from "next/link";
import {
  EMPTY_INTAKE,
  FAST_ITEMS,
  NEURO_DEFICIT_ITEMS,
  LVO_ITEMS,
  ANTICOAGULANT_OPTIONS,
  ARRIVAL_OPTIONS,
  isFastPositive,
  lvoConcernCount,
  type IntakeForm,
  type FastAssessment,
  type NeuroDeficits,
  type LvoConcern,
} from "@/lib/intake";
import { getNihssSeverity } from "@/lib/nihss";
import { usePatients } from "@/lib/store";
import UrgencyPanel from "./UrgencyPanel";

function SectionCard({
  icon: Icon,
  title,
  hint,
  trailing,
  tone = "default",
  children,
}: {
  icon: typeof User;
  title: string;
  hint?: string;
  trailing?: React.ReactNode;
  tone?: "default" | "alert";
  children: React.ReactNode;
}) {
  const iconBg =
    tone === "alert"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  const border =
    tone === "alert"
      ? "border-rose-200 dark:border-rose-500/30"
      : "border-slate-200 dark:border-slate-800";
  return (
    <section
      className={`rounded-2xl border ${border} bg-white shadow-sm dark:bg-slate-900`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className={`grid h-8 w-8 place-items-center rounded-lg ${iconBg}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h2>
            {hint && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {hint}
              </p>
            )}
          </div>
        </div>
        {trailing}
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-0.5 text-rose-600 dark:text-rose-400">*</span>}
      </span>
      {children}
      {hint && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {hint}
        </span>
      )}
    </label>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 disabled:bg-slate-50 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-100/10 dark:disabled:bg-slate-900 dark:disabled:text-slate-600 dark:[color-scheme:dark]";

const selectCls = inputCls + " pr-8 appearance-none";

function TogglePill({
  active,
  onClick,
  children,
  accent = "rose",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "rose" | "amber" | "slate";
}) {
  const activeStyles =
    accent === "rose"
      ? "border-rose-300 bg-rose-50 text-rose-800 ring-1 ring-rose-200 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30"
      : accent === "amber"
        ? "border-amber-300 bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30"
        : "border-slate-400 bg-slate-100 text-slate-900 ring-1 ring-slate-300 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-50 dark:ring-slate-600";
  const checkColor =
    accent === "rose"
      ? "border-rose-500 bg-rose-500"
      : accent === "amber"
        ? "border-amber-500 bg-amber-500"
        : "border-slate-700 bg-slate-700";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
        active
          ? activeStyles
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      }`}
    >
      <span
        className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
          active
            ? `${checkColor} text-white`
            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
        }`}
        aria-hidden
      >
        {active && (
          <svg
            viewBox="0 0 16 16"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M3 8.5l3 3 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

export default function IntakeForm() {
  const router = useRouter();
  const { addPatient } = usePatients();
  const [form, setForm] = useState<IntakeForm>(EMPTY_INTAKE);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof IntakeForm>(key: K, value: IntakeForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleFast(key: keyof FastAssessment) {
    setForm((f) => ({ ...f, fast: { ...f.fast, [key]: !f.fast[key] } }));
  }

  function toggleNeuro(key: keyof NeuroDeficits) {
    setForm((f) => ({
      ...f,
      neuroDeficits: { ...f.neuroDeficits, [key]: !f.neuroDeficits[key] },
    }));
  }

  function toggleLvo(key: keyof LvoConcern) {
    setForm((f) => ({
      ...f,
      lvoConcern: { ...f.lvoConcern, [key]: !f.lvoConcern[key] },
    }));
  }

  const fastPositive = isFastPositive(form.fast);
  const lvoCount = lvoConcernCount(form.lvoConcern);

  const nihssSeverity = useMemo(() => {
    if (form.nihssEstimate === "") return null;
    return getNihssSeverity(Number(form.nihssEstimate));
  }, [form.nihssEstimate]);

  const bpAlert =
    form.bpSystolic !== "" &&
    form.bpDiastolic !== "" &&
    (Number(form.bpSystolic) > 185 || Number(form.bpDiastolic) > 110);

  const glucoseAlert =
    form.bloodGlucose !== "" &&
    (Number(form.bloodGlucose) < 50 || Number(form.bloodGlucose) > 400);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const patient = addPatient(form);
    setTimeout(() => router.push(`/triage/${patient.id}`), 600);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            New Patient Intake
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Capture initial triage information. All fields can be refined during
            assessment.
          </p>
        </div>
      </div>

      {fastPositive && (
        <div
          role="alert"
          className="relative overflow-hidden rounded-xl border border-rose-300 bg-gradient-to-r from-rose-50 to-rose-100/60 shadow-sm"
        >
          <div className="absolute inset-y-0 left-0 w-1.5 bg-rose-600" />
          <div className="flex items-start gap-3 px-5 py-4 pl-6">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-600 text-white shadow-sm">
              <Siren className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  Stroke Alert
                </span>
                <span className="inline-flex items-center rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  FAST positive
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-rose-900">
                Activate code stroke. Notify neurology, mobilize CT, and confirm
                last known well.
              </p>
              <p className="mt-0.5 text-xs text-rose-800/80">
                Positive on:{" "}
                {[
                  form.fast.faceDrooping && "Face",
                  form.fast.armWeakness && "Arm",
                  form.fast.speechDifficulty && "Speech",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <SectionCard icon={User} title="Demographics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Age" required>
            <input
              type="number"
              min={0}
              max={120}
              className={inputCls + " tabular"}
              placeholder="e.g. 68"
              value={form.age}
              onChange={(e) =>
                update("age", e.target.value === "" ? "" : Number(e.target.value))
              }
              required
            />
          </Field>
          <Field label="Sex" required>
            <select
              className={selectCls}
              value={form.sex}
              onChange={(e) => update("sex", e.target.value as IntakeForm["sex"])}
              required
            >
              <option value="" disabled>
                Select…
              </option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Mode of Arrival" required>
            <select
              className={selectCls}
              value={form.arrivalMode}
              onChange={(e) =>
                update(
                  "arrivalMode",
                  e.target.value as IntakeForm["arrivalMode"]
                )
              }
              required
            >
              <option value="" disabled>
                Select…
              </option>
              {ARRIVAL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        icon={Activity}
        title="FAST Assessment"
        hint="Face · Arm · Speech · Time — any positive triggers code stroke"
        tone={fastPositive ? "alert" : "default"}
        trailing={
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              fastPositive
                ? "bg-rose-600 text-white"
                : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {fastPositive ? "Positive" : "Negative"}
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FAST_ITEMS.map((item) => {
            const active = form.fast[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleFast(item.key)}
                aria-pressed={active}
                className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? "border-rose-400 bg-rose-50 ring-1 ring-rose-300 dark:border-rose-500/50 dark:bg-rose-500/10 dark:ring-rose-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-lg text-lg font-bold ${
                      active
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {item.letter}
                  </span>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      active
                        ? "text-rose-700 dark:text-rose-300"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {active ? "Present" : "Absent"}
                  </span>
                </div>
                <div>
                  <div
                    className={`text-sm font-semibold ${
                      active
                        ? "text-rose-900 dark:text-rose-100"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </div>
                  <p
                    className={`mt-0.5 text-xs leading-snug ${
                      active
                        ? "text-rose-800/80 dark:text-rose-200/80"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.prompt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              T — Time / Last Known Well
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Last known well (date & time)"
              required={!form.lastKnownWellUnknown}
            >
              <input
                type="datetime-local"
                className={inputCls + " tabular"}
                value={form.lastKnownWell}
                disabled={form.lastKnownWellUnknown}
                onChange={(e) => update("lastKnownWell", e.target.value)}
                required={!form.lastKnownWellUnknown}
              />
            </Field>
            <div className="flex items-end">
              <label className="inline-flex w-full cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                  checked={form.lastKnownWellUnknown}
                  onChange={(e) =>
                    update("lastKnownWellUnknown", e.target.checked)
                  }
                />
                Unknown — wake-up or unwitnessed
              </label>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={Brain}
        title="Neurological Deficits"
        hint="Select all observed deficits"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {NEURO_DEFICIT_ITEMS.map((item) => (
            <TogglePill
              key={item.key}
              active={form.neuroDeficits[item.key]}
              onClick={() => toggleNeuro(item.key)}
              accent="rose"
            >
              {item.label}
            </TogglePill>
          ))}
        </div>
        <div className="mt-4">
          <Field label="Additional notes">
            <textarea
              rows={2}
              className={inputCls + " h-auto resize-y py-2 leading-relaxed"}
              placeholder="e.g. onset while watching TV, witnessed by spouse…"
              value={form.symptomNotes}
              onChange={(e) => update("symptomNotes", e.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        icon={Target}
        title="LVO Concern Screening"
        hint="Cortical and severity features suggesting large vessel occlusion"
        trailing={
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              lvoCount >= 2
                ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
                : lvoCount === 1
                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {lvoCount} of {LVO_ITEMS.length}
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LVO_ITEMS.map((item) => {
            const active = form.lvoConcern[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleLvo(item.key)}
                aria-pressed={active}
                className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  active
                    ? "border-amber-300 bg-amber-50 ring-1 ring-amber-200 dark:border-amber-500/40 dark:bg-amber-500/10 dark:ring-amber-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
                    active
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                  aria-hidden
                >
                  {active && (
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        d="M3 8.5l3 3 7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <div>
                  <div
                    className={`text-sm font-medium ${
                      active
                        ? "text-amber-900 dark:text-amber-100"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </div>
                  <p
                    className={`text-xs ${
                      active
                        ? "text-amber-800/80 dark:text-amber-200/80"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.hint}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {lvoCount >= 2 && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>{lvoCount} LVO features</strong> present — consider CT
              angiography and early IR notification.
            </span>
          </div>
        )}
      </SectionCard>

      <SectionCard
        icon={Pill}
        title="Anticoagulant Use"
        hint="Affects tPA eligibility"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Current anticoagulant" required>
            <select
              className={selectCls}
              value={form.anticoagulant}
              onChange={(e) =>
                update(
                  "anticoagulant",
                  e.target.value as IntakeForm["anticoagulant"]
                )
              }
            >
              {ANTICOAGULANT_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </Field>
          <Field label="Last dose" hint="Date/time of last dose, if known">
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. yesterday 8pm, 36h ago, unknown"
              value={form.anticoagulantLastDose}
              onChange={(e) => update("anticoagulantLastDose", e.target.value)}
              disabled={form.anticoagulant === "None"}
            />
          </Field>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard
          icon={Stethoscope}
          title="NIHSS Estimate"
          hint="Quick bedside estimate"
        >
          <Field label="Estimated NIHSS (0–42)">
            <input
              type="number"
              min={0}
              max={42}
              className={inputCls + " tabular"}
              placeholder="0"
              value={form.nihssEstimate}
              onChange={(e) =>
                update(
                  "nihssEstimate",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>
          {nihssSeverity && (
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-medium ${nihssSeverity.bgColor} ${nihssSeverity.color}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {nihssSeverity.label} stroke severity
            </div>
          )}
        </SectionCard>

        <SectionCard icon={Droplet} title="Blood Glucose" hint="mg/dL">
          <Field label="Glucose">
            <input
              type="number"
              min={0}
              max={1000}
              className={inputCls + " tabular"}
              placeholder="e.g. 110"
              value={form.bloodGlucose}
              onChange={(e) =>
                update(
                  "bloodGlucose",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>
          {glucoseAlert && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700 ring-1 ring-inset ring-rose-200">
              <AlertTriangle className="h-3.5 w-3.5" />
              Out of tPA-safe range (50–400)
            </div>
          )}
        </SectionCard>

        <SectionCard icon={Gauge} title="Blood Pressure" hint="mmHg">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Systolic">
              <input
                type="number"
                min={0}
                max={300}
                className={inputCls + " tabular"}
                placeholder="SBP"
                value={form.bpSystolic}
                onChange={(e) =>
                  update(
                    "bpSystolic",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </Field>
            <Field label="Diastolic">
              <input
                type="number"
                min={0}
                max={200}
                className={inputCls + " tabular"}
                placeholder="DBP"
                value={form.bpDiastolic}
                onChange={(e) =>
                  update(
                    "bpDiastolic",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </Field>
          </div>
          {bpAlert && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
              <AlertTriangle className="h-3.5 w-3.5" />
              BP exceeds 185/110 — manage before tPA
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        icon={Truck}
        title="Transport Workflow"
        hint="Estimated transit time to stroke centers — informs destination decision"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Nearest Primary Stroke Center (PSC)"
            hint="Estimated minutes to PSC"
          >
            <input
              type="number"
              min={0}
              max={600}
              className={inputCls + " tabular"}
              placeholder="e.g. 12"
              value={form.transportPscMinutes}
              onChange={(e) =>
                update(
                  "transportPscMinutes",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>
          <Field
            label="Nearest Comprehensive Stroke Center (CSC)"
            hint="Estimated minutes to CSC (capable of thrombectomy)"
          >
            <input
              type="number"
              min={0}
              max={600}
              className={inputCls + " tabular"}
              placeholder="e.g. 28"
              value={form.transportCscMinutes}
              onChange={(e) =>
                update(
                  "transportCscMinutes",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>
        </div>
        <p className="mt-3 text-[11px] text-slate-500">
          If LVO concern is high and the CSC is within reasonable additional
          time, direct CSC transport is suggested in the panel below.
        </p>
      </SectionCard>

      <UrgencyPanel form={form} />

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/90 px-6 py-3 backdrop-blur lg:-mx-10 lg:px-10 dark:border-slate-800 dark:bg-slate-950/90">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitted}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-60"
        >
          {submitted ? "Adding to queue…" : "Add patient to queue"}
        </button>
      </div>
    </form>
  );
}
