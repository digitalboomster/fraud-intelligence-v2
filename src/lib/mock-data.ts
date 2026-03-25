export type ViewKey = "dashboard" | "alerts" | "case" | "entity" | "reporting" | "audit";
export type AlertSeverity = "Critical" | "High" | "Medium" | "Low";
export type AlertChannel = "Mobile" | "Web" | "Transfer" | "Card";
export type AlertStatus = "Open" | "Investigating" | "Escalated" | "Resolved";
export type CaseDecision = "Pending" | "Approved" | "Rejected" | "Escalated";
export type SubmissionStatus = "Accepted" | "Pending" | "Certified" | "Generated";

export type NavigationItem = {
  key: ViewKey;
  label: string;
  icon: string;
  href: string;
};

export type AlertItem = {
  id: string;
  time: string;
  customer: string;
  amount: string;
  channel: AlertChannel;
  risk: number;
  signal: string;
  severity: AlertSeverity;
  owner: string;
  status: AlertStatus;
  entityId: string;
  caseId: string;
  region: string;
  /** Model confidence 0–100; shown consistently across queue, case, and entity views */
  confidencePct: number;
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  actor: string;
  detail: string;
  beforeState?: string;
  afterState?: string;
  justification?: string;
  sessionRef?: string;
};

export type BehavioralContextBlock = {
  amountVs30dAvg: string;
  amountVs90dAvg: string;
  frequencyVsBaseline: string;
  deviceVsBaseline: string;
  locationVsBaseline: string;
};

export type CaseRiskFactor = { label: string; points: string; contribution: number };

export type CaseRecord = {
  id: string;
  analyst: string;
  analystTitle: string;
  amount: string;
  currency: string;
  method: string;
  /** Payment network / rail (NIP, USSD, card scheme, etc.) — not geography */
  paymentRail: string;
  /** Destination geography (city, country) */
  destinationGeography: string;
  status: string;
  decision: CaseDecision;
  linkedAlertId: string;
  entityId: string;
  auditTrail: Array<{ id: string; title: string; body: string; time: string }>;
  evidence: Array<{ label: string; value: string }>;
  riskFactors: CaseRiskFactor[];
  aggregatedRisk: number;
  confidencePct: number;
  fraudScenario: string;
  recommendedAction: string;
  riskTrend: "Increasing" | "Stable" | "Decreasing";
  behavioralContext: BehavioralContextBlock;
  /** Related transaction / system events (M-06) */
  transactionAuditEvents: Array<{ id: string; title: string; body: string; time: string }>;
  entityProfile: {
    initials: string;
    name: string;
    memberSince: string;
    kyc: string;
    credit: string;
    linked: string;
  };
};

export type EntityIntervention = {
  id: string;
  label: string;
  completed: boolean;
  tier: "immediate" | "compliance";
};

export type EntityRecord = {
  id: string;
  breadcrumb: string;
  name: string;
  tags: string[];
  riskIndex: number;
  riskTitle: string;
  riskTier: string;
  riskNarrative: string;
  frozen: boolean;
  confidencePct: number;
  fraudScenario: string;
  recommendedAction: string;
  riskTrend: "Increasing" | "Stable" | "Decreasing";
  behavioralContext: BehavioralContextBlock;
  /** When true, UI enforces hold / escalation messaging (H-07) */
  sanctionsHoldRequired?: boolean;
  factorCards: Array<{ label: string; value: string }>;
  financialSnapshot: Array<{ label: string; value: string }>;
  investigationsPending: string;
  fingerprint: {
    device: string[];
    network: string[];
    identity: string[];
  };
  identityTrust: Array<{ label: string; status: string }>;
  timeline: Array<{
    id: string;
    timestamp: string;
    action: string;
    amount: string;
    signal: string;
  }>;
  associated: Array<{
    id: string;
    name: string;
    meta: string;
    risk: string;
  }>;
  interventions: EntityIntervention[];
};

/** Single taxonomy for dashboard chart + alert queue mini-bars (H-01) */
export const standardSignalDistribution = [
  { label: "Device", value: 58 },
  { label: "Velocity", value: 91 },
  { label: "Geo", value: 47 },
  { label: "Behavior", value: 72 },
  { label: "Consortium", value: 63 },
] as const;

export type ReportExportCard = {
  id: string;
  title: string;
  body: string;
  action: string;
  format: "pdf" | "xlsx" | "pptx";
};

export type ReportSubmission = {
  id: string;
  type: string;
  status: SubmissionStatus;
  date: string;
  periodLabel?: string;
  framework?: string;
  summaryNote?: string;
};

export type DashboardReviewItem = {
  id: string;
  entityLabel: string;
  amount: string;
  rail: string;
  tags: string[];
  alertId: string;
  caseId: string;
  entityId: string;
};

export const navigationItems: NavigationItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { key: "alerts", label: "Alert Queue", icon: "alerts", href: "/alerts" },
  { key: "case", label: "Case Manager", icon: "case", href: "/case" },
  { key: "entity", label: "Entity Search", icon: "entity", href: "/entity" },
  { key: "reporting", label: "Reporting", icon: "reporting", href: "/reporting" },
  { key: "audit", label: "Audit Logs", icon: "audit", href: "/audit" },
];

