"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AlertChannel } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";
import { IconSymbol } from "@/components/icon-symbol";

type IntakeTab = "subject" | "transaction" | "review";

const channelOptions: AlertChannel[] = ["Mobile", "Card", "Web", "Transfer"];

export function NewInvestigationView() {
  const router = useRouter();
  const { createInvestigation, state } = useAppState();
  const [tab, setTab] = useState<IntakeTab>("subject");
  const [entityName, setEntityName] = useState("");
  const [region, setRegion] = useState("Lagos, NG");
  const [amountNgn, setAmountNgn] = useState("2500000");
  const [channel, setChannel] = useState<AlertChannel>("Mobile");
  const [signal, setSignal] = useState("Velocity Trigger");
  const [narrative, setNarrative] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const amountPreview = useMemo(() => {
    const value = Number(amountNgn);
    if (!Number.isFinite(value) || value <= 0) {
      return "NGN 0.00";
    }
    return `NGN ${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [amountNgn]);

  const validate = () => {
    const issues: string[] = [];
    if (entityName.trim().length < 3) issues.push("Entity name must be at least 3 characters.");
    if (region.trim().length < 3) issues.push("Region is required.");
    if (!Number.isFinite(Number(amountNgn)) || Number(amountNgn) <= 0) issues.push("Amount must be greater than 0.");
    if (signal.trim().length < 3) issues.push("Signal must be at least 3 characters.");
    if (narrative.trim().length < 12) issues.push("Case narrative should be at least 12 characters.");
    setErrors(issues);
    return issues.length === 0;
  };

  const submit = () => {
    if (!validate()) {
      setTab("review");
      return;
    }
    const caseId = createInvestigation({
      entityName: entityName.trim(),
      region: region.trim(),
      amountNgn: Number(amountNgn),
      channel,
      signal: signal.trim(),
      narrative: narrative.trim(),
    });
    router.push(`/case/${caseId}?from=case`);
  };

  return (
    <div className="stack">
      <div className="pageLabel">Operations / New Intake</div>
      <div className="pageHead">
        <div>
          <h1>New Investigation</h1>
          <div className="pageSub">
            Capture intake inputs, generate linked records, and open a live case workspace instantly.
          </div>
        </div>
        <div className="actionsRow">
          <button type="button" className="ghostBtn" onClick={() => router.push("/case")}>
            Cancel
          </button>
          <button type="button" className="primaryBtn" onClick={submit}>
            Create Investigation
          </button>
        </div>
      </div>

      <div className="panel intakeTabs">
        <button type="button" className={`intakeTab${tab === "subject" ? " active" : ""}`} onClick={() => setTab("subject")}>
          01 Subject
        </button>
        <button type="button" className={`intakeTab${tab === "transaction" ? " active" : ""}`} onClick={() => setTab("transaction")}>
          02 Transaction
        </button>
        <button type="button" className={`intakeTab${tab === "review" ? " active" : ""}`} onClick={() => setTab("review")}>
          03 Review & Submit
        </button>
      </div>

      {tab === "subject" ? (
        <div className="panel intakePanel">
          <div className="moduleTitle">Subject Profile</div>
          <div className="intakeFormGrid">
            <label className="intakeField">
              <span>Entity Name</span>
              <input value={entityName} onChange={(e) => setEntityName(e.target.value)} placeholder="e.g. Adebayo Ventures Ltd" />
            </label>
            <label className="intakeField">
              <span>Region</span>
              <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Abuja, NG" />
            </label>
            <label className="intakeField intakeFieldFull">
              <span>Case Narrative</span>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Explain why this case is being opened and what is suspicious."
                rows={5}
              />
            </label>
          </div>
        </div>
      ) : null}

      {tab === "transaction" ? (
        <div className="panel intakePanel">
          <div className="moduleTitle">Transaction Signal</div>
          <div className="intakeFormGrid">
            <label className="intakeField">
              <span>Amount (NGN)</span>
              <input value={amountNgn} onChange={(e) => setAmountNgn(e.target.value.replace(/[^\d]/g, ""))} />
            </label>
            <label className="intakeField">
              <span>Channel</span>
              <select value={channel} onChange={(e) => setChannel(e.target.value as AlertChannel)}>
                {channelOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="intakeField intakeFieldFull">
              <span>Primary Signal</span>
              <input value={signal} onChange={(e) => setSignal(e.target.value)} placeholder="e.g. Smurfing Pattern" />
            </label>
          </div>
        </div>
      ) : null}

      {tab === "review" ? (
        <div className="panel intakePanel">
          <div className="splitTop">
            <div className="moduleTitle">Review</div>
            <span className="chip chipNeutral">Operator: {state.currentUser.name}</span>
          </div>
          <div className="reviewList">
            <div className="reviewRow">
              <div>
                <small>Entity</small>
                <div>{entityName || "Not provided"}</div>
              </div>
              <div>
                <small>Region</small>
                <div>{region || "Not provided"}</div>
              </div>
              <div>
                <small>Amount</small>
                <div className="mono">{amountPreview}</div>
              </div>
              <span className="chip chipPrimary">{channel}</span>
            </div>
            <div className="reviewRow">
              <div>
                <small>Signal</small>
                <div>{signal || "Not provided"}</div>
              </div>
              <div style={{ gridColumn: "span 3" }}>
                <small>Narrative</small>
                <div>{narrative || "Not provided"}</div>
              </div>
            </div>
          </div>
          {errors.length > 0 ? (
            <div className="intakeErrors">
              {errors.map((item) => (
                <div key={item}>
                  <IconSymbol name="alerts" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
