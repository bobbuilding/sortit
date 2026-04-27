export const treasuryTimeseries = [
  { id: "Treasury", color: "#00FF89", data: [
    { x: "Jan", y: 10200000 }, { x: "Feb", y: 11500000 }, { x: "Mar", y: 10800000 },
    { x: "Apr", y: 12100000 }, { x: "May", y: 11700000 }, { x: "Jun", y: 13400000 }, { x: "Jul", y: 14200000 },
  ]},
  { id: "Burn", color: "#FF6B6B", data: [
    { x: "Jan", y: 140000 }, { x: "Feb", y: 135000 }, { x: "Mar", y: 130000 },
    { x: "Apr", y: 128000 }, { x: "May", y: 126000 }, { x: "Jun", y: 124500 }, { x: "Jul", y: 124000 },
  ]},
];

export const assetAllocation = [
  { id: "Cash", label: "Cash & Equiv", value: 42, color: "#00FF89" },
  { id: "Fixed Income", label: "Fixed Income", value: 25, color: "#00C67A" },
  { id: "Equities", label: "Equities", value: 18, color: "#007A4A" },
  { id: "Crypto", label: "Crypto", value: 8, color: "#FFB800" },
  { id: "Real Assets", label: "Real Assets", value: 7, color: "#3D8B6E" },
];

export const burnByCategory = [
  { month: "Jan", Payroll: 90000, Infra: 20000, Marketing: 15000, Ops: 15000 },
  { month: "Feb", Payroll: 90000, Infra: 22000, Marketing: 12000, Ops: 11000 },
  { month: "Mar", Payroll: 90000, Infra: 19000, Marketing: 14000, Ops: 7000 },
  { month: "Apr", Payroll: 90000, Infra: 21000, Marketing: 10000, Ops: 7000 },
  { month: "May", Payroll: 90000, Infra: 20000, Marketing: 9000, Ops: 7000 },
  { month: "Jun", Payroll: 91000, Infra: 18000, Marketing: 9500, Ops: 6000 },
  { month: "Jul", Payroll: 92000, Infra: 17000, Marketing: 9000, Ops: 6000 },
];

export const sankeyData = {
  nodes: [
    { id: "Revenue" }, { id: "Funding" }, { id: "Payroll" },
    { id: "Infrastructure" }, { id: "Marketing" }, { id: "Operations" }, { id: "Retained" },
  ],
  links: [
    { source: "Revenue", target: "Payroll", value: 40000 },
    { source: "Revenue", target: "Infrastructure", value: 15000 },
    { source: "Revenue", target: "Retained", value: 25000 },
    { source: "Funding", target: "Payroll", value: 52000 },
    { source: "Funding", target: "Infrastructure", value: 5000 },
    { source: "Funding", target: "Marketing", value: 9500 },
    { source: "Funding", target: "Operations", value: 6000 },
  ],
};

export const nodes = [
  { id: "ND-774-ALPHA", name: "NODE_01", status: "ACTIVE", type: "Primary Treasury", liquidity: 14200000, yield: 3.4, risk: "LOW", lastSync: "2 mins ago" },
  { id: "ND-443-BETA",  name: "NODE_02", status: "ACTIVE", type: "Payroll Escrow",   liquidity: 620000,   yield: 0,   risk: "LOW", lastSync: "12 mins ago" },
  { id: "ND-891-GAMMA", name: "NODE_03", status: "MONITORING", type: "Growth Reserve", liquidity: 2100000, yield: 5.2, risk: "MEDIUM", lastSync: "1 hr ago" },
  { id: "ND-220-DELTA", name: "NODE_04", status: "IDLE", type: "Emergency Fund",    liquidity: 800000,   yield: 1.8, risk: "LOW", lastSync: "3 hrs ago" },
];

export const assets = [
  { id: "AST-001", name: "USD Stablecoin Reserve", category: "Cash",        value: 5964000, yield: 4.1, risk: "LOW",  custodian: "Fireblocks",     updated: "Live" },
  { id: "AST-002", name: "Series A SPV",           category: "Equity",      value: 2556000, yield: 0,   risk: "HIGH", custodian: "AngelList",      updated: "Daily" },
  { id: "AST-003", name: "T-Bill Portfolio",        category: "Fixed Income",value: 3550000, yield: 5.3, risk: "LOW",  custodian: "Mercury",        updated: "Live" },
  { id: "AST-004", name: "BTC Treasury Reserve",    category: "Crypto",      value: 1136000, yield: 0,   risk: "HIGH", custodian: "Coinbase Prime", updated: "Live" },
  { id: "AST-005", name: "Office Lease Deposit",    category: "Real Asset",  value: 994000,  yield: 0,   risk: "LOW",  custodian: "Self-Held",      updated: "Monthly" },
];

export const transactions = [
  { id: "TXN-8821", type: "INBOUND",  description: "Series A Tranche 2",  amount: 2000000,  status: "SETTLED", date: "2024-07-15", node: "ND-774-ALPHA" },
  { id: "TXN-8820", type: "OUTBOUND", description: "Q2 Payroll Batch",     amount: -382000,  status: "SETTLED", date: "2024-07-01", node: "ND-443-BETA" },
  { id: "TXN-8819", type: "INBOUND",  description: "T-Bill Yield Harvest", amount: 14200,    status: "SETTLED", date: "2024-06-30", node: "ND-891-GAMMA" },
  { id: "TXN-8818", type: "OUTBOUND", description: "AWS Infrastructure",   amount: -17400,   status: "SETTLED", date: "2024-06-28", node: "ND-774-ALPHA" },
  { id: "TXN-8817", type: "INBOUND",  description: "Customer Revenue",     amount: 45200,    status: "SETTLED", date: "2024-06-25", node: "ND-774-ALPHA" },
  { id: "TXN-8816", type: "OUTBOUND", description: "Marketing Spend",      amount: -9500,    status: "SETTLED", date: "2024-06-20", node: "ND-774-ALPHA" },
  { id: "TXN-8815", type: "OUTBOUND", description: "Legal & Compliance",   amount: -6200,    status: "PENDING", date: "2024-06-18", node: "ND-774-ALPHA" },
  { id: "TXN-8814", type: "INBOUND",  description: "Grant Disbursement",   amount: 100000,   status: "PENDING", date: "2024-06-15", node: "ND-220-DELTA" },
];
