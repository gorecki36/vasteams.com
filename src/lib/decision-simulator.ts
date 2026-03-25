// ── Types ──────────────────────────────────────────────────────────

export interface DecisionOption {
  id: string;
  name: string;
  bestPayoff: number;
  bestProbability: number; // 0-1
  worstPayoff: number;
  // worstProbability = 1 - bestProbability (auto)
}

export interface DecisionScenario {
  name: string;
  options: DecisionOption[];
  payoffUnit: string;
  baseRate: number; // 0-1
  sunkCost: number;
  sunkCostUnit: string;
  edge: number; // 0-1
  biasFlags: {
    survivorshipRisk: boolean;
    sunkCostInfluence: boolean;
    baseRateIgnored: boolean;
  };
}

export interface EVResult {
  optionId: string;
  optionName: string;
  ev: number;
  breakdown: string;
}

export interface BayesianResult {
  prior: number;
  posterior: number;
}

export interface KellyResult {
  fraction: number;
  halfKelly: number;
  isPositive: boolean;
  sensitivityCurve: { p: number; kelly: number }[];
}

export type Signal = "go" | "caution" | "stop";

export interface Verdict {
  model: string;
  signal: Signal;
  summary: string;
}

export interface DecisionAnalysis {
  ev: EVResult[];
  bayesian: BayesianResult;
  kelly: KellyResult;
  sunkCostDelta: number;
  survivorshipRatio: number;
  verdicts: Verdict[];
  recommendation: string;
  confidence: "high" | "medium" | "low";
}

// ── Constants ──────────────────────────────────────────────────────

export const BASE_RATE_PRESETS: {
  label: string;
  rate: number;
  source: string;
}[] = [
  { label: "Startups (general)", rate: 0.1, source: "~90% fail within 10 years" },
  { label: "VC-backed startups", rate: 0.25, source: "~75% fail to return capital" },
  { label: "Job changes", rate: 0.65, source: "~65% report satisfaction after switching" },
  { label: "New product launches", rate: 0.15, source: "~85% of new products fail" },
  { label: "Real estate investments", rate: 0.7, source: "~70% generate positive returns long-term" },
  { label: "Small business (5yr)", rate: 0.5, source: "~50% survive past 5 years" },
  { label: "Freelance transition", rate: 0.4, source: "~40% sustain full-time income within 2 years" },
  { label: "Marketing campaigns", rate: 0.3, source: "~30% hit target ROI" },
];

export const PAYOFF_UNITS = ["$", "%", "points", "custom"] as const;
export type PayoffUnit = (typeof PAYOFF_UNITS)[number];

export const SUNK_COST_UNITS = ["$", "months", "hours", "years"] as const;

// ── Calculations ───────────────────────────────────────────────────

