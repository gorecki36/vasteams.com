import {
  PROMPT_CAPABILITIES,
  AGENTIC_CAPABILITIES,
  ALL_CAPABILITIES,
  type CapabilityScore,
  type BenchmarkId,
} from "./ai-benchmarks";

// ===========================================
// Job tasks (user-facing) — map to underlying AI benchmarks
// These are the 6 tasks marketers actually recognize as their work.
// Each task's benchmarkWeights specify how its score decomposes into LLM benchmarks.
// benchmarkWeights do NOT have to sum to 1; they represent relative influence.
// ===========================================

export interface JobTask {
  id: string;
  name: string;
  shortName: string;
  description: string;
  benchmarkWeights: Record<string, number>;
}

export const JOB_TASKS: JobTask[] = [
  {
    id: "research",
    name: "Research",
    shortName: "Research",
    description: "Find information, validate sources, understand context and market",
    // Broad-domain knowledge recall + multi-step investigation over tools
    benchmarkWeights: { knowledge: 0.6, research_solving: 0.4 },
  },
  {
    id: "analyze",
    name: "Analyze",
    shortName: "Analyze",
    description: "Data, numbers, attribution, metrics, reporting",
    // Quantitative / mathematical reasoning
    benchmarkWeights: { quant_analysis: 1.0 },
  },
  {
    id: "think",
    name: "Think & decide",
    shortName: "Think",
    description: "Strategy, trade-offs, judgment, reasoning",
    // Expert-level reasoning + sustained reasoning over long context
    benchmarkWeights: { expert_reasoning: 0.7, long_form_analysis: 0.3 },
  },
  {
    id: "write",
    name: "Write",
    shortName: "Write",
    description: "Emails, copy, briefs, long-form content, decks",
    // Long-form generation + following multi-constraint instructions (briefs, brand guidelines)
    benchmarkWeights: { long_form_analysis: 0.55, instruction_following: 0.45 },
  },
  {
    id: "summarize",
    name: "Summarize",
    shortName: "Summarize",
    description: "Compress sources, extract key points, build slide takeaways",
    // Long-context compression + broad knowledge to contextualize
    benchmarkWeights: { long_form_analysis: 0.75, knowledge: 0.25 },
  },
  {
    id: "organize",
    name: "Organize & coordinate",
    shortName: "Organize",
    description: "Project management, repetitive tasks, meeting logistics, workflows",
    // Following multi-step instructions + multi-turn tool use (agents) + research coordination
    benchmarkWeights: { instruction_following: 0.5, customer_interaction: 0.3, research_solving: 0.2 },
  },
];

/** Convert user's task weights (0-100 per task) into benchmark weights for readiness calc */
export function tasksToBenchmarkWeights(
  taskWeights: Record<string, number>
): NumericWeights {
  const bw: NumericWeights = {};
  for (const cap of ALL_CAPABILITIES) {
    bw[cap.id] = 0;
  }
  for (const task of JOB_TASKS) {
    const tw = taskWeights[task.id] ?? 0;
    for (const [benchmarkId, benchmarkWeight] of Object.entries(task.benchmarkWeights)) {
      bw[benchmarkId] = (bw[benchmarkId] ?? 0) + tw * benchmarkWeight;
    }
  }
  return bw;
}

export type CapabilityWeight = "high" | "medium" | "low";

export interface RoleDefinition {
  id: string;
  name: string;
  shortName: string;
  weights: Record<string, CapabilityWeight>;
}

/** Numeric weights (0-100) — for slider-driven profiles */
export type NumericWeights = Record<string, number>;

/** Relevance weights — how much of this skill does the role actually need? */
export const RELEVANCE: Record<CapabilityWeight, number> = {
  high: 0.9,
  medium: 0.5,
  low: 0.2,
};

/** Convert categorical weight to numeric (0-100) */
export function weightToNumeric(w: CapabilityWeight): number {
  if (w === "high") return 90;
  if (w === "medium") return 50;
  return 20;
}

/** Convert numeric weight back to categorical bucket (for rendering existing components) */
export function numericToWeight(n: number): CapabilityWeight {
  if (n >= 70) return "high";
  if (n >= 35) return "medium";
  return "low";
}

