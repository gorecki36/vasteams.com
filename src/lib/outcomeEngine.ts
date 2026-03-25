import { SliderValues } from "./forces";
import { REGIONS } from "./regions";

// ── Types ───────────────────────────────────────────────────────

export interface OutcomeValues {
  meaning_crisis: number;
  trust_collapse: number;
  pod_economics: number;
  escapism_spiritual: number;
  economic_withdrawal: number;
  gdp_decline: number;
  unemployment: number;
}

export interface TimeSeriesPoint {
  year: number;
  outcomes: OutcomeValues;
  matrix: number;
}

// ── Math Helpers ────────────────────────────────────────────────

/** Sigmoid over year — returns 0-100 */
function yearSigmoid(year: number, arrivalYear: number, k: number): number {
  return 100 / (1 + Math.exp(-k * (year - arrivalYear)));
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

// ── Core idea ───────────────────────────────────────────────────
//
// Every outcome ALWAYS reaches 100. The question is WHEN.
// The weighted input sum (0-100) determines the arrival year —
// the inflection point where the sigmoid crosses 50.
//
//   pressure=100 → arrival ~2055  (arrives fast)
//   pressure=50  → arrival ~2090  (default pace)
//   pressure=15  → arrival ~2115  (arrives late)
//
// k=0.065 gives a ~68-year window from 10% to 90%.

const K = 0.065; // sigmoid steepness (per-year)
const LATEST_ARRIVAL = 2125; // arrival year when pressure = 0
const ARRIVAL_RANGE = 70; // years earlier when pressure = 100

function arrivalYear(pressure: number): number {
  return LATEST_ARRIVAL - (pressure / 100) * ARRIVAL_RANGE;
}

// ── Outcome Computation ─────────────────────────────────────────

export function computeOutcomes(
  inputs: SliderValues,
  year: number,
  regionId: string
): OutcomeValues {
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];

  // Apply regional modifiers to inputs
  const s: Record<string, number> = { ...inputs };
  for (const [key, mod] of Object.entries(region.modifiers)) {
    if (key in s) {
      s[key] = clamp(s[key] + mod);
    }
  }

  // ── Tier 1 pressures (from raw inputs) ────────────────────

  const meaningPressure =
    (s.digital_immersion ?? 50) * 0.35 +
    (s.ai_acceleration ?? 50) * 0.25 +
    (s.demographic_collapse ?? 50) * 0.2 +
    (s.corporate_power ?? 50) * 0.2;

  const trustPressure =
    (s.corporate_power ?? 50) * 0.3 +
    (s.ai_acceleration ?? 50) * 0.25 +
    (s.climate_crisis ?? 50) * 0.25 +
    (s.digital_immersion ?? 50) * 0.2;

  const podPressure =
    (s.neural_interface ?? 50) * 0.3 +
    (s.ai_acceleration ?? 50) * 0.25 +
    (s.corporate_power ?? 50) * 0.25 +
    (s.global_convergence ?? 50) * 0.2;

  // Each outcome: sigmoid that always reaches 100, arrival shifts with pressure
  const meaning_crisis = yearSigmoid(year, arrivalYear(meaningPressure), K);
  const trust_collapse = yearSigmoid(year, arrivalYear(trustPressure), K);
  const pod_economics = yearSigmoid(year, arrivalYear(podPressure), K);

  // ── Tier 2 pressures (from Tier 1 pressures + inputs) ─────
  // Use Tier 1 PRESSURES (not time-dependent values) to avoid
  // double-counting time. Tier 2 just arrives slightly later (+5yr lag).

  const TIER2_LAG = 5; // years after Tier 1

  const escapismPressure =
    meaningPressure * 0.35 +
    (s.digital_immersion ?? 50) * 0.25 +
    (s.climate_crisis ?? 50) * 0.2 +
    (s.neural_interface ?? 50) * 0.2;

  const withdrawalPressure =
    (s.ai_acceleration ?? 50) * 0.35 +
    meaningPressure * 0.4 +
    (s.corporate_power ?? 50) * 0.25;

  const escapism_spiritual = yearSigmoid(
    year,
    arrivalYear(escapismPressure) + TIER2_LAG,
    K
  );
  const economic_withdrawal = yearSigmoid(
    year,
    arrivalYear(withdrawalPressure) + TIER2_LAG,
    K
  );

  // ── Tier 2: GDP Decline & Unemployment ───────────────────────
  // AI offsets GDP decline — use (100 - ai) so high AI = low pressure
  const gdpDeclinePressure =
    (s.climate_crisis ?? 50) * 0.3 +
    (s.demographic_collapse ?? 50) * 0.25 +
    meaningPressure * 0.2 +
    (s.corporate_power ?? 50) * 0.1 +
    (100 - (s.ai_acceleration ?? 50)) * 0.15;

  const unemploymentPressure =
    (s.ai_acceleration ?? 50) * 0.45 +
    (s.corporate_power ?? 50) * 0.2 +
    meaningPressure * 0.15 +
    (s.digital_immersion ?? 50) * 0.2;

  const gdp_decline = yearSigmoid(
    year,
    arrivalYear(gdpDeclinePressure) + TIER2_LAG,
    K
  );
  const unemployment = yearSigmoid(
    year,
    arrivalYear(unemploymentPressure) + TIER2_LAG,
    K
  );

  return {
    meaning_crisis: Math.round(clamp(meaning_crisis)),
    trust_collapse: Math.round(clamp(trust_collapse)),
    pod_economics: Math.round(clamp(pod_economics)),
    escapism_spiritual: Math.round(clamp(escapism_spiritual)),
    economic_withdrawal: Math.round(clamp(economic_withdrawal)),
    gdp_decline: Math.round(clamp(gdp_decline)),
    unemployment: Math.round(clamp(unemployment)),
  };
}

// ── Moment of Matrix ────────────────────────────────────────────

export function computeMomentOfMatrix(outcomes: OutcomeValues): number {
  const raw =
    outcomes.escapism_spiritual * 0.25 +
    outcomes.economic_withdrawal * 0.25 +
    outcomes.meaning_crisis * 0.2 +
    outcomes.trust_collapse * 0.15 +
    outcomes.pod_economics * 0.15;
  return Math.round(clamp(raw));
}

// ── Time Series ─────────────────────────────────────────────────

export function computeTimeSeries(
  inputs: SliderValues,
  regionId: string
): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  for (let year = 2025; year <= 2150; year += 5) {
    const outcomes = computeOutcomes(inputs, year, regionId);
    const matrix = computeMomentOfMatrix(outcomes);
    points.push({ year, outcomes, matrix });
  }
  return points;
}
