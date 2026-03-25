export interface Force {
  id: string;
  name: string;
  description: string;
  lowLabel: string;
  midLabel: string;
  highLabel: string;
  defaultValue: number; // 50 = current trajectory
}

export interface OutcomeVariable {
  id: string;
  name: string;
  description: string;
  drivers: { id: string; weight: number }[];
}

// ── 7 Input Forces (user-controlled) ───────────────────────────

export const INPUT_FORCES: Force[] = [
  {
    id: "ai_acceleration",
    name: "AI Acceleration",
    description:
      "Rate of AI capability growth — from regulatory freeze to recursive self-improvement",
    lowLabel: "AI Winter",
    midLabel: "4-5x/yr compute growth",
    highLabel: "Recursive self-improvement",
    defaultValue: 50,
  },
  {
    id: "climate_crisis",
    name: "Climate Crisis",
    description:
      "Severity of climate disruption — from successful mitigation to cascading tipping points",
    lowLabel: "Mitigation succeeds",
    midLabel: "+2.7°C by 2100",
    highLabel: "Cascading tipping points",
    defaultValue: 50,
  },
  {
    id: "neural_interface",
    name: "Neural Interface Tech",
    description:
      "Brain-computer interface progress — from public rejection to consumer full-immersion",
    lowLabel: "Regulatory block",
    midLabel: "Consumer non-invasive 2030",
    highLabel: "Full immersion by 2035",
    defaultValue: 50,
  },
  {
    id: "corporate_power",
    name: "Corporate Power",
    description:
      "Concentration of corporate control — from antitrust breakup to megacorp dominance",
    lowLabel: "Platforms broken up",
    midLabel: "Consolidation continues",
    highLabel: "3 megacorps control all",
    defaultValue: 50,
  },
  {
    id: "demographic_collapse",
    name: "Demographic Collapse",
    description:
      "Rate of population decline — from stabilization to extreme collapse",
    lowLabel: "TFR stabilizes",
    midLabel: "Global TFR 1.6 by 2050",
    highLabel: "Sub-1.0 TFR by 2040",
    defaultValue: 50,
  },
  {
    id: "digital_immersion",
    name: "Digital Immersion",
    description:
      "Share of life spent in digital environments — from cultural backlash to near-total immersion",
    lowLabel: "Screen-time backlash",
    midLabel: "AR normalization",
    highLabel: "90%+ waking life digital",
    defaultValue: 50,
  },
  {
    id: "global_convergence",
    name: "Global Convergence",
    description:
      "Whether regions converge or diverge — from widening digital divide to rapid convergence",
    lowLabel: "Regions diverge further",
    midLabel: "30-50 year lag",
    highLabel: "Convergence within 20 years",
    defaultValue: 50,
  },
];

// ── 5 Outcome Variables (computed, not user-set) ────────────────

export const OUTCOME_VARIABLES: OutcomeVariable[] = [
  {
    id: "meaning_crisis",
    name: "Meaning Crisis",
    description: "Erosion of shared meaning and purpose",
    drivers: [
      { id: "digital_immersion", weight: 0.35 },
      { id: "ai_acceleration", weight: 0.25 },
      { id: "demographic_collapse", weight: 0.2 },
      { id: "corporate_power", weight: 0.2 },
    ],
  },
  {
    id: "trust_collapse",
    name: "Trust Collapse",
    description: "Erosion of institutional trust",
    drivers: [
      { id: "corporate_power", weight: 0.3 },
      { id: "ai_acceleration", weight: 0.25 },
      { id: "climate_crisis", weight: 0.25 },
      { id: "digital_immersion", weight: 0.2 },
    ],
  },
  {
    id: "pod_economics",
    name: "Pod Economics",
    description: "Viability and cost trajectory of pod living",
    drivers: [
      { id: "neural_interface", weight: 0.3 },
      { id: "ai_acceleration", weight: 0.25 },
      { id: "corporate_power", weight: 0.25 },
      { id: "global_convergence", weight: 0.2 },
    ],
  },
  {
    id: "escapism_spiritual",
    name: "Escapism / Spiritual",
    description: "Drive toward transcendence and digital escape",
    drivers: [
      { id: "meaning_crisis", weight: 0.35 },
      { id: "digital_immersion", weight: 0.25 },
      { id: "climate_crisis", weight: 0.2 },
      { id: "neural_interface", weight: 0.2 },
    ],
  },
  {
    id: "economic_withdrawal",
    name: "Economic Withdrawal",
    description: "Disengagement from traditional economy",
    drivers: [
      { id: "ai_acceleration", weight: 0.35 },
      { id: "meaning_crisis", weight: 0.4 },
      { id: "corporate_power", weight: 0.25 },
    ],
  },
];

// ── Backward-compat alias (all 12 force metadata) ──────────────

export const FORCES: Force[] = INPUT_FORCES;

// ── Slider helpers ──────────────────────────────────────────────

export type SliderValues = Record<string, number>;

export function getDefaultSliders(): SliderValues {
  const values: SliderValues = {};
  for (const f of INPUT_FORCES) {
    values[f.id] = f.defaultValue;
  }
  return values;
}