/** Build a synthetic RoleDefinition from numeric weights (for downstream components) */
export function roleFromNumericWeights(
  id: string,
  name: string,
  shortName: string,
  weights: NumericWeights
): RoleDefinition {
  const categorical: Record<string, CapabilityWeight> = {};
  for (const capId of Object.keys(weights)) {
    categorical[capId] = numericToWeight(weights[capId]);
  }
  return { id, name, shortName, weights: categorical };
}

// Weights validated against: McKinsey State of AI 2025, Gartner Marketing Trends 2026,
// AMA Marketing Competency Model, ANA Capabilities Framework, LinkedIn Skills data,
// Teal/PostHog/Improvado role frameworks, ALM Corp 2026 job posting analysis.
// See: analysis/role-weight-sources.md for full citations.

export const ROLES: RoleDefinition[] = [
  {
    id: "cmo",
    name: "CMO",
    shortName: "CMO",
    weights: {
      knowledge: "high",         // Competitive intel, market sensing, board-level briefings
      quant_analysis: "high",    // Revenue accountability, attribution, ROI forecasting (IDC 2025: top-3 CMO competency)
      expert_reasoning: "high",  // Pricing, segmentation, brand econometrics, strategic trade-offs
      instruction_following: "low", // CMOs set briefs, they don't follow them
      code_generation: "low",    // Orchestrate technical teams, rarely write code
      autonomous_coding: "low",  // Evaluate martech investments, not implement them
      customer_interaction: "medium", // Executive-level customer/partner relationships, not day-to-day service
      long_form_analysis: "high", // Contracts, board decks, analyst reports, M&A materials, AI governance docs
      research_solving: "high",  // Market entry analysis, competitive response, brand architecture investigations
    },
  },
  {
    id: "performance",
    name: "Performance Marketer",
    shortName: "Performance",
    weights: {
      knowledge: "medium",       // Platform-specific knowledge (Google, Meta, programmatic), competitive benchmarking
      quant_analysis: "high",    // CTR, ROAS, attribution, incrementality testing — the defining skill
      expert_reasoning: "medium", // Auction mechanics, bidding algorithms, measurement methodology
      instruction_following: "high", // Execute against briefs, brand guidelines, compliance, platform policies
      code_generation: "medium", // Tracking pixels, GTM, basic SQL/Python, API integrations
      autonomous_coding: "low",  // Hands off complex integrations to engineering
      customer_interaction: "low", // Optimizes ads, not conversations
      long_form_analysis: "medium", // Campaign post-mortems, quarterly reviews, media plans
      research_solving: "high",  // Diagnosing performance drops, running experiments, debugging attribution
    },
  },
  {
    id: "content_creator",
    name: "Content Creator",
    shortName: "Content",
    weights: {
      knowledge: "high",         // Topic research, SEO research, audience research, subject matter expertise
      quant_analysis: "medium",  // Content analytics, engagement, SEO rankings, conversion (36-40% of job postings)
      expert_reasoning: "low",   // Synthesize and translate expertise, rarely perform original PhD-level analysis
      instruction_following: "high", // Brand voice guides, editorial calendars, content briefs, SEO specs
      code_generation: "low",    // Basic HTML/CMS only, ~13% of postings mention code-adjacent skills
      autonomous_coding: "low",  // Not expected to build or deploy software
      customer_interaction: "medium", // Community management, social engagement, comment responses
      long_form_analysis: "medium", // Synthesizing long source docs into content, whitepapers, thought leadership
      research_solving: "high",  // Finding sources, validating claims, competitive content analysis, gap analysis
    },
  },
  {
    id: "brand",
    name: "Brand Strategist",
    shortName: "Brand",
    weights: {
      knowledge: "high",         // Competitive intel, cultural trends, consumer behavior, category dynamics
      quant_analysis: "medium",  // Brand tracking, sentiment analysis, market sizing — secondary to qualitative
      expert_reasoning: "high",  // Positioning frameworks, brand architecture, portfolio strategy
      instruction_following: "medium", // Follows org strategy but also creates guidelines — more creator than follower
      code_generation: "low",    // No coding expectations in any job posting reviewed
      autonomous_coding: "low",  // Not applicable to the role
      customer_interaction: "medium", // Consumer research interviews, focus groups, stakeholder workshops
      long_form_analysis: "high", // Brand audits, competitive audits, strategy decks, research reports
      research_solving: "high",  // Competitive analysis, consumer insight mining, strategic problem framing
    },
  },
  {
    id: "growth",
    name: "Growth Engineer",
    shortName: "Growth",
    weights: {
      knowledge: "medium",       // Working knowledge of acquisition channels, product mechanics, growth levers
      quant_analysis: "high",    // A/B testing, funnel analysis, statistical significance, LTV modeling
      expert_reasoning: "medium", // Experimentation methodology, growth frameworks — applied not theoretical
      instruction_following: "medium", // Follows experiment briefs/product specs, also designs experiments autonomously
      code_generation: "high",   // Python, JS, SQL baseline — builds tracking, landing pages, data pipelines
      autonomous_coding: "high", // Distinguishing trait: end-to-end implementation, deploy, debug, iterate
      customer_interaction: "low", // Optimizes user flows, rarely interacts with customers directly
      long_form_analysis: "low", // Produces experiment summaries, not lengthy strategic documents
      research_solving: "high",  // Multi-step debugging, hypothesis generation, funnel diagnosis
    },
  },
  {
    id: "analyst",
    name: "Marketing Analyst",
    shortName: "Analyst",
    weights: {
      knowledge: "medium",       // Marketing domain knowledge to contextualize data
      quant_analysis: "high",    // SQL, Python/R, statistical modeling, attribution — in 100% of job descriptions
      expert_reasoning: "high",  // MMM, econometric analysis, advanced statistics, causal inference
      instruction_following: "medium", // Follows reporting requirements, also proactively surfaces insights
      code_generation: "high",   // SQL and Python/R are "must-have" — queries, transforms, automated reports
      autonomous_coding: "medium", // Builds data pipelines and automated reporting within existing infra
      customer_interaction: "low", // Analyzes customer data, does not interact with customers
      long_form_analysis: "high", // QBRs, deep-dive analyses, attribution reports, market research summaries
      research_solving: "high",  // Diagnosing performance issues, building models, validating hypotheses
    },
  },
];

