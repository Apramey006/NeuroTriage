function isoMinutesAgo(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export interface ActivityEvent {
  id: string;
  caseId: string;
  mrn: string;
  message: string;
  timestamp: string;
  kind: "imaging" | "consult" | "treatment" | "admit" | "alert";
}

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "evt-1",
    caseId: "case-001",
    mrn: "MRN-48201",
    message: "CT head completed — no hemorrhage",
    timestamp: isoMinutesAgo(4),
    kind: "imaging",
  },
  {
    id: "evt-2",
    caseId: "case-002",
    mrn: "MRN-48198",
    message: "IR consult paged — LVO suspected on CTA",
    timestamp: isoMinutesAgo(12),
    kind: "consult",
  },
  {
    id: "evt-3",
    caseId: "case-001",
    mrn: "MRN-48201",
    message: "Alteplase ordered — 61.2 mg total",
    timestamp: isoMinutesAgo(8),
    kind: "treatment",
  },
  {
    id: "evt-4",
    caseId: "case-003",
    mrn: "MRN-48189",
    message: "Code stroke activated — neuro at bedside",
    timestamp: isoMinutesAgo(18),
    kind: "alert",
  },
  {
    id: "evt-5",
    caseId: "case-004",
    mrn: "MRN-48144",
    message: "Admitted to stroke unit for observation",
    timestamp: isoMinutesAgo(58),
    kind: "admit",
  },
];
