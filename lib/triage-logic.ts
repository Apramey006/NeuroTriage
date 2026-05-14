import type { IntakeForm } from "./intake";
import {
  isFastPositive,
  lvoConcernCount,
  NEURO_DEFICIT_ITEMS,
} from "./intake";

export type LkwCategory =
  | "0-4.5h"
  | "4.5-6h"
  | "6-24h"
  | ">24h"
  | "unknown";

export type Urgency = "Critical" | "High" | "Elevated" | "Moderate" | "Low";

export type Tier = "STAT" | "URGENT" | "ROUTINE";

export interface RankFactor {
  label: string;
  detail: string;
  points: number;
  kind: "boost" | "caution" | "mimic";
}

export interface Ranking {
  score: number;
  tier: Tier;
  factors: RankFactor[];
  topReasons: RankFactor[];
}

export const TIER_STYLES: Record<
  Tier,
  {
    label: string;
    solid: string;
    soft: string;
    text: string;
    ring: string;
    dot: string;
    accent: string;
  }
> = {
  STAT: {
    label: "STAT",
    solid: "bg-rose-600 text-white",
    soft: "bg-rose-50",
    text: "text-rose-800",
    ring: "ring-rose-200",
    dot: "bg-rose-600",
    accent: "border-rose-300",
  },
  URGENT: {
    label: "URGENT",
    solid: "bg-amber-500 text-white",
    soft: "bg-amber-50",
    text: "text-amber-800",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
    accent: "border-amber-300",
  },
  ROUTINE: {
    label: "ROUTINE",
    solid: "bg-sky-600 text-white",
    soft: "bg-sky-50",
    text: "text-sky-800",
    ring: "ring-sky-200",
    dot: "bg-sky-600",
    accent: "border-sky-200",
  },
};

export function urgencyToTier(u: Urgency): Tier {
  if (u === "Critical" || u === "High") return "STAT";
  if (u === "Elevated" || u === "Moderate") return "URGENT";
  return "ROUTINE";
}

export type LvoConcernLevel = "None" | "Low" | "Moderate" | "High";

export type GlucoseFlag =
  | "critical-low"
  | "low"
  | "normal"
  | "high"
  | "none";

export interface WorkflowStep {
  id: string;
  label: string;
  detail: string;
  urgent: boolean;
}

export interface DestinationSuggestion {
  destination: "PSC" | "CSC" | "Either";
  rationale: string;
}

export const URGENCY_RANK: Record<Urgency, number> = {
  Critical: 5,
  High: 4,
  Elevated: 3,
  Moderate: 2,
  Low: 1,
};

export const URGENCY_STYLES: Record<
  Urgency,
  { label: string; bg: string; ring: string; text: string; dot: string }
> = {
  Critical: {
    label: "Critical",
    bg: "bg-rose-600",
    ring: "ring-rose-700",
    text: "text-white",
    dot: "bg-white",
  },
  High: {
    label: "High",
    bg: "bg-rose-100",
    ring: "ring-rose-200",
    text: "text-rose-800",
    dot: "bg-rose-600",
  },
  Elevated: {
    label: "Elevated",
    bg: "bg-amber-100",
    ring: "ring-amber-200",
    text: "text-amber-800",
    dot: "bg-amber-600",
  },
  Moderate: {
    label: "Moderate",
    bg: "bg-sky-100",
    ring: "ring-sky-200",
    text: "text-sky-800",
    dot: "bg-sky-600",
  },
  Low: {
    label: "Low",
    bg: "bg-slate-100",
    ring: "ring-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-500",
  },
};

export const LKW_CATEGORY_LABEL: Record<LkwCategory, string> = {
  "0-4.5h": "0–4.5h · tPA window",
  "4.5-6h": "4.5–6h · extended IV",
  "6-24h": "6–24h · EVT window",
  ">24h": ">24h · outside window",
  unknown: "Unknown · wake-up protocol",
};

export const LKW_CATEGORY_TONE: Record<
  LkwCategory,
  { bg: string; text: string; ring: string }
> = {
  "0-4.5h": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
  },
  "4.5-6h": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  "6-24h": {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
  },
  ">24h": {
    bg: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-200",
  },
  unknown: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-200",
  },
};