export const dashboardData = {
  status: "Live network feed active",
  updated: "Last update: 14:20:04 UTC",
  hero: {
    priority: "Critical risk priority",
    title: 'Syndicate Operation: "Echo Delta"',
    subtitle:
      "Coordinated account takeover attempt across 142 distinct entities with synchronized device hand-offs and cross-border payout testing.",
    velocity: "42 tx/min",
    exposure: "NGN 248,500,000.00",
    signal: "Fingerprint Mismatch",
    riskIndex: "98.4",
  },
  metrics: [
    { label: "Live Alert Volume", value: "1,402" },
    { label: "High-Risk Count", value: "84" },
    { label: "CBN-Ready Cases", value: "12" },
  ],
  chartBars: standardSignalDistribution.map((item) => ({ label: item.label, value: item.value })),
  threatVector: "Automated script injection",
  confidence: "High reliability (92%)",
  advisory:
    "Unusual spike in merchant-led transfer traffic across Lagos and Port Harcourt nodes. Patterns mirror historical layering behavior in high-risk MCC corridors.",
  reviewItems: [
    {
      id: "TX-99042-XP",
      entityLabel: "Entity: EL-99238",
      amount: "NGN 12,400,000.00",
      rail: "Card not present",
      tags: ["Velocity", "New_Geo"],
      alertId: "AL-99238",
      caseId: "TRX-88219-B",
      entityId: "E-9941-XJ72",
    },
    {
      id: "TX-98122-U1",
      entityLabel: "Entity: JO-99237",
      amount: "NGN 1,250,000.00",
      rail: "Wire transfer",
      tags: ["Beneficiary_Watch"],
      alertId: "AL-99237",
      caseId: "TRX-77210-A",
      entityId: "E-2039-LON",
    },
    {
      id: "TX-97551-ZZ",
      entityLabel: "Entity: AI-99236",
      amount: "NGN 55,000.00",
      rail: "Mobile POS",
      tags: ["Low_Confidence"],
      alertId: "AL-99236",
      caseId: "TRX-99102-Z",
      entityId: "E-7731-NG",
    },
  ],
  tape: [
    "14:18:22  Analyst K. Balogun cleared case #8421",
    "14:15:01  Rule R-102 modified by system",
    "14:12:44  Bulk export reporting job initiated",
  ],
};

export const initialAlerts: AlertItem[] = [
  {
    id: "AL-99238",
    time: "14:02:11",
    customer: "Chinedu Okafor",
    amount: "NGN 4,250,000.00",
    channel: "Mobile",
    risk: 98,
    signal: "Velocity Trigger",
    severity: "Critical",
    owner: "Chika Nnamdi",
    status: "Open",
    entityId: "E-9941-XJ72",
    caseId: "TRX-88238-P",
    region: "Lagos, NG",
    confidencePct: 91,
  },
  {
    id: "AL-99237",
    time: "14:01:45",
    customer: "Amina Bello",
    amount: "NGN 12,500.00",
    channel: "Web",
    risk: 42,
    signal: "IP Cluster",
    severity: "Medium",
    owner: "Musa Ibrahim",
    status: "Investigating",
    entityId: "E-2039-LON",
    caseId: "TRX-77210-A",
    region: "Abuja, NG",
    confidencePct: 68,
  },
  {
    id: "AL-99236",
    time: "13:58:02",
    customer: "Aisha Murray",
    amount: "NGN 890,110.00",
    channel: "Mobile",
    risk: 81,
    signal: "Device Pattern",
    severity: "High",
    owner: "Chika Nnamdi",
    status: "Open",
    entityId: "E-7731-NG",
    caseId: "TRX-99102-Z",
    region: "Lagos, NG",
    confidencePct: 84,
  },
  {
    id: "AL-99235",
    time: "13:55:18",
    customer: "Tunde Adebayo",
    amount: "NGN 3,720,000.00",
    channel: "Transfer",
    risk: 88,
    signal: "Cross-Border Burst",
    severity: "Critical",
    owner: "Chika Nnamdi",
    status: "Escalated",
    entityId: "E-5531-LA",
    caseId: "TRX-66103-Q",
    region: "Port Harcourt, NG",
    confidencePct: 88,
  },
  {
    id: "AL-99234",
    time: "13:50:12",
    customer: "Ngozi Eze",
    amount: "NGN 14,250,000.00",
    channel: "Transfer",
    risk: 94,
    signal: "Foreign IP Intelligence",
    severity: "Critical",
    owner: "Tosin Adeyemi",
    status: "Investigating",
    entityId: "E-1120-US",
    caseId: "TRX-88219-B",
    region: "Kano, NG",
    confidencePct: 93,
  },
  {
    id: "AL-99233",
    time: "13:47:09",
    customer: "Ifeoma Nwosu",
    amount: "NGN 12,000,000.00",
    channel: "Card",
    risk: 76,
    signal: "Consortium Match",
    severity: "High",
    owner: "Musa Ibrahim",
    status: "Open",
    entityId: "E-2039-LON",
    caseId: "TRX-77233-C",
    region: "Ibadan, NG",
    confidencePct: 79,
  },
];

export const alertsMeta = {
  subtitle:
    "Counts and KPIs below follow your active filters (severity, channel, owner). Use “All” for platform-wide scope.",
  signalDistribution: standardSignalDistribution.map((item) => ({ label: item.label, value: item.value })),
  triageTime: "4m 12s",
  team: [
    { name: "Chika Nnamdi", count: "12 alerts" },
    { name: "Musa Ibrahim", count: "8 alerts" },
    { name: "Tosin Adeyemi", count: "Break" },
  ],
  recommendation:
    "Unusual clustering of mobile logins in the Benin region. 14 alerts linked to shared device IDs. Recommend batch review.",
};

