export type Sex = "Male" | "Female" | "Other";

export type CaseStatus =
  | "tPA Eligible"
  | "Thrombectomy Only"
  | "Outside Window"
  | "Observation"
  | "Completed";

export interface NihssScores {
  item1a: number; // LOC 0-3
  item1b: number; // LOC Questions 0-2
  item1c: number; // LOC Commands 0-2
  item2: number; // Gaze 0-2
  item3: number; // Visual 0-3
  item4: number; // Facial Palsy 0-3
  item5a: number; // Motor Arm Left 0-4
  item5b: number; // Motor Arm Right 0-4
  item6a: number; // Motor Leg Left 0-4
  item6b: number; // Motor Leg Right 0-4
  item7: number; // Limb Ataxia 0-2
  item8: number; // Sensory 0-2
  item9: number; // Language 0-3
  item10: number; // Dysarthria 0-2
  item11: number; // Extinction 0-2
}

export interface Contraindications {
  priorIch: boolean;
  headTraumaStroke3m: boolean;
  mi3m: boolean;
  giUrinaryBleed21d: boolean;
  majorSurgery14d: boolean;
  bpUncontrolled: boolean;
  activeBleedingDiathesis: boolean;
  plateletLow: boolean;
  glucoseAbnormal: boolean;
  inrElevated: boolean;
  heparin48h: boolean;
  directThrombin: boolean;
}

export interface LvoFeatures {
  suddenSevereHeadache: boolean;
  gazeDeviation: boolean;
  hemispatialNeglect: boolean;
  nihssGte6: boolean; // auto-computed
  armDriftLegWeakness: boolean;
}

export interface ActionChecklist {
  ctHead: boolean;
  ctAngio: boolean;
  labs: boolean;
  ecg: boolean;
  neurologyConsult: boolean;
  neurosurgeryIrNotification: boolean;
}

export interface PatientInfo {
  mrn: string;
  age: number | "";
  sex: Sex;
  weight: number | ""; // kg
  codeActivatedTime: string; // ISO datetime string
  lastKnownWell: string; // ISO datetime string
  unknownOnset: boolean;
}

export interface TriageCase {
  id: string;
  patientInfo: PatientInfo;
  nihssScores: NihssScores;
  contraindications: Contraindications;
  lvoFeatures: LvoFeatures;
  actionChecklist: ActionChecklist;
  status: CaseStatus;
  recommendation: string;
  createdAt: string;
  updatedAt: string;
}
