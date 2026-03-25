"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { RadialRiskVisual } from "@/components/data-visuals";
import { IconSymbol } from "@/components/icon-symbol";

function exportEntityDossier(entity: {
  id: string;
  name: string;
  riskTier: string;
  riskIndex: number;
  frozen: boolean;
  financialSnapshot: Array<{ label: string; value: string }>;
}) {
  const lines = [
    `Entity Dossier: ${entity.name}`,
    `Entity ID: ${entity.id}`,
    `Risk Tier: ${entity.riskTier}`,
    `Risk Index: ${entity.riskIndex}`,
    `Account Frozen: ${entity.frozen ? "Yes" : "No"}`,
    "",
    "Financial Snapshot",
    ...entity.financialSnapshot.map((item) => `- ${item.label}: ${item.value}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${entity.id}-dossier.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function EntityView({
  entityId,
  fromCaseId,
  returnFrom,
}: {
  entityId?: string;
  fromCaseId?: string;
  returnFrom?: "alerts" | "dashboard" | "case";
}) {
  const router = useRouter();
  const { state, toggleEntityFrozen, toggleIntervention, logEntityDossierExport } = useAppState();
  const [detailOpen, setDetailOpen] = useState(false);

  const entity = useMemo(() => {
    if (!entityId) {
      return null;
    }
    return state.entities.find((item) => item.id === entityId) ?? null;
  }, [entityId, state.entities]);

  const openCasesForEntity = useMemo(() => {
    if (!entity) {
      return 0;
    }
    return state.cases.filter((c) => c.entityId === entity.id && c.decision === "Pending").length;
  }, [entity, state.cases]);

  const sanctionsPending = useMemo(() => {
    if (!entity) {
      return false;
    }
    return entity.identityTrust.some(
      (row) =>
        row.label === "Sanctions Screening" &&
        (row.status.toLowerCase().includes("pending") || row.status.toLowerCase().includes("review")),
    );
  }, [entity]);

  const showSanctionsHold =
    entity &&
    (entity.sanctionsHoldRequired || (sanctionsPending && entity.riskIndex >= 72));

  const immediateInterventions = entity?.interventions.filter((i) => i.tier === "immediate") ?? [];
  const complianceInterventions = entity?.interventions.filter((i) => i.tier === "compliance") ?? [];

  if (!entity) {
    return (
      <div className="stack pageStack">
        <section className="panel">
          <div className="moduleTitle" style={{ marginBottom: 12 }}>Entity unavailable</div>
          <div className="heroSubtitle">Entity <span className="mono">{entityId}</span> was not found.</div>
        </section>
      </div>
    );
  }

  return (
    <div className="stack pageStack">
      {showSanctionsHold ? (
        <section className="panel sanctionsHoldBanner" role="status">
          <div className="splitTop">
            <strong>Sanctions screening hold</strong>
            <span className="chip chipRisk">Auto-restriction</span>
          </div>
          <p className="heroSubtitle" style={{ margin: "10px 0 0" }}>
            Sanctions outcome is not cleared. Further payouts and new beneficiaries should remain blocked until
            compliance completes screening or escalates with justification (H-07).
          </p>
        </section>
      ) : null}

      <div className="dossierHead">
        <div>
          <div className="pageLabel">{entity.breadcrumb}</div>
          <h1 style={{ fontSize: 42 }}>{entity.name}</h1>
          <div className="tags">
            {entity.tags.map((tag) => (
              <span className="chip chipPrimary" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="actionsRow">
          <button
            type="button"
            className="utilityGlyph"
            onClick={() =>
              router.push(
                fromCaseId
                  ? `/case/${fromCaseId}${returnFrom ? `?from=${returnFrom}` : ""}`
                  : "/entity",
              )
            }
            aria-label={fromCaseId ? "Back to case" : "Back to entity directory"}
          >
            <IconSymbol name="back" />
          </button>
          <button
            type="button"
            className="ghostBtn"
            onClick={() => {
              exportEntityDossier(entity);
              logEntityDossierExport(entity.id, entity.name);
            }}
          >
            Export Dossier
          </button>
          <button type="button" className="primaryBtn" onClick={() => toggleEntityFrozen(entity.id)}>
            {entity.frozen ? "Unfreeze Account" : "Freeze Account"}
          </button>
        </div>
      </div>

      <section className="panel tier1Summary">
        <div className="splitTop">
          <div className="moduleTitle">Analyst summary</div>
          <span className="chip chipNeutral">Tier 1 — decision-first</span>
        </div>
        <div className="tier1SummaryGrid">
          <div>
            <span className="eyebrow">Risk level</span>
            <strong>{entity.riskTier}</strong>
            <div className="muted">Index {entity.riskIndex}/100 · Trend: {entity.riskTrend}</div>
          </div>
          <div>
            <span className="eyebrow">Model confidence</span>
            <strong className="tabular">{entity.confidencePct}%</strong>
          </div>
          <div className="tier1SummaryWide">
            <span className="eyebrow">Likely scenario</span>
            <div>{entity.fraudScenario}</div>
          </div>
          <div className="tier1SummaryWide">
            <span className="eyebrow">Recommended action</span>
            <div>{entity.recommendedAction}</div>
          </div>
          <div className="tier1SummaryWide">
            <span className="eyebrow">Investigations</span>
            <div className="muted">
              {entity.investigationsPending} · {openCasesForEntity} open case(s) on file for this entity
            </div>
          </div>
        </div>
      </section>

      <div className="entityGrid">
        <div className="stack">
          <section className="panel">
            <div className="ringRow">
              <RadialRiskVisual value={entity.riskIndex} label="Risk index" size={188} accent="#ffb3ac" />
              <div>
                <div className="moduleTitle" style={{ color: "var(--risk)", marginBottom: 10 }}>
                  {entity.riskTitle}
                </div>
                <h2 className="heroTitle" style={{ marginBottom: 10 }}>
                  {entity.riskTier}
                </h2>
                <div className="heroSubtitle">{entity.riskNarrative}</div>
              </div>
            </div>
            <div className="moduleTitle" style={{ marginTop: 20, marginBottom: 10 }}>
              Key risk signals (Tier 2)
            </div>
            <div className="statCards">
              {entity.factorCards.map((factor) => (
                <div className="statCard" key={factor.label}>
                  <span className="eyebrow">{factor.label}</span>
                  <strong>{factor.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="panel behavioralPanel">
            <div className="moduleTitle" style={{ marginBottom: 12 }}>
              Behavioral context vs baseline
            </div>
            <div className="infoList">
              <div className="infoRow">
                <span>Amount vs 30-day average</span>
                <strong>{entity.behavioralContext.amountVs30dAvg}</strong>
              </div>
              <div className="infoRow">
                <span>Amount vs 90-day average</span>
                <strong>{entity.behavioralContext.amountVs90dAvg}</strong>
              </div>
              <div className="infoRow">
                <span>Frequency vs baseline</span>
                <strong>{entity.behavioralContext.frequencyVsBaseline}</strong>
              </div>
              <div className="infoRow">
                <span>Device vs registered</span>
                <strong>{entity.behavioralContext.deviceVsBaseline}</strong>
              </div>
              <div className="infoRow">
                <span>Location vs typical</span>
                <strong>{entity.behavioralContext.locationVsBaseline}</strong>
              </div>
            </div>
          </section>

          <div className="collapsibleBlock">
            <button type="button" className="collapsibleToggle" onClick={() => setDetailOpen((v) => !v)}>
              <span>{detailOpen ? "▼" : "▶"}</span>
              <span>Supporting technical detail (Tier 3)</span>
              <span className="muted">Device, network, identity checks</span>
            </button>
            {detailOpen ? (
              <section className="gridTwo" style={{ marginTop: 14 }}>
                <div className="panel">
                  <div className="moduleTitle" style={{ marginBottom: 16 }}>
                    Behavioral Risk Fingerprint
                  </div>
                  <div className="footSplit">
                    <div>
                      <span className="eyebrow">Device Profiling</span>
                      <div className="infoList">
                        {entity.fingerprint.device.map((item) => (
                          <div key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="eyebrow">Network Logic</span>
                      <div className="infoList">
                        {entity.fingerprint.network.map((item) => (
                          <div key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <span className="eyebrow">Identity Auth</span>
                    <div className="infoList">
                      {entity.fingerprint.identity.map((item) => (
                        <div key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="moduleTitle" style={{ marginBottom: 16 }}>
                    Identity Trust (KYC)
                  </div>
                  <div className="infoList">
                    {entity.identityTrust.map((item) => (
                      <div className="infoRow" key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.status}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}
          </div>

          <section className="panel">
            <div className="splitTop">
              <div className="moduleTitle">Event Timeline</div>
              <div className="muted">View all {entity.timeline.length} events</div>
            </div>
            {entity.timeline.map((item) => (
              <div className="timelineRow" key={item.id}>
                <div className="mono">{item.timestamp}</div>
                <div>{item.action}</div>
                <div className="tabular">{item.amount}</div>
                <div>
                  <span className="chip chipRisk">{item.signal}</span>
                </div>
                <div className="timelineArrow">↗</div>
              </div>
            ))}
          </section>
        </div>

        <aside className="rightRail">
          <section className="panel">
            <div className="moduleTitle" style={{ marginBottom: 16 }}>
              Financial Snapshot
            </div>
            <div className="infoList">
              {entity.financialSnapshot.map((item) => (
                <div className="infoRow" key={item.label}>
                  <span className="muted">{item.label}</span>
                  <strong className="tabular">{item.value}</strong>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }} className="chip chipRisk">
              {entity.investigationsPending}
            </div>
          </section>

          <section className="panel">
            <div className="moduleTitle" style={{ marginBottom: 16 }}>
              Associated Entities
            </div>
            <div className="infoList">
              {entity.associated.map((item) => {
                const linked = state.entities.find((row) => row.name === item.name && row.id !== entity.id);
                return (
                  <div className="panelRaised" key={item.id}>
                    <strong>{item.name}</strong>
                    <div className="muted" style={{ marginTop: 8 }}>
                      {item.meta}
                    </div>
                    <div style={{ marginTop: 8 }} className="chip chipPrimary">
                      Risk: {item.risk}
                    </div>
                    {linked ? (
                      <button
                        type="button"
                        className="ghostBtn"
                        style={{ marginTop: 12, width: "100%" }}
                        onClick={() => router.push(`/entity/${linked.id}`)}
                      >
                        Open linked dossier
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panelRaised">
            <div className="moduleTitle" style={{ marginBottom: 12 }}>
              Interventions — immediate
            </div>
            <div className="infoList">
              {immediateInterventions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`interventionItem${item.completed ? " completed" : ""}`}
                  onClick={() => toggleIntervention(entity.id, item.id)}
                >
                  <span className="interventionCheck">{item.completed ? "✓" : "○"}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="moduleTitle" style={{ margin: "18px 0 12px" }}>
              Secondary — compliance
            </div>
            <div className="infoList">
              {complianceInterventions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`interventionItem${item.completed ? " completed" : ""}`}
                  onClick={() => toggleIntervention(entity.id, item.id)}
                >
                  <span className="interventionCheck">{item.completed ? "✓" : "○"}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