export const initialEntities: EntityRecord[] = [
  {
    id: "E-9941-XJ72",
    breadcrumb: "Entities  >  E-9941-XJ72",
    name: "Amina Bello",
    tags: ["Individual", "Premium_Savings_0012", "Abuja, NG"],
    riskIndex: 72,
    riskTitle: "High exposure",
    riskTier: "High",
    riskNarrative:
      "Composite scoring indicates high correlation with synthetic identity patterns. Multiple device hand-offs detected within last 48 hours across cross-border nodes.",
    frozen: false,
    confidencePct: 81,
    fraudScenario: "Synthetic identity / mule corridor risk with device hand-offs.",
    recommendedAction: "Outbound call to customer; temporary debit restriction above NGN 500k pending verification.",
    riskTrend: "Increasing",
    sanctionsHoldRequired: true,
    behavioralContext: {
      amountVs30dAvg: "Largest single outbound 4.1× 30-day median.",
      amountVs90dAvg: "NGN 12M transfer is 2.7× 90-day largest prior leg.",
      frequencyVsBaseline: "Device switches: 3 in 48h vs typical 1 per 14 days.",
      deviceVsBaseline: "New iPhone session not enrolled in baseline profile.",
      locationVsBaseline: "Lagos activity diverges from Abuja-weighted home profile.",
    },
    factorCards: [
      { label: "Velocity", value: "High" },
      { label: "Location risk", value: "High" },
      { label: "Network risk", value: "Medium" },
      { label: "Identity match", value: "Medium (82%)" },
    ],
    financialSnapshot: [
      { label: "Total assets", value: "NGN 242,900,000.00" },
      { label: "Last 30d volume", value: "NGN 18,205,120.00" },
      { label: "Exposure cap", value: "NGN 1,200,000.00" },
    ],
    investigationsPending: "3 active investigations pending",
    fingerprint: {
      device: [
        "iPhone 15 Pro Max",
        "Detected in Lagos, Nigeria (mismatch)",
        "MacBook Pro M2",
        "Abuja, NG (baseline)",
      ],
      network: ["VPN detection", "High probability", "IP reputation", "Neutral"],
      identity: ["2FA success", "FaceID success", "NIN/BVN re-verification required"],
    },
    identityTrust: [
      { label: "Facial Match", status: "98.8% match" },
      { label: "Address Verification", status: "Passed" },
      { label: "Sanctions Screening", status: "Pending review" },
    ],
    timeline: [
      { id: "EV-01", timestamp: "2023-11-24 14:22:10", action: "ATM Withdrawal", amount: "NGN 400,000.00", signal: "Unusual locale" },
      { id: "EV-02", timestamp: "2023-11-24 11:05:42", action: "New Device Link", amount: "—", signal: "Account change" },
      { id: "EV-03", timestamp: "2023-11-23 23:46:19", action: "NIP Transfer", amount: "NGN 12,000,000.00", signal: "Velocity spike" },
    ],
    associated: [
      {
        id: "AE-01",
        name: "Sterling Global Holdings",
        meta: "Director / beneficial owner — from CAC corporate filing + KYC attestation (2023)",
        risk: "Low",
      },
      {
        id: "AE-02",
        name: "Ifeoma Nwosu",
        meta: "Joint account party — verified on mandate card and BVN-linked profile",
        risk: "Medium",
      },
    ],
    interventions: [
      { id: "IN-01", label: "Outbound call to customer on registered MSISDN — confirm recent transfers.", completed: false, tier: "immediate" },
      { id: "IN-02", label: "Apply temporary outbound restriction above threshold pending review.", completed: false, tier: "immediate" },
      { id: "IN-03", label: "Internal escalation to senior analyst / fraud desk.", completed: false, tier: "immediate" },
      { id: "IN-04", label: "Request proof of source of wealth for NGN 12m leg (compliance).", completed: false, tier: "compliance" },
      { id: "IN-05", label: "Enhanced address / document reverification.", completed: false, tier: "compliance" },
      { id: "IN-06", label: "Device fingerprinting mandate on new handset.", completed: false, tier: "compliance" },
    ],
  },
  {
    id: "E-2039-LON",
    breadcrumb: "Entities  >  E-2039-LON",
    name: "Ngozi Eze",
    tags: ["Retail Banking", "Priority_Exposure", "Kano, NG"],
    riskIndex: 94,
    riskTitle: "Immediate review",
    riskTier: "Critical",
    confidencePct: 93,
    fraudScenario: "Account takeover / foreign IP payout testing.",
    recommendedAction: "Keep payout freeze; confirm customer via branch or video KYC before release.",
    riskTrend: "Increasing",
    riskNarrative:
      "High-confidence foreign IP and atypical value indicators continue to cluster around this account and connected beneficiaries.",
    frozen: true,
    behavioralContext: {
      amountVs30dAvg: "Outbound 5.1× 30-day median ticket.",
      amountVs90dAvg: "Largest leg in 18 months.",
      frequencyVsBaseline: "Single high-value push vs typical payroll-sized flows.",
      deviceVsBaseline: "Handset matches profile; IP path does not.",
      locationVsBaseline: "Kano session vs Lagos-dominant history.",
    },
    factorCards: [
      { label: "Velocity", value: "Critical" },
      { label: "Location risk", value: "Critical" },
      { label: "Network risk", value: "High" },
      { label: "Identity match", value: "Medium (61%)" },
    ],
    financialSnapshot: [
      { label: "Total assets", value: "NGN 381,400,000.00" },
      { label: "Last 30d volume", value: "NGN 74,205,120.00" },
      { label: "Exposure cap", value: "NGN 14,250,000.00" },
    ],
    investigationsPending: "1 active investigation pending",
    fingerprint: {
      device: ["iPhone 14 Pro", "Kano, NG (mismatch)", "MacBook Air", "Lagos, NG (baseline)"],
      network: ["Tor exit node", "High probability", "IP reputation", "Elevated risk"],
      identity: ["2FA bypassed", "Biometric skipped", "KYC review initiated"],
    },
    identityTrust: [
      { label: "Facial Match", status: "87.1% match" },
      { label: "Address Verification", status: "Pending" },
      { label: "Sanctions Screening", status: "Cleared" },
    ],
    timeline: [
      { id: "EV-11", timestamp: "2024-10-24 09:44:20", action: "RTGS Transfer", amount: "NGN 14,250,000.00", signal: "Foreign IP intelligence" },
      { id: "EV-12", timestamp: "2024-10-24 09:05:12", action: "Case Assignment", amount: "—", signal: "Priority escalation" },
      { id: "EV-13", timestamp: "2024-10-24 08:12:44", action: "AI Review", amount: "—", signal: "Atypical high value" },
    ],
    associated: [
      { id: "AE-11", name: "Ngozi Eze", meta: "Primary member / account owner", risk: "H-Risk" },
    ],
    interventions: [
      { id: "IN-11", label: "Maintain payout freeze pending compliance sign-off.", completed: true, tier: "immediate" },
      { id: "IN-12a", label: "Outbound call to customer — high-value hold confirmation.", completed: false, tier: "immediate" },
      { id: "IN-12", label: "Escalate case to sanctions and fraud fusion desk.", completed: false, tier: "immediate" },
      { id: "IN-13", label: "Regulatory STR packaging if fraud confirmed.", completed: false, tier: "compliance" },
    ],
  },
  {
    id: "E-1120-US",
    breadcrumb: "Entities  >  E-1120-US",
    name: "Ngozi Eze",
    tags: ["Individual", "Premier_Current_7781", "Kano, NG"],
    riskIndex: 94,
    riskTitle: "Immediate review",
    riskTier: "Critical",
    confidencePct: 93,
    fraudScenario: "Account takeover / foreign IP payout testing.",
    recommendedAction: "Keep payout freeze; confirm customer via branch or video KYC before release.",
    riskTrend: "Increasing",
    riskNarrative:
      "Foreign IP and atypical value indicators continue to cluster around this account and connected beneficiaries.",
    frozen: true,
    behavioralContext: {
      amountVs30dAvg: "Outbound 5.1× 30-day median ticket.",
      amountVs90dAvg: "Largest leg in 18 months.",
      frequencyVsBaseline: "Single high-value push vs typical payroll-sized flows.",
      deviceVsBaseline: "Handset matches profile; IP path does not.",
      locationVsBaseline: "Kano session vs Lagos-dominant history.",
    },
    factorCards: [
      { label: "Velocity", value: "Critical" },
      { label: "Location risk", value: "Critical" },
      { label: "Network risk", value: "High" },
      { label: "Identity match", value: "Medium (61%)" },
    ],
    financialSnapshot: [
      { label: "Total assets", value: "NGN 381,400,000.00" },
      { label: "Last 30d volume", value: "NGN 74,205,120.00" },
      { label: "Exposure cap", value: "NGN 14,250,000.00" },
    ],
    investigationsPending: "1 active investigation pending",
    fingerprint: {
      device: ["iPhone 14 Pro", "Kano, NG (mismatch)", "MacBook Air", "Lagos, NG (baseline)"],
      network: ["Tor exit node", "High probability", "IP reputation", "Elevated risk"],
      identity: ["2FA bypassed", "Biometric skipped", "KYC review initiated"],
    },
    identityTrust: [
      { label: "Facial Match", status: "87.1% match" },
      { label: "Address Verification", status: "Pending" },
      { label: "Sanctions Screening", status: "Cleared" },
    ],
    timeline: [
      { id: "EV-11", timestamp: "2024-10-24 09:44:20", action: "RTGS Transfer", amount: "NGN 14,250,000.00", signal: "Foreign IP intelligence" },
      { id: "EV-12", timestamp: "2024-10-24 09:05:12", action: "Case Assignment", amount: "—", signal: "Priority escalation" },
      { id: "EV-13", timestamp: "2024-10-24 08:12:44", action: "AI Review", amount: "—", signal: "Atypical high value" },
    ],
    associated: [
      { id: "AE-11", name: "Ngozi Eze", meta: "Primary member / account owner", risk: "H-Risk" },
    ],
    interventions: [
      { id: "IN-11", label: "Maintain payout freeze pending compliance sign-off.", completed: true, tier: "immediate" },
      { id: "IN-12a", label: "Outbound call to customer — high-value hold confirmation.", completed: false, tier: "immediate" },
      { id: "IN-12", label: "Escalate case to sanctions and fraud fusion desk.", completed: false, tier: "immediate" },
      { id: "IN-13", label: "Regulatory STR packaging if fraud confirmed.", completed: false, tier: "compliance" },
    ],
  },
  {
    id: "E-7731-NG",
    breadcrumb: "Entities  >  E-7731-NG",
    name: "Aisha Murray",
    tags: ["Individual", "Mobile_Wallet_2291", "Lagos, NG"],
    riskIndex: 81,
    riskTitle: "High exposure",
    riskTier: "High",
    confidencePct: 84,
    fraudScenario: "Device takeover or scam-assisted push payments.",
    recommendedAction: "Velocity throttle + customer callback before raising limits.",
    riskTrend: "Increasing",
    riskNarrative:
      "Device variance and concentrated transfer bursts suggest coordinated account testing behavior.",
    frozen: false,
    behavioralContext: {
      amountVs30dAvg: "Burst legs ~1.8× typical mobile outbound.",
      amountVs90dAvg: "Within range individually; cadence is abnormal.",
      frequencyVsBaseline: "9 transfers / 2h vs ~3 / day baseline.",
      deviceVsBaseline: "New Samsung model vs registered A-series.",
      locationVsBaseline: "Lagos-consistent; device is not.",
    },
    factorCards: [
      { label: "Velocity", value: "High" },
      { label: "Location risk", value: "Medium" },
      { label: "Network risk", value: "Medium" },
      { label: "Identity match", value: "High (89%)" },
    ],
    financialSnapshot: [
      { label: "Total assets", value: "NGN 24,100,000.00" },
      { label: "Last 30d volume", value: "NGN 5,902,200.00" },
      { label: "Exposure cap", value: "NGN 900,000.00" },
    ],
    investigationsPending: "2 active investigations pending",
    fingerprint: {
      device: ["Samsung Galaxy S21", "Lagos, Nigeria (mismatch)", "iPad Air", "Abuja, NG (baseline)"],
      network: ["VPN detection", "Moderate probability", "IP reputation", "Neutral"],
      identity: ["2FA success", "FaceID unavailable", "Address re-check required"],
    },
    identityTrust: [
      { label: "Facial Match", status: "92.3% match" },
      { label: "Address Verification", status: "Passed" },
      { label: "Sanctions Screening", status: "Cleared" },
    ],
    timeline: [
      { id: "EV-21", timestamp: "2024-10-24 13:58:02", action: "Mobile Transfer", amount: "NGN 890,110.00", signal: "Device pattern" },
      { id: "EV-22", timestamp: "2024-10-24 13:51:10", action: "New Device Login", amount: "—", signal: "Fingerprint mismatch" },
      { id: "EV-23", timestamp: "2024-10-24 13:46:08", action: "Wallet Funding", amount: "NGN 300,000.00", signal: "Velocity spike" },
    ],
    associated: [
      { id: "AE-21", name: "Aisha Murray", meta: "Primary member / account owner", risk: "M-Risk" },
    ],
    interventions: [
      { id: "IN-21", label: "Maintain transaction velocity throttling for 24h.", completed: true, tier: "immediate" },
      { id: "IN-21b", label: "Outbound call — verify last 3 beneficiaries.", completed: false, tier: "immediate" },
      { id: "IN-22", label: "Trigger secondary KYC document review.", completed: false, tier: "compliance" },
    ],
  },
  {
    id: "E-5531-LA",
    breadcrumb: "Entities  >  E-5531-LA",
    name: "Tunde Adebayo",
    tags: ["Individual", "Global_Transfer_8403", "Port Harcourt, NG"],
    riskIndex: 88,
    riskTitle: "Cross-border exposure",
    riskTier: "High",
    confidencePct: 88,
    fraudScenario: "Layering via new beneficiaries and compressed time window.",
    recommendedAction: "Hold new beneficiaries; escalate to cross-border monitoring desk.",
    riskTrend: "Increasing",
    riskNarrative:
      "Cross-border bursts and new beneficiary activity indicate potential laundering corridor behavior.",
    frozen: false,
    behavioralContext: {
      amountVs30dAvg: "Burst total 4.2× median daily outbound.",
      amountVs90dAvg: "Upper decile cumulative movement.",
      frequencyVsBaseline: "3 legs / 18 min vs 2–3 / week typical.",
      deviceVsBaseline: "Registered Pixel handset — consistent.",
      locationVsBaseline: "Port Harcourt elevated vs Lagos-weighted profile.",
    },
    factorCards: [
      { label: "Velocity", value: "High" },
      { label: "Location risk", value: "High" },
      { label: "Network risk", value: "Medium" },
      { label: "Identity match", value: "High (84%)" },
    ],
    financialSnapshot: [
      { label: "Total assets", value: "NGN 89,300,000.00" },
      { label: "Last 30d volume", value: "NGN 21,004,120.00" },
      { label: "Exposure cap", value: "NGN 3,720,000.00" },
    ],
    investigationsPending: "1 active investigation pending",
    fingerprint: {
      device: ["Pixel 8 Pro", "Port Harcourt, NG (mismatch)", "Windows Device", "Lagos, NG (baseline)"],
      network: ["New ASN route", "High probability", "IP reputation", "Watchlist adjacent"],
      identity: ["2FA success", "FaceID success", "Address check pending"],
    },
    identityTrust: [
      { label: "Facial Match", status: "90.4% match" },
      { label: "Address Verification", status: "Pending" },
      { label: "Sanctions Screening", status: "Cleared" },
    ],
    timeline: [
      { id: "EV-31", timestamp: "2024-10-24 13:55:18", action: "NIP Transfer", amount: "NGN 3,720,000.00", signal: "Cross-border burst" },
      { id: "EV-32", timestamp: "2024-10-24 13:49:04", action: "Beneficiary Added", amount: "—", signal: "New payee" },
      { id: "EV-33", timestamp: "2024-10-24 13:42:47", action: "Device Login", amount: "—", signal: "New location" },
    ],
    associated: [
      { id: "AE-31", name: "Tunde Adebayo", meta: "Primary member / account owner", risk: "M-Risk" },
    ],
    interventions: [
      { id: "IN-31", label: "Escalate to cross-border monitoring desk.", completed: false, tier: "immediate" },
      { id: "IN-32", label: "Place outbound transfer hold over threshold.", completed: true, tier: "immediate" },
      { id: "IN-33", label: "Enhanced beneficiary KYC if funds released.", completed: false, tier: "compliance" },
    ],
  },
];

