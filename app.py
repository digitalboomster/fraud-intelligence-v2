import streamlit as st
import pandas as pd
import numpy as np
import joblib
import plotly.express as px

st.set_page_config(page_title="Fraud Risk Monitoring Dashboard", layout="wide")

st.title("🏦 AI Fraud Risk Monitoring Console")

@st.cache_resource
def load_model():
    return joblib.load("nigerian_bank_fraud_model.pkl")

@st.cache_resource
def load_features():
    return joblib.load("model_features.pkl")

model = load_model()
model_features = load_features()

st.sidebar.header("Upload Transaction CSV")
uploaded_file = st.sidebar.file_uploader("Upload CSV", type=["csv"])

if uploaded_file is None:
    st.warning("Please upload a transaction file.")
    st.stop()

df_live = pd.read_csv(uploaded_file)

missing_cols = [col for col in model_features if col not in df_live.columns]

if missing_cols:
    st.error(f"Missing required columns: {missing_cols}")
    st.stop()

X_live = df_live[model_features]

df_live["risk_score"] = model.predict_proba(X_live)[:, 1] * 100

threshold = st.sidebar.slider("Fraud Threshold", 0, 100, 50)

df_live["prediction"] = (df_live["risk_score"] >= threshold).astype(int)

st.subheader("Risk Score Distribution")

fig = px.histogram(df_live, x="risk_score", nbins=50)
st.plotly_chart(fig, use_container_width=True)

st.subheader("Preview Scored Transactions")
st.dataframe(df_live.head())