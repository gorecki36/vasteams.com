import { NextResponse } from "next/server";
import {
  PROMPT_CAPABILITIES,
  AGENTIC_CAPABILITIES,
  ALL_CAPABILITIES,
  MOCK_DATA,
  bestScoreForBenchmark,
  type BenchmarkData,
  type RawModelBenchmarks,
  type BenchmarkId,
  type CapabilityScore,
} from "@/lib/ai-benchmarks";

// Cache with TTL
let cachedData: BenchmarkData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/** Convert 0-1 benchmark score to 0-100 percentage, or return undefined */
function pct(val: unknown): number | undefined {
  if (val == null || typeof val !== "number") return undefined;
  return val <= 1 ? val * 100 : val;
}

// Human-readable benchmark names for display
const BENCHMARK_DISPLAY: Record<BenchmarkId, string> = {
  mmlu_pro: "MMLU-Pro",
  math_500: "MATH-500",
  gpqa: "GPQA Diamond",
  ifbench: "IFBench",
  livecodebench: "LiveCodeBench",
  terminalbench_hard: "TerminalBench Hard",
  tau2: "\u03C4\u00B2-bench",
  lcr: "LCR",
  scicode: "SciCode",
};

// --- Artificial Analysis ---
async function fetchArtificialAnalysis(): Promise<RawModelBenchmarks[]> {
  const apiKey = process.env.ARTIFICIAL_ANALYSIS_API_KEY;
  if (!apiKey) return [];

  const res = await fetch(
    "https://artificialanalysis.ai/api/v2/data/llms/models",
    { headers: { "x-api-key": apiKey } }
  );

  if (!res.ok) throw new Error(`AA API returned ${res.status}`);

  const json = await res.json();
  const models = Array.isArray(json) ? json : json.data ?? [];

  return models
    .filter((m: Record<string, unknown>) => {
      const evals = (m.evaluations ?? {}) as Record<string, unknown>;
      return ((evals.artificial_analysis_intelligence_index as number) ?? 0) > 30;
    })
    .map((m: Record<string, unknown>) => {
      const e = (m.evaluations ?? {}) as Record<string, unknown>;
      const creator = (m.model_creator ?? {}) as Record<string, unknown>;
      return {
        name: (m.name ?? "Unknown") as string,
        provider: (creator.name ?? "") as string,
        benchmarks: {
          // Prompt-level benchmarks
          mmlu_pro: pct(e.mmlu_pro),
          math_500: pct(e.math_500),
          gpqa: pct(e.gpqa),
          ifbench: pct(e.ifbench),
          livecodebench: pct(e.livecodebench),
          // Agentic benchmarks
          terminalbench_hard: pct(e.terminalbench_hard),
          tau2: pct(e.tau2),
          lcr: pct(e.lcr),
          scicode: pct(e.scicode),
        } as Partial<Record<BenchmarkId, number>>,
      };
    });
}

// --- Compute best scores across all models ---
function computeAllScores(models: RawModelBenchmarks[]): BenchmarkData {
  function buildLayer(capabilities: typeof ALL_CAPABILITIES): CapabilityScore[] {
    return capabilities.map((cap) => {
      const { score, model } = bestScoreForBenchmark(models, cap.benchmark);
      return {
        id: cap.id,
        name: cap.name,
        shortName: cap.shortName,
        layer: cap.layer,
        score,
        bestModel: model,
        benchmark: BENCHMARK_DISPLAY[cap.benchmark],
        whatItTests: cap.whatItTests,
        marketingApplication: cap.marketingApplication,
      };
    });
  }

  const prompt = buildLayer(PROMPT_CAPABILITIES);
  const agentic = buildLayer(AGENTIC_CAPABILITIES);

  // Best overall: model with highest average score across all 9 benchmarks it has data for
  let bestOverallName = "Unknown";
  let bestOverallScore = 0;

  for (const model of models) {
    let total = 0;
    let count = 0;
    for (const cap of ALL_CAPABILITIES) {
      const val = model.benchmarks[cap.benchmark];
      if (val != null) {
        total += val;
        count++;
      }
    }
    if (count > 0) {
      const avg = total / count;
      if (avg > bestOverallScore) {
        bestOverallScore = avg;
        bestOverallName = model.name;
      }
    }
  }

  return {
    prompt,
    agentic,
    bestOverall: { name: bestOverallName, score: Math.round(bestOverallScore) },
    updatedAt: new Date().toISOString(),
    sources: ["Artificial Analysis"],
  };
}

export async function GET() {
  // Mock mode if no API key
  if (!process.env.ARTIFICIAL_ANALYSIS_API_KEY) {
    return NextResponse.json({ ...MOCK_DATA, mock: true });
  }

  // Check cache
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json({ ...cachedData, cached: true });
  }

  try {
    const models = await fetchArtificialAnalysis();

    if (models.length === 0) {
      if (cachedData) {
        return NextResponse.json({ ...cachedData, cached: true, stale: true });
      }
      return NextResponse.json({ ...MOCK_DATA, mock: true });
    }

    const data = computeAllScores(models);

    // Update cache
    cachedData = data;
    cacheTimestamp = now;

    return NextResponse.json(data);
  } catch {
    // Serve stale cache or mock on failure
    if (cachedData) {
      return NextResponse.json({ ...cachedData, cached: true, stale: true });
    }
    return NextResponse.json({ ...MOCK_DATA, mock: true });
  }
}