export const initialCases: CaseRecord[] = [
  {
    id: "TRX-88219-B",
    analyst: "Tosin Adeyemi",
    analystTitle: "Lead Analyst",
    amount: "NGN 14,250,000.00",
    currency: "NGN",
    method: "NIBSS Instant Payment",
    paymentRail: "NIP",
    destinationGeography: "Kano, NG",
    status: "Suspended / High Risk",
    decision: "Pending",
    linkedAlertId: "AL-99234",
    entityId: "E-1120-US",
    confidencePct: 93,
    fraudScenario: "Likely account takeover — foreign IP cluster with device drift from registered baseline.",
    recommendedAction: "Maintain payout restriction; verify customer out-of-band before releasing funds.",
    riskTrend: "Increasing",
    behavioralContext: {
      amountVs30dAvg: "This transfer is 5.9× the customer 30-day average (NGN 2.4M).",
      amountVs90dAvg: "3.2× the 90-day rolling average outbound size.",
      frequencyVsBaseline: "1 attempt today vs typical 0.4 outbound transfers / day.",
      deviceVsBaseline: "Current device does not match registered primary (Lagos baseline vs Kano session).",
      locationVsBaseline: "Login geography atypical — customer profile weighted to Lagos / Abuja corridors.",
    },
    auditTrail: [
      { id: "CA-1", title: "Flagged by AI Engine (Sentinel V4)", body: "Transaction amount 400% above user monthly average. Velocity score threshold exceeded.", time: "Oct 24, 08:12:44" },
      { id: "CA-2", title: "Case Assigned to Analyst", body: "Auto-assigned to Tosin Adeyemi based on high-value asset prioritization rules.", time: "Oct 24, 09:05:12" },
      { id: "CA-3", title: "Suspicious Device Fingerprint Detected", body: "Device ID mismatch. Origin IP resolves to high-risk network in Kano, NG.", time: "Oct 24, 09:44:20" },
    ],
    transactionAuditEvents: [
      { id: "TX-88219-01", title: "Auth challenge passed", body: "OTP delivered to registered mobile.", time: "Oct 24, 09:42:01" },
      { id: "TX-88219-02", title: "Transfer initiated", body: "NIP debit staging NGN 14,250,000.00.", time: "Oct 24, 09:43:18" },
      { id: "TX-88219-03", title: "Risk engine hold", body: "Velocity + IP rules triggered automated review.", time: "Oct 24, 09:44:20" },
    ],
    evidence: [
      { label: "Geo-Location", value: "Kano, Nigeria (IP: 102.88.14.12)" },
      { label: "Device Signature", value: "iPhone 14 Pro / iOS 17.4" },
      { label: "Frequency", value: "1st attempt today" },
      { label: "Avg Size", value: "NGN 240,000.00" },
      { label: "User Tenure", value: "4.2 years" },
    ],
    riskFactors: [
      { label: "Foreign IP Intelligence", points: "+45 pts", contribution: 45 },
      { label: "Atypical High Value", points: "+30 pts", contribution: 30 },
      { label: "Device ID Mismatch", points: "+19 pts", contribution: 19 },
    ],
    aggregatedRisk: 94,
    entityProfile: {
      initials: "JD",
      name: "Ngozi Eze",
      memberSince: "Member since Jan 2020",
      kyc: "Verified (L1)",
      credit: "782 Excellent",
      linked: "03 active",
    },
  },
  {
    id: "TRX-77210-A",
    analyst: "Musa Ibrahim",
    analystTitle: "Senior Investigator",
    amount: "NGN 12,000,000.00",
    currency: "NGN",
    method: "POS Settlement Transfer",
    paymentRail: "POS / Card settlement",
    destinationGeography: "Lagos, NG",
    status: "Review / Elevated",
    decision: "Escalated",
    linkedAlertId: "AL-99233",
    entityId: "E-9941-XJ72",
    confidencePct: 86,
    fraudScenario: "Consortium-linked beneficiary — possible mule routing through merchant POS.",
    recommendedAction: "Hold settlement batch; request beneficiary verification from acquiring bank.",
    riskTrend: "Stable",
    behavioralContext: {
      amountVs30dAvg: "Outbound 2.1× 30-day average ticket size.",
      amountVs90dAvg: "Within upper band of 90-day history but beneficiary is new.",
      frequencyVsBaseline: "3 POS settlements today vs typical 1 / day.",
      deviceVsBaseline: "Terminal device ID consistent with registered merchant profile.",
      locationVsBaseline: "Merchant location matches registered Lagos address.",
    },
    auditTrail: [
      { id: "CA-11", title: "Consortium signal match", body: "Outbound beneficiary overlaps with previously reported mule account.", time: "Oct 23, 17:12:44" },
    ],
    transactionAuditEvents: [
      { id: "TX-77210-01", title: "POS batch posted", body: "NGN 12,000,000.00 to Mainland Trade Hub Ltd.", time: "Oct 23, 17:08:02" },
      { id: "TX-77210-02", title: "Consortium rule fired", body: "Beneficiary hash matched watchlist cluster.", time: "Oct 23, 17:12:44" },
    ],
    evidence: [
      { label: "Consortium Match", value: "2 previous institutions" },
      { label: "Beneficiary", value: "Mainland Trade Hub Ltd" },
      { label: "Review Window", value: "72h" },
      { label: "Analyst Note", value: "Escalated to compliance" },
    ],
    riskFactors: [
      { label: "Consortium Match", points: "+32 pts", contribution: 32 },
      { label: "Shared Device", points: "+21 pts", contribution: 21 },
    ],
    aggregatedRisk: 83,
    entityProfile: {
      initials: "JS",
      name: "Amina Bello",
      memberSince: "Member since May 2021",
      kyc: "Pending review",
      credit: "661 Moderate",
      linked: "02 active",
    },
  },
  {
    id: "TRX-99102-Z",
    analyst: "Chika Nnamdi",
    analystTitle: "Chief Compliance",
    amount: "NGN 890,110.00",
    currency: "NGN",
    method: "Mobile Transfer",
    paymentRail: "USSD / mobile bank",
    destinationGeography: "Lagos, NG",
    status: "Open / High",
    decision: "Pending",
    linkedAlertId: "AL-99236",
    entityId: "E-7731-NG",
    confidencePct: 84,
    fraudScenario: "Device drift with burst transfers to a new beneficiary — possible takeover or scam push.",
    recommendedAction: "Temporary outbound cap; outbound call to customer on file.",
    riskTrend: "Increasing",
    behavioralContext: {
      amountVs30dAvg: "Per-transfer size 1.8× 30-day average.",
      amountVs90dAvg: "Within normal range individually; burst pattern is the driver.",
      frequencyVsBaseline: "9 transfers in 2h vs typical ~3 per day.",
      deviceVsBaseline: "Handset model changed from registered Samsung A-series to SM-G991U.",
      locationVsBaseline: "Lagos session — geography matches profile; device does not.",
    },
    auditTrail: [
      { id: "CA-21", title: "Device pattern variance detected", body: "Device fingerprint diverged from established profile baseline.", time: "Oct 24, 13:58:02" },
    ],
    transactionAuditEvents: [
      { id: "TX-99102-01", title: "Burst window opened", body: "First of 9 transfers within 120 minutes.", time: "Oct 24, 13:40:00" },
      { id: "TX-99102-02", title: "Velocity alert", body: "Threshold: >6 mobile transfers / 2h.", time: "Oct 24, 13:55:11" },
      { id: "TX-99102-03", title: "Case opened", body: "Linked to device-pattern rule pack.", time: "Oct 24, 13:58:02" },
    ],
    evidence: [
      { label: "Device Signature", value: "Android SM-G991U" },
      { label: "Network Region", value: "Lagos, NG" },
      { label: "Transfer Count", value: "9 in 2h" },
      { label: "Beneficiary Age", value: "6 days" },
    ],
    riskFactors: [
      { label: "Device Pattern", points: "+34 pts", contribution: 34 },
      { label: "Velocity Window", points: "+18 pts", contribution: 18 },
    ],
    aggregatedRisk: 81,
    entityProfile: {
      initials: "AM",
      name: "Aisha Murray",
      memberSince: "Member since Sep 2022",
      kyc: "Verified (L1)",
      credit: "704 Good",
      linked: "01 active",
    },
  },
  {
    id: "TRX-66103-Q",
    analyst: "Chika Nnamdi",
    analystTitle: "Chief Compliance",
    amount: "NGN 3,720,000.00",
    currency: "NGN",
    method: "NIP Transfer",
    paymentRail: "NIP",
    destinationGeography: "Port Harcourt, NG",
    status: "Escalated / Critical",
    decision: "Escalated",
    linkedAlertId: "AL-99235",
    entityId: "E-5531-LA",
    confidencePct: 88,
    fraudScenario: "Layering-style burst to new beneficiaries — cross-border corridor risk.",
    recommendedAction: "Escalate to fusion desk; hold pending beneficiaries until attestation.",
    riskTrend: "Increasing",
    behavioralContext: {
      amountVs30dAvg: "Each leg ~1.4× typical outbound size.",
      amountVs90dAvg: "Cumulative burst 4.2× median daily outbound.",
      frequencyVsBaseline: "3 transfers in 18 min vs typical 2–3 per week.",
      deviceVsBaseline: "Device matches registered handset.",
      locationVsBaseline: "Port Harcourt login — elevated vs Lagos-weighted history.",
    },
    auditTrail: [
      { id: "CA-31", title: "Cross-border burst detected", body: "Three transfers routed across newly added beneficiary rail in 18 minutes.", time: "Oct 24, 13:55:18" },
    ],
    transactionAuditEvents: [
      { id: "TX-66103-01", title: "Transfer 1/3", body: "NGN 1,240,000.00 — new beneficiary.", time: "Oct 24, 13:42:10" },
      { id: "TX-66103-02", title: "Transfer 2/3", body: "NGN 1,240,000.00 — same rail.", time: "Oct 24, 13:48:55" },
      { id: "TX-66103-03", title: "Transfer 3/3 + alert", body: "NGN 1,240,000.00 — burst rule engaged.", time: "Oct 24, 13:55:18" },
    ],
    evidence: [
      { label: "Destination geography", value: "Port Harcourt, NG" },
      { label: "Payment rail", value: "NIP" },
      { label: "Burst Window", value: "18 minutes" },
      { label: "Prior Alerts", value: "2 related signals" },
    ],
    riskFactors: [
      { label: "Cross-Border Burst", points: "+39 pts", contribution: 39 },
      { label: "New Beneficiary", points: "+17 pts", contribution: 17 },
    ],
    aggregatedRisk: 88,
    entityProfile: {
      initials: "KO",
      name: "Tunde Adebayo",
      memberSince: "Member since Mar 2021",
      kyc: "Verified (L2)",
      credit: "688 Moderate",
      linked: "02 active",
    },
  },
  {
    id: "TRX-88238-P",
    analyst: "Musa Ibrahim",
    analystTitle: "Senior Investigator",
    amount: "NGN 4,250,000.00",
    currency: "NGN",
    method: "Mobile Wallet Top-up",
    paymentRail: "Mobile money / wallet",
    destinationGeography: "Lagos, NG",
    status: "Open / Critical",
    decision: "Pending",
    linkedAlertId: "AL-99238",
    entityId: "E-9941-XJ72",
    confidencePct: 91,
    fraudScenario: "Extreme velocity on wallet rail — scripted top-up pattern.",
    recommendedAction: "Hard stop on wallet channel; step-up authentication before any release.",
    riskTrend: "Increasing",
    behavioralContext: {
      amountVs30dAvg: "Per-event size 3.4× 30-day average top-up.",
      amountVs90dAvg: "2.9× 90-day average.",
      frequencyVsBaseline: "11 events in 7 min — baseline ~3 mobile events per day.",
      deviceVsBaseline: "Device ID EP-11-392-A matches session but velocity is anomalous.",
      locationVsBaseline: "Lagos — consistent with profile; frequency is not.",
    },
    auditTrail: [
      { id: "CA-41", title: "Velocity threshold exceeded", body: "Concurrent top-up attempts exceeded threshold by 3.1x.", time: "Oct 24, 14:02:11" },
    ],
    transactionAuditEvents: [
      { id: "TX-88238-01", title: "Event 1–3", body: "Wallet top-ups NGN 180k–420k in 90s window.", time: "Oct 24, 13:55:02" },
      { id: "TX-88238-02", title: "Event 4–7", body: "Sustained burst; fraud score climbing.", time: "Oct 24, 13:57:44" },
      { id: "TX-88238-03", title: "Event 8–11", body: "Peak velocity before automated hold.", time: "Oct 24, 14:01:58" },
      { id: "TX-88238-04", title: "Case surfaced", body: "Analyst queue — velocity trigger.", time: "Oct 24, 14:02:11" },
    ],
    evidence: [
      { label: "Velocity", value: "11 tx in 7 min" },
      { label: "Geo-Location", value: "Lagos, NG" },
      { label: "Device ID", value: "EP-11-392-A" },
      { label: "Account Age", value: "14 months" },
    ],
    riskFactors: [
      { label: "Velocity Trigger", points: "+41 pts", contribution: 41 },
      { label: "Session Overlap", points: "+16 pts", contribution: 16 },
    ],
    aggregatedRisk: 90,
    entityProfile: {
      initials: "EP",
      name: "Chinedu Okafor",
      memberSince: "Member since Aug 2023",
      kyc: "Verified (L1)",
      credit: "731 Good",
      linked: "01 active",
    },
  },
  {
    id: "TRX-77233-C",
    analyst: "Musa Ibrahim",
    analystTitle: "Senior Investigator",
    amount: "NGN 12,000,000.00",
    currency: "NGN",
    method: "Card",
    paymentRail: "Card scheme (CNP)",
    destinationGeography: "Ibadan, NG",
    status: "Open / Elevated",
    decision: "Pending",
    linkedAlertId: "AL-99233",
    entityId: "E-2039-LON",
    confidencePct: 79,
    fraudScenario: "Card-not-present concentration through merchant cluster linked to prior mule typology.",
    recommendedAction: "Request issuer auth logs; consider merchant suspend pending consortium review.",
    riskTrend: "Stable",
    behavioralContext: {
      amountVs30dAvg: "Single capture near upper decile for this customer.",
      amountVs90dAvg: "Within historical max but merchant cluster is novel.",
      frequencyVsBaseline: "1 large CNP today vs typical low-value grocery pattern.",
      deviceVsBaseline: "Browser fingerprint consistent with prior sessions.",
      locationVsBaseline: "Ibadan terminal — acceptable but MCC cluster is elevated risk.",
    },
    auditTrail: [
      { id: "CA-51", title: "Consortium match surfaced", body: "Signal overlaps with shared merchant fingerprint cluster.", time: "Oct 24, 13:47:09" },
    ],
    transactionAuditEvents: [
      { id: "TX-77233-01", title: "Authorization", body: "CNP auth approved — MCC 5411.", time: "Oct 24, 13:46:40" },
      { id: "TX-77233-02", title: "Consortium match", body: "Merchant ID tied to prior SAR cluster.", time: "Oct 24, 13:47:09" },
    ],
    evidence: [
      { label: "Signal", value: "Consortium Match" },
      { label: "Origin", value: "Ibadan, NG" },
      { label: "Merchant MCC", value: "5411" },
      { label: "Review Window", value: "24h" },
    ],
    riskFactors: [
      { label: "Consortium Match", points: "+35 pts", contribution: 35 },
      { label: "Clustered Merchant", points: "+14 pts", contribution: 14 },
    ],
    aggregatedRisk: 76,
    entityProfile: {
      initials: "SM",
      name: "Ifeoma Nwosu",
      memberSince: "Member since Jan 2020",
      kyc: "Verified (L1)",
      credit: "742 Good",
      linked: "02 active",
    },
  },
];

