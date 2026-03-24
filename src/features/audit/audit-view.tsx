"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/lib/app-state";

function downloadAuditCsv(
  rows: Array<{ id: string; timestamp: string; actor: string; detail: string }>,
) {
  const header = ["Entry ID", "Timestamp", "Actor", "Detail"];
  const lines = rows.map((row) =>
    [row.id, row.timestamp, row.actor, `"${row.detail.replace(/"/g, '""')}"`].join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `audit-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AuditView() {
  const { state, appendAuditEntry } = useAppState();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return state.auditLog;
    }
    return state.auditLog.filter(
      (item) =>
        item.actor.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q),
    );
  }, [query, state.auditLog]);

  return (
    <div className="stack pageStack">
      <div className="pageHead">
        <div>
          <div className="pageLabel">Operational Ledger</div>
          <h1 style={{ fontSize: 40 }}>Audit Logs</h1>
          <div className="pageSub">
            Platform-level activity trail across analysts, automation rules, reporting jobs, and controls.
          </div>
        </div>
        <div className="actionsRow">
          <button
            type="button"
            className="ghostBtn"
            onClick={() => {
              downloadAuditCsv(filtered);
              appendAuditEntry("Audit Logs", `Exported ${filtered.length} ledger row(s) to CSV.`);
            }}
          >
            Export filtered CSV
          </button>
        </div>
      </div>

      <section className="panel">
        <div className="splitTop">
          <div className="moduleTitle">Recent system events</div>
          <label className="directoryFilter" style={{ marginBottom: 0 }}>
            <span className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
              Filter ledger
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Actor, detail, or entry ID…"
            />
          </label>
        </div>
        <div className="muted" style={{ marginBottom: 14 }}>
          Showing {filtered.length} of {state.auditLog.length} entries
        </div>
        <div className="auditFeed">
          {filtered.map((item) => (
            <div className="auditItem" key={item.id}>
              <strong className="mono">{item.timestamp}</strong>
              <span>{item.actor}</span>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
