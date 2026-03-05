export type BenchmarkId =
  | "mmlu_pro"
  | "math_500"
  | "gpqa"
  | "ifbench"
  | "livecodebench"
  | "terminalbench_hard"
  | "tau2"
  | "lcr"
  | "scicode";

export type CapabilityLayer = "prompt" | "agentic";

export interface CapabilityDefinition {
  id: string;
  name: string;
  shortName: string;
  layer: CapabilityLayer;
  benchmark: BenchmarkId;
  whatItTests: string;
  marketingApplication: string;
}

export interface CapabilityScore {
  id: string;
  name: string;
  shortName: string;
  layer: CapabilityLayer;
  score: number;
  bestModel: string;
  benchmark: string;
  whatItTests: string;
  marketingApplication: string;
}

export interface BenchmarkData {
  prompt: CapabilityScore[];
  agentic: CapabilityScore[];
  bestOverall: { name: string; score: number };
  updatedAt: string;
  sources: string[];
  mock?: boolean;
  cached?: boolean;
  stale?: boolean;
}

export interface RawModelBenchmarks {
  name: string;
  provider: string;
  benchmarks: Partial<Record<BenchmarkId, number>>;
}

// --- Prompt-Level Capabilities ---
// Single-turn accuracy benchmarks. Can AI produce the right output when asked?

export const PROMPT_CAPABILITIES: CapabilityDefinition[] = [
  {
    id: "knowledge",
    name: "Knowledge & Research",
    shortName: "Knowledge",
    layer: "prompt",
    benchmark: "mmlu_pro",
    whatItTests: "Accuracy across 57 professional domains",
    marketingApplication: "Market research, competitive intel, cross-industry insight",
  },
  {
    id: "quant_analysis",
    name: "Quantitative Analysis",
    shortName: "Quant",
    layer: "prompt",
    benchmark: "math_500",
    whatItTests: "Complex mathematical problem-solving",
    marketingApplication: "Attribution modeling, forecasting, budget optimization",
  },
  {
    id: "expert_reasoning",
    name: "Expert Reasoning",
    shortName: "Reasoning",
    layer: "prompt",
    benchmark: "gpqa",
    whatItTests: "PhD-level science & expert questions",
    marketingApplication: "Deep analysis requiring specialized domain knowledge",
  },
  {
    id: "instruction_following",
    name: "Instruction Following",
    shortName: "Instructions",
    layer: "prompt",
    benchmark: "ifbench",
    whatItTests: "Following multi-constraint instructions precisely",
    marketingApplication: "Brief execution, brand guidelines, format compliance",
  },
  {
    id: "code_generation",
    name: "Code Generation",
    shortName: "Code Gen",
    layer: "prompt",
    benchmark: "livecodebench",
    whatItTests: "Solving real-world programming problems",
    marketingApplication: "Martech setup, workflow scripting, data pipelines",
  },
];

// --- Agentic Capabilities ---
// Multi-step, tool-using, autonomous task execution.

export const AGENTIC_CAPABILITIES: CapabilityDefinition[] = [
  {
    id: "autonomous_coding",
    name: "Autonomous Coding",
    shortName: "Auto Code",
    layer: "agentic",
    benchmark: "terminalbench_hard",
    whatItTests: "End-to-end terminal tasks: compile, deploy, debug",
    marketingApplication: "Building martech integrations, deploying campaigns autonomously",
  },
  {
    id: "customer_interaction",
    name: "Customer Interaction",
    shortName: "Customer",
    layer: "agentic",
    benchmark: "tau2",
    whatItTests: "Multi-turn conversation guiding users through tasks using tools",
    marketingApplication: "Customer service, sales enablement, interactive support",
  },
  {
    id: "long_form_analysis",
    name: "Long-Form Analysis",
    shortName: "Long Analysis",
    layer: "agentic",
    benchmark: "lcr",
    whatItTests: "Reasoning over 10k-100k token documents",
    marketingApplication: "Analyzing briefs, contracts, research reports, competitive docs",
  },
  {
    id: "research_solving",
    name: "Research & Problem Solving",
    shortName: "Research",
    layer: "agentic",
    benchmark: "scicode",
    whatItTests: "End-to-end scientific coding research problems",
    marketingApplication: "Complex analytical projects requiring multi-step investigation",
  },
];

