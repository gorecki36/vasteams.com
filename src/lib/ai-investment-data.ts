// ─── Types ───────────────────────────────────────────────────────────────────

export type CycleKey =
  | "aiCapEx"
  | "nasdaq"
  | "crypto"
  | "railroad"
  | "dow1929"
  | "nikkei"
  | "electric"
  | "auto";

export type CycleDataPoint = { year: number } & {
  [K in CycleKey]?: number | null;
};

export interface StackLayer {
  id: string;
  name: string;
  level: number; // 1 = bottom (raw materials), 6 = top (applications)
  totalInvestment: string;
  crowding: "low" | "medium" | "high";
  insight: string;
  companies: {
    category: string;
    name: string;
    ticker?: string; // stock ticker if public/ETF
    access: "public" | "etf" | "private";
    via?: string; // how to invest if private
  }[];
  color: string; // tailwind border color
  highlight: boolean; // bottom layers get visual emphasis
  tagline: string; // always-visible one-liner under the name
  keyMetric: string; // standout number, always visible
  bottleneck: string; // what's hard about this layer
  timeline: string; // how long to solve
  whyItMatters: string; // thesis-level framing sentence
  stats: { label: string; value: string; source?: string }[]; // 2-3 mini stat cards
  indicatorIds?: string[]; // references into BOTTLENECK_INDICATORS
}

export interface CapExRevenuePoint {
  year: number;
  label: string;
  capEx: number; // $B
  revenue: number; // $B
}

export interface BottleneckIndicator {
  id: string;
  label: string;
  value: string;
  trend: string;
  unit: string;
  sparkline: number[];
  fredSeries?: string; // FRED series ID for data refresh
  lastUpdated: string; // YYYY-MM date of last data point
  framing: string;
}

// ─── Hero Stats ──────────────────────────────────────────────────────────────

export const HERO_STATS = [
  { value: "$690B", label: "2026 AI infra spend", sub: "projected" },
  { value: "10–20x", label: "CapEx-to-Revenue ratio", sub: "varies by scope" },
  { value: "128wk", label: "Transformer lead time", sub: "Wood Mackenzie" },
] as const;

// ─── Cycle Comparison Data ───────────────────────────────────────────────────
//
// All indexed to 100 at cycle start. Each tracks the velocity of a major
// investment/technology boom over its first ~8 years.
//
// MODERN CYCLES:
//   AI CapEx: Combined hyperscaler CapEx (AMZN+GOOG+MSFT+META).
//     Base: 2020 = $94.2B. Sources: DC Pulse, Platformonomics, earnings reports.
//   NASDAQ: FRED NASDAQCOM, Jan monthly values. Base: Jan 1995 = 758.
//   Crypto: Total market cap, Jan snapshots. Base: Jan 2017 ≈ $17.7B. CoinMarketCap.
//
// HISTORICAL CYCLES (all from FRED):
//   Railroad: Miles of railroad built/year. FRED A02F2AUSA374NNBR. Base: 1865 = 819.
//   Dow 1929: DJ Industrial Stock Price. FRED M1109BUSM293NNBR. Base: 1924 = 99.86.
//   Nikkei: Nikkei 225 annual avg. FRED NIKKEI225. Base: 1985 = 12,557.
//   Electrification: Electric power production. FRED M01128USM247NNBR. Base: 1919 = 3.23.
//   Auto: Factory auto production. FRED M0107AUSM543NNBR. Base: 1913 = 38.5.

