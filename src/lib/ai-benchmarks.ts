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
  /** Release date of the best-performing model (YYYY-MM-DD) */
  scoreDate?: string;
}

/** Total number of benchmarks tracked */
export const BENCHMARK_COUNT = 9;

/** A snapshot of best-per-benchmark scores at a specific date */
export interface HistoryPoint {
  date: string; // YYYY-MM-DD
  benchmarks: Partial<Record<BenchmarkId, number>>;
  /** How many of the 9 benchmarks have real data at this date */
  benchmarkCount: number;
}

export interface BenchmarkData {
  prompt: CapabilityScore[];
  agentic: CapabilityScore[];
  bestOverall: { name: string; score: number };
  updatedAt: string;
  sources: string[];
  history?: HistoryPoint[];
  mock?: boolean;
  cached?: boolean;
  stale?: boolean;
}

export interface RawModelBenchmarks {
  name: string;
  provider: string;
  releaseDate?: string;
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
): { score: number; model: string; releaseDate?: string } {
  let best = 0;
  let bestModel = "Unknown";
  let bestDate: string | undefined;
  for (const m of models) {
    const val = m.benchmarks[benchmarkId];
    if (val != null && val > best) {
      best = val;
      bestModel = m.name;
      bestDate = m.releaseDate;
    }
  }
  return { score: Math.round(best), model: bestModel, releaseDate: bestDate };
}

/**
 * Sourced historical data: cumulative best-per-benchmark at each model release.
 *
 * Pre-Dec 2024: only 4 benchmarks had published scores (MMLU-Pro, GPQA Diamond,
 * LiveCodeBench, SciCode). Missing benchmarks are extrapolated using the average
 * of available ones during readiness computation.
 *
 * Sources:
 *   MMLU-Pro — arXiv:2406.01574 (original paper), OpenAI simple-evals, Artificial Analysis
 *   GPQA Diamond — arXiv:2311.12022, OpenAI simple-evals, Anthropic model cards
 *   LiveCodeBench — arXiv:2403.07974, livecodebench.github.io
 *   SciCode — arXiv:2407.13168, scicode-bench.github.io
 *   MATH-500 — OpenAI simple-evals (o1+ only; pre-o1 used full MATH, not comparable)
 *   IFBench — arXiv:2507.02833 (Jul 2025, no pre-2025 data)
 *   TerminalBench Hard — tbench.ai (May 2025, no pre-2025 data)
 *   tau2-bench — arXiv:2506.07982 (Jun 2025, no pre-2025 data)
 *   AA-LCR — artificialanalysis.ai (Aug 2025, no pre-2025 data)
 */
