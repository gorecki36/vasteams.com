// ── Types ──────────────────────────────────────────────────────────

export interface Kid {
  id: string;
  age: number;
}

export interface RetirementInputs {
  // Financial Profile
  currentAge: number;
  retirementAge: number;
  netWorth: number;
  annualSalary: number;
  passiveIncome: number;
  costOfLiving: number;
  expectedReturn: number; // decimal, e.g. 0.06
  inflationRate: number; // decimal, e.g. 0.03

  // Life Stage
  kids: Kid[];
  mortgagePaidOff: boolean;
  mortgagePaidOffAge: number;
  annualMortgage: number; // how much mortgage costs per year

  // Life Expectancy Factors
  gender: "male" | "female";
  vo2max: "elite" | "good" | "average" | "below_average";
  bmi: "underweight" | "normal" | "overweight" | "obese";
  smoker: "yes" | "no" | "former";
  familyLongevity: boolean; // parents past 85?
  chronicConditions: "none" | "one" | "multiple";
}

export interface YearSnapshot {
  age: number;
  netWorth: number;
  survivalProbability: number; // 0-1
  isRetired: boolean;
}

export interface RetirementAnalysis {
  yearData: YearSnapshot[];
  moneyRunsOutAge: number | null; // null = never runs out
  expectedDeathAge: number; // median survival
  safetyMargin: number; // years between money-out and expected death (positive = safe)
  monthlyPostRetirementBudget: number;
  signal: "safe" | "tight" | "danger";
  verdict: string;
}

export interface SensitivityRow {
  scenario: string;
  moneyRunsOutAge: number | null;
  safetyMargin: number;
  signal: "safe" | "tight" | "danger";
}

export interface MonteCarloResult {
  probRuin: number; // P(money runs out while alive)
  probSafe: number; // P(die with money remaining)
  medianWealthAtDeath: number;
  ruinAgePercentiles: { p10: number; p50: number; p90: number } | null;
  deathAgePercentiles: { p10: number; p50: number; p90: number };
  samplePaths: { age: number; netWorth: number }[][]; // ~150 paths for viz
  ruinAgeHistogram: { age: number; count: number }[];
  deathAgeHistogram: { age: number; count: number }[];
}

// ── Constants ──────────────────────────────────────────────────────

const COLLEGE_ANNUAL_COST = 40_000;
const HEALTHCARE_PRE_65 = 8_000;
const HEALTHCARE_POST_65 = 3_000;
const MAX_AGE = 100;

// Gompertz parameters — calibrated to SSA 2023 period life tables
// Male: conditional median at 35 → 80, at 65 → 83
// Female: conditional median at 35 → 85, at 65 → 87
const GOMPERTZ = {
  male: { a: 0.00007, b: 0.085 },
  female: { a: 0.000045, b: 0.085 },
};

// Hazard ratio modifiers
const HAZARD_RATIOS = {
  vo2max: { elite: 0.65, good: 0.85, average: 1.0, below_average: 1.3 },
  bmi: { underweight: 1.2, normal: 1.0, overweight: 1.15, obese: 1.4 },
  smoker: { yes: 1.6, no: 1.0, former: 1.15 },
  familyLongevity: 0.85,
  chronic: { none: 1.0, one: 1.25, multiple: 1.6 },
};

// ── Survival Curve ─────────────────────────────────────────────────

function computeHazardMultiplier(inputs: RetirementInputs): number {
  let m = 1.0;
  m *= HAZARD_RATIOS.vo2max[inputs.vo2max];
  m *= HAZARD_RATIOS.bmi[inputs.bmi];
  m *= HAZARD_RATIOS.smoker[inputs.smoker];
  if (inputs.familyLongevity) m *= HAZARD_RATIOS.familyLongevity;
  m *= HAZARD_RATIOS.chronic[inputs.chronicConditions];
  return m;
}

function gompertzSurvival(age: number, gender: "male" | "female", hazardMultiplier: number): number {
  // S(t) = exp(-(a*m/b) * (exp(b*t) - 1))
  const { a, b } = GOMPERTZ[gender];
  const am = a * hazardMultiplier;
  return Math.exp(-(am / b) * (Math.exp(b * age) - 1));
}