export const CYCLE_DATA: CycleDataPoint[] = [
  { year: 0, aiCapEx: 100, nasdaq: 100, crypto: 100, railroad: 100, dow1929: 100, nikkei: 100, electric: 100, auto: 100 },
  { year: 1, aiCapEx: 135, nasdaq: 135, crypto: 4689, railroad: 171, dow1929: 134, nikkei: 131, electric: 112, auto: 118 },
  { year: 2, aiCapEx: 159, nasdaq: 177, crypto: 734, railroad: 310, dow1929: 153, nikkei: 185, electric: 106, auto: 194 },
  { year: 3, aiCapEx: 149, nasdaq: 207, crypto: 1073, railroad: 301, dow1929: 176, nikkei: 215, electric: 123, auto: 330 },
  { year: 4, aiCapEx: 267, nasdaq: 311, crypto: 4350, railroad: 501, dow1929: 227, nikkei: 271, electric: 144, auto: 378 },
  { year: 5, aiCapEx: 442, nasdaq: 529, crypto: 12429, railroad: 691, dow1929: 308, nikkei: 234, electric: 152, auto: 204 },
  { year: 6, aiCapEx: 733, nasdaq: 350, crypto: 4802, railroad: 813, dow1929: 236, nikkei: 194, electric: 170, auto: 359 },
  { year: 7, aiCapEx: null, nasdaq: 261, crypto: null, railroad: 908, dow1929: 138, nikkei: 144, electric: 190, auto: 412 },
  { year: 8, aiCapEx: null, nasdaq: 183, crypto: null, railroad: 637, dow1929: 64, nikkei: null, electric: 207, auto: 312 },
];

export interface CycleMeta {
  label: string;
  color: string;
  period: string;
  group: "modern" | "historical";
}

export const CYCLE_META: Record<CycleKey, CycleMeta> = {
  aiCapEx: {
    label: "AI CapEx (2020–2026)",
    color: "#3b82f6", // blue-500
    period: "AI infrastructure",
    group: "modern",
  },
  nasdaq: {
    label: "NASDAQ (1995–2003)",
    color: "#34d399", // emerald-400
    period: "Dot-com bubble",
    group: "modern",
  },
  crypto: {
    label: "Crypto (2017–2023)",
    color: "#f59e0b", // amber-500
    period: "Crypto boom-bust",
    group: "modern",
  },
  railroad: {
    label: "Railroad (1865–1873)",
    color: "#a78bfa", // violet-400
    period: "Railroad mania",
    group: "historical",
  },
  dow1929: {
    label: "Dow (1924–1932)",
    color: "#f43f5e", // rose-500
    period: "Roaring Twenties",
    group: "historical",
  },
  nikkei: {
    label: "Nikkei (1985–1992)",
    color: "#ec4899", // pink-500
    period: "Japan bubble",
    group: "historical",
  },
  electric: {
    label: "Electrification (1919–1927)",
    color: "#06b6d4", // cyan-500
    period: "Grid buildout",
    group: "historical",
  },
  auto: {
    label: "Auto (1913–1921)",
    color: "#fb923c", // orange-400
    period: "Auto boom",
    group: "historical",
  },
};

// ─── Investment Stack Data ───────────────────────────────────────────────────