export function getLkwMinutes(
  form: Pick<IntakeForm, "lastKnownWell" | "lastKnownWellUnknown">,
  now: Date = new Date()
): number | null {
  if (form.lastKnownWellUnknown) return null;
  if (!form.lastKnownWell) return null;
  const t = new Date(form.lastKnownWell).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((now.getTime() - t) / 60000));
}

export function computeLkwCategory(minutes: number | null): LkwCategory {
  if (minutes === null) return "unknown";
  if (minutes <= 270) return "0-4.5h";
  if (minutes <= 360) return "4.5-6h";
  if (minutes <= 1440) return "6-24h";
  return ">24h";
}

export function computeLvoConcern(form: IntakeForm): LvoConcernLevel {
  const screenCount = lvoConcernCount(form.lvoConcern);
  const nihss =
    typeof form.nihssEstimate === "number" ? form.nihssEstimate : 0;

  let score = screenCount;
  if (nihss >= 6) score += 1;
  if (nihss >= 10) score += 2;
  if (form.lvoConcern.severeUnilateralWeakness) score += 1;
  if (form.lvoConcern.gazeDeviation && form.lvoConcern.aphasia) score += 1;

  if (score >= 5) return "High";
  if (score >= 3) return "Moderate";
  if (score >= 1) return "Low";
  return "None";
}

export function computeGlucoseFlag(g: number | ""): GlucoseFlag {
  if (g === "") return "none";
  const n = Number(g);
  if (n < 40) return "critical-low";
  if (n < 60) return "low";
  if (n > 400) return "high";
  return "normal";
}

export function neuroRedFlags(form: IntakeForm): string[] {
  return NEURO_DEFICIT_ITEMS.filter((i) => form.neuroDeficits[i.key]).map(
    (i) => i.label
  );
}

export function computeUrgency(form: IntakeForm): Urgency {
  const fast = isFastPositive(form.fast);
  const cat = computeLkwCategory(getLkwMinutes(form));
  const lvo = computeLvoConcern(form);
  const neuroCount = neuroRedFlags(form).length;

  if (
    fast &&
    (cat === "0-4.5h" || cat === "unknown") &&
    (lvo === "High" || lvo === "Moderate")
  ) {
    return "Critical";
  }
  if (fast && cat === "0-4.5h") return "High";
  if (fast && (cat === "4.5-6h" || cat === "6-24h")) return "Elevated";
  if (lvo === "High") return "Elevated";
  if (fast && cat === ">24h") return "Moderate";
  if (!fast && (neuroCount > 0 || lvo !== "None")) return "Moderate";
  return "Low";
}

export function suggestDestination(form: IntakeForm): DestinationSuggestion {
  const lvo = computeLvoConcern(form);
  const psc =
    form.transportPscMinutes === "" ? null : Number(form.transportPscMinutes);
  const csc =
    form.transportCscMinutes === "" ? null : Number(form.transportCscMinutes);

  if (lvo === "High") {
    if (csc !== null && (psc === null || csc - psc <= 30)) {
      return {
        destination: "CSC",
        rationale: `High LVO concern — direct CSC transport (${csc} min) favored over PSC + transfer delay.`,
      };
    }
    if (psc !== null) {
      return {
        destination: "PSC",
        rationale: `High LVO concern but CSC too distant — stabilize at PSC (${psc} min), plan emergent transfer.`,
      };
    }
    return {
      destination: "CSC",
      rationale: "High LVO concern — CSC capable of thrombectomy preferred.",
    };
  }

  if (lvo === "Moderate") {
    if (csc !== null && psc !== null && csc - psc <= 15) {
      return {
        destination: "CSC",
        rationale: `Moderate LVO concern — CSC (${csc} min) within reasonable additional time.`,
      };
    }
    return {
      destination: "PSC",
      rationale: "Moderate LVO concern — PSC for initial imaging and IV thrombolysis.",
    };
  }

  return {
    destination: "Either",
    rationale: "No high-grade LVO features — nearest stroke-ready center.",
  };
}