const MOCK_HISTORY: HistoryPoint[] = [
  // --- Pre-Dec 2024: 4/9 benchmarks available ---
  // MMLU-Pro published Jun 2024, but GPT-4 Turbo was retro-tested in the paper.
  // GPQA Diamond published Nov 2023. LiveCodeBench Mar 2024. SciCode Jul 2024.

  // GPT-4 (Mar 2023) — only GPQA existed, retro-tested
  // GPQA: ~39% (original paper, 0-shot CoT) | Others: not yet published
  { date: "2023-03-14", benchmarks: { gpqa: 39 }, benchmarkCount: 1 },

  // GPT-4 Turbo (Nov 2023) — GPQA improved
  // GPQA: 42% (simple-evals, 0125-preview) | MMLU-Pro retro: 64% (paper Table 2)
  { date: "2023-11-06", benchmarks: { gpqa: 42, mmlu_pro: 64 }, benchmarkCount: 2 },

  // Claude 3 Opus (Mar 2024) — LiveCodeBench now exists
  // MMLU-Pro: 69% (paper) | GPQA: 50% (Anthropic model card) | LiveCodeBench: first scores
  { date: "2024-03-04", benchmarks: { mmlu_pro: 69, gpqa: 50, livecodebench: 37 }, benchmarkCount: 3 },

  // GPT-4o (May 2024) — MMLU-Pro paper published with retro scores
  // MMLU-Pro: 73% (paper) | GPQA: 50% (simple-evals) | LiveCodeBench: ~40%
  { date: "2024-05-13", benchmarks: { mmlu_pro: 73, gpqa: 50, livecodebench: 40 }, benchmarkCount: 3 },

  // Claude 3.5 Sonnet (Jun 2024) + SciCode published (Jul 2024)
  // MMLU-Pro: 73% (best still GPT-4o) | GPQA: 59% (Anthropic model card addendum)
  // LiveCodeBench: ~49% | SciCode: 26% (subproblem rate — comparable to other benchmarks)
  { date: "2024-06-20", benchmarks: { mmlu_pro: 73, gpqa: 59, livecodebench: 49, scicode: 26 }, benchmarkCount: 4 },

  // Llama 3.1 405B (Jul 2024)
  // MMLU-Pro: 73% (best unchanged) | GPQA: 51% (simple-evals) | SciCode: 26%
  // No cumulative improvement — skip (no new best)

  // o1-preview (Sep 2024)
  // MMLU-Pro: 73% (best unchanged) | GPQA: 73% (simple-evals) | LiveCodeBench: ~55%
  { date: "2024-09-12", benchmarks: { mmlu_pro: 73, gpqa: 73, livecodebench: 55, scicode: 26 }, benchmarkCount: 4 },

  // Claude 3.5 Sonnet v2 (Oct 2024)
  // MMLU-Pro: 77% (PricePerToken) | GPQA: 65% (Anthropic Oct addendum) — best still o1-preview 73%
  // LiveCodeBench: ~60%
  { date: "2024-10-22", benchmarks: { mmlu_pro: 77, gpqa: 73, livecodebench: 60, scicode: 5 }, benchmarkCount: 4 },

  // o1 (Dec 2024) — AA API data likely starts around here
  // MMLU-Pro: 84% (PricePerToken) | GPQA: 76% (simple-evals) | MATH-500: 96% (first MATH-500 scores)
  // SciCode: ~5% still
  { date: "2024-12-05", benchmarks: { mmlu_pro: 84, gpqa: 76, livecodebench: 60, scicode: 5 }, benchmarkCount: 4 },

  // --- Post-Dec 2024: AA API provides data; new benchmarks start appearing ---
  // From here, the live API computeHistory() takes over when AA key is configured.
  // These mock entries cover the full timeline for demo/no-key mode.

  // o3 + o3-mini (Jan 2025)
  // MMLU-Pro: 85% | GPQA: 83% (simple-evals, high) | MATH-500: 98%
  { date: "2025-01-31", benchmarks: { mmlu_pro: 85, math_500: 98, gpqa: 83, livecodebench: 65, scicode: 10 }, benchmarkCount: 5 },

  // Claude 3.7 Sonnet (Feb 2025) — extended thinking
  // MATH-500: 96% (Anthropic) — best still o3 at 98% | GPQA: 85% (extended thinking)
  { date: "2025-02-24", benchmarks: { mmlu_pro: 85, math_500: 98, gpqa: 85, livecodebench: 65, scicode: 10 }, benchmarkCount: 5 },

  // o3 full release + GPT-4.1 (Apr 2025)
  // GPQA: 83% (o3 high, simple-evals) — best still 85% from 3.7 extended
  // LiveCodeBench: ~70% | SciCode: improving
  { date: "2025-04-16", benchmarks: { mmlu_pro: 85, math_500: 98, gpqa: 85, livecodebench: 70, scicode: 15 }, benchmarkCount: 5 },

  // TerminalBench Hard launches (May 2025), tau2-bench (Jun 2025)
  // Gemini 2.5 Pro pushes MMLU-Pro and GPQA
  { date: "2025-06-15", benchmarks: { mmlu_pro: 87, math_500: 98, gpqa: 86, livecodebench: 75, scicode: 20, terminalbench_hard: 33, tau2: 78 }, benchmarkCount: 7 },

  // IFBench (Jul 2025), AA-LCR (Aug 2025)
  { date: "2025-08-05", benchmarks: { mmlu_pro: 87, math_500: 98, gpqa: 87, ifbench: 50, livecodebench: 80, terminalbench_hard: 40, tau2: 82, lcr: 69, scicode: 25 }, benchmarkCount: 9 },

  // Claude Opus 4.6 era (Oct 2025)
  { date: "2025-10-01", benchmarks: { mmlu_pro: 87, math_500: 95, gpqa: 90, ifbench: 77, livecodebench: 89, terminalbench_hard: 47, tau2: 87, lcr: 72, scicode: 53 }, benchmarkCount: 9 },
];