export const STACK_LAYERS: StackLayer[] = [
  {
    id: "raw-materials",
    name: "Raw Materials",
    level: 1,
    totalInvestment: "Structural",
    crowding: "low",
    insight:
      "Copper demand +50% by 2040 (S&P Global, Jan 2026). Mines take 5–10 years to open. Can't be solved by software.",
    companies: [
      { category: "Copper Mining", name: "Freeport-McMoRan", ticker: "FCX", access: "public" },
      { category: "Rare Earths", name: "MP Materials", ticker: "MP", access: "public" },
      { category: "Uranium", name: "Cameco", ticker: "CCJ", access: "public" },
      { category: "Copper Basket", name: "Global X Copper Miners", ticker: "COPX", access: "etf" },
      { category: "Rare Earth Basket", name: "VanEck Rare Earth ETF", ticker: "REMX", access: "etf" },
    ],
    color: "border-emerald-500",
    highlight: true,
    indicatorIds: ["copper"],
    tagline: "The mines, metals, and minerals AI runs on",
    keyMetric: "Copper +115% since 2020",
    bottleneck: "5–10 year mine cycle — no software shortcut",
    timeline: "5–10 years to bring new supply online",
    whyItMatters:
      "Every cable, transformer, and server rack requires copper and rare earths. This is the slowest layer to respond to demand — and the most structurally underinvested.",
    stats: [
      { label: "Copper demand by 2040", value: "+50%", source: "S&P Global" },
      { label: "COPX ETF return (2025)", value: "+95.3%", source: "Global X" },
      { label: "Rare earth govt spending", value: "$12B", source: "U.S. DOE" },
    ],
  },
  {
    id: "power-energy",
    name: "Power & Energy",
    level: 2,
    totalInvestment: "Critical",
    crowding: "low",
    insight:
      "30% transformer shortfall (Wood Mackenzie). Lead times 128–144 weeks. Nuclear renaissance underway — Constellation signed a 20-year 1.1GW deal with Meta.",
    companies: [
      { category: "Grid Infrastructure", name: "Eaton", ticker: "ETN", access: "public" },
      { category: "Power Generation", name: "GE Vernova", ticker: "GEV", access: "public" },
      { category: "Nuclear", name: "Constellation Energy", ticker: "CEG", access: "public" },
      { category: "Utilities", name: "NextEra Energy", ticker: "NEE", access: "public" },
      { category: "Uranium Basket", name: "Sprott Uranium Miners", ticker: "URNM", access: "etf" },
    ],
    color: "border-emerald-500",
    highlight: true,
    indicatorIds: ["uranium", "electricity"],
    tagline: "The electricity that feeds every GPU cycle",
    keyMetric: "30% transformer shortfall",
    bottleneck: "128–144 week lead times — grid is maxed out",
    timeline: "2–3 years for new transformer capacity",
    whyItMatters:
      "You can't train or run AI without electricity. Transformer shortfalls and grid constraints are the hardest bottleneck in the stack — money alone can't solve it.",
    stats: [
      { label: "Transformer lead time", value: "128–144 wk", source: "Wood Mackenzie" },
      { label: "DC electricity demand by 2030", value: "2–3x", source: "IEA" },
      { label: "Nuclear deal (Meta + CEG)", value: "1.1 GW / 20 yr", source: "Constellation" },
    ],
  },
  {
    id: "data-centers",
    name: "Data Centers & Cooling",
    level: 3,
    totalInvestment: "$77.7B",
    crowding: "medium",
    insight:
      "$77.7B in construction starts (+190% YoY, ConstructConnect). Air cooling is practically impossible at 150kW/rack — liquid cooling market ($6.6B → $38.4B) growing 28.7% CAGR.",
    companies: [
      { category: "Cooling & Power", name: "Vertiv", ticker: "VRT", access: "public" },
      { category: "Liquid Cooling", name: "Modine", ticker: "MOD", access: "public" },
      { category: "Colocation", name: "Equinix", ticker: "EQIX", access: "public" },
      { category: "Wholesale DC", name: "Digital Realty", ticker: "DLR", access: "public" },
      { category: "DC Basket", name: "Global X Data Center ETF", ticker: "DTCR", access: "etf" },
    ],
    color: "border-emerald-400/60",
    highlight: true,
    tagline: "The buildings and thermal systems housing AI",
    keyMetric: "$77.7B construction starts",
    bottleneck: "Air cooling fails at 150 kW/rack — liquid cooling required",
    timeline: "18–24 months for new builds",
    whyItMatters:
      "AI compute density is outpacing the physical infrastructure that contains it. Cooling is the make-or-break constraint — the market is exploding from $6.6B to $38.4B.",
    stats: [
      { label: "Construction starts YoY", value: "+190%", source: "ConstructConnect" },
      { label: "Cooling market by 2033", value: "$38.4B", source: "Grand View" },
      { label: "Vertiv backlog", value: "$9.5B", source: "Vertiv Q4 2025" },
    ],
  },
  {
    id: "chips-silicon",
    name: "Chips & Silicon",
    level: 4,
    totalInvestment: "$54.6B HBM",
    crowding: "medium",
    insight:
      "Custom ASICs replacing NVIDIA — Broadcom holds ~70% share (TrendForce). HBM growing 58% YoY (BofA). CoWoS packaging is the bottleneck — TSMC scaling from 35K to 130K wafers/month.",
    companies: [
      { category: "GPUs", name: "NVIDIA", ticker: "NVDA", access: "public" },
      { category: "Custom ASICs", name: "Broadcom", ticker: "AVGO", access: "public" },
      { category: "HBM Memory", name: "Micron", ticker: "MU", access: "public" },
      { category: "Advanced Packaging", name: "TSMC", ticker: "TSM", access: "public" },
      { category: "Custom XPUs", name: "Marvell", ticker: "MRVL", access: "public" },
      { category: "Semiconductor Basket", name: "VanEck Semiconductor ETF", ticker: "SMH", access: "etf" },
    ],
    color: "border-zinc-600",
    highlight: false,
    indicatorIds: ["hbm"],
    tagline: "The processors and memory doing the thinking",
    keyMetric: "$54.6B HBM market",
    bottleneck: "CoWoS packaging — TSMC behind demand",
    timeline: "12–18 months to scale packaging capacity",
    whyItMatters:
      "Everyone knows about NVIDIA. The real constraint is advanced packaging — TSMC's CoWoS is the choke point that determines how many AI chips actually ship.",
    stats: [
      { label: "HBM market growth YoY", value: "+58%", source: "BofA" },
      { label: "Broadcom ASIC share", value: "~70%", source: "TrendForce" },
      { label: "TSMC CoWoS scaling", value: "35K→130K wafers/mo", source: "TSMC" },
    ],
  },
  {
    id: "models-platforms",
    name: "Models & Platforms",
    level: 5,
    totalInvestment: "Mostly private",
    crowding: "medium",
    insight:
      'Mostly private. The "wait for IPO" layer. OpenAI (~$730B, Bloomberg Feb 2026), Anthropic (~$380B, CNBC Feb 2026), and xAI/SpaceX (~$1.25T, CNBC Feb 2026) — collectively valued over $2T but still burning cash faster than they earn it.',
    companies: [
      { category: "Frontier Models", name: "OpenAI", access: "private", via: "ARK Venture (ARKVX), EquityZen" },
      { category: "Safety-First AI", name: "Anthropic", access: "private", via: "ARK Venture (ARKVX), Forge Global" },
      { category: "Infrastructure + AI", name: "xAI / SpaceX", access: "private", via: "Forge Global (FRGE)" },
      { category: "Research Lab", name: "Google DeepMind", access: "public", ticker: "GOOGL", via: "Part of Alphabet" },
      { category: "Private AI Basket", name: "ARK Venture Fund", ticker: "ARKVX", access: "etf", via: "Open to non-accredited, $500 min" },
    ],
    color: "border-zinc-700",
    highlight: false,
    tagline: "The foundation models and companies building them",
    keyMetric: ">$2T combined valuation",
    bottleneck: "Cash-negative, IPO timeline unclear",
    timeline: "IPOs expected 2026–2028",
    whyItMatters:
      "These companies are valued like tech giants but burn cash like startups. The gap between valuation and revenue is the defining risk of this layer.",
    stats: [
      { label: "OpenAI valuation", value: "~$730B", source: "Bloomberg Feb 2026" },
      { label: "Anthropic valuation", value: "~$380B", source: "CNBC Feb 2026" },
      { label: "AI revenue vs CapEx", value: "~16:1 gap", source: "Goldman Sachs" },
    ],
  },
  {
    id: "applications",
    name: "Applications",
    level: 6,
    totalInvestment: "Most crowded",
    crowding: "high",
    insight:
      "Most crowded, highest risk. Thousands of AI wrappers competing on thin margins. Where everyone is looking — and where most capital will be destroyed.",
    companies: [
      { category: "AI Search", name: "Perplexity", access: "private", via: "EquityZen, Forge Global" },
      { category: "AI Coding", name: "Cursor", access: "private" },
      { category: "AI Legal", name: "Harvey", access: "private" },
      { category: "AI Marketing", name: "Jasper", access: "private" },
      { category: "AI Creative", name: "Midjourney", access: "private" },
      { category: "Enterprise AI", name: "Glean", access: "private", via: "EquityZen" },
      { category: "Broad AI Basket", name: "Global X AI & Technology", ticker: "AIQ", access: "etf" },
      { category: "AI Infra Basket", name: "Tortoise AI Infrastructure", ticker: "TCAI", access: "etf" },
    ],
    color: "border-zinc-800",
    highlight: false,
    tagline: "The products end users actually touch",
    keyMetric: "Most crowded, highest risk",
    bottleneck: "Thin margins, low defensibility",
    timeline: "Constant churn — 6-month cycles",
    whyItMatters:
      "This is where most attention — and most capital destruction — happens. Thousands of wrappers, thin margins, and almost no moat. The dot-com Pets.com layer.",
    stats: [
      { label: "AI startups funded (2024)", value: "3,000+", source: "PitchBook" },
      { label: "Avg AI wrapper margin", value: "<20%", source: "Industry est." },
      { label: "CapEx-to-revenue ratio", value: "~16:1", source: "Goldman Sachs" },
    ],
  },
];