// ===========================================
// Seniority-level profiles (role-agnostic) — numeric weights 0-100 for slider UI
// Weight shifts reflect task mix at each career level.
// Sources: Stanford AI Index 2026 (age/employment data), BCG 2022/2026 (manager task exposure),
// O*NET 11-2021 (marketing manager task profile), AMA Marketing Competency Model,
// ANA Capabilities Framework, LinkedIn Skills data by tenure.
// ===========================================

export interface SeniorityLevel {
  id: string;
  name: string;
  shortName: string;
  /** Task weights 0-100 across the 6 job tasks */
  taskWeights: Record<string, number>;
}

export const SENIORITY_LEVELS: SeniorityLevel[] = [
  {
    id: "entry",
    name: "Entry-level (0-1 yr)",
    shortName: "Entry",
    // Heavy on execution, coordination, writing under guidance. Light on strategic thinking.
    taskWeights: {
      research: 40, analyze: 50, think: 20, write: 65, summarize: 45, organize: 75,
    },
  },
  {
    id: "junior",
    name: "Junior (1-3 yr)",
    shortName: "Junior",
    // Bulk of daily work: analysis + writing. Starting to organize small projects.
    taskWeights: {
      research: 55, analyze: 80, think: 30, write: 70, summarize: 55, organize: 60,
    },
  },
  {
    id: "mid",
    name: "Mid (3-6 yr, Manager)",
    shortName: "Mid",
    // Balanced: research, analyze, write all substantial. Starting to strategize.
    taskWeights: {
      research: 65, analyze: 75, think: 60, write: 75, summarize: 65, organize: 60,
    },
  },
  {
    id: "senior",
    name: "Senior (6-10 yr, Sr Mgr/Director)",
    shortName: "Senior",
    // Shifted to strategy + judgment. Still writes a lot but less analysis hands-on.
    taskWeights: {
      research: 70, analyze: 45, think: 85, write: 75, summarize: 70, organize: 50,
    },
  },
  {
    id: "very_senior",
    name: "Very Senior (10+ yr, VP/C-suite)",
    shortName: "Very Senior",
    // Strategy-dominant, delegates coordination and detailed analysis.
    taskWeights: {
      research: 65, analyze: 35, think: 90, write: 70, summarize: 60, organize: 30,
    },
  },
];