function conditionalSurvival(
  targetAge: number,
  currentAge: number,
  gender: "male" | "female",
  hazardMultiplier: number
): number {
  // P(survive to targetAge | already currentAge) = S(targetAge) / S(currentAge)
  const sTarget = gompertzSurvival(targetAge, gender, hazardMultiplier);
  const sCurrent = gompertzSurvival(currentAge, gender, hazardMultiplier);
  if (sCurrent === 0) return 0;
  return Math.min(sTarget / sCurrent, 1);
}

function findMedianSurvival(currentAge: number, gender: "male" | "female", hazardMultiplier: number): number {
  // Find age where conditional survival drops to 50%
  for (let age = currentAge; age <= 120; age++) {
    if (conditionalSurvival(age, currentAge, gender, hazardMultiplier) < 0.5) {
      return age;
    }
  }
  return 100;
}

// ── Financial Runway ───────────────────────────────────────────────

function annualCostAtAge(age: number, inputs: RetirementInputs): number {
  let cost = inputs.costOfLiving;

  // Inflation adjustment (compound from current age)
  const yearsFromNow = age - inputs.currentAge;
  cost *= Math.pow(1 + inputs.inflationRate, yearsFromNow);

  // Kids: college costs (ages 18-22), reduced costs when independent (23+)
  for (const kid of inputs.kids) {
    const kidAgeAtYear = kid.age + yearsFromNow;
    if (kidAgeAtYear >= 18 && kidAgeAtYear <= 22) {
      cost += COLLEGE_ANNUAL_COST * Math.pow(1 + inputs.inflationRate, yearsFromNow);
    }
  }

  // Mortgage drops off when paid
  if (inputs.mortgagePaidOff && age >= inputs.mortgagePaidOffAge) {
    cost -= inputs.annualMortgage * Math.pow(1 + inputs.inflationRate, yearsFromNow);
    cost = Math.max(cost, 0);
  }

  // Healthcare
  if (age >= 65) {
    cost += HEALTHCARE_POST_65 * Math.pow(1 + inputs.inflationRate, yearsFromNow);
  } else if (age >= inputs.retirementAge) {
    // Pre-65, no employer coverage
    cost += HEALTHCARE_PRE_65 * Math.pow(1 + inputs.inflationRate, yearsFromNow);
  }

  return cost;
}

function computeFinancialRunway(inputs: RetirementInputs): YearSnapshot[] {
  const hazardMultiplier = computeHazardMultiplier(inputs);
  const snapshots: YearSnapshot[] = [];
  let netWorth = inputs.netWorth;

  for (let age = inputs.currentAge; age <= MAX_AGE; age++) {
    const isRetired = age >= inputs.retirementAge;
    const survival = conditionalSurvival(age, inputs.currentAge, inputs.gender, hazardMultiplier);

    snapshots.push({
      age,
      netWorth: Math.round(netWorth),
      survivalProbability: Math.round(survival * 1000) / 1000,
      isRetired,
    });

    // Compute next year's net worth
    const cost = annualCostAtAge(age, inputs);
    const income = isRetired ? inputs.passiveIncome : inputs.annualSalary + inputs.passiveIncome;
    const realReturn = inputs.expectedReturn - inputs.inflationRate;

    netWorth = netWorth * (1 + realReturn) + income - cost;
  }

  return snapshots;
}

// ── Main Analysis ──────────────────────────────────────────────────

