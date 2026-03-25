import {
  PROMPT_CAPABILITIES,
  AGENTIC_CAPABILITIES,
  ALL_CAPABILITIES,
  type CapabilityScore,
  type BenchmarkId,
} from "./ai-benchmarks";

export type CapabilityWeight = "high" | "medium" | "low";

export interface RoleDefinition {
  id: string;
  name: string;
  shortName: string;
  weights: Record<string, CapabilityWeight>;
}

/** Relevance weights — how much of this skill does the role actually need? */
export const RELEVANCE: Record<CapabilityWeight, number> = {
  high: 0.9,
  medium: 0.5,
  low: 0.2,
};

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
