# NeuroTriage

**AI-assisted stroke workflow prioritization** — a clinician-facing decision-support prototype for high-acuity stroke triage in the ED.

NeuroTriage takes structured bedside inputs from the first minutes of a possible stroke encounter and produces an **explainable**, **time-aware ranking** of all active patients, a per-patient decision-support panel, and a suggested workflow checklist (stroke alert, CT, CTA, IR notification, etc.). It is designed for rapid scanning by an attending under pressure — not as a replacement for clinical judgment.

> ⚠️ **Research / demo only.** Not a medical device. Not validated for clinical use. Do not use to make care decisions.

---

## What the prototype does

- **Multi-patient intake.** A focused triage form collects FAST exam, neurological deficits, LVO screen, NIHSS estimate, glucose, blood pressure, anticoagulant use, last-known-well (LKW), and estimated transport time to nearest Primary Stroke Center (PSC) and Comprehensive Stroke Center (CSC).
- **Time-aware ranking.** Each patient is scored by a transparent additive model. Top contributors include LKW window, FAST positivity, LVO concern, neuro deficit count, NIHSS thresholds, hypoglycemia (deducts as possible stroke mimic), and transport feasibility to a thrombectomy-capable center. The queue re-ranks itself every 30 seconds as elapsed time changes window categories.
- **Explainable rankings.** Every patient row surfaces a "Why ranked here" callout with the top weighted factors and their signed point contributions. The decision-support panel for each patient lists the complete factor breakdown.
- **Three-tier urgency** — **STAT** (red, pulsing), **URGENT** (amber), **ROUTINE** (sky) — derived from the composite score.
- **LKW visual timeline.** A horizontal scale highlights the tPA (0–4.5 h), extended IV (4.5–6 h), EVT (6–24 h), and outside-window (>24 h) zones with a live patient marker.
- **Suggested workflow steps** auto-generate from the intake — stroke alert activation, glucose check, non-contrast CT, CTA if LVO suspected, perfusion/MRI for extended-window selection, neurointervention notification, BP management to <185/110 pre-tPA, and hypoglycemia correction. Urgent steps are pinned.
- **Destination suggestion.** PSC vs. CSC routing uses LVO concern + entered transport times (e.g., direct CSC favored when high LVO concern and CSC is within ~30 min of PSC time).
- **Dark mode** suitable for overnight ED/ICU use, with persisted preference and a smooth chrome transition.
- **Local persistence.** Patients are kept in `localStorage` for the demo — no backend, no PHI leaves the browser.

---

## How to run it locally

**Requirements:** Node.js 20+, npm.

```bash
git clone <this repo>
cd neurotriage
npm install
npm run dev
```

Open <http://localhost:3000>.

The dashboard is seeded with three demo patients on first load. Use **+ New Patient** to add more. The **Reset** button in the queue header restores the seed. Click any patient row for the full decision-support detail page.

### Other commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on :3000 |
| `npm run build` | Production build via Turbopack |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

### Project layout

```
app/
  page.tsx              Dashboard (hero, stats, priority queue, activity)
  triage/new/page.tsx   Patient intake form + live decision support
  triage/[id]/page.tsx  Per-patient detail view
  layout.tsx            Root shell, font, theme-script
  globals.css           Theme tokens, animations, dark variant
components/             UI: Header, Sidebar, PriorityQueue, UrgencyPanel,
                        LkwTimeline, IntakeForm, PatientDetail, StatCard,
                        DashboardStats, ThemeToggle
lib/
  intake.ts             IntakeForm shape + FAST/LVO/neuro definitions
  triage-logic.ts       Categorization, ranking, workflow, destination
  store.ts              localStorage-backed patient store (useSyncExternalStore)
  time.ts               LKW math, formatting, window calculators
  nihss.ts              Full NIHSS item catalog (reserved for future scorer UI)
  mock-data.ts          Seeded activity events
```

---

## Stroke triage concepts included

The decision logic encodes well-established acute-stroke concepts. None of these are NeuroTriage-specific; the prototype is a UI/UX layer on top of standard practice:

- **FAST exam** — Face/Arm/Speech as a high-sensitivity bedside screen, with **Time / last-known-well** as the gating variable for everything downstream.
- **Treatment windows.**
  - **0–4.5 h** — IV thrombolysis (alteplase / tenecteplase) eligibility window.
  - **4.5–6 h** — extended IV selection in carefully chosen cases.
  - **6–24 h** — endovascular therapy (mechanical thrombectomy) eligibility per **DAWN** and **DEFUSE-3** trial criteria using perfusion or DWI/FLAIR mismatch.
  - **>24 h** — generally outside acute-revascularization windows.
