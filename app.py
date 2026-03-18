"""
Savvy Bee — Transaction Risk Intelligence
Institutional-grade fraud detection. Advisory only.
"""
import streamlit as st
import pandas as pd
import numpy as np
import joblib
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from pathlib import Path

st.set_page_config(
    page_title="Transaction Risk | Savvy Bee",
    page_icon=None,
    layout="wide",
    initial_sidebar_state="collapsed",
)

CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.stApp {
    background: #06080d;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #ffffff;
}
.stApp p, .stApp span, .stApp li, .stApp .stMarkdown { color: #ffffff !important; }

#MainMenu, footer, header { visibility: hidden; }

.block-container {
    padding: 0 2.5rem 4rem;
    max-width: 1440px;
}

/* System bar */
.sysbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0 0.75rem;
    border-bottom: 1px solid #0f1623;
    margin-bottom: 2.5rem;
}
.sysbar-left { display: flex; align-items: center; gap: 1.5rem; }
.sysbar-logo {
    font-size: 0.78rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}
.sysbar-divider { width: 1px; height: 16px; background: #1e2a3d; }
.sysbar-module {
    font-size: 0.72rem;
    font-weight: 400;
    color: #94a3b8;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}
.sysbar-right { display: flex; align-items: center; gap: 1.25rem; }
.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.65rem;
    font-weight: 600;
    color: #10b981;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}
.status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #10b981;
    animation: blink 2.5s ease-in-out infinite;
}
@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
.sysbar-tag {
    font-size: 0.62rem;
    color: #64748b;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
}

/* Page title */
.page-title {
    font-size: 1.65rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin-bottom: 0.35rem;
}
.page-sub {
    font-size: 0.825rem;
    color: #e2e8f0;
    font-weight: 400;
    line-height: 1.5;
    margin-bottom: 2rem;
}

/* KPI cards */
.kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: #0f1623;
    border: 1px solid #0f1623;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 2rem;
}
.kpi-cell {
    background: #090c14;
    padding: 1.25rem 1.5rem;
    position: relative;
}
.kpi-cell::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: transparent;
}
.kpi-cell.accent::after { background: #3b82f6; }
.kpi-cell.warn::after { background: #f59e0b; }
.kpi-cell.danger::after { background: #ef4444; }
.kpi-cell.ok::after { background: #10b981; }
.kpi-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.6rem;
}
.kpi-val {
    font-size: 1.9rem;
    font-weight: 700;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.03em;
    line-height: 1;
}
.kpi-val.blue { color: #60a5fa; }
.kpi-val.amber { color: #fbbf24; }
.kpi-val.red { color: #f87171; }
.kpi-val.green { color: #34d399; }
.kpi-desc {
    font-size: 0.7rem;
    color: #64748b;
    margin-top: 0.4rem;
    font-weight: 400;
}

/* Section label */
.section-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #0f1623;
}

/* Data panel */
.data-panel {
    background: #090c14;
    border: 1px solid #0f1623;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    color: #e2e8f0;
}
.data-panel .panel-header { color: #94a3b8; }
.panel-header {
    font-size: 0.65rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid #0f1623;
}

/* Tier chips */
.chip { display:inline-block; padding:1px 7px; border-radius:3px; font-size:0.6rem; font-weight:700; letter-spacing:0.1em; }
.chip-low { background:rgba(16,185,129,0.08); color:#34d399; border:1px solid rgba(16,185,129,0.15); }
.chip-elevated { background:rgba(251,191,36,0.08); color:#fbbf24; border:1px solid rgba(251,191,36,0.15); }
.chip-high { background:rgba(248,113,113,0.08); color:#f87171; border:1px solid rgba(248,113,113,0.15); }

/* Action table */
.action-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #0f1623;
}
.action-row:last-child { border-bottom: none; }
.action-tier { min-width: 80px; }
.action-desc { font-size: 0.8rem; color: #e2e8f0; flex: 1; padding: 0 1rem; }
.action-directive { font-size: 0.75rem; color: #94a3b8; text-align: right; }

/* CTA block */
.cta-block {
    background: #090c14;
    border: 1px solid #0f1623;
    border-left: 3px solid #3b82f6;
    border-radius: 0 8px 8px 0;
    padding: 1.75rem 2rem;
    margin-top: 2rem;
}
.cta-title { font-size: 1rem; font-weight: 600; color: #ffffff; margin-bottom: 0.4rem; letter-spacing: -0.01em; }
.cta-sub { font-size: 0.825rem; color: #e2e8f0; line-height: 1.5; margin-bottom: 1rem; }
.cta-link { font-size: 0.8rem; font-weight: 600; color: #60a5fa; letter-spacing: 0.02em; text-decoration: none; }

/* Feature grid */
.feat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: #0f1623;
    border: 1px solid #0f1623;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1.5rem;
}
.feat-cell {
    background: #090c14;
    padding: 1rem 1.25rem;
}
.feat-group {
    font-size: 0.6rem;
    font-weight: 700;
    color: #3b82f6;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.5rem;
}
.feat-item {
    font-size: 0.72rem;
    color: #94a3b8;
    padding: 0.2rem 0;
    font-family: 'SF Mono', 'Fira Code', monospace;
    letter-spacing: 0.01em;
}

/* Buttons */
.stButton > button {
    background: #090c14 !important;
    color: #e2e8f0 !important;
    border: 1px solid #0f1623 !important;
    border-radius: 4px !important;
    font-size: 0.75rem !important;
    font-weight: 500 !important;
    letter-spacing: 0.04em !important;
    padding: 0.45rem 1.1rem !important;
    font-family: 'Inter', sans-serif !important;
    transition: all 0.12s;
}
.stButton > button:hover {
    background: #0f1623 !important;
    color: #e2e8f0 !important;
    border-color: #1e2a3d !important;
}

/* Sidebar */
[data-testid="stSidebar"] {
    background: #06080d !important;
    border-right: 1px solid #0f1623 !important;
}
[data-testid="stSidebar"] label { color: #e2e8f0 !important; font-size: 0.72rem !important; }
[data-testid="stSidebar"] p { color: #94a3b8 !important; font-size: 0.72rem !important; }
[data-testid="stSidebar"] h3 { color: #e2e8f0 !important; font-size: 0.7rem !important; }

/* Tabs */
[data-baseweb="tab-list"] {
    background: transparent !important;
    border-bottom: 1px solid #0f1623 !important;
    gap: 0 !important;
    margin-bottom: 0 !important;
}
[data-baseweb="tab"] {
    background: transparent !important;
    color: #1e2a3d !important;
    font-size: 0.72rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    padding: 0.7rem 1.5rem !important;
    border-bottom: 2px solid transparent !important;
    margin-bottom: -1px !important;
}
[aria-selected="false"][data-baseweb="tab"] { color: #94a3b8 !important; }
[aria-selected="true"][data-baseweb="tab"] {
    color: #ffffff !important;
    border-bottom-color: #3b82f6 !important;
    background: transparent !important;
}
[data-testid="stTabsContent"] { padding-top: 2rem; }

/* Metrics override */
[data-testid="stMetricValue"] { color: #ffffff !important; }
[data-testid="stMetricLabel"] { color: #94a3b8 !important; font-size: 0.65rem !important; text-transform: uppercase; letter-spacing: 0.08em; }

/* Dataframe */
[data-testid="stDataFrame"] { border: 1px solid #0f1623; border-radius: 6px; }
.stDataFrame th { background: #090c14 !important; color: #94a3b8 !important; font-size: 0.65rem !important; text-transform: uppercase; letter-spacing: 0.06em; }
.stDataFrame td { color: #ffffff !important; }

hr { border-color: #0f1623 !important; margin: 1.5rem 0 !important; }
[data-testid="stExpander"] { background: #090c14 !important; border: 1px solid #0f1623 !important; border-radius: 6px !important; }
.stAlert { border-radius: 4px !important; }
</style>
"""

# Chart theme constants
CHART_BG = "rgba(0,0,0,0)"
CHART_GRID = "#0f1623"
CHART_TEXT = "#94a3b8"
CHART_TICK = "#64748b"
CHART_FONT = dict(family="Inter, sans-serif", color=CHART_TEXT, size=11)
COLOR_SCALE = [[0, "#10b981"], [0.45, "#f59e0b"], [0.7, "#ef4444"], [1, "#dc2626"]]
BLUE = "#3b82f6"
AMBER = "#f59e0b"
RED = "#ef4444"
GREEN = "#10b981"


def chart_layout(**overrides):
    base = dict(
        paper_bgcolor=CHART_BG,
        plot_bgcolor=CHART_BG,
        font=CHART_FONT,
        margin=dict(t=32, b=32, l=8, r=8),
        xaxis=dict(
            gridcolor=CHART_GRID,
            linecolor=CHART_GRID,
            tickcolor=CHART_GRID,
            tickfont=dict(color=CHART_TICK, size=10),
            title_font=dict(color=CHART_TEXT, size=10),
            zeroline=False,
        ),
        yaxis=dict(
            gridcolor=CHART_GRID,
            linecolor=CHART_GRID,
            tickcolor=CHART_GRID,
            tickfont=dict(color=CHART_TICK, size=10),
            title_font=dict(color=CHART_TEXT, size=10),
            zeroline=False,
        ),
        legend=dict(
            font=dict(color=CHART_TEXT, size=10),
            bgcolor="rgba(0,0,0,0)",
            bordercolor=CHART_GRID,
        ),
        hoverlabel=dict(
            bgcolor="#090c14",
            bordercolor="#1e2a3d",
            font=dict(color="#e2e8f0", size=11),
        ),
        title_font=dict(color=CHART_TEXT, size=10, family="Inter"),
    )
    base.update(overrides)
    return base


def _base_path():
    return Path(__file__).resolve().parent


@st.cache_resource
def load_model():
    return joblib.load(_base_path() / "nigerian_bank_fraud_model.pkl")


@st.cache_resource
def load_features():
    return joblib.load(_base_path() / "model_features.pkl")


@st.cache_data
def load_demo_data():
    return pd.read_csv(_base_path() / "demo_live_transactions.csv")


def run_scoring(df, model, features):
    df = df.copy()
    X = df[features]
    df["risk_score"] = model.predict_proba(X)[:, 1] * 100
    df["risk_tier"] = pd.cut(
        df["risk_score"],
        bins=[-0.1, 30, 70, 100],
        labels=["LOW", "ELEVATED", "HIGH"],
    ).astype(str)
    return df


def get_scenario(df_scored, scenario, n=200):
    n = min(n, len(df_scored))
    if scenario == "Low risk":
        pool = df_scored[df_scored["risk_tier"] == "LOW"]
    elif scenario == "Elevated":
        pool = df_scored[df_scored["risk_tier"] == "ELEVATED"]
    elif scenario == "High risk":
        pool = df_scored[df_scored["risk_tier"] == "HIGH"]
    else:
        pool = df_scored
    if len(pool) == 0:
        pool = df_scored
    return pool.sample(n=min(n, len(pool)), random_state=42).reset_index(drop=True)


# ----- session state -----
for k, v in [("scenario", "Random"), ("threshold", 50)]:
    if k not in st.session_state:
        st.session_state[k] = v

# ----- load -----
model = load_model()
model_features = load_features()
df_full = load_demo_data()
df_full_scored = run_scoring(df_full, model, model_features)

# ----- sidebar -----
with st.sidebar:
    st.markdown("### Data source")
    use_csv = st.checkbox("Upload CSV", value=False)
    uploaded = st.file_uploader("", type=["csv"], label_visibility="collapsed") if use_csv else None

    if use_csv and uploaded:
        try:
            df_up = pd.read_csv(uploaded)
            missing = [c for c in model_features if c not in df_up.columns]
            if missing:
                st.error(f"Missing columns: {', '.join(missing[:4])}{'...' if len(missing) > 4 else ''}")
                df_full_scored = run_scoring(df_full, model, model_features)
            else:
                df_full_scored = run_scoring(df_up, model, model_features)
                st.success(f"{len(df_up):,} rows loaded")
        except Exception as e:
            st.error(str(e))

    st.markdown("---")
    st.markdown("### Risk scenario")
    scenario = st.radio("", ["Random", "Low risk", "Elevated", "High risk"], label_visibility="collapsed")
    st.session_state.scenario = scenario

    st.markdown("---")
    st.markdown("### Alert threshold")
    threshold = st.slider("", 0, 100, 50, label_visibility="collapsed")
    st.session_state.threshold = threshold

    st.markdown("---")
    st.caption("Savvy Bee · Advisory only")

df_sample = get_scenario(df_full_scored, st.session_state.scenario)
df_sample["flagged"] = (df_sample["risk_score"] >= threshold).astype(int)

# ===== PAGE =====
st.markdown(CSS, unsafe_allow_html=True)

# System bar
st.markdown(f"""
<div class="sysbar">
  <div class="sysbar-left">
    <span class="sysbar-logo">Savvy Bee</span>
    <div class="sysbar-divider"></div>
    <span class="sysbar-module">Transaction Risk Intelligence</span>
  </div>
  <div class="sysbar-right">
    <span class="status-pill"><span class="status-dot"></span>System online</span>
    <span class="sysbar-tag">Advisory only &middot; Synthetic data &middot; NGN</span>
  </div>
</div>
""", unsafe_allow_html=True)

# Headline
st.markdown('<div class="page-title">Fraud Detection</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="page-sub">Per-transaction risk scoring for Nigerian payment flows. '
    'ML-powered, fully auditable. Advisory output only &mdash; no automated decisions.</div>',
    unsafe_allow_html=True,
)

# Tabs
tab1, tab2, tab3, tab4 = st.tabs(["01  Input", "02  Preparation", "03  Assessment", "04  Actions"])

# ─────────────────────────────────────────────
# TAB 1 — INPUT DATA
# ─────────────────────────────────────────────
with tab1:
    n_total = len(df_sample)
    total_vol = df_sample["amount_ngn"].sum()
    mean_amt = df_sample["amount_ngn"].mean()
    night_pct = df_sample["is_night_txn"].mean() * 100

    st.markdown(f"""
    <div class="kpi-row">
      <div class="kpi-cell accent">
        <div class="kpi-label">Transaction count</div>
        <div class="kpi-val">{n_total:,}</div>
        <div class="kpi-desc">Sample records in scope</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">Total volume (NGN)</div>
        <div class="kpi-val">{total_vol/1_000_000:.1f}M</div>
        <div class="kpi-desc">Aggregate transaction value</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">Mean transaction</div>
        <div class="kpi-val">{mean_amt:,.0f}</div>
        <div class="kpi-desc">Average single transaction</div>
      </div>
      <div class="kpi-cell warn">
        <div class="kpi-label">Night transactions</div>
        <div class="kpi-val amber">{night_pct:.0f}%</div>
        <div class="kpi-desc">Off-hours activity</div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    col_a, col_b = st.columns(2)

    with col_a:
        # Amount distribution
        fig = go.Figure()
        log_amounts = np.log10(df_sample["amount_ngn"].clip(lower=1))
        fig.add_trace(go.Histogram(
            x=df_sample["amount_ngn"],
            nbinsx=35,
            marker=dict(color=BLUE, opacity=0.75, line=dict(width=0)),
            name="Amount",
        ))
        fig.update_layout(
            **chart_layout(
                title="Transaction amount distribution (NGN)",
                height=280,
                showlegend=False,
                xaxis_title="Amount (NGN)",
                yaxis_title="Count",
            )
        )
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    with col_b:
        # Transactions by hour
        hourly = df_sample.groupby("txn_hour").size().reset_index(name="count")
        fig2 = go.Figure()
        fig2.add_trace(go.Bar(
            x=hourly["txn_hour"],
            y=hourly["count"],
            marker=dict(
                color=hourly["count"],
                colorscale=[[0, "#0f1623"], [1, "#3b82f6"]],
                line=dict(width=0),
            ),
        ))
        fig2.update_layout(
            **chart_layout(
                title="Transaction volume by hour of day",
                height=280,
                showlegend=False,
                xaxis_title="Hour (0–23)",
                yaxis_title="Count",
                xaxis=dict(tickmode="linear", dtick=4, gridcolor=CHART_GRID,
                           linecolor=CHART_GRID, tickcolor=CHART_GRID,
                           tickfont=dict(color=CHART_TICK, size=10),
                           title_font=dict(color=CHART_TEXT, size=10)),
            )
        )
        st.plotly_chart(fig2, use_container_width=True, config={"displayModeBar": False})

    with st.expander("Raw sample records"):
        show_cols = ["sender_account", "receiver_account", "amount_ngn", "txn_hour",
                     "velocity_score", "geo_anomaly_score", "channel_risk_score", "is_night_txn"]
        st.dataframe(df_sample[show_cols].head(20), use_container_width=True)

    st.markdown("""
    <div class="data-panel">
      <div class="panel-header">Data schema</div>
      Input schema is compatible with standard Nigerian payment rails.
      Features include counterparty identifiers, amounts, timing signals,
      velocity metrics, and device/network behavioural indicators.
      No data leaves the client environment in production deployments.
    </div>
    """, unsafe_allow_html=True)

# ─────────────────────────────────────────────
# TAB 2 — FEATURE PREPARATION
# ─────────────────────────────────────────────
with tab2:
    feature_groups = {
        "Transaction core": ["amount_ngn", "txn_hour", "is_weekend", "is_salary_week", "is_night_txn"],
        "Velocity & frequency": ["velocity_score", "user_txn_frequency_24h", "txn_count_last_1h",
                                  "txn_count_last_24h", "total_amount_last_1h"],
        "Temporal": ["time_since_last_transaction", "time_since_last", "avg_gap_between_txns"],
        "Device & network": ["device_seen_count", "is_device_shared", "ip_seen_count", "is_ip_shared"],
        "User behaviour": ["user_txn_count_total", "user_avg_txn_amt", "user_std_txn_amt",
                           "spending_deviation_score"],
        "Risk signals": ["merchant_fraud_rate", "channel_risk_score", "persona_fraud_risk",
                         "location_fraud_risk", "geo_anomaly_score"],
    }

    cells_html = ""
    for group, feats in feature_groups.items():
        items = "".join(f'<div class="feat-item">{f}</div>' for f in feats)
        cells_html += f"""
        <div class="feat-cell">
          <div class="feat-group">{group}</div>
          {items}
        </div>"""

    st.markdown(f'<div class="feat-grid">{cells_html}</div>', unsafe_allow_html=True)

    # Feature correlation with risk score (computed live, honest signal)
    corr_vals = {}
    for f in model_features:
        if f in df_full_scored.columns:
            try:
                corr_vals[f] = abs(df_full_scored[f].corr(df_full_scored["risk_score"]))
            except Exception:
                corr_vals[f] = 0.0
    corr_df = (
        pd.DataFrame(list(corr_vals.items()), columns=["feature", "correlation"])
        .dropna()
        .sort_values("correlation", ascending=True)
        .tail(15)
    )

    fig_corr = go.Figure()
    fig_corr.add_trace(go.Bar(
        x=corr_df["correlation"],
        y=corr_df["feature"],
        orientation="h",
        marker=dict(
            color=corr_df["correlation"],
            colorscale=[[0, "#1e2a3d"], [1, "#3b82f6"]],
            line=dict(width=0),
        ),
    ))
    fig_corr.update_layout(
        **chart_layout(
            title="Feature correlation with risk score (absolute, top 15)",
            height=380,
            showlegend=False,
            xaxis_title="Absolute correlation",
            margin=dict(t=32, b=32, l=8, r=24),
        )
    )
    fig_corr.update_yaxes(tickfont=dict(family="SF Mono, Fira Code, monospace", size=10, color="#94a3b8"))
    st.plotly_chart(fig_corr, use_container_width=True, config={"displayModeBar": False})

    st.markdown("""
    <div class="data-panel">
      <div class="panel-header">Pipeline</div>
      Raw transaction fields are parsed and normalised before model inference.
      The feature correlation chart shows each input's linear association with
      the output risk score on the full demo dataset.
      The pipeline is deterministic and fully reproducible — same input always
      produces the same output.
    </div>
    """, unsafe_allow_html=True)

# ─────────────────────────────────────────────
# TAB 3 — RISK ASSESSMENT
# ─────────────────────────────────────────────
with tab3:
    n_flagged = (df_sample["risk_score"] >= threshold).sum()
    n_total = len(df_sample)
    pct_flagged = 100 * n_flagged / n_total if n_total > 0 else 0
    avg_risk = df_sample["risk_score"].mean()
    tier_counts = df_sample["risk_tier"].value_counts()
    n_high = tier_counts.get("HIGH", 0)

    risk_class = "red" if avg_risk >= threshold else "amber" if avg_risk >= threshold * 0.6 else ""
    flag_class = "red" if pct_flagged >= 20 else "amber" if pct_flagged >= 10 else ""
    high_class = "red" if n_high > 5 else "amber" if n_high > 0 else "green"
    high_bar = "danger" if n_high > 5 else "warn" if n_high > 0 else "ok"

    st.markdown(f"""
    <div class="kpi-row">
      <div class="kpi-cell accent">
        <div class="kpi-label">Transactions scored</div>
        <div class="kpi-val">{n_total:,}</div>
        <div class="kpi-desc">In current scenario</div>
      </div>
      <div class="kpi-cell {'danger' if flag_class == 'red' else 'warn' if flag_class == 'amber' else ''}">
        <div class="kpi-label">Above threshold</div>
        <div class="kpi-val {flag_class}">{n_flagged}</div>
        <div class="kpi-desc">{pct_flagged:.1f}% of total &middot; threshold {threshold}%</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">Mean risk score</div>
        <div class="kpi-val {risk_class}">{avg_risk:.1f}%</div>
        <div class="kpi-desc">Portfolio average</div>
      </div>
      <div class="kpi-cell {high_bar}">
        <div class="kpi-label">HIGH tier</div>
        <div class="kpi-val {high_class}">{n_high}</div>
        <div class="kpi-desc">Score &gt; 70 — priority review</div>
      </div>
    </div>
    """, unsafe_allow_html=True)

    col_left, col_right = st.columns([3, 2])

    with col_left:
        # Score distribution
        fig_dist = go.Figure()
        bins = np.linspace(0, 100, 41)
        low_mask = df_sample["risk_score"] < 30
        mid_mask = (df_sample["risk_score"] >= 30) & (df_sample["risk_score"] < 70)
        high_mask = df_sample["risk_score"] >= 70

        for mask, color, name in [
            (low_mask, GREEN, "LOW"),
            (mid_mask, AMBER, "ELEVATED"),
            (high_mask, RED, "HIGH"),
        ]:
            if mask.sum() > 0:
                fig_dist.add_trace(go.Histogram(
                    x=df_sample.loc[mask, "risk_score"],
                    xbins=dict(start=0, end=100, size=2.5),
                    marker=dict(color=color, opacity=0.8, line=dict(width=0)),
                    name=name,
                ))
        fig_dist.add_vline(
            x=threshold, line_dash="dash", line_color="#ef4444", line_width=1.5,
            annotation_text=f"  {threshold}% threshold",
            annotation_font=dict(color="#ef4444", size=10),
            annotation_position="top right",
        )
        fig_dist.update_layout(
            **chart_layout(
                title="Risk score distribution by tier",
                height=280,
                barmode="stack",
                showlegend=True,
                xaxis_title="Risk score (%)",
                yaxis_title="Count",
            )
        )
        st.plotly_chart(fig_dist, use_container_width=True, config={"displayModeBar": False})

        # Scatter: amount vs risk
        fig_sc = go.Figure()
        scatter_data = df_sample.sample(n=min(150, len(df_sample)), random_state=1)
        fig_sc.add_trace(go.Scatter(
            x=scatter_data["amount_ngn"],
            y=scatter_data["risk_score"],
            mode="markers",
            marker=dict(
                size=6,
                color=scatter_data["risk_score"],
                colorscale=COLOR_SCALE,
                opacity=0.7,
                line=dict(width=0),
                showscale=False,
            ),
            hovertemplate=(
                "Amount: %{x:,.0f} NGN<br>"
                "Risk: %{y:.1f}%<extra></extra>"
            ),
        ))
        fig_sc.add_hline(
            y=threshold, line_dash="dash", line_color=RED, line_width=1,
            annotation_text=f"  Threshold",
            annotation_font=dict(color=RED, size=9),
        )
        fig_sc.update_layout(
            **chart_layout(
                title="Transaction amount vs. risk score",
                height=260,
                showlegend=False,
                xaxis_title="Amount (NGN)",
                yaxis_title="Risk score (%)",
            )
        )
        st.plotly_chart(fig_sc, use_container_width=True, config={"displayModeBar": False})

    with col_right:
        # Velocity vs risk scatter
        fig_vel = go.Figure()
        fig_vel.add_trace(go.Scatter(
            x=df_sample["velocity_score"],
            y=df_sample["risk_score"],
            mode="markers",
            marker=dict(
                size=5,
                color=df_sample["risk_score"],
                colorscale=COLOR_SCALE,
                opacity=0.65,
                line=dict(width=0),
                showscale=True,
                colorbar=dict(
                    tickfont=dict(color=CHART_TICK, size=9),
                    title=dict(text="Risk", font=dict(color=CHART_TEXT, size=9)),
                    thickness=10,
                    len=0.7,
                ),
            ),
            hovertemplate="Velocity: %{x:.1f}<br>Risk: %{y:.1f}%<extra></extra>",
        ))
        fig_vel.add_hline(
            y=threshold, line_dash="dash", line_color=RED, line_width=1,
        )
        fig_vel.update_layout(
            **chart_layout(
                title="Velocity score vs. risk score",
                height=260,
                showlegend=False,
                xaxis_title="Velocity score",
                yaxis_title="Risk score (%)",
            )
        )
        st.plotly_chart(fig_vel, use_container_width=True, config={"displayModeBar": False})

        # Tier donut
        tier_labels = ["LOW", "ELEVATED", "HIGH"]
        tier_values = [tier_counts.get(t, 0) for t in tier_labels]
        tier_colors = [GREEN, AMBER, RED]
        fig_donut = go.Figure()
        fig_donut.add_trace(go.Pie(
            labels=tier_labels,
            values=tier_values,
            hole=0.65,
            marker=dict(colors=tier_colors, line=dict(color="#06080d", width=2)),
            textinfo="label+percent",
            textfont=dict(color="#94a3b8", size=10),
            hovertemplate="%{label}: %{value} (%{percent})<extra></extra>",
        ))
        fig_donut.update_layout(
            **chart_layout(
                title="Risk tier breakdown",
                height=260,
                showlegend=False,
                margin=dict(t=32, b=32, l=8, r=8),
            )
        )
        st.plotly_chart(fig_donut, use_container_width=True, config={"displayModeBar": False})

    # Priority queue
    flagged_df = df_sample[df_sample["flagged"] == 1].nlargest(12, "risk_score")
    if len(flagged_df) > 0:
        st.markdown('<div class="section-label">Priority review queue</div>', unsafe_allow_html=True)

        def tier_chip(t):
            cls = "chip-high" if t == "HIGH" else "chip-elevated" if t == "ELEVATED" else "chip-low"
            return f'<span class="chip {cls}">{t}</span>'

        display = flagged_df[["sender_account", "receiver_account", "amount_ngn",
                               "risk_score", "velocity_score", "risk_tier"]].copy()
        display.columns = ["Sender", "Receiver", "Amount (NGN)", "Risk (%)", "Velocity", "Tier"]
        display["Risk (%)"] = display["Risk (%)"].round(1)
        display["Velocity"] = display["Velocity"].round(1)
        st.dataframe(display.reset_index(drop=True), use_container_width=True)

# ─────────────────────────────────────────────
# TAB 4 — RECOMMENDED ACTIONS
# ─────────────────────────────────────────────
with tab4:
    n_flagged = (df_sample["risk_score"] >= threshold).sum()
    avg_risk = df_sample["risk_score"].mean()
    n_high = (df_sample["risk_tier"] == "HIGH").sum()
    n_elevated = (df_sample["risk_tier"] == "ELEVATED").sum()

    col_g, col_actions = st.columns([1, 2])

    with col_g:
        # Gauge
        gauge_color = RED if avg_risk >= threshold else AMBER if avg_risk >= threshold * 0.6 else GREEN
        fig_gauge = go.Figure(go.Indicator(
            mode="gauge+number",
            value=round(avg_risk, 1),
            number=dict(
                suffix="%",
                font=dict(color="#f1f5f9", size=40, family="Inter"),
            ),
            gauge=dict(
                axis=dict(
                    range=[0, 100],
                    tickwidth=1,
                    tickcolor="#1e2a3d",
                    tickfont=dict(color=CHART_TICK, size=9),
                ),
                bar=dict(color=gauge_color, thickness=0.55),
                bgcolor="#0f1623",
                borderwidth=0,
                steps=[
                    dict(range=[0, 30], color="#071310"),
                    dict(range=[30, 70], color="#13110a"),
                    dict(range=[70, 100], color="#130b0b"),
                ],
                threshold=dict(
                    line=dict(color=RED, width=2),
                    thickness=0.8,
                    value=threshold,
                ),
            ),
            title=dict(
                text="Portfolio mean risk",
                font=dict(color=CHART_TEXT, size=11, family="Inter"),
            ),
        ))
        fig_gauge.update_layout(
            paper_bgcolor=CHART_BG,
            margin=dict(t=48, b=16, l=16, r=16),
            height=260,
            font=dict(family="Inter"),
        )
        st.plotly_chart(fig_gauge, use_container_width=True, config={"displayModeBar": False})

        # Summary counts
        st.markdown(f"""
        <div class="data-panel" style="margin-top:0">
          <div class="panel-header">Exposure summary</div>
          <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid #0f1623">
            <span style="font-size:0.75rem;color:#94a3b8">Above threshold</span>
            <span style="font-size:0.8rem;font-weight:600;color:#ffffff;font-variant-numeric:tabular-nums">{n_flagged}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid #0f1623">
            <span style="font-size:0.75rem;color:#94a3b8">HIGH tier</span>
            <span style="font-size:0.8rem;font-weight:600;color:#f87171;font-variant-numeric:tabular-nums">{n_high}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.4rem 0">
            <span style="font-size:0.75rem;color:#94a3b8">ELEVATED tier</span>
            <span style="font-size:0.8rem;font-weight:600;color:#fbbf24;font-variant-numeric:tabular-nums">{n_elevated}</span>
          </div>
        </div>
        """, unsafe_allow_html=True)

    with col_actions:
        # Tier action table
        st.markdown("""
        <div class="data-panel">
          <div class="panel-header">Tier handling framework</div>
          <div class="action-row">
            <div class="action-tier"><span class="chip chip-low">LOW</span></div>
            <div class="action-desc">Score &lt; 30. Normal behavioural pattern. No anomaly signals detected.</div>
            <div class="action-directive">Routine monitoring. No action.</div>
          </div>
          <div class="action-row">
            <div class="action-tier"><span class="chip chip-elevated">ELEVATED</span></div>
            <div class="action-desc">Score 30–70. One or more signals present — velocity, geo deviation, or shared device.</div>
            <div class="action-directive">Optional review. Escalate if corroborating signals present.</div>
          </div>
          <div class="action-row">
            <div class="action-tier"><span class="chip chip-high">HIGH</span></div>
            <div class="action-desc">Score &gt; 70. Multiple high-confidence fraud signals. Requires immediate attention.</div>
            <div class="action-directive">Priority review. Consider hold or escalation per policy.</div>
          </div>
        </div>
        """, unsafe_allow_html=True)

        # Contextual guidance
        if n_high > 0:
            guidance = f"Queue {n_high} HIGH-tier transaction{'s' if n_high > 1 else ''} for immediate review. " \
                       f"Assign to compliance team and adhere to SLA. " \
                       f"{'Additionally, ' + str(n_elevated) + ' ELEVATED transactions warrant secondary review.' if n_elevated > 0 else ''}"
        elif n_flagged > 0:
            guidance = f"{n_flagged} transaction{'s' if n_flagged > 1 else ''} above the {threshold}% threshold. " \
                       f"All ELEVATED tier — schedule for secondary review within standard SLA."
        else:
            guidance = f"No transactions breach the {threshold}% threshold under the current scenario. " \
                       f"Routine monitoring applies. Adjust threshold if higher sensitivity is required."

        st.markdown(f"""
        <div class="data-panel" style="margin-top:1rem">
          <div class="panel-header">Operational guidance &mdash; current scenario</div>
          <div style="font-size:0.825rem;color:#e2e8f0;line-height:1.65">{guidance}</div>
        </div>
        """, unsafe_allow_html=True)

    # CTA
    st.markdown("""
    <div class="cta-block">
      <div class="cta-title">Deploy transaction risk intelligence in your environment</div>
      <div class="cta-sub">
        Savvy Bee's fraud detection layer integrates alongside your existing payment rails
        and transaction data — no infrastructure replacement required.
        Advisory output only. Every score is traceable and auditable.
      </div>
      <a class="cta-link" href="https://mysavvybee.com/" target="_blank">Request a demo &rarr;</a>
    </div>
    """, unsafe_allow_html=True)

# Footer
st.markdown("<br>", unsafe_allow_html=True)
st.markdown(
    '<p style="font-size:0.62rem;color:#64748b;letter-spacing:0.08em;text-transform:uppercase;">'
    'Synthetic demo data &nbsp;&middot;&nbsp; Advisory only &nbsp;&middot;&nbsp; '
    'Full audit trail &nbsp;&middot;&nbsp; Savvy Bee Ltd &nbsp;&middot;&nbsp; '
    'Transaction Risk Intelligence</p>',
    unsafe_allow_html=True,
)