/** Role templates in task-weight form (quick-start for common marketing specializations) */
export const ROLE_TASK_PROFILES: Record<string, Record<string, number>> = {
  cmo:             { research: 75, analyze: 60, think: 90, write: 80, summarize: 65, organize: 50 },
  performance:     { research: 60, analyze: 90, think: 60, write: 55, summarize: 50, organize: 60 },
  content_creator: { research: 80, analyze: 40, think: 55, write: 90, summarize: 75, organize: 45 },
  brand:           { research: 85, analyze: 45, think: 85, write: 75, summarize: 65, organize: 45 },
  growth:          { research: 55, analyze: 85, think: 60, write: 55, summarize: 45, organize: 55 },
  analyst:         { research: 70, analyze: 95, think: 75, write: 65, summarize: 65, organize: 40 },
};

// Technical share of daily work by seniority (for Career Exposure calculation)
// Sources: O*NET task profiles, AMA/ANA competency frameworks, BCG 2022 (10/20/70 rule flipped by level)
export const TECHNICAL_SHARE: Record<string, number> = {
  entry: 70,         // Most daily work is technical / executable tasks
  junior: 55,
  mid: 40,           // Starting to balance execution with people/strategy
  senior: 22,        // Mostly leadership, relationships, judgment
  very_senior: 12,   // Strategic judgment, stakeholder management dominate
};

/** Compute readiness from numeric weights directly */
export function computeReadinessFromWeights(
  weights: NumericWeights,
  scores: CapabilityScore[]
): number {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const cap of scores) {
    const w = weights[cap.id];
    if (w == null) continue;
    const mult = w / 100;
    weightedSum += cap.score * mult;
    totalWeight += mult;
  }
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

export function computeLayerReadinessFromWeights(
  weights: NumericWeights,
  scores: CapabilityScore[],
  layer: "prompt" | "agentic"
): number {
  const layerCapIds =
    layer === "prompt"
      ? PROMPT_CAPABILITIES.map((c) => c.id)
      : AGENTIC_CAPABILITIES.map((c) => c.id);
  let totalWeight = 0;
  let weightedSum = 0;
  for (const capId of layerCapIds) {
    const w = weights[capId];
    if (w == null) continue;
    const mult = w / 100;
    const capScore = scores.find((s) => s.id === capId);
    weightedSum += (capScore?.score ?? 0) * mult;
    totalWeight += mult;
  }
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/** Compute weighted readiness for a specific layer */
export function computeLayerReadiness(
  role: RoleDefinition,
  scores: CapabilityScore[],
  layer: "prompt" | "agentic"
): number {
  const layerCapIds =
    layer === "prompt"
      ? PROMPT_CAPABILITIES.map((c) => c.id)
      : AGENTIC_CAPABILITIES.map((c) => c.id);

  let totalWeight = 0;
  let weightedSum = 0;

  for (const capId of layerCapIds) {
    const weight = role.weights[capId];
    if (!weight) continue;
    const multiplier = RELEVANCE[weight];
    const capScore = scores.find((s) => s.id === capId);
    weightedSum += (capScore?.score ?? 0) * multiplier;
    totalWeight += multiplier;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/** Compute overall weighted readiness across both layers */
export function computeReadiness(
  role: RoleDefinition,
  scores: CapabilityScore[]
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const cap of scores) {
    const weight = role.weights[cap.id];
    if (!weight) continue;
    const multiplier = RELEVANCE[weight];
    weightedSum += cap.score * multiplier;
    totalWeight += multiplier;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/**
 * Compute readiness from a raw benchmark map (used by timeline history points).
 * Missing benchmarks are filled with the average of available ones so that
 * readiness reflects model improvement, not benchmark availability.
 */
export function computeReadinessFromBenchmarks(
  role: RoleDefinition,
  benchmarks: Partial<Record<BenchmarkId, number>>
): number {
  // Compute average of available benchmarks for extrapolation
  const available = ALL_CAPABILITIES
    .map((cap) => benchmarks[cap.benchmark])
    .filter((v): v is number => v != null);
  const avgScore = available.length > 0
    ? available.reduce((a, b) => a + b, 0) / available.length
    : 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (const cap of ALL_CAPABILITIES) {
    const weight = role.weights[cap.id];
    if (!weight) continue;
    const multiplier = RELEVANCE[weight];
    const score = benchmarks[cap.benchmark] ?? avgScore;
    weightedSum += score * multiplier;
    totalWeight += multiplier;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}