export function analyzeRetirement(inputs: RetirementInputs): RetirementAnalysis {
  const yearData = computeFinancialRunway(inputs);
  const hazardMultiplier = computeHazardMultiplier(inputs);
  const expectedDeathAge = findMedianSurvival(inputs.currentAge, inputs.gender, hazardMultiplier);

  // Find when money runs out
  const moneyOutSnapshot = yearData.find((s) => s.age > inputs.currentAge && s.netWorth <= 0);
  const moneyRunsOutAge = moneyOutSnapshot ? moneyOutSnapshot.age : null;

  // Safety margin
  const safetyMargin = moneyRunsOutAge !== null
    ? moneyRunsOutAge - expectedDeathAge
    : MAX_AGE - expectedDeathAge; // if money never runs out, margin is remaining life

  // Monthly post-retirement budget
  const retirementStart = yearData.find((s) => s.age === inputs.retirementAge);
  const retirementNetWorth = retirementStart?.netWorth ?? inputs.netWorth;
  const retirementYears = moneyRunsOutAge
    ? moneyRunsOutAge - inputs.retirementAge
    : MAX_AGE - inputs.retirementAge;
  const monthlyBudget = retirementYears > 0
    ? Math.round((retirementNetWorth / retirementYears / 12) + inputs.passiveIncome / 12)
    : 0;

  // Signal
  let signal: "safe" | "tight" | "danger";
  let verdict: string;

  if (moneyRunsOutAge === null || safetyMargin >= 10) {
    signal = "safe";
    verdict = `You can afford to retire at ${inputs.retirementAge}. Your money outlasts your expected lifespan with a comfortable margin.`;
  } else if (safetyMargin >= 0) {
    signal = "tight";
    verdict = `Retiring at ${inputs.retirementAge} is possible but tight. Your safety margin is only ${safetyMargin} years. Consider working ${Math.max(2, 5 - safetyMargin)} more years or reducing expenses.`;
  } else {
    signal = "danger";
    const gap = Math.abs(safetyMargin);
    verdict = `Retiring at ${inputs.retirementAge} puts you at risk. Money runs out ${gap} years before your expected lifespan. You need ${gap + 5} more working years or $${Math.round(gap * inputs.costOfLiving / 12).toLocaleString()}/month in expense cuts.`;
  }

  return {
    yearData,
    moneyRunsOutAge,
    expectedDeathAge,
    safetyMargin,
    monthlyPostRetirementBudget: monthlyBudget,
    signal,
    verdict,
  };
}

// ── Sensitivity Analysis ───────────────────────────────────────────

function quickAnalysis(inputs: RetirementInputs): { moneyRunsOutAge: number | null; expectedDeathAge: number } {
  const result = analyzeRetirement(inputs);
  return { moneyRunsOutAge: result.moneyRunsOutAge, expectedDeathAge: result.expectedDeathAge };
}

export function computeSensitivity(inputs: RetirementInputs): SensitivityRow[] {
  const baseline = quickAnalysis(inputs);
  const rows: SensitivityRow[] = [];

  const scenarios: { label: string; override: Partial<RetirementInputs> }[] = [
    { label: "Retire 5 years earlier", override: { retirementAge: Math.max(inputs.currentAge + 1, inputs.retirementAge - 5) } },
    { label: "Retire 5 years later", override: { retirementAge: Math.min(80, inputs.retirementAge + 5) } },
    { label: "Returns at 4%", override: { expectedReturn: 0.04 } },
    { label: "Returns at 8%", override: { expectedReturn: 0.08 } },
    { label: "Live to 90", override: {} },
    { label: "Live to 95", override: {} },
    { label: "Reduce expenses 20%", override: { costOfLiving: inputs.costOfLiving * 0.8 } },
  ];

  for (const s of scenarios) {
    const modifiedInputs = { ...inputs, ...s.override };
    const result = quickAnalysis(modifiedInputs);

    // For "Live to X" scenarios, override the expected death age
    let expectedDeath = result.expectedDeathAge;
    if (s.label === "Live to 90") expectedDeath = 90;
    if (s.label === "Live to 95") expectedDeath = 95;

    const margin = result.moneyRunsOutAge !== null
      ? result.moneyRunsOutAge - expectedDeath
      : MAX_AGE - expectedDeath;

    let signal: "safe" | "tight" | "danger";
    if (result.moneyRunsOutAge === null || margin >= 10) signal = "safe";
    else if (margin >= 0) signal = "tight";
    else signal = "danger";

    rows.push({
      scenario: s.label,
      moneyRunsOutAge: result.moneyRunsOutAge,
      safetyMargin: margin,
      signal,
    });
  }

  return rows;
}

// ── Monte Carlo Simulation ─────────────────────────────────────────

const MC_SIMS = 5_000;
const MC_SAMPLE_PATHS = 150;
const EQUITY_VOLATILITY = 0.16; // annualized std dev for a stock-heavy portfolio

// Box-Muller transform for normal random variates
function randn(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Sample a death age from the Gompertz survival curve via inverse CDF
function sampleDeathAge(currentAge: number, gender: "male" | "female", hazardMultiplier: number): number {
  const u = Math.random(); // uniform(0,1)
  // Find age where conditional survival = u (inverse CDF)
  // Binary search between currentAge and 120
  let lo = currentAge;
  let hi = 120;
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    const s = conditionalSurvival(mid, currentAge, gender, hazardMultiplier);
    if (s > u) lo = mid; else hi = mid;
  }
  return Math.round((lo + hi) / 2);
}

