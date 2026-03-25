"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  exportCards,
  initialAlerts,
  initialAuditLogItems,
  initialCases,
  initialEntities,
  initialSubmissions,
  type AlertChannel,
  type AlertItem,
  type AlertSeverity,
  type AuditEntry,
  type CaseDecision,
  type CaseRecord,
  type EntityRecord,
  type ReportSubmission,
} from "@/lib/mock-data";

type SeverityFilter = AlertSeverity | "All";
type ChannelFilter = AlertChannel | "All";
type OwnerFilter = "All" | "Mine" | string;
type NewInvestigationInput = {
  entityName: string;
  region: string;
  amountNgn: number;
  channel: AlertChannel;
  signal: string;
  narrative: string;
};

export type ReportPackInput = {
  periodLabel: string;
  framework: string;
  narrative?: string;
};

type AppState = {
  alerts: AlertItem[];
  cases: CaseRecord[];
  entities: EntityRecord[];
  submissions: ReportSubmission[];
  auditLog: AuditEntry[];
  selectedAlertIds: string[];
  severityFilter: SeverityFilter;
  channelFilter: ChannelFilter;
  ownerFilter: OwnerFilter;
  commandQuery: string;
  currentUser: {
    name: string;
    title: string;
  };
};

type AppAction =
  | { type: "hydrate"; payload: AppState }
  | { type: "setCommandQuery"; payload: string }
  | { type: "setSeverityFilter"; payload: SeverityFilter }
  | { type: "setChannelFilter"; payload: ChannelFilter }
  | { type: "setOwnerFilter"; payload: OwnerFilter }
  | { type: "resetAlertFilters" }
  | { type: "toggleAlertSelection"; payload: string }
  | { type: "clearAlertSelection" }
  | { type: "setAlertStatus"; payload: { ids: string[]; status: AlertItem["status"]; owner?: string } }
  | { type: "setCaseDecision"; payload: { caseId: string; decision: CaseDecision; status: string; note: string } }
  | { type: "toggleEntityFrozen"; payload: string }
  | { type: "toggleIntervention"; payload: { entityId: string; interventionId: string } }
  | {
      type: "createInvestigation";
      payload: { alert: AlertItem; caseRecord: CaseRecord; entity: EntityRecord; audit: AuditEntry };
    }
  | { type: "addSubmission"; payload: ReportSubmission }
  | { type: "appendAudit"; payload: AuditEntry }
  | { type: "appendCaseNote"; payload: { caseId: string; title: string; body: string } };

type AppContextValue = {
  state: AppState;
  filteredAlerts: AlertItem[];
  searchResults: Array<
    | { kind: "alert"; id: string; title: string; subtitle: string; href: string }
    | { kind: "case"; id: string; title: string; subtitle: string; href: string }
    | { kind: "entity"; id: string; title: string; subtitle: string; href: string }
    | { kind: "report"; id: string; title: string; subtitle: string; href: string }
  >;
  exportArtifacts: typeof exportCards;
  setCommandQuery: (value: string) => void;
  setSeverityFilter: (value: SeverityFilter) => void;
  setChannelFilter: (value: ChannelFilter) => void;
  setOwnerFilter: (value: OwnerFilter) => void;
  resetAlertFilters: () => void;
  toggleAlertSelection: (id: string) => void;
  clearAlertSelection: () => void;
  runBatchAction: () => void;
  setCaseDecision: (caseId: string, decision: CaseDecision, analystNote?: string) => void;
  addCaseNote: (caseId: string, title: string, body: string) => void;
  toggleEntityFrozen: (entityId: string) => void;
  toggleIntervention: (entityId: string, interventionId: string) => void;
  generateReportPack: (input: ReportPackInput) => void;
  shareInternalDistribution: (distributionNote?: string) => void;
  downloadArtifact: (artifactId: string) => void;
  exportDashboardSignals: (
    bars: Array<{ label: string; value: number }>,
    snapshot: { liveAlerts: number; openCases: number; criticalAlerts: number },
  ) => void;
  logCaseEvidenceExport: (caseId: string) => void;
  logEntityDossierExport: (entityId: string, entityName: string) => void;
  logAlertsCsvExport: (rowCount: number) => void;
  appendAuditEntry: (actor: string, detail: string) => void;
  createInvestigationTarget: () => string | null;
  createInvestigation: (input: NewInvestigationInput) => string;
};