- **NIHSS** — standardized 0–42 deficit scale; ≥6 used as one of the LVO-likelihood signals.
- **LVO (large vessel occlusion) screening** — cortical signs that predict an occlusion amenable to thrombectomy: gaze deviation, aphasia, hemispatial neglect/cortical signs, severe unilateral weakness. The prototype combines these with NIHSS thresholds into a four-level concern grade.
- **Stroke mimics** — particularly **hypoglycemia** as a focal-deficit mimic. Glucose <40 mg/dL deducts from the rank and produces a "treat and reassess" workflow step before imaging. BP and glucose are also surfaced against the standard pre-tPA safety thresholds (BP <185/110, glucose 50–400).
- **Tiered stroke center routing** — Primary vs. Comprehensive Stroke Center decision logic, with **direct-to-CSC** favored when LVO is suspected and transport delta is small (drip-and-ship vs. mothership trade-off).
- **Pre-tPA contraindications and BP management.** Acknowledged in the workflow steps (BP <185/110, hypoglycemia correction). The form currently captures anticoagulant use as a coarse signal; the full inclusion/exclusion list is not yet enforced.

---

## Future directions

### EHR integration
- **SMART on FHIR launch** from Epic / Cerner / athenahealth so NeuroTriage opens in-context for a selected encounter.
- **Auto-prefill** demographics, weight, allergies, home meds (esp. anticoagulants and last dose), prior strokes/ICH, INR, platelets, creatinine, glucose, and last vitals from FHIR R4 resources (`Patient`, `Observation`, `MedicationRequest`, `Condition`).
- **Order placement** — one-click STAT CT head / CTA neck / labs / alteplase orders pushed back via FHIR `ServiceRequest` / `MedicationRequest`, with read-back to the panel as orders are placed and resulted.
- **Note generation** — auto-draft the stroke-alert H&P from intake + decision support so the attending edits rather than dictates from scratch.

### EMS routing integration
- **Prehospital screening** — paramedic-facing app feeding LAMS / RACE / VAN scores and 12-lead ECG into NeuroTriage **before patient arrival**, with a countdown to ETA.
- **Routing decision support** — combine the EMS LVO score with live CSC bed/IR-suite status and traffic-aware transport ETAs to suggest mothership vs. drip-and-ship, with auto-notification to the receiving facility.
- **Telestroke handoff** — one-click join to a stroke neurologist for prehospital or in-route consult.

### Imaging integration
- **DICOM viewer** embedded in the patient detail page (cornerstone.js / OHIF).
- **Automated ASPECTS scoring** on non-contrast CT (e.g., Brainomix-style models) and **CTA LVO detection** (e.g., Viz LVO / RapidAI-style), pulled in via vendor APIs and surfaced as additional ranking factors.
- **Perfusion mismatch** — auto-pull core/penumbra volumes from RAPID/Olea and gate the extended-window EVT recommendation on the actual mismatch ratio, not just an LKW heuristic.
- **Hemorrhage detection** on CT to immediately flip the recommendation away from thrombolysis.

### Validated LVO scoring
- Replace the in-house LVO concern composite with **standard, validated scales**: RACE, FAST-ED, LAMS, VAN, C-STAT, G-FAST. Let the user pick the local protocol; show the score and the threshold-based interpretation.
- Recalibrate ranking weights against published predictive values for each scale.
- Document sensitivity / specificity and the chosen cut-off transparently in the explanation card.

### Real-time clinician feedback loops
- **Override capture** — every time a clinician disagrees with a tier or workflow step, capture the override + free-text reason. Build a labeled dataset of clinician judgment.
- **Outcome linkage** — close the loop with final diagnosis (stroke vs. mimic), treatment given (tPA / EVT / neither), and 90-day mRS if available.
- **Model recalibration** — periodically refit the ranking weights against override-and-outcome data per site (institutional learning, not global pooling). Show drift / disagreement reports to the stroke quality committee.
- **A/B comparison** — let a site run "AI-assisted" vs. "control" queues side by side to measure door-to-CT, door-to-needle, and door-to-puncture deltas.
- **Continuous validation** — track sensitivity/specificity of the FAST gate and LVO predictor against confirmed imaging diagnoses; alert the team if site performance diverges from published norms.

### Other directions

- **Full NIHSS scorer UI** wired to all 15 items, with per-item severity and the running total.
- **Complete pre-tPA contraindication checklist** with hard gates that downgrade the recommendation.
- **Authentication, audit trail, RBAC** — required for any real deployment.
- **Multi-device / multi-user real-time sync** (server backend + WebSocket).
- **Stroke quality dashboard** — door-to-needle, door-to-puncture, mRS at 90 days, per-attending and per-shift breakdowns.
- **Accessibility audit** (WCAG 2.2 AA) — color-contrast on all status colors, keyboard navigation, screen-reader announcements for tier changes.
- **Internationalization** — Spanish, then site-specific protocol localization.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4** with class-based dark mode (`@custom-variant dark`)
- **lucide-react** icons
- Client-side state via `useSyncExternalStore` over `localStorage`

No backend, no database, no analytics — by design, for this prototype.

---

## License

Prototype / demo code. No license granted. Contact the author before reuse.