export function computeEV(option: DecisionOption): EVResult {
  const worstProbability = 1 - option.bestProbability;
  const ev =
    option.bestProbability * option.bestPayoff +
    worstProbability * option.worstPayoff;
  const breakdown = `${(option.bestProbability * 100).toFixed(0)}% × ${option.bestPayoff.toLocaleString()} + ${(worstProbability * 100).toFixed(0)}% × ${option.worstPayoff.toLocaleString()} = ${ev.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return { optionId: option.id, optionName: option.name, ev, breakdown };
}

export function computeBayesianPosterior(
  baseRate: number,
  edge: number
): BayesianResult {
  // Simplified Bayesian: edge acts as a likelihood ratio multiplier
  // Higher edge = stronger evidence your case differs from base rate
  // K scales the update: at edge=0 posterior=prior, at edge=1 posterior is heavily updated
  const K = 3; // sensitivity factor
  const likelihoodRatio = 1 + edge * K;
  const prior = baseRate;
  const posterior =
    (prior * likelihoodRatio) /
    (prior * likelihoodRatio + (1 - prior));
  return { prior, posterior: Math.min(posterior, 0.99) };
}

export function computeKelly(
  probability: number,
  bestPayoff: number,
  worstPayoff: number
): KellyResult {
  // Kelly: f* = (p*b - q) / b
  // b = net odds (what you win per unit risked)
  // q = 1 - p
  const absWorst = Math.abs(worstPayoff) || 1; // what you risk
  const b = bestPayoff / absWorst; // net odds ratio
  const q = 1 - probability;
  const fraction = b > 0 ? (probability * b - q) / b : 0;
  const clampedFraction = Math.max(0, Math.min(fraction, 1));
  const halfKelly = clampedFraction / 2;
  const isPositive = clampedFraction > 0;

  // Sensitivity curve: Kelly fraction across probability range
  const sensitivityCurve: { p: number; kelly: number }[] = [];
  for (let p = 0; p <= 100; p += 5) {
    const pDecimal = p / 100;
    const qLocal = 1 - pDecimal;
    const kellyLocal = b > 0 ? (pDecimal * b - qLocal) / b : 0;
    sensitivityCurve.push({
      p,
      kelly: Math.max(0, Math.min(kellyLocal * 100, 100)),
    });
  }

  return { fraction: clampedFraction, halfKelly, isPositive, sensitivityCurve };
}

function generateVerdicts(scenario: DecisionScenario, evResults: EVResult[], bayesian: BayesianResult, kelly: KellyResult): Verdict[] {
  const verdicts: Verdict[] = [];
  const bestEV = Math.max(...evResults.map((e) => e.ev));
  const worstEV = Math.min(...evResults.map((e) => e.ev));
  const evSpread = bestEV - worstEV;

  // 1. EV
  if (bestEV > 0 && evSpread > Math.abs(worstEV) * 0.2) {
    verdicts.push({ model: "Expected Value", signal: "go", summary: `Best option EV is ${bestEV.toLocaleString(undefined, { maximumFractionDigits: 0 })}${scenario.payoffUnit !== "custom" ? scenario.payoffUnit : ""}` });
  } else if (bestEV > 0) {
    verdicts.push({ model: "Expected Value", signal: "caution", summary: "Options are close — small EV difference" });
  } else {
    verdicts.push({ model: "Expected Value", signal: "stop", summary: "All options have negative expected value" });
  }

  // 2. Base Rate
  if (scenario.baseRate >= 0.5) {
    verdicts.push({ model: "Base Rate", signal: "go", summary: `Base rate of ${(scenario.baseRate * 100).toFixed(0)}% is favorable` });
  } else if (scenario.baseRate >= 0.2) {
    verdicts.push({ model: "Base Rate", signal: "caution", summary: `Base rate of ${(scenario.baseRate * 100).toFixed(0)}% — proceed carefully` });
  } else {
    verdicts.push({ model: "Base Rate", signal: "stop", summary: `Base rate of ${(scenario.baseRate * 100).toFixed(0)}% — most attempts fail` });
  }

  // 3. Sunk Cost
  if (scenario.sunkCost === 0 || !scenario.biasFlags.sunkCostInfluence) {
    verdicts.push({ model: "Sunk Cost", signal: "go", summary: "No sunk cost bias detected" });
  } else {
    verdicts.push({ model: "Sunk Cost", signal: "caution", summary: `${scenario.sunkCost.toLocaleString()} ${scenario.sunkCostUnit} invested — ensure it's not anchoring you` });
  }

  // 4. Bayesian
  if (bayesian.posterior >= 0.5) {
    verdicts.push({ model: "Bayesian Update", signal: "go", summary: `Updated probability: ${(bayesian.posterior * 100).toFixed(0)}%` });
  } else if (bayesian.posterior >= 0.25) {
    verdicts.push({ model: "Bayesian Update", signal: "caution", summary: `Updated probability: ${(bayesian.posterior * 100).toFixed(0)}% — moderate` });
  } else {
    verdicts.push({ model: "Bayesian Update", signal: "stop", summary: `Updated probability only ${(bayesian.posterior * 100).toFixed(0)}%` });
  }

  // 5. Survivorship
  const survivorshipRatio = scenario.baseRate > 0 ? (1 - scenario.baseRate) / scenario.baseRate : 99;
  if (survivorshipRatio <= 1) {
    verdicts.push({ model: "Survivorship Bias", signal: "go", summary: "Success is more common than failure here" });
  } else if (survivorshipRatio <= 4) {
    verdicts.push({ model: "Survivorship Bias", signal: "caution", summary: `${survivorshipRatio.toFixed(0)} failures per success — check your sample` });
  } else {
    verdicts.push({
      model: "Survivorship Bias",
      signal: scenario.biasFlags.survivorshipRisk ? "stop" : "caution",
      summary: `${survivorshipRatio.toFixed(0)} failures per visible success`,
    });
  }

  // 6. Kelly
  if (kelly.isPositive && kelly.halfKelly >= 0.2) {
    verdicts.push({ model: "Kelly Criterion", signal: "go", summary: `Half-Kelly suggests ${(kelly.halfKelly * 100).toFixed(0)}% commitment` });
  } else if (kelly.isPositive) {
    verdicts.push({ model: "Kelly Criterion", signal: "caution", summary: `Small edge — commit only ${(kelly.halfKelly * 100).toFixed(0)}%` });
  } else {
    verdicts.push({ model: "Kelly Criterion", signal: "stop", summary: "No positive edge — Kelly says don't bet" });
  }

  return verdicts;
}

export function analyzeDecision(scenario: DecisionScenario): DecisionAnalysis {
  // EV for each option
  const ev = scenario.options.map(computeEV);

  // Bayesian update using base rate + edge
  const bayesian = computeBayesianPosterior(scenario.baseRate, scenario.edge);

  // Kelly using the best option's payoffs with Bayesian posterior
  const bestOption = scenario.options.reduce((best, opt) => {
    const optEV = computeEV(opt);
    const bestEV = computeEV(best);
    return optEV.ev > bestEV.ev ? opt : best;
  });
  const kelly = computeKelly(
    bayesian.posterior,
    bestOption.bestPayoff,
    Math.abs(bestOption.worstPayoff)
  );

  // Sunk cost delta: what's the EV difference if sunk cost were 0
  const sunkCostDelta = scenario.sunkCost;

  // Survivorship ratio
  const survivorshipRatio =
    scenario.baseRate > 0
      ? Math.round((1 - scenario.baseRate) / scenario.baseRate)
      : 99;

  // Verdicts
  const verdicts = generateVerdicts(scenario, ev, bayesian, kelly);

  // Overall recommendation
  const goCount = verdicts.filter((v) => v.signal === "go").length;
  const stopCount = verdicts.filter((v) => v.signal === "stop").length;

  let recommendation: string;
  let confidence: "high" | "medium" | "low";

  if (goCount >= 5) {
    recommendation = "Strong signal to proceed. Most models align positively.";
    confidence = "high";
  } else if (goCount >= 3 && stopCount === 0) {
    recommendation = "Favorable with caveats. Address the cautionary signals.";
    confidence = "medium";
  } else if (stopCount >= 3) {
    recommendation = "Multiple red flags. Reconsider or restructure the bet.";
    confidence = "high";
  } else if (stopCount >= 2) {
    recommendation = "Significant concerns. The math doesn't strongly support this.";
    confidence = "medium";
  } else {
    recommendation = "Mixed signals. No clear winner — consider gathering more data.";
    confidence = "low";
  }

  return {
    ev,
    bayesian,
    kelly,
    sunkCostDelta,
    survivorshipRatio,
    verdicts,
    recommendation,
    confidence,
  };
}
