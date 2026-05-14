"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { EMPTY_INTAKE, type IntakeForm } from "./intake";

export interface IntakePatient {
  id: string;
  mrn: string;
  intake: IntakeForm;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "neurotriage:patients:v1";
const listeners = new Set<() => void>();
let cache: IntakePatient[] | null = null;

function read(): IntakePatient[] {
  if (typeof window === "undefined") return [];
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw) as IntakePatient[];
      return cache;
    }
  } catch {
    // ignore
  }
  cache = seed();
  write(cache);
  return cache;
}

function write(next: IntakePatient[]) {
  cache = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function genMrn() {
  return `MRN-${Math.floor(40000 + Math.random() * 9999)}`;
}

function isoMinutesAgo(min: number) {
  return new Date(Date.now() - min * 60_000).toISOString();
}

function isoLkw(min: number) {
  const d = new Date(Date.now() - min * 60_000);
  // datetime-local format: YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function seed(): IntakePatient[] {
  return [
    {
      id: "seed-1",
      mrn: "MRN-48201",
      createdAt: isoMinutesAgo(38),
      updatedAt: isoMinutesAgo(4),
      intake: {
        ...EMPTY_INTAKE,
        age: 72,
        sex: "Female",
        arrivalMode: "EMS",
        fast: {
          faceDrooping: true,
          armWeakness: true,
          speechDifficulty: true,
        },
        neuroDeficits: {
          unilateralWeakness: true,
          numbness: false,
          visionLoss: false,
          dizzinessAtaxia: false,
          confusion: false,
          severeHeadache: false,
          alteredMentalStatus: false,
        },
        lvoConcern: {
          gazeDeviation: true,
          aphasia: true,
          neglectCorticalSigns: false,
          severeUnilateralWeakness: true,
        },
        lastKnownWell: isoLkw(95),
        anticoagulant: "None",
        nihssEstimate: 14,
        bloodGlucose: 118,
        bpSystolic: 172,
        bpDiastolic: 94,
        transportPscMinutes: 8,
        transportCscMinutes: 22,
      },
    },
    {
      id: "seed-2",
      mrn: "MRN-48198",
      createdAt: isoMinutesAgo(180),
      updatedAt: isoMinutesAgo(12),
      intake: {
        ...EMPTY_INTAKE,
        age: 64,
        sex: "Male",
        arrivalMode: "Transfer",
        fast: {
          faceDrooping: true,
          armWeakness: true,
          speechDifficulty: false,
        },
        neuroDeficits: {
          unilateralWeakness: true,
          numbness: true,
          visionLoss: false,
          dizzinessAtaxia: false,
          confusion: false,
          severeHeadache: false,
          alteredMentalStatus: false,
        },
        lvoConcern: {
          gazeDeviation: true,
          aphasia: false,
          neglectCorticalSigns: true,
          severeUnilateralWeakness: true,
        },
        lastKnownWell: isoLkw(380),
        anticoagulant: "DOAC (apixaban/rivaroxaban/edoxaban)",
        anticoagulantLastDose: "yesterday 9pm",
        nihssEstimate: 18,
        bloodGlucose: 142,
        bpSystolic: 198,
        bpDiastolic: 112,
        transportPscMinutes: 10,
        transportCscMinutes: 28,
      },
    },
    {
      id: "seed-3",
      mrn: "MRN-48189",
      createdAt: isoMinutesAgo(20),
      updatedAt: isoMinutesAgo(2),
      intake: {
        ...EMPTY_INTAKE,
        age: 58,
        sex: "Male",
        arrivalMode: "Walk-in",
        fast: {
          faceDrooping: false,
          armWeakness: true,
          speechDifficulty: false,
        },
        neuroDeficits: {
          unilateralWeakness: false,
          numbness: true,
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
        lastKnownWell: isoLkw(45),
        anticoagulant: "Antiplatelet only",
        anticoagulantLastDose: "this morning",
        nihssEstimate: 3,
        bloodGlucose: 96,
        bpSystolic: 138,
        bpDiastolic: 84,
        transportPscMinutes: 12,
        transportCscMinutes: 35,
      },
    },
  ];
}

const emptyServer: IntakePatient[] = [];

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function usePatients(): {
  patients: IntakePatient[];
  hydrated: boolean;
  addPatient: (intake: IntakeForm) => IntakePatient;
  updatePatient: (id: string, intake: IntakeForm) => void;
  removePatient: (id: string) => void;
  resetSeed: () => void;
} {
  const snap = useSyncExternalStore(
    subscribe,
    () => read(),
    () => emptyServer
  );
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return {
    patients: snap,
    hydrated,
    addPatient: (intake: IntakeForm) => {
      const p: IntakePatient = {
        id: genId(),
        mrn: genMrn(),
        intake,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      write([p, ...read()]);
      return p;
    },
    updatePatient: (id, intake) => {
      const next = read().map((p) =>
        p.id === id
          ? { ...p, intake, updatedAt: new Date().toISOString() }
          : p
      );
      write(next);
    },
    removePatient: (id) => {
      write(read().filter((p) => p.id !== id));
    },
    resetSeed: () => {
      cache = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      write(seed());
    },
  };
}

export function usePatient(id: string): {
  patient: IntakePatient | undefined;
  hydrated: boolean;
} {
  const { patients, hydrated } = usePatients();
  return { patient: patients.find((p) => p.id === id), hydrated };
}
