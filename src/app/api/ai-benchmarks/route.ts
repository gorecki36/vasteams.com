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
  type HistoryPoint,
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
        releaseDate: (m.release_date ?? undefined) as string | undefined,
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

/**
 * Sourced pre-API historical anchors (before AA API coverage ~Dec 2024).
 * Only benchmarks that existed at each date are included.
 *
 * Sources:
 *   GPQA Diamond — arXiv:2311.12022, OpenAI simple-evals, Anthropic model cards
 *   MMLU-Pro — arXiv:2406.01574 (original paper), PricePerToken/Artificial Analysis
 *   LiveCodeBench — arXiv:2403.07974
 *   SciCode — arXiv:2407.13168
 */
const HISTORICAL_ANCHORS: HistoryPoint[] = [
  // GPT-4 — only GPQA existed (published Nov 2023, but GPT-4 retro-tested in paper)
  { date: "2023-03-14", benchmarks: { gpqa: 39 }, benchmarkCount: 1 },
  // GPT-4 Turbo — GPQA improved; MMLU-Pro retro-tested in Jun 2024 paper
  { date: "2023-11-06", benchmarks: { gpqa: 42, mmlu_pro: 64 }, benchmarkCount: 2 },
  // Claude 3 Opus — LiveCodeBench now published
  { date: "2024-03-04", benchmarks: { mmlu_pro: 69, gpqa: 50, livecodebench: 37 }, benchmarkCount: 3 },
  // GPT-4o — MMLU-Pro paper published with retro scores
  { date: "2024-05-13", benchmarks: { mmlu_pro: 73, gpqa: 50, livecodebench: 40 }, benchmarkCount: 3 },
  // Claude 3.5 Sonnet + SciCode published (subproblem rate — comparable to other benchmarks)
  { date: "2024-06-20", benchmarks: { mmlu_pro: 73, gpqa: 59, livecodebench: 49, scicode: 26 }, benchmarkCount: 4 },
  // o1-preview — big GPQA jump
  { date: "2024-09-12", benchmarks: { mmlu_pro: 73, gpqa: 73, livecodebench: 55, scicode: 26 }, benchmarkCount: 4 },
  // Claude 3.5 Sonnet v2
  { date: "2024-10-22", benchmarks: { mmlu_pro: 77, gpqa: 73, livecodebench: 60, scicode: 26 }, benchmarkCount: 4 },
];

// --- Compute cumulative best-per-benchmark at each release date ---
function computeHistory(models: RawModelBenchmarks[]): HistoryPoint[] {
  // Only models with a release date
  const dated = models
    .filter((m) => m.releaseDate)
    .sort((a, b) => a.releaseDate!.localeCompare(b.releaseDate!));

  if (dated.length === 0) return HISTORICAL_ANCHORS;

  const running: Partial<Record<BenchmarkId, number>> = {};
  const livePoints: HistoryPoint[] = [];
  const benchmarkIds = ALL_CAPABILITIES.map((c) => c.benchmark);

  for (const model of dated) {
    let changed = false;
    for (const bid of benchmarkIds) {
      const val = model.benchmarks[bid];
      if (val != null && val > (running[bid] ?? 0)) {
        running[bid] = val;
        changed = true;
      }
    }
    if (changed) {
      const snapshot = { ...running };
      livePoints.push({
        date: model.releaseDate!,
        benchmarks: snapshot,
        benchmarkCount: Object.keys(snapshot).length,
      });
    }
  }

  // Prepend historical anchors that predate the earliest live point
  const earliestLive = livePoints[0]?.date ?? "9999-99-99";
  const preAnchors = HISTORICAL_ANCHORS.filter((a) => a.date < earliestLive);

  return [...preAnchors, ...livePoints];
}

// --- Compute best scores across all models ---
function computeAllScores(models: RawModelBenchmarks[]): BenchmarkData {
  function buildLayer(capabilities: typeof ALL_CAPABILITIES): CapabilityScore[] {
    return capabilities.map((cap) => {
      const { score, model, releaseDate } = bestScoreForBenchmark(models, cap.benchmark);
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
        scoreDate: releaseDate,
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
    history: computeHistory(models),
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
