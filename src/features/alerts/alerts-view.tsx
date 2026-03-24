"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { alertsMeta } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";

function downloadCsv(rows: ReturnType<typeof useAppState>["filteredAlerts"]) {
  const header = ["Alert ID", "Time", "Customer", "Amount", "Channel", "Risk", "Signal", "Severity", "Owner", "Status"];
  const lines = rows.map((row) =>
    [row.id, row.time, row.customer, row.amount, row.channel, row.risk, row.signal, row.severity, row.owner, row.status].join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "alert-queue.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AlertsView({ focusId }: { focusId?: string }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const {
    state,
    filteredAlerts,
    setSeverityFilter,
    setChannelFilter,
    setOwnerFilter,
    resetAlertFilters,
    toggleAlertSelection,
    clearAlertSelection,
    runBatchAction,
    logAlertsCsvExport,
  } = useAppState();

  const counts = useMemo(
    () => ({
      total: filteredAlerts.length,
      critical: filteredAlerts.filter((row) => row.severity === "Critical").length,
    }),
    [filteredAlerts],
  );

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedAlerts = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return filteredAlerts.slice(start, start + rowsPerPage);
  }, [safeCurrentPage, filteredAlerts]);

  const startIndex = filteredAlerts.length === 0 ? 0 : (safeCurrentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(safeCurrentPage * rowsPerPage, filteredAlerts.length);

  return (
    <div className="stack pageStack">
      <div className="pageHead">
        <div>
          <div className="pageLabel">Operational Queue</div>
          <h1>Live Alert Queue</h1>
          <div className="pageSub">{alertsMeta.subtitle}</div>
        </div>
        <div className="actionsRow">
          <button
            type="button"
            className="ghostBtn"
            onClick={() => {
              downloadCsv(filteredAlerts);
              logAlertsCsvExport(filteredAlerts.length);
            }}
          >
            Export CSV
          </button>
          <button type="button" className="primaryBtn" onClick={runBatchAction}>
            Batch Action ({state.selectedAlertIds.length})
          </button>
        </div>
      </div>

      <div className="filterBar">
        <button
          type="button"
          className={`filterPill ${state.severityFilter !== "All" ? "active" : ""}`}
          onClick={() => setSeverityFilter(state.severityFilter === "Critical" ? "All" : "Critical")}
        >
          <strong>Severity</strong>
          <span>{state.severityFilter}</span>
        </button>
        <button
          type="button"
          className={`filterPill ${state.channelFilter !== "All" ? "active" : ""}`}
          onClick={() => setChannelFilter(state.channelFilter === "Mobile" ? "All" : "Mobile")}
        >
          <strong>Channel</strong>
          <span>{state.channelFilter}</span>
        </button>
        <button
          type="button"
          className={`filterPill ${state.ownerFilter !== "All" ? "active" : ""}`}
          onClick={() => setOwnerFilter(state.ownerFilter === "Mine" ? "All" : "Mine")}
        >
          <strong>Owner</strong>
          <span>{state.ownerFilter}</span>
        </button>
        <button
          type="button"
          className="textButton"
          style={{ marginLeft: "auto" }}
          onClick={() => {
            resetAlertFilters();
            clearAlertSelection();
          }}
        >
          Clear filters & selection
        </button>
      </div>

      <div className="gridTwo">
        <section className="tableWrap">
          <div className="tableHeader">
            <span />
            <span>Time</span>
            <span>Alert</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Risk</span>
            <span>Signal</span>
          </div>
          {pagedAlerts.map((row) => {
            const selected = state.selectedAlertIds.includes(row.id);
            const focused = focusId === row.id;
            return (
              <button
                key={row.id}
                type="button"
                className={`alertRow alertRowButton${selected ? " selected" : ""}${focused ? " focused" : ""}`}
                onClick={() => router.push(`/case/${row.caseId}?from=alerts`)}
              >
                <span className="checkboxWrap" onClick={(event) => event.stopPropagation()}>
                  <input
                    aria-label={`Select ${row.id}`}
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleAlertSelection(row.id)}
                  />
                </span>
                <span>{row.time}</span>
                <div style={{ minWidth: 0 }}>
                  <strong className="mono" style={{ display: "block" }}>{row.id}</strong>
                  <div className="muted">{row.channel}</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.customer}</strong>
                  <div className="muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.region}</div>
                </div>
                <div className="tabular">{row.amount}</div>
                <div>
                  <div className="riskValue">{row.risk}</div>
                  <div className="riskBar">
                    <span style={{ width: `${row.risk}%` }} />
                  </div>
                </div>
                <div className="alertSignalGroup">
                  <span className={`chip ${row.severity === "Critical" ? "chipRisk" : "chipPrimary"}`}>
                    {row.signal}
                  </span>
                  <span className="muted">{row.status}</span>
                </div>
              </button>
            );
          })}
          <div className="splitTop" style={{ marginTop: 18 }}>
            <div className="muted">
              Showing {startIndex}-{endIndex} of {filteredAlerts.length} items · {counts.critical} critical
            </div>
            <div className="pager" aria-label="Pagination">
              <button
                type="button"
                className="pagerBtn"
                onClick={() => setCurrentPage((prev) => Math.max(1, Math.min(prev, totalPages) - 1))}
                disabled={safeCurrentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    type="button"
                    className={`pagerBtn${page === safeCurrentPage ? " active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === safeCurrentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                type="button"
                className="pagerBtn"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, Math.min(prev, totalPages) + 1))}
                disabled={safeCurrentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <aside className="rightRail">
          <section className="panel">
            <div className="splitTop">
              <div className="moduleTitle">Signal Distribution</div>
              <div className="muted">Live</div>
            </div>
            <div className="miniBars">
              {alertsMeta.signalDistribution.map((item) => {
                const maxVal = Math.max(...alertsMeta.signalDistribution.map((d) => d.value));
                const barH = Math.round((item.value / maxVal) * 68);
                return (
                  <div key={item.label}>
                    <span style={{ height: `${barH}px` }} />
                    <div className="barLabel">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel">
            <div className="splitTop">
              <div className="moduleTitle">Team Performance</div>
              <div className="muted">Live</div>
            </div>
            <div className="muted">Avg. triage time</div>
            <div className="metricValue" style={{ margin: "8px 0 16px" }}>
              {alertsMeta.triageTime}
            </div>
            <div className="personList">
              {alertsMeta.team.map((person) => (
                <div className="personRow" key={person.name}>
                  <span>{person.name}</span>
                  <span>{person.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel panelFeature">
            <div className="moduleTitle">AI Recommendation</div>
            <div className="heroSubtitle">{alertsMeta.recommendation}</div>
          </section>
        </aside>
      </div>
    </div>
  );
}