export const reportingData = {
  title: "Regulatory Reporting Portal",
  subtitle: "Operational performance and control effectiveness for Q4 FY24 (period aligned to Oct 2024 submissions).",
  metrics: [
    { label: "Loss avoided", value: "NGN 4.2B", note: "12% vs last quarter" },
    { label: "Time to detect", value: "1.4s", note: "0.2s improvement" },
    { label: "Time to triage", value: "8.5m", note: "4% volume surge" },
    { label: "False-positive rate", value: "2.1%", note: "Within threshold (2.5%)" },
  ],
  modelConfidence: 94.2,
  recall: "High (0.92)",
  drift: "Nominal (0.04)",
  narrative:
    "System performance remains within established regulatory risk appetites. Current model drift is negligible; however, increased transaction volumes in peer-to-peer segments warrant closer automated monitoring for Q4.",
  assurance: [
    "CBN AML/CFT guideline alignment - Q4 review window completed, no material exceptions.",
    "NDPA data residency controls - validated for all domestic payment flows.",
    "Discreet CBN mandate memo filed: Enhanced monitoring threshold for high-risk transfers above NGN 5m.",
  ],
};

/** Default period in “Generate regulator pack” — aligned to `reportingData.subtitle` (Q4 FY24). */
export const reportingPackDefaultPeriodLabel = "Q4 FY24";

