"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { IconSymbol } from "@/components/icon-symbol";

export function CaseIndexView() {
  const router = useRouter();
  const { state } = useAppState();
  const [query, setQuery] = useState("");

  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return state.cases;
    }
    return state.cases.filter(
      (item) =>
        item.id.toLowerCase().includes(q) ||
        item.entityProfile.name.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q),
    );
  }, [query, state.cases]);

  const statusClass = (status: string) => {
    const value = status.toLowerCase();
    if (value.includes("critical")) {
      return "chipRisk";
    }
    if (value.includes("elevated") || value.includes("high")) {
      return "chipPrimary";
    }
    return "chipNeutral";
  };

  return (
    <div className="stack pageStack">
      <div className="pageHead">
        <div>
          <div className="pageLabel">Case Manager</div>
          <h1>Case Directory</h1>
          <div className="pageSub">Select a case to open a dedicated case page.</div>
        </div>
      </div>

      <label className="directoryFilter">
        <span className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
          Filter directory
        </span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Case ID, entity, or status…" />
      </label>

      <section className="tableWrap">
        <div className="tableHeader" style={{ gridTemplateColumns: "120px minmax(0, 1.2fr) 190px 170px auto" }}>
          <span>Case ID</span>
          <span>Entity</span>
          <span>Status</span>
          <span>Amount</span>
          <span />
        </div>
        <div className="muted" style={{ marginBottom: 8 }}>
          {filteredCases.length} case{filteredCases.length === 1 ? "" : "s"}
        </div>
        <div className="directoryList">
          {filteredCases.map((item) => (
            <div className="directoryRow" style={{ gridTemplateColumns: "120px minmax(0, 1.2fr) 190px 170px auto" }} key={item.id}>
              <strong className="mono">{item.id}</strong>
              <div>
                <strong>{item.entityProfile.name}</strong>
                <div className="muted">{item.method}</div>
              </div>
              <span className={`chip directoryStatus ${statusClass(item.status)}`}>{item.status}</span>
              <span className="tabular">{item.amount}</span>
              <button
                type="button"
                className="utilityGlyph"
                aria-label={`Open case ${item.id}`}
                onClick={() => router.push(`/case/${item.id}?from=case`)}
              >
                <IconSymbol name="external" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