export const ALL_CAPABILITIES: CapabilityDefinition[] = [
  ...PROMPT_CAPABILITIES,
  ...AGENTIC_CAPABILITIES,
];

/** Get the best raw score (%) for a single benchmark across all models */
export function bestScoreForBenchmark(
  models: RawModelBenchmarks[],
  benchmarkId: BenchmarkId
): { score: number; model: string } {
  let best = 0;
  let bestModel = "Unknown";
  for (const m of models) {
    const val = m.benchmarks[benchmarkId];
    if (val != null && val > best) {
      best = val;
      bestModel = m.name;
    }
  }
  return { score: Math.round(best), model: bestModel };
}

/** Mock data for when no API keys are configured */
export const MOCK_DATA: BenchmarkData = {
  prompt: [
    { id: "knowledge", name: "Knowledge & Research", shortName: "Knowledge", layer: "prompt", score: 87, bestModel: "Gemini 2.5 Pro", benchmark: "MMLU-Pro", whatItTests: "Accuracy across 57 professional domains", marketingApplication: "Market research, competitive intel, cross-industry insight" },
    { id: "quant_analysis", name: "Quantitative Analysis", shortName: "Quant", layer: "prompt", score: 95, bestModel: "o3", benchmark: "MATH-500", whatItTests: "Complex mathematical problem-solving", marketingApplication: "Attribution modeling, forecasting, budget optimization" },
    { id: "expert_reasoning", name: "Expert Reasoning", shortName: "Reasoning", layer: "prompt", score: 90, bestModel: "Gemini 2.5 Pro", benchmark: "GPQA Diamond", whatItTests: "PhD-level science & expert questions", marketingApplication: "Deep analysis requiring specialized domain knowledge" },
    { id: "instruction_following", name: "Instruction Following", shortName: "Instructions", layer: "prompt", score: 77, bestModel: "Claude Opus 4.6", benchmark: "IFBench", whatItTests: "Following multi-constraint instructions precisely", marketingApplication: "Brief execution, brand guidelines, format compliance" },
    { id: "code_generation", name: "Code Generation", shortName: "Code Gen", layer: "prompt", score: 89, bestModel: "Claude Opus 4.6", benchmark: "LiveCodeBench", whatItTests: "Solving real-world programming problems", marketingApplication: "Martech setup, workflow scripting, data pipelines" },
  ],
  agentic: [
    { id: "autonomous_coding", name: "Autonomous Coding", shortName: "Auto Code", layer: "agentic", score: 47, bestModel: "Claude Opus 4.6", benchmark: "TerminalBench Hard", whatItTests: "End-to-end terminal tasks: compile, deploy, debug", marketingApplication: "Building martech integrations, deploying campaigns autonomously" },
    { id: "customer_interaction", name: "Customer Interaction", shortName: "Customer", layer: "agentic", score: 87, bestModel: "Claude Opus 4.6", benchmark: "t2-bench", whatItTests: "Multi-turn conversation guiding users through tasks using tools", marketingApplication: "Customer service, sales enablement, interactive support" },
    { id: "long_form_analysis", name: "Long-Form Analysis", shortName: "Long Analysis", layer: "agentic", score: 72, bestModel: "Gemini 2.5 Pro", benchmark: "LCR", whatItTests: "Reasoning over 10k-100k token documents", marketingApplication: "Analyzing briefs, contracts, research reports, competitive docs" },
    { id: "research_solving", name: "Research & Problem Solving", shortName: "Research", layer: "agentic", score: 53, bestModel: "o3", benchmark: "SciCode", whatItTests: "End-to-end scientific coding research problems", marketingApplication: "Complex analytical projects requiring multi-step investigation" },
  ],
  bestOverall: { name: "Claude Opus 4.6", score: 78 },
  updatedAt: new Date().toISOString(),
  sources: ["mock"],
};