export const initialSubmissions: ReportSubmission[] = [
  { id: "SAR-2024-0891-B", type: "Suspicious Activity", status: "Accepted", date: "Oct 12, 2024" },
  { id: "AML-MOD-772-V2", type: "Compliance Audit", status: "Pending", date: "Oct 14, 2024" },
  { id: "FIN-CTR-002", type: "Internal Governance", status: "Certified", date: "Oct 08, 2024" },
];

export const exportCards: ReportExportCard[] = [
  {
    id: "alert-analysis",
    title: "Alert Queue Analysis",
    body: "Complete logs of triage outcomes and justifications.",
    action: "Download PDF",
    format: "pdf",
  },
  {
    id: "control-map",
    title: "Control Map Summary",
    body: "Visual alignment of detection rules to compliance mandates.",
    action: "Download XLSX",
    format: "xlsx",
  },
  {
    id: "board-pack",
    title: "Board Summary Pack",
    body: "Executive synthesis of risk posture and ROI.",
    action: "Export Slides",
    format: "pptx",
  },
  {
    id: "cbn-memo",
    title: "CBN Compliance Memo",
    body: "Internal memo covering current CBN mandates on AML monitoring and suspicious transaction escalation.",
    action: "Download PDF",
    format: "pdf",
  },
];

