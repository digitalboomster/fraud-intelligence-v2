"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CaseDecision } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";
import { IconSymbol } from "@/components/icon-symbol";
import { WorkflowSheet } from "@/components/workflow-sheet";

function downloadEvidencePack(caseId: string, evidence: Array<{ label: string; value: string }>) {
  const blob = new Blob(
    [[`Evidence pack for ${caseId}`, "", ...evidence.map((item) => `${item.label}: ${item.value}`)].join("\n")],
    { type: "text/plain;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${caseId}-evidence.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function CaseView({ caseId, from }: { caseId?: string; from?: "alerts" | "dashboard" | "case" }) {
  const router = useRouter();
  const { state, setCaseDecision, addCaseNote, logCaseEvidenceExport } = useAppState();
  const backHref = from === "alerts" ? "/alerts" : from === "dashboard" ? "/dashboard" : "/case";

  const [workspaceTab, setWorkspaceTab] = useState<"overview" | "workspace">("overview");
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<CaseDecision | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [noteTitle, setNoteTitle] = useState("Analyst note");
  const [noteBody, setNoteBody] = useState("");

  const activeCase = useMemo(() => {
    if (!caseId) {
      return null;
    }
    return state.cases.find((item) => item.id === caseId) ?? null;
  }, [caseId, state.cases]);

  const openDecision = (decision: CaseDecision) => {
    setPendingDecision(decision);
    setDecisionNote("");
    setDecisionOpen(true);
  };

  const submitDecision = () => {
    if (!activeCase || !pendingDecision) {
      return;
    }
    setCaseDecision(activeCase.id, pendingDecision, decisionNote);
    setDecisionOpen(false);
    setPendingDecision(null);
    setDecisionNote("");
  };

  const submitCaseNote = () => {
    if (!activeCase) {
      return;
    }
    const title = noteTitle.trim();
    const body = noteBody.trim();
    if (title.length < 2 || body.length < 4) {
      return;
    }
    addCaseNote(activeCase.id, title, body);
    setNoteTitle("Analyst note");
    setNoteBody("");
  };

  if (!activeCase) {
    return (
      <div className="stack pageStack">
        <section className="panel">
          <div className="moduleTitle" style={{ marginBottom: 12 }}>Case unavailable</div>
          <div className="heroSubtitle">Case <span className="mono">{caseId}</span> was not found.</div>
          <div className="actionsRow" style={{ marginTop: 14 }}>
            <button type="button" className="ghostBtn" onClick={() => router.push(backHref)}>
              Back
            </button>
          </div>
        </section>
      </div>
    );
  }

  const decisionTitle =
    pendingDecision === "Approved"
      ? "Approve case"
      : pendingDecision === "Rejected"
        ? "Reject case"
        : pendingDecision === "Escalated"
          ? "Escalate to compliance"
          : "Update determination";

  return (
    <div className="stack pageStack">
      <WorkflowSheet
        open={decisionOpen}
        title={decisionTitle}
        onClose={() => {
          setDecisionOpen(false);
          setPendingDecision(null);
          setDecisionNote("");
        }}
      >
        <p className="heroSubtitle" style={{ margin: 0 }}>
          Record a determination for <span className="mono">{activeCase.id}</span>. Your rationale is stored on the case
          audit trail and the platform ledger.
        </p>
        <label className="sheetField">
          <span>Rationale (optional — uses template if empty)</span>
          <textarea
            value={decisionNote}
            onChange={(event) => setDecisionNote(event.target.value)}
            placeholder="Document the evidence basis for this decision."
          />
        </label>
        <div className="sheetActions">
          <button
            type="button"
            className="ghostBtn"
            onClick={() => {
              setDecisionOpen(false);
              setPendingDecision(null);
              setDecisionNote("");
            }}
          >
            Cancel
          </button>
          <button type="button" className="primaryBtn" onClick={submitDecision}>
            Record decision
          </button>
        </div>
      </WorkflowSheet>

      <div className="splitTop">
        <div className="actionsRow">
          <button type="button" className="utilityGlyph" onClick={() => router.push(backHref)} aria-label="Back">
            <IconSymbol name="back" />
          </button>
          <div>
            <div className="pageLabel">Case Manager</div>
            <h1 style={{ fontSize: 34, margin: 0 }}>Case #{activeCase.id}</h1>
          </div>
        </div>
      </div>

      <div className="caseWorkspaceTabs">
        <button
          type="button"
          className={`caseWorkspaceTab${workspaceTab === "overview" ? " active" : ""}`}
          onClick={() => setWorkspaceTab("overview")}
        >
          Overview
        </button>
        <button
          type="button"
          className={`caseWorkspaceTab${workspaceTab === "workspace" ? " active" : ""}`}
          onClick={() => setWorkspaceTab("workspace")}
        >
          Analyst workspace
        </button>
      </div>

      {workspaceTab === "workspace" ? (
        <section className="panel intakePanel">
          <div className="moduleTitle">Structured case notes</div>
          <p className="heroSubtitle" style={{ marginTop: 0 }}>
            Inputs here append to the case audit trail and mirror to the global audit log.
          </p>
          <div className="intakeFormGrid">
            <label className="intakeField">
              <span>Note title</span>
              <input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} placeholder="e.g. Beneficiary verification" />
            </label>
            <label className="intakeField intakeFieldFull">
              <span>Detail</span>
              <textarea
                value={noteBody}
                onChange={(event) => setNoteBody(event.target.value)}
                placeholder="Document findings, contacts, and next steps."
                rows={5}
              />
            </label>
          </div>
          <div className="sheetActions">
            <button type="button" className="primaryBtn" onClick={submitCaseNote}>
              Add to audit trail
            </button>
          </div>
        </section>
      ) : null}

      {workspaceTab === "overview" ? (
        <>
          <section className="panel summaryStrip">
            <div>
              <span className="eyebrow">Transaction Amount</span>
              <strong className="tabular">{activeCase.amount}</strong>
              <div className="muted">{activeCase.currency}</div>
            </div>
            <div>
              <span className="eyebrow">Initiation Method</span>
              <strong>{activeCase.method}</strong>
            </div>
            <div>
              <span className="eyebrow">Destination Rail</span>
              <strong>{activeCase.destination}</strong>
            </div>
            <div>
              <span className="eyebrow">Current Status</span>
              <span className="chip chipRisk">{activeCase.status}</span>
            </div>
            <button
              type="button"
              className="ghostBtn"
              onClick={() => {
                downloadEvidencePack(activeCase.id, activeCase.evidence);
                logCaseEvidenceExport(activeCase.id);
              }}
            >
              Evidence Pack
            </button>
            <button
              type="button"
              className="utilityGlyph"
              onClick={() =>
                router.push(
                  `/entity/${activeCase.entityId}?fromCase=${activeCase.id}${
                    from ? `&returnFrom=${from}` : ""
                  }`,
                )
              }
              aria-label="Open entity profile"
            >
              <IconSymbol name="external" />
            </button>
          </section>

          <div className="caseGrid">
            <div className="stack">
              <section className="panel">
                <div className="splitTop">
                  <div className="moduleTitle">Audit Trail</div>
                  <div className="muted">{activeCase.auditTrail.length} entries in latest review window</div>
                </div>
                <div className="timelineList">
                  {activeCase.auditTrail.map((item) => (
                    <div className="reviewRow reviewRowAudit" key={item.id}>
                      <span className="timelineMarker" />
                      <div>
                        <strong>{item.title}</strong>
                        <div className="heroSubtitle">{item.body}</div>
                      </div>
                      <div className="muted">{item.time}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="moduleTitle" style={{ marginBottom: 16 }}>
                  Supporting Evidence
                </div>
                <div className="evidenceGrid evidenceGridCase">
                  {activeCase.evidence.map((item) => (
                    <div className="evidenceCard" key={item.label}>
                      <span className="eyebrow">{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="rightRail">
              <section className="panel">
                <div className="moduleTitle">Risk Signal Dashboard</div>
                <div className="scoreBox" style={{ marginTop: 18 }}>
                  <div className="splitTop">
                    <span>Aggregated Risk Score</span>
                    <strong className="tabular">{activeCase.aggregatedRisk}/100</strong>
                  </div>
                  <div className="scoreBar">
                    <span style={{ width: `${activeCase.aggregatedRisk}%` }} />
                  </div>
                  <div className="heroSubtitle">
                    System classification: <strong>Critical.</strong> Multiple high-confidence fraud indicators matched.
                  </div>
                </div>
                <div className="infoList" style={{ marginTop: 18 }}>
                  {activeCase.riskFactors.map((item) => (
                    <div className="infoRow" key={item.label}>
                      <span>{item.label}</span>
                      <strong style={{ color: "var(--risk)" }}>{item.points}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="moduleTitle" style={{ marginBottom: 16 }}>
                  Entity Profile
                </div>
                <div className="actionsRow">
                  <div className="brandMark">{activeCase.entityProfile.initials}</div>
                  <div>
                    <strong>{activeCase.entityProfile.name}</strong>
                    <div className="muted">{activeCase.entityProfile.memberSince}</div>
                  </div>
                </div>
                <div className="infoList" style={{ marginTop: 18 }}>
                  <div className="infoRow">
                    <span>KYC Status</span>
                    <strong>{activeCase.entityProfile.kyc}</strong>
                  </div>
                  <div className="infoRow">
                    <span>Credit Rating</span>
                    <strong>{activeCase.entityProfile.credit}</strong>
                  </div>
                  <div className="infoRow">
                    <span>Linked Accounts</span>
                    <strong>{activeCase.entityProfile.linked}</strong>
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="moduleTitle" style={{ marginBottom: 16 }}>
                  Final Determination
                </div>
                <div className="determination">
                  <button type="button" className="dangerBtn" onClick={() => openDecision("Rejected")}>
                    Reject
                  </button>
                  <button type="button" className="primaryBtn" onClick={() => openDecision("Approved")}>
                    Approve
                  </button>
                </div>
                <button
                  type="button"
                  className="ghostBtn"
                  style={{ marginTop: 12, width: "100%" }}
                  onClick={() => openDecision("Escalated")}
                >
                  Escalate to Compliance
                </button>
              </section>
            </aside>
          </div>
        </>
      ) : null}
    </div>
  );
}