// ─── CapEx vs Revenue Data ───────────────────────────────────────────────────
//
// CapEx: Combined AMZN + GOOG + MSFT + META capital expenditure.
//   2020-2023: DC Pulse / public earnings. 2024: Platformonomics ($251B).
//   2025-2026: Analyst consensus (multiple sources).
//
// Revenue: Pure-play generative AI vendor revenue (OpenAI, Anthropic, etc.).
//   NOT total "AI market" which includes legacy enterprise AI.
//   2020-2022: negligible (pre-ChatGPT). 2023: OpenAI ~$2B + others.
//   2024: OpenAI ~$3.4B, Anthropic ~$900M, others. 2025-2026: Futurum ~$35B.
//   Note: These are estimates. The GAP is the story, not the exact revenue line.

export const CAPEX_REVENUE_DATA: CapExRevenuePoint[] = [
  { year: 2020, label: "2020", capEx: 94, revenue: 0.1 },
  { year: 2021, label: "2021", capEx: 127, revenue: 0.3 },
  { year: 2022, label: "2022", capEx: 150, revenue: 1 },
  { year: 2023, label: "2023", capEx: 141, revenue: 3 },
  { year: 2024, label: "2024", capEx: 251, revenue: 6 },
  { year: 2025, label: "2025", capEx: 416, revenue: 25 },
  { year: 2026, label: "2026", capEx: 690, revenue: 35 },
];

