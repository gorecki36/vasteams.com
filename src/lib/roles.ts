import {
  PROMPT_CAPABILITIES,
  AGENTIC_CAPABILITIES,
  type CapabilityScore,
} from "./ai-benchmarks";

export type CapabilityWeight = "high" | "medium" | "low";

export interface RoleDefinition {
  id: string;
  name: string;
  shortName: string;
  weights: Record<string, CapabilityWeight>;
}

const WEIGHT_MULTIPLIERS: Record<CapabilityWeight, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const ROLES: RoleDefinition[] = [
  {
    id: "cmo",
    name: "CMO",
    shortName: "CMO",
    weights: {
      // Prompt
      knowledge: "high",
      quant_analysis: "medium",
      expert_reasoning: "high",
      instruction_following: "medium",
      code_generation: "low",
      // Agentic
      autonomous_coding: "low",
      customer_interaction: "high",
      long_form_analysis: "medium",
      research_solving: "low",
    },
  },
  {
    id: "performance",
    name: "Performance Marketer",
    shortName: "Performance",
    weights: {
      knowledge: "low",
      quant_analysis: "high",
      expert_reasoning: "medium",
      instruction_following: "medium",
      code_generation: "high",
      autonomous_coding: "high",
      customer_interaction: "low",
      long_form_analysis: "low",
      research_solving: "medium",
    },
  },
  {
    id: "content_creator",
    name: "Content Creator",
    shortName: "Content",
    weights: {
      knowledge: "high",
      quant_analysis: "low",
      expert_reasoning: "low",
      instruction_following: "high",
      code_generation: "low",
      autonomous_coding: "low",
      customer_interaction: "high",
      long_form_analysis: "medium",
      research_solving: "low",
    },
  },
  {
    id: "brand",
    name: "Brand Strategist",
    shortName: "Brand",
    weights: {
      knowledge: "high",
      quant_analysis: "low",
      expert_reasoning: "high",
      instruction_following: "medium",
      code_generation: "low",
      autonomous_coding: "low",
      customer_interaction: "medium",
      long_form_analysis: "high",
      research_solving: "low",
    },
  },
  {
    id: "growth",
    name: "Growth Engineer",
    shortName: "Growth",
    weights: {
      knowledge: "low",
      quant_analysis: "high",
      expert_reasoning: "medium",
      instruction_following: "low",
      code_generation: "high",
      autonomous_coding: "high",
      customer_interaction: "low",
      long_form_analysis: "low",
      research_solving: "medium",
    },
  },
  {
    id: "analyst",
    name: "Marketing Analyst",
    shortName: "Analyst",
    weights: {
      knowledge: "low",
      quant_analysis: "high",
      expert_reasoning: "medium",
      instruction_following: "low",
      code_generation: "medium",
      autonomous_coding: "low",
      customer_interaction: "low",
      long_form_analysis: "high",
      research_solving: "high",
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
    const multiplier = WEIGHT_MULTIPLIERS[weight];
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
    const multiplier = WEIGHT_MULTIPLIERS[weight];
    weightedSum += cap.score * multiplier;
    totalWeight += multiplier;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}
