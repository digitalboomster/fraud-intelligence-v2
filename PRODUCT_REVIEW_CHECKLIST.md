# Product review — verification checklist

**Last code audit:** 2026-03-24 — static review of `src/` (grep/read), plus `npm run lint` and `npm run build` (both pass).

**Gaps closed (2026-03-24):** Case sidebar classification is derived from `aggregatedRisk`, `decision`, and `status` (`case-view.tsx`). Regulator pack default period is `reportingPackDefaultPeriodLabel` (`Q4 FY24`) in `mock-data.ts`, used by `reporting-view.tsx`.

Items below are marked **`[x]`** where the current implementation satisfies the criterion in code. **`[ ]`** = not met or not verified in this pass. Use **`[x]`** / **`[ ]`** locally when you re-verify in the browser.

---

## Critical / credibility

- [x] **NIN / BVN** — No `SSN` in `src/`; KYC/identity copy uses Nigeria-appropriate terms (e.g. `NIN/BVN` in `mock-data.ts`, `app-state.tsx` intake entity).
- [x] **Regions / locales** — Amounts as NGN, Nigerian cities/regions in alerts, cases, and entities (`mock-data.ts`).

## High — consistency & clarity

- [x] **Single signal taxonomy** — `standardSignalDistribution` drives `dashboardData.chartBars` and `alertsMeta.signalDistribution` (`mock-data.ts`); same five labels (Device, Velocity, Geo, Behavior, Consortium).
- [x] **Case: Tier 1 summary** — `case-view.tsx`: analyst summary panel includes aggregated risk, trend, confidence, scenario, recommended action, open-case count + dossier link (`tier1Summary`).
- [x] **Entity: Tier 1 summary** — `entity-view.tsx`: same shape (risk tier/index, trend, confidence, scenario, action, investigations + open cases).
- [x] **Risk drivers** — Sorted by `contribution`; index `0` gets `riskDriverTop` and “Top driver —” prefix (`case-view.tsx` + `CaseRiskFactor` in mock data).
- [x] **Behavioral vs baseline** — Dedicated panels on case and entity (`behavioralPanel`, `behavioralContext` fields).
- [x] **Payment rail vs geography** — Case `summaryStrip` shows **Payment rail** and **Destination geography** separately (`paymentRail`, `destinationGeography`).
- [x] **Audit: state change** — `AuditEntry` supports `beforeState` / `afterState` / `justification` / `sessionRef`; `audit-view.tsx` renders them; seed rows `AU-2`, `AU-5` include before/after (and `AU-1`, `AU-3`, `AU-5` session refs where set).
- [x] **Sanctions + critical/high** — `entity-view.tsx`: `sanctionsHoldBanner` when `sanctionsHoldRequired` or sanctions row pending/review with `riskIndex >= 72`.

## Medium — queue & workspace UX

- [x] **Reporting period (static copy)** — `reportingData.subtitle`, narrative, assurance, and submission dates align on **Q4 FY24 / Oct 2024** (`mock-data.ts` + `reporting-view.tsx` page header).
- [x] **Reporting period (generator default)** — Pack modal initializes from `reportingPackDefaultPeriodLabel` (`Q4 FY24`, `mock-data.ts`) — aligned with page copy.
- [x] **Alerts: scoped counts** — Subtitle + line: platform total vs filtered (`alerts-view.tsx` + `alertsMeta.subtitle`).
- [x] **Alerts: batch action** — Primary button `disabled` when `selectedAlertIds.length === 0`.
- [x] **Alerts: confidence** — `confidencePct` column in the queue grid.
- [x] **Team “Break”** — `personRowOffShift` styling for the Break row (`globals.css`).
- [x] **Operational language** — Risk tiers in seed data use **High** / **Critical** (not “Tier 3 Fragile”-style labels). Some statuses still use the word “Elevated” (case/entity status strings) — acceptable as ops language.
- [x] **Associated entities — provenance** — `associated[].meta` describes source/relationship (e.g. CAC filing, primary owner) in `mock-data.ts`.
- [x] **Entity: deep detail** — Fingerprint + KYC behind collapsible “Supporting technical detail (Tier 3)” (`entity-view.tsx`).
- [x] **Case timeline** — `transactionAuditEvents` rendered before `auditTrail` in “Transaction & case timeline” (`case-view.tsx`).

## Low / polish

- [x] **Interventions order** — UI splits **immediate** vs **compliance** blocks; seed lists order ops before compliance (`entity-view.tsx` + `mock-data.ts`).
- [x] **Risk trend** — Shown in Tier 1 blocks on case and entity (`riskTrend`).
- [x] **Confidence alignment** — `confidencePct` on alerts, case Tier 1, entity Tier 1; dashboard has separate hero/model copy.
- [x] **Dashboard signal footnote** — `signalChartFootnote` under the chart (`dashboard-view.tsx`).
- [x] **Dashboard export** — `exportDashboardSignals` builds CSV and appends audit entry (`app-state.tsx`).

## Regression / technical

- [x] **`npm run lint`** — Passes (re-verify after pulls).
- [x] **`npm run build`** — Passes (re-verify after pulls).
- [x] **Persisted state** — `migrateHydratedState` re-merges seed alerts/cases/entities with stored data so new fields stay coherent; corrupt JSON clears `STORAGE_KEY` (`app-state.tsx`).
- [x] **New investigation flow** — `createInvestigation` builds alert/case/entity with `paymentRail`, `destinationGeography`, `confidencePct`, `behavioralContext` (`locationVsBaseline`), `transactionAuditEvents`, `contribution` on risk factors, tiered interventions (`app-state.tsx`).

## Quick page pass (implemented in app routes)

Treat as **browser QA**; all routes exist and wired to the views above.

- [x] `/dashboard` — Hero, metrics, `SignalBarVisual` + footnote, export, review list.
- [x] `/alerts` — Filters, counts, confidence column, batch disabled when empty, mini-bars from shared taxonomy.
- [x] `/case/[id]` — Tier 1, rail/geo, behavioral panel, sorted drivers, timeline (txn + notes), dynamic risk sidebar classification.
- [x] `/entity/[id]` — Tier 1, sanctions banner when rules hit, collapsible Tier 3, intervention groups.
- [x] `/audit` — Feed + optional before/after/justification/session.
- [x] `/reporting` — `reportingData` copy + metrics; pack default period **Q4 FY24**.

---

*Re-run this audit after substantive UI/data changes; update the date.*