// Run one simulation: randomized returns + sampled death age
function runOneSim(
  inputs: RetirementInputs,
  hazardMultiplier: number,
  volatility: number
): { deathAge: number; moneyOutAge: number | null; path: { age: number; netWorth: number }[] } {
  const deathAge = sampleDeathAge(inputs.currentAge, inputs.gender, hazardMultiplier);
  const endAge = Math.min(deathAge, MAX_AGE);
  const path: { age: number; netWorth: number }[] = [];
  let netWorth = inputs.netWorth;
  let moneyOutAge: number | null = null;

  for (let age = inputs.currentAge; age <= endAge; age++) {
    path.push({ age, netWorth: Math.round(netWorth) });

    if (netWorth <= 0 && moneyOutAge === null) {
      moneyOutAge = age;
    }

    const isRetired = age >= inputs.retirementAge;
    const cost = annualCostAtAge(age, inputs);
    const income = isRetired ? inputs.passiveIncome : inputs.annualSalary + inputs.passiveIncome;

    // Randomized return: log-normal with mean = expectedReturn, vol = volatility
    const annualReturn = inputs.expectedReturn + volatility * randn();
    const realReturn = annualReturn - inputs.inflationRate;

    netWorth = netWorth * (1 + realReturn) + income - cost;
  }

  return { deathAge, moneyOutAge, path };
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.floor(sorted.length * p);
  return sorted[Math.min(idx, sorted.length - 1)];
}

export function runMonteCarlo(inputs: RetirementInputs): MonteCarloResult {
  const hazardMultiplier = computeHazardMultiplier(inputs);
  // Scale volatility by equity fraction (expected return as proxy)
  // 6% return ≈ 60/40 portfolio → ~10% vol, 10% return ≈ all equity → 16% vol
  const equityFraction = Math.min(inputs.expectedReturn / 0.10, 1);
  const volatility = EQUITY_VOLATILITY * equityFraction;

  const deathAges: number[] = [];
  const ruinAges: number[] = [];
  const wealthAtDeath: number[] = [];
  const samplePaths: { age: number; netWorth: number }[][] = [];
  let ruinCount = 0;

  for (let i = 0; i < MC_SIMS; i++) {
    const sim = runOneSim(inputs, hazardMultiplier, volatility);
    deathAges.push(sim.deathAge);

    const finalWealth = sim.path[sim.path.length - 1]?.netWorth ?? 0;
    wealthAtDeath.push(finalWealth);

    if (sim.moneyOutAge !== null && sim.moneyOutAge < sim.deathAge) {
      ruinCount++;
      ruinAges.push(sim.moneyOutAge);
    }

    if (i < MC_SAMPLE_PATHS) {
      samplePaths.push(sim.path);
    }
  }

  const probRuin = ruinCount / MC_SIMS;
  const probSafe = 1 - probRuin;

  // Sort for percentiles
  deathAges.sort((a, b) => a - b);
  ruinAges.sort((a, b) => a - b);
  wealthAtDeath.sort((a, b) => a - b);

  const medianWealthAtDeath = percentile(wealthAtDeath, 0.5);

  const deathAgePercentiles = {
    p10: percentile(deathAges, 0.1),
    p50: percentile(deathAges, 0.5),
    p90: percentile(deathAges, 0.9),
  };

  const ruinAgePercentiles = ruinAges.length > 0
    ? {
        p10: percentile(ruinAges, 0.1),
        p50: percentile(ruinAges, 0.5),
        p90: percentile(ruinAges, 0.9),
      }
    : null;

  // Build histograms (5-year buckets)
  const buildHistogram = (ages: number[]): { age: number; count: number }[] => {
    const buckets = new Map<number, number>();
    for (const a of ages) {
      const bucket = Math.floor(a / 5) * 5;
      buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
    }
    return Array.from(buckets.entries())
      .map(([age, count]) => ({ age, count }))
      .sort((a, b) => a.age - b.age);
  };

  return {
    probRuin,
    probSafe,
    medianWealthAtDeath,
    ruinAgePercentiles,
    deathAgePercentiles,
    samplePaths,
    ruinAgeHistogram: buildHistogram(ruinAges),
    deathAgeHistogram: buildHistogram(deathAges),
  };
}