// ─── Bottleneck Indicators ───────────────────────────────────────────────────

// Copper, Uranium, Electricity: quarterly samples (Jan, Apr, Jul, Oct) 2020–2026.
// Fetched via scripts/fetch-bottleneck-data.ts from FRED (no API key needed).
//
// HBM: annual market size (sourced per-year, see comments).

export const BOTTLENECK_INDICATORS: BottleneckIndicator[] = [
  {
    id: "copper",
    label: "Copper Price",
    value: "$12,987/mt",
    trend: "+115% since 2020",
    unit: "$/metric ton",
    fredSeries: "PCOPPUSDM",
    lastUpdated: "2026-01",
    sparkline: [6031, 5058, 6372, 6714, 7972, 9325, 9451, 9829, 9782, 10174, 7545, 7651, 9007, 8809, 8477, 7941, 8351, 9446, 9385, 9534, 8977, 9173, 9771, 10740, 12987],
    framing: "Every cable, transformer, and data center needs copper. Mines take 5–10 years to open. (S&P Global)",
  },
  {
    id: "uranium",
    label: "Uranium Price",
    value: "$69.71/lb",
    trend: "+183% since 2020",
    unit: "$/lb",
    fredSeries: "PURANUSDM",
    lastUpdated: "2026-01",
    sparkline: [24.6, 30, 32.4, 29.6, 29.9, 29.8, 32.3, 38.5, 36.9, 48.7, 38.9, 41.3, 40.1, 41.8, 45.2, 57.6, 80.4, 71.6, 68.3, 66.5, 59, 52.7, 58.9, 64, 69.7],
    framing: "Nuclear renaissance. Constellation + Meta 20-year 1.1GW deal. BofA targets $130/lb by Q4 2026.",
  },
  {
    id: "electricity",
    label: "US Electricity Price",
    value: "19.2¢/kWh",
    trend: "+43% since 2020",
    unit: "cents/kWh",
    fredSeries: "APU000072610",
    lastUpdated: "2026-01",
    sparkline: [13.4, 13.3, 13.7, 13.5, 13.6, 13.9, 14.3, 14.2, 14.7, 15.1, 16.4, 16.6, 16.8, 16.5, 16.9, 16.9, 17.3, 17.3, 17.8, 17.7, 17.9, 18.1, 18.9, 19.2],
    framing: "Data center electricity demand projected 2–3x by 2030. (IEA, Goldman Sachs)",
  },
  {
    id: "hbm",
    label: "HBM Memory Market",
    value: "$54.6B",
    trend: "+58% YoY",
    unit: "$B/year",
    lastUpdated: "2026 (proj)",
    // Annual data: 2020-2021 est. (<$1B niche), 2022 Gartner, 2023 industry,
    // 2024 Yole $17B, 2025 Yole $34B proj, 2026 BofA $54.6B proj
    sparkline: [0.5, 0.7, 1.1, 4, 17, 34, 54.6],
    framing: "Only 2 major suppliers: SK Hynix (~62%) and Micron (~21%) as of Q2 2025. Packaging is the real constraint.",
  },
];

