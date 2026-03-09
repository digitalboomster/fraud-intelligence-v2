# Savvy Bee — Fraud Detection Demo

Transaction fraud intelligence for businesses. Advisory only, fully explainable. Part of the Savvy Bee ecosystem.

## Overview

This demo shows how Savvy Bee turns transaction data into risk scores and flags — no money movement, no black boxes. It follows the same step-by-step flow as [Savvy Intelligence](https://savvy-intelligence-2.vercel.app/).

### Flow

1. **The data** — Sample transaction records (sender, receiver, amount, timing, risk features)
2. **Getting it ready** — Feature preparation (model expects 28 features)
3. **What we find** — Risk scores, distribution, flagged transactions
4. **What to do next** — Action guidance and Request Demo CTA

### Scenarios

- **Random** — Mixed risk profile
- **Low risk** — Transactions with risk score &lt; 30%
- **Elevated** — Transactions with 30–70% risk
- **High risk** — Transactions with ≥ 70% risk

### Model

- Trained on Nigerian financial transactions dataset
- XGBoost classifier
- Features: velocity, device/IP sharing, amount, timing, behavioural signals

## Run locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Deploy

- **Streamlit Cloud** — Connect this repo and deploy
- **Docker** — Add a `Dockerfile` if needed

## Request Demo

The demo ends with a CTA to request a full demo. Update the link in `app.py` (search for `Request Demo`) to point to your request-demo page.

## Part of Savvy Bee

- **Savvy Bee One** — personal finance
- **SABI** — wealth intelligence
- **Khalia** — community finance
- **Savvy Intelligence** — readiness, stress, anomaly (business intelligence)
- **Fraud Detection Demo** — transaction fraud (this project)