export function suggestWorkflow(form: IntakeForm): WorkflowStep[] {
  const steps: WorkflowStep[] = [];
  const fast = isFastPositive(form.fast);
  const lvo = computeLvoConcern(form);
  const cat = computeLkwCategory(getLkwMinutes(form));
  const glucose = computeGlucoseFlag(form.bloodGlucose);
  const neuroCount = neuroRedFlags(form).length;
  const inTpaWindow = cat === "0-4.5h";

  if (fast || lvo !== "None" || neuroCount > 0) {
    steps.push({
      id: "alert",
      label: "Activate stroke alert",
      detail: "Page neurology, stroke team, and CT tech.",
      urgent: true,
    });
  }

  steps.push({
    id: "glucose",
    label: "Check blood glucose",
    detail: "Rule out hypoglycemia stroke mimic before imaging.",
    urgent: glucose === "critical-low" || glucose === "low",
  });

  if (glucose === "critical-low" || glucose === "low") {
    steps.push({
      id: "treat-hypo",
      label: "Treat hypoglycemia",
      detail:
        glucose === "critical-low"
          ? "D50 1 amp IV push. Recheck in 15 min. Reassess deficit after correction."
          : "Correct glucose. Reassess neuro exam after normalization.",
      urgent: true,
    });
  }

  if (fast || lvo !== "None" || neuroCount > 0) {
    steps.push({
      id: "ct",
      label: "Non-contrast CT head",
      detail: "Rule out hemorrhage. Target door-to-CT ≤25 min.",
      urgent: inTpaWindow,
    });
  }

  if (lvo === "Moderate" || lvo === "High") {
    steps.push({
      id: "cta",
      label: "CT angiography head/neck",
      detail: "Confirm large vessel occlusion and map collaterals.",
      urgent: lvo === "High",
    });
  }

  if ((cat === "6-24h" || cat === "unknown") && (lvo === "Moderate" || lvo === "High")) {
    steps.push({
      id: "perfusion",
      label: "CT perfusion or MRI DWI/FLAIR",
      detail: "Extended-window EVT selection (DAWN / DEFUSE-3).",
      urgent: lvo === "High",
    });
  }

  if (lvo === "High") {
    steps.push({
      id: "ir",
      label: "Notify neurointervention team",
      detail: "Mobilize IR suite for possible thrombectomy.",
      urgent: true,
    });
  }

  const sbp = form.bpSystolic === "" ? null : Number(form.bpSystolic);
  const dbp = form.bpDiastolic === "" ? null : Number(form.bpDiastolic);
  if (
    inTpaWindow &&
    ((sbp !== null && sbp > 185) || (dbp !== null && dbp > 110))
  ) {
    steps.push({
      id: "bp",
      label: "Manage BP <185/110",
      detail: "Labetalol 10–20 mg IV or nicardipine drip; required pre-tPA.",
      urgent: true,
    });
  }

  return steps;
}

