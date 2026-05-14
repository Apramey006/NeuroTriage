"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Timer, AlarmClock, Stethoscope } from "lucide-react";
import StatCard from "./StatCard";
import { usePatients } from "@/lib/store";
import { assess } from "@/lib/triage-logic";

export default function DashboardStats() {
  const { patients, hydrated } = usePatients();
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    let stat = 0;
    let urgent = 0;
    let inTpa = 0;
    let lvoHigh = 0;
    patients.forEach((p) => {
      const a = assess(p.intake, now);
      if (a.tier === "STAT") stat += 1;
      if (a.tier === "URGENT") urgent += 1;
      if (a.lkwCategory === "0-4.5h") inTpa += 1;
      if (a.lvoConcern === "High") lvoHigh += 1;
    });
    return { stat, urgent, inTpa, lvoHigh, total: patients.length };
  }, [patients, now]);

  const display = hydrated
    ? {
        total: stats.total,
        inTpa: stats.inTpa,
        stat: stats.stat,
        lvoHigh: stats.lvoHigh,
      }
    : { total: "—", inTpa: "—", stat: "—", lvoHigh: "—" };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Active Patients"
        value={display.total}
        hint="In the triage queue"
        icon={Activity}
        tone="rose"
      />
      <StatCard
        label="In tPA Window"
        value={display.inTpa}
        hint="≤ 4.5h from last known well"
        icon={Timer}
        tone="emerald"
      />
      <StatCard
        label="High LVO Concern"
        value={display.lvoHigh}
        hint="Candidates for thrombectomy"
        icon={AlarmClock}
        tone="amber"
      />
      <StatCard
        label="STAT Patients"
        value={display.stat}
        hint="Top of the priority queue"
        icon={Stethoscope}
        tone="rose"
        pulse={typeof display.stat === "number" && display.stat > 0}
      />
    </div>
  );
}
