import type { Sex } from "./types";

export type ArrivalMode = "EMS" | "Walk-in" | "Transfer" | "In-hospital";

export type AnticoagulantStatus =
  | "None"
  | "Warfarin"
  | "DOAC (apixaban/rivaroxaban/edoxaban)"
  | "Dabigatran"
  | "Heparin / LMWH"
  | "Antiplatelet only"
  | "Unknown";

export interface FastAssessment {
  faceDrooping: boolean;
  armWeakness: boolean;
  speechDifficulty: boolean;
}

export interface NeuroDeficits {
  unilateralWeakness: boolean;
  numbness: boolean;
  visionLoss: boolean;
  dizzinessAtaxia: boolean;
  confusion: boolean;
  severeHeadache: boolean;
  alteredMentalStatus: boolean;
}

export interface LvoConcern {
  gazeDeviation: boolean;
  aphasia: boolean;
  neglectCorticalSigns: boolean;
  severeUnilateralWeakness: boolean;
}

export interface IntakeForm {
  age: number | "";
  sex: Sex | "";
  fast: FastAssessment;
  neuroDeficits: NeuroDeficits;
  lvoConcern: LvoConcern;
  symptomNotes: string;
  lastKnownWell: string; // datetime-local string
  lastKnownWellUnknown: boolean;
  anticoagulant: AnticoagulantStatus;
  anticoagulantLastDose: string; // free text
  nihssEstimate: number | "";
  bloodGlucose: number | ""; // mg/dL
  bpSystolic: number | "";
  bpDiastolic: number | "";
  arrivalMode: ArrivalMode | "";
  transportPscMinutes: number | "";
  transportCscMinutes: number | "";
}

export const EMPTY_INTAKE: IntakeForm = {
  age: "",
  sex: "",
  fast: {
    faceDrooping: false,
    armWeakness: false,
    speechDifficulty: false,
  },
  neuroDeficits: {
    unilateralWeakness: false,
    numbness: false,
    visionLoss: false,
    dizzinessAtaxia: false,
    confusion: false,
    severeHeadache: false,
    alteredMentalStatus: false,
  },
  lvoConcern: {
    gazeDeviation: false,
    aphasia: false,
    neglectCorticalSigns: false,
    severeUnilateralWeakness: false,
  },
  symptomNotes: "",
  lastKnownWell: "",
  lastKnownWellUnknown: false,
  anticoagulant: "None",
  anticoagulantLastDose: "",
  nihssEstimate: "",
  bloodGlucose: "",
  bpSystolic: "",
  bpDiastolic: "",
  arrivalMode: "",
  transportPscMinutes: "",
  transportCscMinutes: "",
};

export const ANTICOAGULANT_OPTIONS: AnticoagulantStatus[] = [
  "None",
  "Warfarin",
  "DOAC (apixaban/rivaroxaban/edoxaban)",
  "Dabigatran",
  "Heparin / LMWH",
  "Antiplatelet only",
  "Unknown",
];

export const ARRIVAL_OPTIONS: ArrivalMode[] = [
  "EMS",
  "Walk-in",
  "Transfer",
  "In-hospital",
];

export const FAST_ITEMS: {
  key: keyof FastAssessment;
  letter: string;
  label: string;
  prompt: string;
}[] = [
  {
    key: "faceDrooping",
    letter: "F",
    label: "Face drooping",
    prompt: "Ask the patient to smile. Does one side of the face droop?",
  },
  {
    key: "armWeakness",
    letter: "A",
    label: "Arm weakness",
    prompt: "Ask to raise both arms. Does one drift downward?",
  },
  {
    key: "speechDifficulty",
    letter: "S",
    label: "Speech difficulty",
    prompt: "Ask to repeat a simple phrase. Is speech slurred or strange?",
  },
];

export const NEURO_DEFICIT_ITEMS: {
  key: keyof NeuroDeficits;
  label: string;
}[] = [
  { key: "unilateralWeakness", label: "Unilateral weakness" },
  { key: "numbness", label: "Numbness" },
  { key: "visionLoss", label: "Vision loss" },
  { key: "dizzinessAtaxia", label: "Dizziness / ataxia" },
  { key: "confusion", label: "Confusion" },
  { key: "severeHeadache", label: "Severe headache" },
  { key: "alteredMentalStatus", label: "Altered mental status" },
];

export const LVO_ITEMS: {
  key: keyof LvoConcern;
  label: string;
  hint: string;
}[] = [
  {
    key: "gazeDeviation",
    label: "Gaze deviation",
    hint: "Forced conjugate deviation",
  },
  { key: "aphasia", label: "Aphasia", hint: "Expressive or receptive" },
  {
    key: "neglectCorticalSigns",
    label: "Neglect / cortical signs",
    hint: "Hemispatial inattention",
  },
  {
    key: "severeUnilateralWeakness",
    label: "Severe unilateral weakness",
    hint: "Dense hemiparesis",
  },
];

export function isFastPositive(f: FastAssessment): boolean {
  return f.faceDrooping || f.armWeakness || f.speechDifficulty;
}

export function lvoConcernCount(l: LvoConcern): number {
  return Object.values(l).filter(Boolean).length;
}