// ─── Sources ─────────────────────────────────────────────────────────────────

export const SOURCES = [
  { label: "FRED — NASDAQ Composite", url: "https://fred.stlouisfed.org/series/NASDAQCOM" },
  { label: "FRED — Railroad Miles Built", url: "https://fred.stlouisfed.org/series/A02F2AUSA374NNBR" },
  { label: "FRED — Dow Jones 1920s", url: "https://fred.stlouisfed.org/series/M1109BUSM293NNBR" },
  { label: "FRED — Nikkei 225", url: "https://fred.stlouisfed.org/series/NIKKEI225" },
  { label: "FRED — Electric Power Production", url: "https://fred.stlouisfed.org/series/M01128USM247NNBR" },
  { label: "FRED — Auto Factory Production", url: "https://fred.stlouisfed.org/series/M0107AUSM543NNBR" },
  { label: "FRED — Copper Price", url: "https://fred.stlouisfed.org/series/PCOPPUSDM" },
  { label: "FRED — Uranium Price", url: "https://fred.stlouisfed.org/series/PURANUSDM" },
  { label: "FRED — US Electricity Price", url: "https://fred.stlouisfed.org/series/APU000072610" },
  { label: "CoinMarketCap — Crypto Market Cap", url: null },
  { label: "Platformonomics — Hyperscaler CapEx", url: "https://platformonomics.com/2025/02/follow-the-capex-cloud-table-stakes-2024-retrospective/" },
  { label: "DC Pulse — CapEx 2020–2023", url: null },
  { label: "Futurum — AI CapEx 2026", url: "https://futurumgroup.com/insights/ai-capex-2026-the-690b-infrastructure-sprint/" },
  { label: "Yole Group — HBM Market", url: null },
  { label: "BofA — HBM & Uranium Forecasts", url: null },
  { label: "Wood Mackenzie — Transformer Supply", url: null },
  { label: "Bloomberg, CNBC — Valuations (Feb 2026)", url: null },
] as const;