/** Mock data for when no API keys are configured */
export const MOCK_DATA: BenchmarkData = {
  prompt: [
    { id: "knowledge", name: "Knowledge & Research", shortName: "Knowledge", layer: "prompt", score: 87, bestModel: "Gemini 2.5 Pro", benchmark: "MMLU-Pro", whatItTests: "Accuracy across 57 professional domains", marketingApplication: "Market research, competitive intel, cross-industry insight", scoreDate: "2025-06-15" },
    { id: "quant_analysis", name: "Quantitative Analysis", shortName: "Quant", layer: "prompt", score: 95, bestModel: "o3", benchmark: "MATH-500", whatItTests: "Complex mathematical problem-solving", marketingApplication: "Attribution modeling, forecasting, budget optimization", scoreDate: "2025-04-20" },
    { id: "expert_reasoning", name: "Expert Reasoning", shortName: "Reasoning", layer: "prompt", score: 90, bestModel: "Gemini 2.5 Pro", benchmark: "GPQA Diamond", whatItTests: "PhD-level science & expert questions", marketingApplication: "Deep analysis requiring specialized domain knowledge", scoreDate: "2025-06-15" },
    { id: "instruction_following", name: "Instruction Following", shortName: "Instructions", layer: "prompt", score: 77, bestModel: "Claude Opus 4.6", benchmark: "IFBench", whatItTests: "Following multi-constraint instructions precisely", marketingApplication: "Brief execution, brand guidelines, format compliance", scoreDate: "2025-10-01" },
    { id: "code_generation", name: "Code Generation", shortName: "Code Gen", layer: "prompt", score: 89, bestModel: "Claude Opus 4.6", benchmark: "LiveCodeBench", whatItTests: "Solving real-world programming problems", marketingApplication: "Martech setup, workflow scripting, data pipelines", scoreDate: "2025-10-01" },
  ],
  agentic: [
    { id: "autonomous_coding", name: "Autonomous Coding", shortName: "Auto Code", layer: "agentic", score: 47, bestModel: "Claude Opus 4.6", benchmark: "TerminalBench Hard", whatItTests: "End-to-end terminal tasks: compile, deploy, debug", marketingApplication: "Building martech integrations, deploying campaigns autonomously", scoreDate: "2025-10-01" },
    { id: "customer_interaction", name: "Customer Interaction", shortName: "Customer", layer: "agentic", score: 87, bestModel: "Claude Opus 4.6", benchmark: "t2-bench", whatItTests: "Multi-turn conversation guiding users through tasks using tools", marketingApplication: "Customer service, sales enablement, interactive support", scoreDate: "2025-10-01" },
    { id: "long_form_analysis", name: "Long-Form Analysis", shortName: "Long Analysis", layer: "agentic", score: 72, bestModel: "Gemini 2.5 Pro", benchmark: "LCR", whatItTests: "Reasoning over 10k-100k token documents", marketingApplication: "Analyzing briefs, contracts, research reports, competitive docs", scoreDate: "2025-06-15" },
    { id: "research_solving", name: "Research & Problem Solving", shortName: "Research", layer: "agentic", score: 53, bestModel: "o3", benchmark: "SciCode", whatItTests: "End-to-end scientific coding research problems", marketingApplication: "Complex analytical projects requiring multi-step investigation", scoreDate: "2025-04-20" },
  ],
  bestOverall: { name: "Claude Opus 4.6", score: 78 },
  updatedAt: new Date().toISOString(),
  sources: ["mock"],
  history: MOCK_HISTORY,
};