export function rankPatient(form: IntakeForm): Ranking {
  const factors: RankFactor[] = [];
  const fast = isFastPositive(form.fast);
  const lkwMinutes = getLkwMinutes(form);
  const cat = computeLkwCategory(lkwMinutes);
  const lvo = computeLvoConcern(form);
  const flags = neuroRedFlags(form);
  const glucose = computeGlucoseFlag(form.bloodGlucose);
  const psc =
    form.transportPscMinutes === "" ? null : Number(form.transportPscMinutes);
  const csc =
    form.transportCscMinutes === "" ? null : Number(form.transportCscMinutes);
  const nihss =
    typeof form.nihssEstimate === "number" ? form.nihssEstimate : 0;

  // 1. Last Known Well — highest-priority variable
  if (cat === "0-4.5h") {
    factors.push({
      label: "Within tPA window",
      detail: "Last known well ≤4.5h — IV thrombolysis available",
      points: 50,
      kind: "boost",
    });
  } else if (cat === "4.5-6h") {
    factors.push({
      label: "Extended IV window",
      detail: "Last known well 4.5–6h — select IV cases per imaging",
      points: 35,
      kind: "boost",
    });
  } else if (cat === "6-24h") {
    factors.push({
      label: "EVT window",
      detail: "Last known well 6–24h — thrombectomy eligibility by perfusion",
      points: 25,
      kind: "boost",
    });
  } else if (cat === ">24h") {
    factors.push({
      label: "Outside acute window",
      detail: "Last known well >24h — supportive care and workup",
      points: 5,
      kind: "caution",
    });
  } else {
    factors.push({
      label: "LKW unknown · wake-up",
      detail: "Treat as actionable pending MRI DWI/FLAIR mismatch",
      points: 28,
      kind: "caution",
    });
  }

  // 2. FAST positivity
  if (fast) {
    const which = [
      form.fast.faceDrooping && "Face",
      form.fast.armWeakness && "Arm",
      form.fast.speechDifficulty && "Speech",
    ]
      .filter(Boolean)
      .join("/");
    factors.push({
      label: "FAST positive",
      detail: `${which} — classic stroke presentation`,
      points: 30,
      kind: "boost",
    });
  }

  // 3. LVO concern
  if (lvo === "High") {
    factors.push({
      label: "High LVO concern",
      detail: "Cortical + severity features suggest large vessel occlusion",
      points: 40,
      kind: "boost",
    });
  } else if (lvo === "Moderate") {
    factors.push({
      label: "Moderate LVO concern",
      detail: "Some LVO features — CTA indicated",
      points: 22,
      kind: "boost",
    });
  } else if (lvo === "Low") {
    factors.push({
      label: "Low LVO concern",
      detail: "Isolated cortical feature — keep on differential",
      points: 8,
      kind: "boost",
    });
  }

  // 4. Neuro deficits + NIHSS
  if (flags.length > 0) {
    const pts = Math.min(20, flags.length * 5);
    factors.push({
      label: `${flags.length} neuro deficit${flags.length > 1 ? "s" : ""}`,
      detail: flags.join(", "),
      points: pts,
      kind: "boost",
    });
  }
  if (nihss >= 16) {
    factors.push({
      label: `NIHSS ${nihss} · severe`,
      detail: "Major deficit — disabling stroke",
      points: 15,
      kind: "boost",
    });
  } else if (nihss >= 6) {
    factors.push({
      label: `NIHSS ${nihss} · moderate`,
      detail: "Significant deficit — meets LVO screening threshold",
      points: 8,
      kind: "boost",
    });
  }

  // 5. Glucose concern — possible mimic
  if (glucose === "critical-low") {
    factors.push({
      label: "Critical hypoglycemia",
      detail: "Likely stroke mimic — treat and reassess before imaging",
      points: -20,
      kind: "mimic",
    });
  } else if (glucose === "low") {
    factors.push({
      label: "Low glucose",
      detail: "Possible mimic — correct and reassess deficit",
      points: -8,
      kind: "mimic",
    });
  } else if (glucose === "high") {
    factors.push({
      label: "Hyperglycemia",
      detail: "Outside tPA-safe range — manage glucose",
      points: -3,
      kind: "caution",
    });
  }

  // 6. Transport considerations
  if (lvo === "High" || lvo === "Moderate") {
    if (csc !== null && (psc === null || csc - psc <= 30)) {
      factors.push({
        label: "CSC accessible",
        detail: `Direct CSC transport (${csc} min) favored for thrombectomy`,
        points: 8,
        kind: "boost",
      });
    } else if (psc !== null && csc !== null && csc - psc > 30) {
      factors.push({
        label: "CSC transfer required",
        detail: `CSC +${csc - psc} min — drip-and-ship from PSC`,
        points: -4,
        kind: "caution",
      });
    }
  }

  const score = factors.reduce((s, f) => s + f.points, 0);
  const urgency = computeUrgency(form);
  const tier = urgencyToTier(urgency);

  const topReasons = [...factors]
    .sort((a, b) => Math.abs(b.points) - Math.abs(a.points))
    .slice(0, 4);

  return { score, tier, factors, topReasons };
}

export interface TriageAssessment {
  urgency: Urgency;
  tier: Tier;
  ranking: Ranking;
  fastPositive: boolean;
  lvoConcern: LvoConcernLevel;
  lvoFeatureCount: number;
  glucoseFlag: GlucoseFlag;
  lkwMinutes: number | null;
  lkwCategory: LkwCategory;
  neuroRedFlags: string[];
  destination: DestinationSuggestion;
  workflow: WorkflowStep[];
}

export function assess(form: IntakeForm, now: Date = new Date()): TriageAssessment {
  const lkwMinutes = getLkwMinutes(form, now);
  const urgency = computeUrgency(form);
  return {
    urgency,
    tier: urgencyToTier(urgency),
    ranking: rankPatient(form),
    fastPositive: isFastPositive(form.fast),
    lvoConcern: computeLvoConcern(form),
    lvoFeatureCount: lvoConcernCount(form.lvoConcern),
    glucoseFlag: computeGlucoseFlag(form.bloodGlucose),
    lkwMinutes,
    lkwCategory: computeLkwCategory(lkwMinutes),
    neuroRedFlags: neuroRedFlags(form),
    destination: suggestDestination(form),
    workflow: suggestWorkflow(form),
  };
}
