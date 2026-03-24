"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state";
import { IconSymbol } from "@/components/icon-symbol";

export function EntityIndexView() {
  const router = useRouter();
  const { state } = useAppState();
  const [query, setQuery] = useState("");

  const filteredEntities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return state.entities;
    }
    return state.entities.filter(
      (item) =>
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.riskTier.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [query, state.entities]);

  return (
    <div className="stack pageStack">
      <div className="pageHead">
        <div>
          <div className="pageLabel">Entity Search</div>
          <h1>Entity Directory</h1>
          <div className="pageSub">Browse all entities and open each dedicated dossier page.</div>
        </div>
      </div>

      <label className="directoryFilter">
        <span className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
          Filter directory
        </span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Entity ID, name, tag, or tier…" />
      </label>

      <section className="tableWrap">
        <div className="tableHeader" style={{ gridTemplateColumns: "140px minmax(0, 1.2fr) 130px 160px auto" }}>
          <span>Entity ID</span>
          <span>Name</span>
          <span>Risk Index</span>
          <span>Tier</span>
          <span />
        </div>
        <div className="muted" style={{ marginBottom: 8 }}>
          {filteredEntities.length} entit{filteredEntities.length === 1 ? "y" : "ies"}
        </div>
        <div className="directoryList">
          {filteredEntities.map((item) => (
            <div className="directoryRow" style={{ gridTemplateColumns: "140px minmax(0, 1.2fr) 130px 160px auto" }} key={item.id}>
              <strong className="mono">{item.id}</strong>
              <div>
                <strong>{item.name}</strong>
                <div className="muted">{item.tags[0]}</div>
              </div>
              <span className="tabular">{item.riskIndex}</span>
              <span className="chip chipRisk">{item.riskTier}</span>
              <button
                type="button"
                className="utilityGlyph"
                aria-label={`Open entity ${item.id}`}
                onClick={() => router.push(`/entity/${item.id}`)}
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
