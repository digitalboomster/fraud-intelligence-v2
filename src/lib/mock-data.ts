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
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  actor: string;
  detail: string;
};

export type CaseRecord = {
  id: string;
  analyst: string;
  analystTitle: string;
  amount: string;
  currency: string;
  method: string;
  destination: string;
  status: string;
  decision: CaseDecision;
  linkedAlertId: string;
  entityId: string;
  auditTrail: Array<{ id: string; title: string; body: string; time: string }>;
  evidence: Array<{ label: string; value: string }>;
  riskFactors: Array<{ label: string; points: string }>;
  aggregatedRisk: number;
  entityProfile: {
    initials: string;
    name: string;
    memberSince: string;
    kyc: string;
    credit: string;
    linked: string;
  };
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
  interventions: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
};

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
  chartBars: [
    { label: "Device", value: 58 },
    { label: "Velocity", value: 91 },
    { label: "Geo", value: 47 },
    { label: "Behavior", value: 72 },
    { label: "Consortium", value: 63 },
  ],
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
  },
];

export const alertsMeta = {
  subtitle: "142 live threats monitored in last 24h",
  signalDistribution: [
    { label: "Vel", value: 84 },
    { label: "Geo", value: 61 },
    { label: "Dev", value: 47 },
    { label: "IP", value: 52 },
  ],
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
    riskTitle: "Critical Exposure",
    riskTier: "Tier 3 Elevated",
    riskNarrative:
      "Composite scoring indicates high correlation with synthetic identity patterns. Multiple device hand-offs detected within last 48 hours across cross-border nodes.",
    frozen: false,
    factorCards: [
      { label: "Velocity", value: "High" },
      { label: "Geolocation", value: "Fragile" },
      { label: "Network ID", value: "Stable" },
      { label: "Identity Match", value: "82%" },
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
      identity: ["2FA success", "FaceID success", "SSN re-verification required"],
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
      { id: "AE-01", name: "Sterling Global Holdings", meta: "Director / 100% beneficial owner", risk: "L-Risk" },
      { id: "AE-02", name: "Ifeoma Nwosu", meta: "Shared account access / spouse", risk: "M-Risk" },
    ],
    interventions: [
      {
        id: "IN-01",
        label: "Mandate immediate proof of source of wealth for the NGN 12m transfer.",
        completed: false,
      },
      {
        id: "IN-02",
        label: "Request secondary document verification for the registered address.",
        completed: false,
      },
      {
        id: "IN-03",
        label: "Trigger enhanced device fingerprinting for the Nigeria-based node.",
        completed: false,
      },
    ],
  },
  {
    id: "E-2039-LON",
    breadcrumb: "Entities  >  E-2039-LON",
    name: "Ngozi Eze",
    tags: ["Retail Banking", "Priority_Exposure", "Kano, NG"],
    riskIndex: 94,
    riskTitle: "Immediate Review",
    riskTier: "Tier 4 Critical",
    riskNarrative:
      "High-confidence foreign IP and atypical value indicators continue to cluster around this account and connected beneficiaries.",
    frozen: true,
    factorCards: [
      { label: "Velocity", value: "Critical" },
      { label: "Geolocation", value: "Compromised" },
      { label: "Network ID", value: "Unknown" },
      { label: "Identity Match", value: "61%" },
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
      { id: "IN-11", label: "Maintain payout freeze pending compliance sign-off.", completed: true },
      { id: "IN-12", label: "Escalate case to sanctions and fraud fusion desk.", completed: false },
    ],
  },
  {
    id: "E-1120-US",
    breadcrumb: "Entities  >  E-1120-US",
    name: "Ngozi Eze",
    tags: ["Individual", "Premier_Current_7781", "Kano, NG"],
    riskIndex: 94,
    riskTitle: "Immediate Review",
    riskTier: "Tier 4 Critical",
    riskNarrative:
      "Foreign IP and atypical value indicators continue to cluster around this account and connected beneficiaries.",
    frozen: true,
    factorCards: [
      { label: "Velocity", value: "Critical" },
      { label: "Geolocation", value: "Compromised" },
      { label: "Network ID", value: "Unknown" },
      { label: "Identity Match", value: "61%" },
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
      { id: "IN-11", label: "Maintain payout freeze pending compliance sign-off.", completed: true },
      { id: "IN-12", label: "Escalate case to sanctions and fraud fusion desk.", completed: false },
    ],
  },
  {
    id: "E-7731-NG",
    breadcrumb: "Entities  >  E-7731-NG",
    name: "Aisha Murray",
    tags: ["Individual", "Mobile_Wallet_2291", "Lagos, NG"],
    riskIndex: 81,
    riskTitle: "High Exposure",
    riskTier: "Tier 3 Elevated",
    riskNarrative:
      "Device variance and concentrated transfer bursts suggest coordinated account testing behavior.",
    frozen: false,
    factorCards: [
      { label: "Velocity", value: "High" },
      { label: "Geolocation", value: "Fragile" },
      { label: "Network ID", value: "Moderate" },
      { label: "Identity Match", value: "89%" },
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
      { id: "IN-21", label: "Maintain transaction velocity throttling for 24h.", completed: true },
      { id: "IN-22", label: "Trigger secondary KYC document review.", completed: false },
    ],
  },
  {
    id: "E-5531-LA",
    breadcrumb: "Entities  >  E-5531-LA",
    name: "Tunde Adebayo",
    tags: ["Individual", "Global_Transfer_8403", "Port Harcourt, NG"],
    riskIndex: 88,
    riskTitle: "Cross-Border Exposure",
    riskTier: "Tier 3 Elevated",
    riskNarrative:
      "Cross-border bursts and new beneficiary activity indicate potential laundering corridor behavior.",
    frozen: false,
    factorCards: [
      { label: "Velocity", value: "High" },
      { label: "Geolocation", value: "Elevated" },
      { label: "Network ID", value: "Stable" },
      { label: "Identity Match", value: "84%" },
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
      { id: "IN-31", label: "Escalate to cross-border monitoring desk.", completed: false },
      { id: "IN-32", label: "Place outbound transfer hold over threshold.", completed: true },
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
    destination: "Interbank NIP (Kano)",
    status: "Suspended / High Risk",
    decision: "Pending",
    linkedAlertId: "AL-99234",
    entityId: "E-1120-US",
    auditTrail: [
      { id: "CA-1", title: "Flagged by AI Engine (Sentinel V4)", body: "Transaction amount 400% above user monthly average. Velocity score threshold exceeded.", time: "Oct 24, 08:12:44" },
      { id: "CA-2", title: "Case Assigned to Analyst", body: "Auto-assigned to Tosin Adeyemi based on high-value asset prioritization rules.", time: "Oct 24, 09:05:12" },
      { id: "CA-3", title: "Suspicious Device Fingerprint Detected", body: "Device ID mismatch. Origin IP resolves to high-risk network in Kano, NG.", time: "Oct 24, 09:44:20" },
    ],
    evidence: [
      { label: "Geo-Location", value: "Kano, Nigeria (IP: 102.88.14.12)" },
      { label: "Device Signature", value: "iPhone 14 Pro / iOS 17.4" },
      { label: "Frequency", value: "1st attempt today" },
      { label: "Avg Size", value: "NGN 240,000.00" },
      { label: "User Tenure", value: "4.2 years" },
    ],
    riskFactors: [
      { label: "Foreign IP Intelligence", points: "+45 pts" },
      { label: "Atypical High Value", points: "+30 pts" },
      { label: "Device ID Mismatch", points: "+19 pts" },
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
    destination: "High-Risk Merchant Node",
    status: "Review / Elevated",
    decision: "Escalated",
    linkedAlertId: "AL-99233",
    entityId: "E-9941-XJ72",
    auditTrail: [
      { id: "CA-11", title: "Consortium signal match", body: "Outbound beneficiary overlaps with previously reported mule account.", time: "Oct 23, 17:12:44" },
    ],
    evidence: [
      { label: "Consortium Match", value: "2 previous institutions" },
      { label: "Beneficiary", value: "Mainland Trade Hub Ltd" },
      { label: "Review Window", value: "72h" },
      { label: "Analyst Note", value: "Escalated to compliance" },
    ],
    riskFactors: [
      { label: "Consortium Match", points: "+32 pts" },
      { label: "Shared Device", points: "+21 pts" },
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
    destination: "Lagos Domestic Rail",
    status: "Open / High",
    decision: "Pending",
    linkedAlertId: "AL-99236",
    entityId: "E-7731-NG",
    auditTrail: [
      { id: "CA-21", title: "Device pattern variance detected", body: "Device fingerprint diverged from established profile baseline.", time: "Oct 24, 13:58:02" },
    ],
    evidence: [
      { label: "Device Signature", value: "Android SM-G991U" },
      { label: "Network Region", value: "Lagos, NG" },
      { label: "Transfer Count", value: "9 in 2h" },
      { label: "Beneficiary Age", value: "6 days" },
    ],
    riskFactors: [
      { label: "Device Pattern", points: "+34 pts" },
      { label: "Velocity Window", points: "+18 pts" },
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
    destination: "Port Harcourt, NG",
    status: "Escalated / Critical",
    decision: "Escalated",
    linkedAlertId: "AL-99235",
    entityId: "E-5531-LA",
    auditTrail: [
      { id: "CA-31", title: "Cross-border burst detected", body: "Three transfers routed across newly added beneficiary rail in 18 minutes.", time: "Oct 24, 13:55:18" },
    ],
    evidence: [
      { label: "Destination", value: "Port Harcourt, NG" },
      { label: "Rail Type", value: "NIP Transfer" },
      { label: "Burst Window", value: "18 minutes" },
      { label: "Prior Alerts", value: "2 related signals" },
    ],
    riskFactors: [
      { label: "Cross-Border Burst", points: "+39 pts" },
      { label: "New Beneficiary", points: "+17 pts" },
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
    destination: "Lagos, NG",
    status: "Open / Critical",
    decision: "Pending",
    linkedAlertId: "AL-99238",
    entityId: "E-9941-XJ72",
    auditTrail: [
      { id: "CA-41", title: "Velocity threshold exceeded", body: "Concurrent top-up attempts exceeded threshold by 3.1x.", time: "Oct 24, 14:02:11" },
    ],
    evidence: [
      { label: "Velocity", value: "11 tx in 7 min" },
      { label: "Geo-Location", value: "Lagos, NG" },
      { label: "Device ID", value: "EP-11-392-A" },
      { label: "Account Age", value: "14 months" },
    ],
    riskFactors: [
      { label: "Velocity Trigger", points: "+41 pts" },
      { label: "Session Overlap", points: "+16 pts" },
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
    destination: "Ibadan, NG",
    status: "Open / Elevated",
    decision: "Pending",
    linkedAlertId: "AL-99233",
    entityId: "E-2039-LON",
    auditTrail: [
      { id: "CA-51", title: "Consortium match surfaced", body: "Signal overlaps with shared merchant fingerprint cluster.", time: "Oct 24, 13:47:09" },
    ],
    evidence: [
      { label: "Signal", value: "Consortium Match" },
      { label: "Origin", value: "Ibadan, NG" },
      { label: "Merchant MCC", value: "5411" },
      { label: "Review Window", value: "24h" },
    ],
    riskFactors: [
      { label: "Consortium Match", points: "+35 pts" },
      { label: "Clustered Merchant", points: "+14 pts" },
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
  subtitle: "Operational performance and control effectiveness for Q3 FY24 audit.",
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
    "CBN AML/CFT guideline alignment - Q3 review completed, no material exceptions.",
    "NDPA data residency controls - validated for all domestic payment flows.",
    "Discreet CBN mandate memo filed: Enhanced monitoring threshold for high-risk transfers above NGN 5m.",
  ],
};

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
  { id: "AU-1", timestamp: "14:18:22", actor: "Analyst K. Balogun", detail: "Cleared case #8421." },
  { id: "AU-2", timestamp: "14:15:01", actor: "System", detail: "Rule R-102 modified by system." },
  { id: "AU-3", timestamp: "14:12:44", actor: "Reporting", detail: "Bulk export reporting job initiated." },
  { id: "AU-4", timestamp: "13:58:04", actor: "Sanctions Sync", detail: "Completed with no blocking exceptions." },
  { id: "AU-5", timestamp: "13:41:16", actor: "Operations", detail: "Queue severity threshold lifted for domestic corridor." },
];
