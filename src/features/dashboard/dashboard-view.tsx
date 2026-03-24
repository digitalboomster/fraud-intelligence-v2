"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { dashboardData } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";
import { SignalBarVisual } from "@/components/data-visuals";
import { WorkflowSheet } from "@/components/workflow-sheet";

export function DashboardView() {
  const router = useRouter();
  const { state, exportDashboardSignals, appendAuditEntry } = useAppState();
  const [interceptOpen, setInterceptOpen] = useState(false);
  const [entityOpen, setEntityOpen] = useState(false);
  const [directive, setDirective] = useState("");
  const [entityDirective, setEntityDirective] = useState("");

  const dominantSignal = [...dashboardData.chartBars].sort((a, b) => b.value - a.value)[0];
  const priorityAlert =
    state.alerts.find((item) => item.severity === "Critical" && item.status !== "Resolved") ??
    state.alerts[0];
  const liveAlerts = state.alerts.length.toLocaleString();
  const highRisk = state.alerts.filter((item) => item.severity === "Critical").length.toString();
  const openCases = state.cases.filter((item) => item.decision === "Pending").length.toString();
  const pendingRecs =
    state.alerts.filter((a) => a.status === "Open" || a.status === "Investigating").length;

  const heroRiskPct = useMemo(() => {
    const raw = Number.parseFloat(String(dashboardData.hero.riskIndex));
    if (Number.isFinite(raw)) {
      return Math.min(100, Math.max(0, raw));
    }
    return priorityAlert ? priorityAlert.risk : 0;
  }, [priorityAlert]);

  const liveReviewItems = useMemo(() => {
    return state.alerts.slice(0, 8).map((a) => ({
      id: a.id,
      entityLabel: `${a.customer} · ${a.entityId}`,
      amount: a.amount,
      rail: a.channel,
      tags: [a.signal.length > 16 ? `${a.signal.slice(0, 16)}…` : a.signal, a.severity],
      caseId: a.caseId,
      entityId: a.entityId,
    }));
  }, [state.alerts]);

  const metrics = [
    { label: "Live Alert Volume", value: liveAlerts },
    { label: "High-Risk Count", value: highRisk },
    { label: "Open Cases", value: openCases },
  ];

  const runIntercept = () => {
    if (!priorityAlert) {
      setInterceptOpen(false);
      router.push("/case");
      return;
    }
    const note = directive.trim();
    appendAuditEntry(
      "Command Centre",
      [
        `Intercept workflow → case ${priorityAlert.caseId}.`,
        note ? `Directive: ${note}` : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
    setInterceptOpen(false);
    setDirective("");
    router.push(`/case/${priorityAlert.caseId}?from=dashboard`);
  };

  const runEntityInvestigation = () => {
    if (!priorityAlert) {
      setEntityOpen(false);
      router.push("/entity");
      return;
    }
    const note = entityDirective.trim();
    appendAuditEntry(
      "Command Centre",
      [
        `Entity investigation → ${priorityAlert.entityId}.`,
        note ? `Directive: ${note}` : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
    setEntityOpen(false);
    setEntityDirective("");
    router.push(`/entity/${priorityAlert.entityId}`);
  };

  return (
    <div className="stack pageStack">
      <WorkflowSheet open={interceptOpen} title="Intercept assets" onClose={() => setInterceptOpen(false)}>
        <p className="heroSubtitle" style={{ margin: 0 }}>
          {priorityAlert
            ? `Route to case ${priorityAlert.caseId} for ${priorityAlert.customer} (${priorityAlert.amount}).`
            : "No priority alert in queue. Open the case directory instead."}
        </p>
        <label className="sheetField">
          <span>Operational directive (optional)</span>
          <textarea
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
            placeholder="e.g. Hold settlement 24h pending device attestation."
          />
        </label>
        <div className="sheetActions">
          <button type="button" className="ghostBtn" onClick={() => setInterceptOpen(false)}>
            Cancel
          </button>
          <button type="button" className="primaryBtn" onClick={runIntercept}>
            Confirm & open case
          </button>
        </div>
      </WorkflowSheet>

      <WorkflowSheet
        open={entityOpen}
        title="Investigate entity"
        onClose={() => setEntityOpen(false)}
      >
        <p className="heroSubtitle" style={{ margin: 0 }}>
          {priorityAlert
            ? `Open dossier ${priorityAlert.entityId} linked to alert ${priorityAlert.id}.`
            : "No priority alert. Browse the entity directory."}
        </p>
        <label className="sheetField">
          <span>Investigation focus (optional)</span>
          <textarea
            value={entityDirective}
            onChange={(e) => setEntityDirective(e.target.value)}
            placeholder="e.g. Map beneficiaries and POS settlement chain."
          />
        </label>
        <div className="sheetActions">
          <button type="button" className="ghostBtn" onClick={() => setEntityOpen(false)}>
            Cancel
          </button>
          <button type="button" className="primaryBtn" onClick={runEntityInvestigation}>
            Confirm & open dossier
          </button>
        </div>
      </WorkflowSheet>

      <div className="pageHead">
        <div>
          <div className="pageLabel">Operational Overview</div>
          <h1>Command Centre</h1>
        </div>
        <div className="actionsRow muted">
          <span className="chip chipPrimary">{dashboardData.status}</span>
          <span>{dashboardData.updated}</span>
        </div>
      </div>

      <div className="gridCommand">
        <section className="panel heroPanel">
          <div>
            <span className="priorityStamp">{dashboardData.hero.priority}</span>
            <h2 className="heroTitle">{dashboardData.hero.title}</h2>
            <div className="heroSubtitle">{dashboardData.hero.subtitle}</div>

            <div className="heroStats">
              <div>
                <span className="eyebrow">Velocity</span>
                <div className="heroValue">{dashboardData.hero.velocity}</div>
              </div>
              <div>
                <span className="eyebrow">Exposure</span>
                <div className="heroValue tabular">{dashboardData.hero.exposure}</div>
              </div>
              <div>
                <span className="eyebrow">Signal</span>
                <div className="heroValue">{priorityAlert?.signal ?? dashboardData.hero.signal}</div>
              </div>
            </div>

            <div className="actionsRow" style={{ marginTop: 28 }}>
              <button type="button" className="primaryBtn" onClick={() => setInterceptOpen(true)}>
                Intercept Assets
              </button>
              <button type="button" className="ghostBtn" onClick={() => setEntityOpen(true)}>
                Investigate Entity
              </button>
            </div>
          </div>

          <div className="heroRail">
            <span className="eyebrow">Risk Index</span>
            <div className="heroRiskValue">{heroRiskPct.toFixed(1)}</div>
            <div className="heroRiskMeter">
              <span style={{ width: `${heroRiskPct}%` }} />
            </div>
          </div>
        </section>

        <aside className="metricStack">
          {metrics.map((metric) => (
            <div className="sideMetric" key={metric.label}>
              <div>
                <span className="eyebrow">{metric.label}</span>
                <strong className="tabular">{metric.value}</strong>
              </div>
              <span className="metricIcon" aria-hidden="true" />
            </div>
          ))}
        </aside>
      </div>

      <div className="gridTwo">
        <section className="panel">
          <div className="splitTop">
            <div className="moduleTitle">Risk Signal Distribution</div>
            <button
              type="button"
              className="textButton"
              onClick={() =>
                exportDashboardSignals(dashboardData.chartBars, {
                  liveAlerts: state.alerts.length,
                  openCases: state.cases.filter((c) => c.decision === "Pending").length,
                  criticalAlerts: state.alerts.filter((a) => a.severity === "Critical").length,
                })
              }
            >
              Export raw data
            </button>
          </div>
          <div className="signalDistribution">
            <SignalBarVisual items={dashboardData.chartBars} />
            <div className="signalSummary">
              <div className="signalSummaryCard">
                <span className="eyebrow">Dominant vector</span>
                <strong>{dominantSignal.label}</strong>
                <div className="heroSubtitle">{dominantSignal.value}% of weighted signal activity this cycle.</div>
              </div>
              <div className="signalSummaryCard">
                <span className="eyebrow">Visual interpretation</span>
                <div className="signalLegend">
                  {dashboardData.chartBars.map((bar) => (
                    <div className="signalLegendRow" key={bar.label}>
                      <span>{bar.label}</span>
                      <strong>{bar.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="footSplit">
            <div>
              <span className="eyebrow">Primary Threat Vector</span>
              <div>{dashboardData.threatVector}</div>
            </div>
            <div>
              <span className="eyebrow">Confidence Score</span>
              <div>{dashboardData.confidence}</div>
            </div>
          </div>
        </section>

        <section className="panel panelFeature">
          <div className="moduleTitle">Intelligence Advisory</div>
          <div className="heroSubtitle">{dashboardData.advisory}</div>
          <div className="advisoryFooter">
            <div className="muted">{pendingRecs} open / in-flight queue items</div>
            <button type="button" className="ghostBtn" onClick={() => router.push("/alerts")}>
              Review all
            </button>
          </div>
        </section>
      </div>

      <section className="stack">
        <div className="splitTop">
          <div className="moduleTitle">Review Posture: Action Required</div>
          <button type="button" className="textButton" onClick={() => router.push("/alerts")}>
            View full queue
          </button>
        </div>
        <div className="reviewList">
          {liveReviewItems.map((item) => (
            <div className="reviewRow" key={item.id}>
              <div>
                <strong className="mono">{item.id}</strong>
                <div className="muted">{item.entityLabel}</div>
              </div>
              <div>
                <strong className="tabular">{item.amount}</strong>
                <div className="muted">{item.rail}</div>
              </div>
              <div className="actionsRow">
                {item.tags.map((tag) => (
                  <span className={`chip ${tag === "Critical" ? "chipRisk" : "chipPrimary"}`} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="ghostBtn"
                onClick={() => router.push(`/case/${item.caseId}?from=dashboard`)}
              >
                Review
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="tape">
        {dashboardData.tape.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}
