"use client";

import { useMemo } from "react";
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

  const entity = useMemo(() => {
    if (!entityId) {
      return null;
    }
    return state.entities.find((item) => item.id === entityId) ?? null;
  }, [entityId, state.entities]);

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
            <div className="statCards">
              {entity.factorCards.map((factor) => (
                <div className="statCard" key={factor.label}>
                  <span className="eyebrow">{factor.label}</span>
                  <strong>{factor.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="gridTwo">
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
                      {item.risk}
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
            <div className="moduleTitle" style={{ marginBottom: 16 }}>
              Suggested Interventions
            </div>
            <div className="infoList">
              {entity.interventions.map((item) => (
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