export const initialAuditLogItems: AuditEntry[] = [
  {
    id: "AU-1",
    timestamp: "14:18:22",
    actor: "Analyst K. Balogun",
    detail: "Cleared case #8421 — disposition: false positive after device attestation.",
    sessionRef: "sess-ng-lag-7f3a · IP 102.89.xx.xx",
  },
  {
    id: "AU-2",
    timestamp: "14:15:01",
    actor: "System / Rules Engine",
    detail: "Rule R-102 (domestic velocity) updated — policy pack v2024.10.2.",
    beforeState: "severity_weight: 1.0 · threshold: 850k NGN / 15m window",
    afterState: "severity_weight: 1.15 · threshold: 920k NGN / 15m window",
    justification: "Auto-tuning from supervised feedback loop; no manual override.",
  },
  {
    id: "AU-3",
    timestamp: "14:12:44",
    actor: "Reporting",
    detail: "Bulk export reporting job initiated (pack ID GEN-2024-Q4-01).",
    sessionRef: "batch-worker-east-2",
  },
  { id: "AU-4", timestamp: "13:58:04", actor: "Sanctions Sync", detail: "Completed with no blocking exceptions." },
  {
    id: "AU-5",
    timestamp: "13:41:16",
    actor: "System / Risk Parameters",
    detail: "Queue severity threshold adjusted for domestic NIP corridor.",
    beforeState: "domestic_critical_threshold: 5.0M NGN",
    afterState: "domestic_critical_threshold: 5.5M NGN",
    justification: "Scheduled parameter drift correction (change request CR-OPS-4412). Analyst: auto-approved policy window.",
    sessionRef: "policy-runner-13:41UTC",
  },
];