const STORAGE_KEY = "savvy-fraud-intelligence-state-v5-product-review";

const initialState: AppState = {
  alerts: initialAlerts,
  cases: initialCases,
  entities: initialEntities,
  submissions: initialSubmissions,
  auditLog: initialAuditLogItems,
  selectedAlertIds: [],
  severityFilter: "All",
  channelFilter: "All",
  ownerFilter: "Mine",
  commandQuery: "",
  currentUser: {
    name: "Chika Nnamdi",
    title: "Chief Compliance Officer",
  },
};

function mergeById<T extends { id: string }>(base: T[], persisted: T[]) {
  const map = new Map(base.map((item) => [item.id, item]));
  for (const item of persisted) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

function mergeAlerts(base: AlertItem[], persisted: AlertItem[]) {
  const persistedMap = new Map(persisted.map((item) => [item.id, item]));
  const seedIds = new Set(base.map((item) => item.id));
  const userCreated = persisted.filter((item) => !seedIds.has(item.id));
  const mergedSeeds = base.map((seed) => {
    const saved = persistedMap.get(seed.id);
    if (!saved) {
      return seed;
    }
    return {
      ...seed,
      owner: saved.owner,
      status: saved.status,
    };
  });
  return [...userCreated, ...mergedSeeds];
}

function mergeCases(base: CaseRecord[], persisted: CaseRecord[]) {
  const persistedMap = new Map(persisted.map((item) => [item.id, item]));
  const seedIds = new Set(base.map((item) => item.id));
  const userCreated = persisted.filter((item) => !seedIds.has(item.id));
  const mergedSeeds = base.map((seed) => {
    const saved = persistedMap.get(seed.id);
    if (!saved) {
      return seed;
    }
    return {
      ...seed,
      decision: saved.decision,
      status: saved.status,
      auditTrail: saved.auditTrail,
    };
  });
  return [...userCreated, ...mergedSeeds];
}

function mergeEntities(base: EntityRecord[], persisted: EntityRecord[]) {
  const persistedMap = new Map(persisted.map((item) => [item.id, item]));
  const seedIds = new Set(base.map((item) => item.id));
  const userCreated = persisted.filter((item) => !seedIds.has(item.id));
  const mergedSeeds = base.map((seed) => {
    const saved = persistedMap.get(seed.id);
    if (!saved) {
      return seed;
    }
    const savedById = new Map(saved.interventions.map((item) => [item.id, item]));
    return {
      ...seed,
      frozen: saved.frozen,
      interventions: seed.interventions.map((item) => {
        const persistedIv = savedById.get(item.id);
        return {
          ...item,
          completed: persistedIv?.completed ?? item.completed,
          tier: item.tier,
        };
      }),
    };
  });
  return [...userCreated, ...mergedSeeds];
}

function migrateHydratedState(raw: AppState): AppState {
  return {
    ...initialState,
    ...raw,
    alerts: mergeAlerts(initialAlerts, raw.alerts ?? []),
    cases: mergeCases(initialCases, raw.cases ?? []),
    entities: mergeEntities(initialEntities, raw.entities ?? []),
    submissions: mergeById(initialSubmissions, raw.submissions ?? []),
    auditLog: mergeById(initialAuditLogItems, raw.auditLog ?? []),
    currentUser: initialState.currentUser,
  };
}

function nowStamp() {
  const date = new Date();
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function formatNgnAmount(amountNgn: number) {
  return `NGN ${amountNgn.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function createAudit(actor: string, detail: string): AuditEntry {
  return {
    id: `AU-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: nowStamp(),
    actor,
    detail,
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "setCommandQuery":
      return { ...state, commandQuery: action.payload };
    case "setSeverityFilter":
      return { ...state, severityFilter: action.payload };
    case "setChannelFilter":
      return { ...state, channelFilter: action.payload };
    case "setOwnerFilter":
      return { ...state, ownerFilter: action.payload };
    case "resetAlertFilters":
      return { ...state, severityFilter: "All", channelFilter: "All", ownerFilter: "All" };
    case "toggleAlertSelection": {
      const selectedAlertIds = state.selectedAlertIds.includes(action.payload)
        ? state.selectedAlertIds.filter((id) => id !== action.payload)
        : [...state.selectedAlertIds, action.payload];
      return { ...state, selectedAlertIds };
    }
    case "clearAlertSelection":
      return { ...state, selectedAlertIds: [] };
    case "setAlertStatus": {
      const updatedAlerts = state.alerts.map((alert) =>
        action.payload.ids.includes(alert.id)
          ? {
              ...alert,
              status: action.payload.status,
              owner: action.payload.owner ?? alert.owner,
            }
          : alert,
      );
      return { ...state, alerts: updatedAlerts, selectedAlertIds: [] };
    }
    case "setCaseDecision": {
      const updatedCases = state.cases.map((item) =>
        item.id === action.payload.caseId
          ? {
              ...item,
              decision: action.payload.decision,
              status: action.payload.status,
              auditTrail: [
                {
                  id: `CA-${Math.random().toString(36).slice(2, 8)}`,
                  title: `Decision: ${action.payload.decision}`,
                  body: action.payload.note,
                  time: nowStamp(),
                },
                ...item.auditTrail,
              ],
            }
          : item,
      );
      return { ...state, cases: updatedCases };
    }
    case "toggleEntityFrozen": {
      const entities = state.entities.map((entity) =>
        entity.id === action.payload ? { ...entity, frozen: !entity.frozen } : entity,
      );
      return { ...state, entities };
    }
    case "toggleIntervention": {
      const entities = state.entities.map((entity) =>
        entity.id === action.payload.entityId
          ? {
              ...entity,
              interventions: entity.interventions.map((item) =>
                item.id === action.payload.interventionId
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            }
          : entity,
      );
      return { ...state, entities };
    }
    case "createInvestigation":
      return {
        ...state,
        alerts: [action.payload.alert, ...state.alerts],
        cases: [action.payload.caseRecord, ...state.cases],
        entities: [action.payload.entity, ...state.entities],
        auditLog: [action.payload.audit, ...state.auditLog],
      };
    case "addSubmission":
      return { ...state, submissions: [action.payload, ...state.submissions] };
    case "appendAudit":
      return { ...state, auditLog: [action.payload, ...state.auditLog] };
    case "appendCaseNote": {
      const { caseId, title, body } = action.payload;
      const updatedCases = state.cases.map((item) =>
        item.id === caseId
          ? {
              ...item,
              auditTrail: [
                {
                  id: `CA-${Math.random().toString(36).slice(2, 8)}`,
                  title,
                  body,
                  time: nowStamp(),
                },
                ...item.auditTrail,
              ],
            }
          : item,
      );
      return { ...state, cases: updatedCases };
    }
    default:
      return state;
  }
}

const AppStateContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as AppState;
      dispatch({ type: "hydrate", payload: migrateHydratedState(parsed) });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const filteredAlerts = useMemo(() => {
    return state.alerts.filter((alert) => {
      const severityMatch =
        state.severityFilter === "All" || alert.severity === state.severityFilter;
      const channelMatch =
        state.channelFilter === "All" || alert.channel === state.channelFilter;
      const ownerMatch =
        state.ownerFilter === "All" ||
        (state.ownerFilter === "Mine"
          ? alert.owner.includes("Chika") || alert.owner.includes("Nnamdi")
          : alert.owner === state.ownerFilter);
      const query = state.commandQuery.trim().toLowerCase();
      const queryMatch =
        query.length === 0 ||
        [
          alert.id,
          alert.customer,
          alert.signal,
          alert.region,
          alert.caseId,
          alert.entityId,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return severityMatch && channelMatch && ownerMatch && queryMatch;
    });
  }, [state.alerts, state.channelFilter, state.commandQuery, state.ownerFilter, state.severityFilter]);

  const searchResults = useMemo(() => {
    const query = state.commandQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }

    const alertMatches = state.alerts
      .filter((alert) => `${alert.id} ${alert.customer} ${alert.signal}`.toLowerCase().includes(query))
      .slice(0, 4)
      .map((alert) => ({
        kind: "alert" as const,
        id: alert.id,
        title: alert.id,
        subtitle: `${alert.customer} · ${alert.signal}`,
        href: `/alerts/${alert.id}`,
      }));

    const caseMatches = state.cases
      .filter((item) => `${item.id} ${item.entityProfile.name} ${item.status}`.toLowerCase().includes(query))
      .slice(0, 3)
      .map((item) => ({
        kind: "case" as const,
        id: item.id,
        title: item.id,
        subtitle: `${item.entityProfile.name} · ${item.status}`,
        href: `/case/${item.id}`,
      }));

    const entityMatches = state.entities
      .filter((item) => `${item.id} ${item.name} ${item.riskTier}`.toLowerCase().includes(query))
      .slice(0, 3)
      .map((item) => ({
        kind: "entity" as const,
        id: item.id,
        title: item.name,
        subtitle: `${item.id} · ${item.riskTier}`,
        href: `/entity/${item.id}`,
      }));

    const reportMatches = exportCards
      .filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(query))
      .slice(0, 2)
      .map((item) => ({
        kind: "report" as const,
        id: item.id,
        title: item.title,
        subtitle: item.action,
        href: "/reporting",
      }));

    return [...alertMatches, ...caseMatches, ...entityMatches, ...reportMatches].slice(0, 8);
  }, [state.alerts, state.cases, state.commandQuery, state.entities]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      filteredAlerts,
      searchResults,
      exportArtifacts: exportCards,
      setCommandQuery: (value) => dispatch({ type: "setCommandQuery", payload: value }),
      setSeverityFilter: (value) => dispatch({ type: "setSeverityFilter", payload: value }),
      setChannelFilter: (value) => dispatch({ type: "setChannelFilter", payload: value }),
      setOwnerFilter: (value) => dispatch({ type: "setOwnerFilter", payload: value }),
      resetAlertFilters: () => dispatch({ type: "resetAlertFilters" }),
      toggleAlertSelection: (id) => dispatch({ type: "toggleAlertSelection", payload: id }),
      clearAlertSelection: () => dispatch({ type: "clearAlertSelection" }),
      runBatchAction: () => {
        if (state.selectedAlertIds.length === 0) {
          return;
        }
        dispatch({
          type: "setAlertStatus",
          payload: {
            ids: state.selectedAlertIds,
            status: "Investigating",
            owner: "Chika Nnamdi",
          },
        });
        dispatch({
          type: "appendAudit",
          payload: createAudit(
            "Alert Queue",
            `Moved ${state.selectedAlertIds.length} selected alerts into investigating state.`,
          ),
        });
      },
      setCaseDecision: (caseId, decision, analystNote) => {
        const mapping: Record<CaseDecision, { status: string; note: string }> = {
          Approved: {
            status: "Cleared / Approved",
            note: "Case approved after analyst review and supporting evidence validation.",
          },
          Rejected: {
            status: "Rejected / Fraud confirmed",
            note: "Case rejected due to risk-confirming indicators across device, IP, and value layers.",
          },
          Escalated: {
            status: "Escalated / Compliance review",
            note: "Case escalated to compliance for secondary determination.",
          },
          Pending: {
            status: "Suspended / High Risk",
            note: "Case returned to pending review.",
          },
        };
        const note = analystNote?.trim() ? analystNote.trim() : mapping[decision].note;
        dispatch({
          type: "setCaseDecision",
          payload: {
            caseId,
            decision,
            status: mapping[decision].status,
            note,
          },
        });
        dispatch({
          type: "appendAudit",
          payload: createAudit("Case Manager", `${caseId} → ${mapping[decision].status}.`),
        });
      },
      addCaseNote: (caseId, title, body) => {
        dispatch({ type: "appendCaseNote", payload: { caseId, title, body } });
        dispatch({
          type: "appendAudit",
          payload: createAudit("Case Manager", `${caseId}: ${title}`),
        });
      },
      toggleEntityFrozen: (entityId) => {
        const entity = state.entities.find((item) => item.id === entityId);
        if (!entity) {
          return;
        }
        dispatch({ type: "toggleEntityFrozen", payload: entityId });
        dispatch({
          type: "appendAudit",
          payload: createAudit(
            "Entity Search",
            `${entity.name} ${entity.frozen ? "unfrozen" : "frozen"} by operator action.`,
          ),
        });
      },
      toggleIntervention: (entityId, interventionId) => {
        const entity = state.entities.find((item) => item.id === entityId);
        const intervention = entity?.interventions.find((item) => item.id === interventionId);
        if (!entity || !intervention) {
          return;
        }
        dispatch({ type: "toggleIntervention", payload: { entityId, interventionId } });
        dispatch({
          type: "appendAudit",
          payload: createAudit(
            "Entity Search",
            `${intervention.completed ? "Reopened" : "Completed"} intervention for ${entity.name}.`,
          ),
        });
      },
      generateReportPack: (input) => {
        const submission: ReportSubmission = {
          id: `GEN-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          type: "Regulator Pack",
          status: "Generated",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          periodLabel: input.periodLabel,
          framework: input.framework,
          summaryNote: input.narrative?.trim() || undefined,
        };
        dispatch({ type: "addSubmission", payload: submission });
        dispatch({
          type: "appendAudit",
          payload: createAudit(
            "Reporting",
            `Generated ${submission.id} (${input.framework}, ${input.periodLabel}).`,
          ),
        });
      },
      exportDashboardSignals: (bars, snapshot) => {
        const lines = [
          "label,value",
          ...bars.map((row) => `${row.label},${row.value}`),
          "",
          "metric,value",
          `live_alerts,${snapshot.liveAlerts}`,
          `critical_alerts,${snapshot.criticalAlerts}`,
          `open_cases_pending,${snapshot.openCases}`,
          "",
          `exported_at,${new Date().toISOString()}`,
        ];
        const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `risk-signal-distribution-${new Date().toISOString().slice(0, 10)}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
        dispatch({
          type: "appendAudit",
          payload: createAudit("Command Centre", "Exported risk signal distribution CSV."),
        });
      },
      logCaseEvidenceExport: (caseId) => {
        dispatch({
          type: "appendAudit",
          payload: createAudit("Case Manager", `Evidence pack downloaded for ${caseId}.`),
        });
      },
      logEntityDossierExport: (entityId, entityName) => {
        dispatch({
          type: "appendAudit",
          payload: createAudit("Entity Search", `Dossier exported for ${entityName} (${entityId}).`),
        });
      },
      logAlertsCsvExport: (rowCount) => {
        dispatch({
          type: "appendAudit",
          payload: createAudit("Alert Queue", `Exported ${rowCount} alert row(s) to CSV.`),
        });
      },
      appendAuditEntry: (actor, detail) => {
        dispatch({ type: "appendAudit", payload: createAudit(actor, detail) });
      },
      shareInternalDistribution: (distributionNote) => {
        const latest = state.submissions[0];
        const memo = [
          "Internal Distribution Memo",
          "",
          `Generated at: ${new Date().toISOString()}`,
          `Operator: ${state.currentUser.name}`,
          `Most recent submission: ${latest ? `${latest.id} (${latest.status})` : "N/A"}`,
          distributionNote?.trim() ? `\nAnalyst note:\n${distributionNote.trim()}\n` : "",
          "",
          "Distribution list:",
          "- Compliance Operations",
          "- Risk Governance",
          "- Legal Oversight",
        ].join("\n");
        const blob = new Blob([memo], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `internal-distribution-${new Date().toISOString().slice(0, 10)}.txt`;
        anchor.click();
        URL.revokeObjectURL(url);
        dispatch({
          type: "appendAudit",
          payload: createAudit("Reporting", "Exported internal distribution memo."),
        });
      },
      downloadArtifact: (artifactId) => {
        const artifact = exportCards.find((item) => item.id === artifactId);
        if (!artifact) {
          return;
        }

        const blob = new Blob(
          [
            `${artifact.title}\n\n${artifact.body}\n\nGenerated at ${new Date().toISOString()}\n`,
          ],
          {
            type:
              artifact.format === "xlsx"
                ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : artifact.format === "pptx"
                  ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  : "application/pdf",
          },
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${artifact.id}.${artifact.format}`;
        anchor.click();
        URL.revokeObjectURL(url);
        dispatch({
          type: "appendAudit",
          payload: createAudit("Reporting", `Exported ${artifact.title}.`),
        });
      },
      createInvestigationTarget: () => {
        const selected = state.alerts.find((item) => state.selectedAlertIds.includes(item.id));
        const fallback =
          state.alerts.find((item) => item.severity === "Critical" && item.status !== "Resolved") ??
          state.alerts[0];
        const target = selected ?? fallback;
        if (!target) {
          return null;
        }
        dispatch({
          type: "appendAudit",
          payload: createAudit("Operations", `Opened investigation workspace for ${target.caseId}.`),
        });
        return target.caseId;
      },
      createInvestigation: (input) => {
        const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
        const alertId = `AL-${Math.floor(10000 + Math.random() * 89999)}`;
        const entityId = `E-${Math.floor(1000 + Math.random() * 8999)}-${suffix}`;
        const caseId = `TRX-${Math.floor(10000 + Math.random() * 89999)}-${suffix.slice(0, 1)}`;
        const risk = Math.min(99, Math.max(74, Math.round(72 + input.amountNgn / 300000)));
        const amount = formatNgnAmount(input.amountNgn);
        const now = nowStamp();

        const conf = Math.min(97, Math.max(70, risk + 4));
        const entity: EntityRecord = {
          id: entityId,
          breadcrumb: `Entities  >  ${entityId}`,
          name: input.entityName,
          tags: ["New Investigation", "CBN Watch", input.region],
          riskIndex: risk,
          riskTitle: risk >= 92 ? "Immediate review" : "High exposure",
          riskTier: risk >= 92 ? "Critical" : "High",
          riskNarrative: input.narrative,
          frozen: false,
          confidencePct: conf,
          fraudScenario: "New intake — pattern classification pending rules engine.",
          recommendedAction: "Complete device and beneficiary checks; apply threshold hold if amount exceeds policy.",
          riskTrend: "Stable",
          behavioralContext: {
            amountVs30dAvg: "No 30-day baseline yet — first observation window.",
            amountVs90dAvg: "No 90-day baseline yet.",
            frequencyVsBaseline: "Single reported event at intake.",
            deviceVsBaseline: "Device telemetry collection in progress.",
            locationVsBaseline: `Session geography: ${input.region}.`,
          },
          factorCards: [
            { label: "Velocity", value: "High" },
            { label: "Location risk", value: "Medium" },
            { label: "Network risk", value: "Medium" },
            { label: "Identity match", value: "Pending" },
          ],
          financialSnapshot: [
            { label: "Total assets", value: amount },
            { label: "Last 30d volume", value: amount },
            { label: "Exposure cap", value: "NGN 5,000,000.00" },
          ],
          investigationsPending: "1 active investigation pending",
          fingerprint: {
            device: ["Device collection pending", "Baseline to be established"],
            network: ["Initial review started", "IP reputation pending"],
            identity: ["KYC refresh required", "NIN/BVN verification queued"],
          },
          identityTrust: [
            { label: "Facial Match", status: "Pending review" },
            { label: "Address Verification", status: "Pending review" },
            { label: "Sanctions Screening", status: "In progress" },
          ],
          timeline: [
            { id: `EV-${suffix}A`, timestamp: now, action: "Investigation Intake", amount, signal: input.signal },
          ],
          associated: [
            {
              id: `AE-${suffix}A`,
              name: input.entityName,
              meta: "Primary account holder — from intake registration",
              risk: "High",
            },
          ],
          interventions: [
            {
              id: `IN-${suffix}A`,
              label: "Outbound call to customer — verify initiated transfer.",
              completed: false,
              tier: "immediate",
            },
            {
              id: `IN-${suffix}B`,
              label: "Temporary outbound debit threshold until review closes.",
              completed: false,
              tier: "immediate",
            },
            {
              id: `IN-${suffix}C`,
              label: "Internal escalation to fraud desk lead.",
              completed: false,
              tier: "immediate",
            },
            {
              id: `IN-${suffix}D`,
              label: "Source-of-funds documentation if compliance confirms fraud typology.",
              completed: false,
              tier: "compliance",
            },
          ],
        };

        const initials = input.entityName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((item) => item[0]?.toUpperCase() ?? "")
          .join("") || "NA";
        const caseRecord: CaseRecord = {
          id: caseId,
          analyst: state.currentUser.name,
          analystTitle: state.currentUser.title,
          amount,
          currency: "NGN",
          method: `${input.channel} transfer`,
          paymentRail: input.channel === "Card" ? "Card scheme" : input.channel === "Transfer" ? "NIP" : "Mobile / digital rail",
          destinationGeography: input.region,
          confidencePct: conf,
          fraudScenario: "Manual intake — investigate beneficiary and device telemetry before release.",
          recommendedAction: "Hold pending verification; assign analyst within SLA.",
          riskTrend: "Stable",
          behavioralContext: {
            amountVs30dAvg: "Baseline pending — first intake observation.",
            amountVs90dAvg: "Baseline pending.",
            frequencyVsBaseline: "Single event at intake.",
            deviceVsBaseline: "Collection in progress.",
            locationVsBaseline: input.region,
          },
          status: "Open / High",
          decision: "Pending",
          linkedAlertId: alertId,
          entityId,
          auditTrail: [
            { id: `CA-${suffix}A`, title: "Case created", body: "Investigation initialized from intake form.", time: now },
          ],
          transactionAuditEvents: [
            {
              id: `TX-${suffix}0`,
              title: "Intake logged",
              body: `Signal: ${input.signal} · Amount ${amount}`,
              time: now,
            },
          ],
          evidence: [
            { label: "Intake Narrative", value: input.narrative },
            { label: "Channel", value: input.channel },
            { label: "Region", value: input.region },
            { label: "Signal", value: input.signal },
          ],
          riskFactors: [
            { label: "Manual Intake Trigger", points: "+20 pts", contribution: 20 },
            { label: "Value Threshold", points: `+${Math.round(risk / 2)} pts`, contribution: Math.round(risk / 2) },
            { label: "Signal Match", points: "+18 pts", contribution: 18 },
          ],
          aggregatedRisk: risk,
          entityProfile: {
            initials,
            name: input.entityName,
            memberSince: "Member since Mar 2026",
            kyc: "Pending refresh",
            credit: "N/A",
            linked: "01 active",
          },
        };

        const alert: AlertItem = {
          id: alertId,
          time: now,
          customer: input.entityName,
          amount,
          channel: input.channel,
          risk,
          signal: input.signal,
          severity: risk >= 92 ? "Critical" : "High",
          owner: state.currentUser.name,
          status: "Open",
          entityId,
          caseId,
          region: input.region,
          confidencePct: conf,
        };

        dispatch({
          type: "createInvestigation",
          payload: {
            alert,
            caseRecord,
            entity,
            audit: createAudit("Investigation Intake", `Created ${caseId} for ${input.entityName} via tabbed new-investigation workflow.`),
          },
        });
        return caseId;
      },
    }),
    [filteredAlerts, searchResults, state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
