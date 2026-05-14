"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2, User } from "lucide-react";
import { usePatient, usePatients } from "@/lib/store";
import UrgencyPanel from "./UrgencyPanel";
import {
  FAST_ITEMS,
  NEURO_DEFICIT_ITEMS,
  LVO_ITEMS,
} from "@/lib/intake";

export default function PatientDetail({ id }: { id: string }) {
  const router = useRouter();
  const { patient, hydrated } = usePatient(id);
  const { removePatient } = usePatients();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading patient…</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Patient not found
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The patient {id} is not in the local queue.
          </p>
        </div>
      </div>
    );
  }

  const { intake } = patient;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>
          <h1 className="mt-1 flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {patient.mrn}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              {intake.age || "—"}/{intake.sex || "—"} ·{" "}
              {intake.arrivalMode || "Unknown arrival"}
            </span>
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Remove ${patient.mrn} from the queue?`)) {
              removePatient(patient.id);
              router.push("/");
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>

      <UrgencyPanel form={intake} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Intake Details
          </h2>
        </div>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Age / Sex">
            {intake.age || "—"} / {intake.sex || "—"}
          </Detail>
          <Detail label="Arrival">{intake.arrivalMode || "—"}</Detail>
          <Detail label="Last known well">
            {intake.lastKnownWellUnknown
              ? "Unknown · wake-up"
              : intake.lastKnownWell || "—"}
          </Detail>
          <Detail label="FAST positives">
            {FAST_ITEMS.filter((i) => intake.fast[i.key])
              .map((i) => i.label)
              .join(", ") || "None"}
          </Detail>
          <Detail label="Neuro deficits">
            {NEURO_DEFICIT_ITEMS.filter((i) => intake.neuroDeficits[i.key])
              .map((i) => i.label)
              .join(", ") || "None"}
          </Detail>
          <Detail label="LVO features">
            {LVO_ITEMS.filter((i) => intake.lvoConcern[i.key])
              .map((i) => i.label)
              .join(", ") || "None"}
          </Detail>
          <Detail label="NIHSS estimate">
            {intake.nihssEstimate === "" ? "—" : intake.nihssEstimate}
          </Detail>
          <Detail label="Blood pressure">
            {intake.bpSystolic && intake.bpDiastolic
              ? `${intake.bpSystolic} / ${intake.bpDiastolic} mmHg`
              : "—"}
          </Detail>
          <Detail label="Glucose">
            {intake.bloodGlucose === ""
              ? "—"
              : `${intake.bloodGlucose} mg/dL`}
          </Detail>
          <Detail label="Anticoagulant">
            {intake.anticoagulant}
            {intake.anticoagulantLastDose
              ? ` · last dose ${intake.anticoagulantLastDose}`
              : ""}
          </Detail>
          <Detail label="Transport · PSC">
            {intake.transportPscMinutes === ""
              ? "—"
              : `${intake.transportPscMinutes} min`}
          </Detail>
          <Detail label="Transport · CSC">
            {intake.transportCscMinutes === ""
              ? "—"
              : `${intake.transportCscMinutes} min`}
          </Detail>
          {intake.symptomNotes && (
            <div className="sm:col-span-2 lg:col-span-3">
              <Detail label="Notes">{intake.symptomNotes}</Detail>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-slate-900 dark:text-slate-50">{children}</dd>
    </div>
  );
}
