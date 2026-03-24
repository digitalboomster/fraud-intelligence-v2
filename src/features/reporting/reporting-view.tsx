"use client";

import { useState } from "react";
import { exportCards, reportingData } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";
import { IconSymbol } from "@/components/icon-symbol";
import { RadialRiskVisual } from "@/components/data-visuals";
import { WorkflowSheet } from "@/components/workflow-sheet";

const frameworkOptions = ["CBN AML/CFT", "NFIU STR", "Internal Board", "Correspondent bank"] as const;

export function ReportingView() {
  const { state, generateReportPack, shareInternalDistribution, downloadArtifact } = useAppState();
  const [packOpen, setPackOpen] = useState(false);
  const [distOpen, setDistOpen] = useState(false);
  const [periodLabel, setPeriodLabel] = useState("Q1 2026");
  const [framework, setFramework] = useState<string>(frameworkOptions[0]);
  const [packNarrative, setPackNarrative] = useState("");
  const [distNote, setDistNote] = useState("");
  const [packError, setPackError] = useState("");

  const submitPack = () => {
    if (periodLabel.trim().length < 2) {
      setPackError("Reporting period is required.");
      return;
    }
    setPackError("");
    generateReportPack({
      periodLabel: periodLabel.trim(),
      framework,
      narrative: packNarrative,
    });
    setPackOpen(false);
    setPackNarrative("");
  };

  const submitDistribution = () => {
    shareInternalDistribution(distNote);
    setDistOpen(false);
    setDistNote("");
  };

  return (
    <div className="stack pageStack">
      <WorkflowSheet open={packOpen} title="Generate regulator pack" onClose={() => setPackOpen(false)}>
        <p className="heroSubtitle" style={{ margin: 0 }}>
          Capture reporting context before the pack is generated. Outputs appear in submissions and the audit ledger.
        </p>
        <label className="sheetField">
          <span>Reporting period</span>
          <input value={periodLabel} onChange={(e) => setPeriodLabel(e.target.value)} placeholder="e.g. Jan–Mar 2026" />
        </label>
        <label className="sheetField">
          <span>Framework</span>
          <select value={framework} onChange={(e) => setFramework(e.target.value)}>
            {frameworkOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <label className="sheetField">
          <span>Officer narrative (optional)</span>
          <textarea
            value={packNarrative}
            onChange={(e) => setPackNarrative(e.target.value)}
            placeholder="Scope, exclusions, and attestation language."
          />
        </label>
        {packError ? (
          <p className="muted" style={{ color: "var(--risk)", margin: 0 }}>
            {packError}
          </p>
        ) : null}
        <div className="sheetActions">
          <button type="button" className="ghostBtn" onClick={() => setPackOpen(false)}>
            Cancel
          </button>
          <button type="button" className="primaryBtn" onClick={submitPack}>
            Generate pack
          </button>
        </div>
      </WorkflowSheet>

      <WorkflowSheet open={distOpen} title="Internal distribution" onClose={() => setDistOpen(false)}>
        <p className="heroSubtitle" style={{ margin: 0 }}>
          Add an optional distribution note before the memo file is generated.
        </p>
        <label className="sheetField">
          <span>Distribution note (optional)</span>
          <textarea
            value={distNote}
            onChange={(e) => setDistNote(e.target.value)}
            placeholder="e.g. Include latest STR batch for Lagos corridor."
          />
        </label>
        <div className="sheetActions">
          <button type="button" className="ghostBtn" onClick={() => setDistOpen(false)}>
            Cancel
          </button>
          <button type="button" className="primaryBtn" onClick={submitDistribution}>
            Export memo
          </button>
        </div>
      </WorkflowSheet>

      <div className="pageHead">
        <div>
          <div className="pageLabel">Governance & Compliance</div>
          <h1 style={{ fontSize: 40 }}>{reportingData.title}</h1>
          <div className="pageSub">{reportingData.subtitle}</div>
        </div>
        <div className="actionsRow">
          <button type="button" className="ghostBtn" onClick={() => setDistOpen(true)}>
            Internal Distribution
          </button>
          <button type="button" className="primaryBtn" onClick={() => setPackOpen(true)}>
            Generate Regulator Pack
          </button>
        </div>
      </div>

      <div className="metricsRow">
        {reportingData.metrics.map((metric) => (
          <div className="metricCard" key={metric.label}>
            <span className="eyebrow">{metric.label}</span>
            <strong>{metric.value}</strong>
            <div className="muted" style={{ marginTop: 10 }}>
              {metric.note}
            </div>
          </div>
        ))}
      </div>

      <div className="reportingGrid">
        <div className="stack">
          <section className="submissionsWrap">
            <div className="splitTop">
              <div className="moduleTitle">Recent Regulatory Submissions</div>
              <div className="muted">{state.submissions.length} active packs</div>
            </div>
            <div className="submissionRows">
              {state.submissions.map((item) => (
                <div className="submissionRow" key={item.id}>
                  <div>
                    <strong className="mono">{item.id}</strong>
                    <div className="muted">
                      {[item.framework, item.periodLabel].filter(Boolean).join(" · ") || "Regulatory workflow"}
                    </div>
                  </div>
                  <div>{item.type}</div>
                  <div>
                    <span
                      className={`chip ${
                        item.status === "Pending"
                          ? "chipRisk"
                          : item.status === "Accepted"
                            ? "chipSuccess"
                            : item.status === "Certified"
                              ? "chipPrimary"
                              : "chipNeutral"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div>{item.date}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="evidenceGrid exportGrid">
            {exportCards.map((card) => (
              <div className="exportCard" key={card.id}>
                <div className="exportGlyph" aria-hidden="true">
                  <IconSymbol
                    name={
                      card.title === "Alert Queue Analysis"
                        ? "analysis"
                        : card.title === "Control Map Summary"
                          ? "controls"
                          : "reporting"
                    }
                  />
                </div>
                <strong>{card.title}</strong>
                <div className="heroSubtitle" style={{ marginTop: 12 }}>
                  {card.body}
                </div>
                <button
                  type="button"
                  className="ghostBtn"
                  style={{ marginTop: 22, width: "100%" }}
                  onClick={() => downloadArtifact(card.id)}
                >
                  {card.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="rightRail">
          <section className="panel">
            <div className="moduleTitle">Model Performance & Drift</div>
            <div className="modelSummary">
              <div className="modelRingWrap compact">
                <RadialRiskVisual
                  value={reportingData.modelConfidence}
                  label="Confidence"
                  size={148}
                  accent="#b6c4ff"
                  decimals={1}
                />
              </div>
              <div className="modelMeta">
                <div className="modelMetaStat">
                  <div className="infoRow">
                    <span>Recall</span>
                    <strong>High</strong>
                  </div>
                  <div className="infoRow">
                    <span>Stability</span>
                    <strong className="mono">(0.92)</strong>
                  </div>
                </div>
                <div className="modelMetaStat">
                  <div className="infoRow">
                    <span>Data Drift</span>
                    <strong>Nominal</strong>
                  </div>
                  <div className="infoRow">
                    <span>Index</span>
                    <strong className="mono">(0.04)</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel panelFeature">
            <div className="moduleTitle" style={{ marginBottom: 16 }}>
              Officer&apos;s Narrative
            </div>
            <div className="heroSubtitle">{reportingData.narrative}</div>
          </section>

          <section className="panel">
            <div className="moduleTitle" style={{ marginBottom: 16 }}>
              Assurance Summary
            </div>
            <div className="infoList">
              {reportingData.assurance.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
