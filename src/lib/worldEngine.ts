import { SliderValues } from "./forces";
import { REGIONS, Region } from "./regions";
import {
  computeOutcomes,
  computeMomentOfMatrix,
  OutcomeValues,
} from "./outcomeEngine";

// ── World State Output ──────────────────────────────────────────

export interface WorldState {
  year: number;
  location: string;
  trajectory: string;
  pod_adoption_pct: number;
  physical_infrastructure_state: string;
  dominant_interface: string;
  economic_model: string;
  population_trend: string;
  last_unmediated_generation: string;
  ai_autonomy_level: string;
  cultural_mood: string;
  key_tension: string;
  resistance_status: string;
  physical_world: {
    cities: string;
    climate: string;
    nature: string;
  };
  technology: {
    neural_interfaces: string;
    ar_glasses: string;
    autonomous_robots: string;
    simulation_quality: string;
  };
  society: {
    education: string;
    work: string;
    religion: string;
    family_structure: string;
  };
  // Raw computed values for the preview panel
  computed: {
    podAdoption: number;
    aiAutonomy: number;
    digitalLife: number;
    physicalDecay: number;
    climateTemp: number;
    populationPct: number;
    trustLevel: number;
    meaningLevel: number;
    gdpDecline: number;
    unemployment: number;
    outcomes: OutcomeValues;
    momentOfMatrix: number;
  };
}

// ── Math Helpers ─────────────────────────────────────────────────

/** Sigmoid curve: slow start → rapid middle → saturation */
function sigmoid(x: number, midpoint: number, steepness: number): number {
  return 1 / (1 + Math.exp(-steepness * (x - midpoint)));
}

/** Clamp 0-100 */
function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

/** Linear ramp from 0 at low to 1 at high */
function ramp(value: number, low: number, high: number): number {
  return Math.max(0, Math.min(1, (value - low) / (high - low)));
}

// ── Engine ───────────────────────────────────────────────────────

export function computeWorldState(
  sliders: SliderValues,
  year: number,
  regionId: string
): WorldState {
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];

  // Compute outcome variables from inputs + time
  const outcomes = computeOutcomes(sliders, year, regionId);
  const momentOfMatrix = computeMomentOfMatrix(outcomes);

  // Apply regional modifiers to slider values for local derivations
  const s = applyRegionalModifiers(sliders, region);

  // Merge computed outcomes into s so derivation functions can read them
  s.meaning_crisis = outcomes.meaning_crisis;
  s.trust_collapse = outcomes.trust_collapse;
  s.pod_economics = outcomes.pod_economics;
  s.escapism_spiritual = outcomes.escapism_spiritual;
  s.economic_withdrawal = outcomes.economic_withdrawal;
  s.gdp_decline = outcomes.gdp_decline;
  s.unemployment = outcomes.unemployment;

  // Time factor: 0 = 2025, 1 = 2150
  const t = (year - 2025) / 125;
  // Decades from now
  const decades = (year - 2025) / 10;

  // ── Compute base adoption curves ────────────────────────────

  // AI autonomy: sigmoid adoption, accelerated by slider
  const aiBase = sigmoid(t, 0.3 - (s.ai_acceleration - 50) * 0.002, 6);
  const aiAutonomy = clamp(aiBase * 100);

  // Neural interface adoption: sigmoid, gated by slider
  const neuralBase = sigmoid(
    t,
    0.35 - (s.neural_interface - 50) * 0.003,
    5
  );
  const neuralAdoption = clamp(neuralBase * 100 * (s.neural_interface / 80));

  // Digital immersion: linear growth accelerated by slider
  const digitalBase = clamp(
    30 + decades * (s.digital_immersion / 50) * 8 + neuralAdoption * 0.3
  );

  // Climate temperature
  const climateTemp = 1.1 + (s.climate_crisis / 50) * decades * 0.15;

  // Pod adoption: requires tech readiness + social/climate demand
  const podAdoption = computePodAdoption(s, t, neuralAdoption, aiAutonomy, climateTemp);

  // Trust and meaning levels — derived from computed outcomes (already time-factored)
  const trustLevel = clamp(100 - s.trust_collapse);
  const meaningLevel = clamp(100 - s.meaning_crisis);

  // Physical infrastructure decay: inversely related to pod adoption + climate
  const physicalDecay = clamp(
    podAdoption * 0.6 + s.climate_crisis * 0.2 + decades * 2
  );

  // Population trend
  const populationPct = computePopulation(s, decades, region);

  // ── Apply interaction rules ─────────────────────────────────

  // AI + silent coup scenario
  const silentCoup = s.ai_acceleration > 90 && year > 2030;

  // ── Derive qualitative state ────────────────────────────────

  const dominant_interface = deriveDominantInterface(
    neuralAdoption,
    digitalBase,
    year
  );
  const economic_model = deriveEconomicModel(s, podAdoption, silentCoup);
  const ai_autonomy_level = deriveAILevel(aiAutonomy, silentCoup);
  const cultural_mood = deriveCulturalMood(s, meaningLevel, trustLevel, podAdoption);
  const key_tension = deriveKeyTension(s, podAdoption, year);
  const resistance_status = deriveResistance(s, podAdoption, trustLevel);
  const physical_infrastructure_state = deriveInfrastructure(physicalDecay);
  const last_unmediated = year <= 2032 ? "current children" : `born before ${Math.min(year, 2032 + Math.floor(decades * 2))}`;

  return {
    year,
    location: `${region.name}, ${region.country}`,
    trajectory: `${region.trajectory} (${region.description})`,
    pod_adoption_pct: Math.round(podAdoption),
    physical_infrastructure_state,
    dominant_interface,
    economic_model,
    population_trend: derivePopulationTrend(populationPct, region),
    last_unmediated_generation: last_unmediated,
    ai_autonomy_level,
    cultural_mood,
    key_tension,
    resistance_status,
    physical_world: {
      cities: deriveCityState(physicalDecay, podAdoption),
      climate: `+${climateTemp.toFixed(1)}°C, ${deriveClimateEffects(climateTemp, region)}`,
      nature: deriveNature(physicalDecay, climateTemp),
    },
    technology: {
      neural_interfaces: deriveNeuralState(neuralAdoption, year),
      ar_glasses: deriveARState(digitalBase, neuralAdoption),
      autonomous_robots: deriveRobotState(aiAutonomy),
      simulation_quality: deriveSimQuality(digitalBase, neuralAdoption, year),
    },
    society: {
      education: deriveEducation(digitalBase, podAdoption),
      work: deriveWork(aiAutonomy, s.economic_withdrawal, podAdoption),
      religion: deriveReligion(s.meaning_crisis, s.escapism_spiritual, podAdoption),
      family_structure: deriveFamily(podAdoption, s.demographic_collapse),
    },
    computed: {
      podAdoption: Math.round(podAdoption),
      aiAutonomy: Math.round(aiAutonomy),
      digitalLife: Math.round(digitalBase),
      physicalDecay: Math.round(physicalDecay),
      climateTemp: parseFloat(climateTemp.toFixed(1)),
      populationPct: Math.round(populationPct),
      trustLevel: Math.round(trustLevel),
      meaningLevel: Math.round(meaningLevel),
      gdpDecline: outcomes.gdp_decline,
      unemployment: outcomes.unemployment,
      outcomes,
      momentOfMatrix,
    },
  };
}

// ── Internal computations ────────────────────────────────────────

function applyRegionalModifiers(
  sliders: SliderValues,
  region: Region
): Record<string, number> {
  const modified: Record<string, number> = { ...sliders };
  for (const [key, mod] of Object.entries(region.modifiers)) {
    if (key in modified) {
      modified[key] = clamp(modified[key] + mod);
    }
  }
  return modified;
}

function computePodAdoption(
  s: Record<string, number>,
  t: number,
  neuralAdoption: number,
  aiAutonomy: number,
  climateTemp: number
): number {
  // Tech prerequisites — all must be met for significant adoption
  const aiGate = ramp(aiAutonomy, 50, 80);       // AI must manage pod infrastructure
  const neuralGate = ramp(neuralAdoption, 20, 50); // need interface tech
  const econGate = ramp(s.pod_economics, 20, 60);  // must be affordable
  const techGate = aiGate * neuralGate * econGate;

  // Social demand — computed outcomes only (time-dependent), no raw inputs
  const demand =
    (s.meaning_crisis * 0.3 +
      s.trust_collapse * 0.25 +
      s.escapism_spiritual * 0.35 +
      s.economic_withdrawal * 0.1) /
    100;

  // Climate emergency push — kicks in above 2°C
  const climatePush = Math.max(0, Math.min(1, (climateTemp - 2) / 2)) * 0.5;

  // Growth S-curve (adoption can't jump from 0 to 100 instantly)
  const growthCurve = sigmoid(t, 0.4, 5);

  return clamp(growthCurve * techGate * Math.max(demand, climatePush) * 100);
}

function computePopulation(
  s: Record<string, number>,
  decades: number,
  region: Region
): number {
  // 100 = current, declines with demographic collapse
  const baseDecline = (s.demographic_collapse / 100) * decades * 3;
  const regionBonus = region.trajectory === "B" ? 10 : region.trajectory === "C" ? 0 : -5;
  return clamp(100 - baseDecline + regionBonus);
}

function derivePopulationTrend(populationPct: number, region: Region): string {
  const trend =
    populationPct > 95
      ? "stable"
      : populationPct > 80
        ? "gradual decline"
        : populationPct > 60
          ? "significant decline"
          : "severe contraction";
  const regional =
    region.trajectory === "B"
      ? " (youngest demographics, slower decline)"
      : region.trajectory === "C"
        ? " (state-managed population policy)"
        : "";
  return `${Math.round(populationPct)}% of 2025 level — ${trend}${regional}`;
}

// ── Qualitative derivation functions ────────────────────────────

function deriveDominantInterface(
  neural: number,
  digital: number,
  year: number
): string {
  if (neural > 70) return "full-immersion neural link";
  if (neural > 40) return "consumer neural interface + AR";
  if (digital > 70 || year > 2045) return "ubiquitous AR glasses";
  if (digital > 50) return "AR glasses + smartphones";
  return "smartphones + early AR";
}

function deriveEconomicModel(
  s: Record<string, number>,
  podAdoption: number,
  silentCoup: boolean
): string {
  if (silentCoup) return "AI-managed resource allocation";
  if (s.corporate_power > 80 && s.trust_collapse > 70)
    return "corporate feudalism";
  if (podAdoption > 60 && s.corporate_power > 60)
    return "life-as-a-service subscription";
  if (s.economic_withdrawal > 70) return "UBI + gig fragments";
  if (podAdoption > 40) return "hybrid subscription-state";
  if (s.corporate_power > 70) return "megacorp oligopoly";
  return "modified market economy";
}

function deriveAILevel(autonomy: number, silentCoup: boolean): string {
  if (silentCoup) return "autonomous decision-maker, humans advisory";
  if (autonomy > 80) return "manages most infrastructure";
  if (autonomy > 60) return "co-manages infrastructure with humans";
  if (autonomy > 40) return "handles routine decisions";
  if (autonomy > 20) return "powerful assistant tool";
  return "narrow task automation";
}

function deriveCulturalMood(
  s: Record<string, number>,
  meaning: number,
  trust: number,
  podAdoption: number
): string {
  if (s.meaning_crisis > 80 && s.escapism_spiritual > 70 && s.demographic_collapse > 60)
    return "voluntary exodus — quiet acceptance of digital migration";
  if (trust < 20 && meaning < 20) return "collective nihilism";
  if (podAdoption > 60 && meaning < 30) return "comfortable numbness";
  if (s.climate_crisis > 80) return "survival solidarity";
  if (trust < 30) return "fragmented tribalism";
  if (meaning > 60 && trust > 50) return "cautious optimism";
  if (meaning < 40) return "aspirational but anxious";
  return "uneasy normalcy";
}

function deriveKeyTension(
  s: Record<string, number>,
  podAdoption: number,
  year: number
): string {
  if (s.ai_acceleration > 90 && year > 2030)
    return "human relevance vs. AI competence";
  if (podAdoption > 30 && podAdoption < 70)
    return "digital divide between pod and physical life";
  if (s.corporate_power > 80)
    return "corporate control vs. individual autonomy";
  if (s.climate_crisis > 75) return "climate survival vs. economic growth";
  if (s.meaning_crisis > 75 && s.escapism_spiritual > 60)
    return "embodiment vs. transcendence";
  if (s.trust_collapse > 75) return "institutional legitimacy crisis";
  return "pace of change vs. human adaptability";
}

function deriveResistance(
  s: Record<string, number>,
  podAdoption: number,
  trustLevel: number
): string {
  if (podAdoption > 70 && trustLevel < 20)
    return "small, disconnected physical-world enclaves";
  if (s.corporate_power > 80 && s.trust_collapse > 70)
    return "active but marginalized resistance movements";
  if (podAdoption > 50) return "growing back-to-physical movement";
  if (trustLevel < 30)
    return "widespread passive non-compliance";
  return "localized community alternatives";
}

function deriveInfrastructure(decay: number): string {
  if (decay > 80) return "abandoned — maintained only by robots";
  if (decay > 60) return "selectively maintained — triage zones";
  if (decay > 40) return "partially maintained — visible decline";
  if (decay > 20) return "aging but functional";
  return "well maintained";
}

function deriveCityState(decay: number, podAdoption: number): string {
  if (decay > 75) return `${Math.round(90 - decay * 0.5)}% occupied, rest rewilding or automated`;
  if (podAdoption > 50) return `mixed pod-districts and traditional zones, ${Math.round(70 - podAdoption * 0.3)}% traditional`;
  if (decay > 40) return "urban contraction visible, some zones abandoned";
  return "mostly traditional, pod-quarters emerging in tech districts";
}

function deriveClimateEffects(temp: number, region: Region): string {
  const base =
    temp > 3
      ? "severe disruption"
      : temp > 2
        ? "significant disruption"
        : temp > 1.5
          ? "noticeable changes"
          : "within adaptation range";
  const regional =
    region.trajectory === "B"
      ? ", disproportionate impact on developing regions"
      : "";
  return base + regional;
}

function deriveNature(decay: number, temp: number): string {
  if (decay > 70 && temp > 2.5)
    return "partial recovery in abandoned zones, stressed ecosystems elsewhere";
  if (decay > 50) return "rewilding in depopulated areas, urban nature reclaims";
  if (temp > 3) return "ecosystem under severe stress, mass migration of species";
  return "managed decline, conservation efforts ongoing";
}

function deriveNeuralState(adoption: number, year: number): string {
  if (adoption > 80) return "ubiquitous, multiple generations native";
  if (adoption > 60) return "mainstream consumer product";
  if (adoption > 40) return "consumer-grade, rapidly spreading";
  if (adoption > 20) return "early consumer, mostly non-invasive";
  if (year > 2035) return "niche medical and military use";
  return "experimental, research-stage";
}

function deriveARState(digital: number, neural: number): string {
  if (neural > 60) return "largely superseded by neural interfaces";
  if (digital > 70) return "ubiquitous as smartphones were";
  if (digital > 50) return "mainstream, most adults own a pair";
  return "growing adoption, smartphone companion";
}

function deriveRobotState(aiAutonomy: number): string {
  if (aiAutonomy > 80) return `handle ${Math.round(50 + aiAutonomy * 0.4)}% of physical maintenance`;
  if (aiAutonomy > 60) return "manage most logistics and maintenance";
  if (aiAutonomy > 40) return "common in warehouses and delivery";
  return "limited to structured environments";
}

function deriveSimQuality(
  digital: number,
  neural: number,
  year: number
): string {
  if (neural > 70 && year > 2060) return "near-perfect sensory simulation";
  if (neural > 50) return "convincing multi-sensory, some uncanny moments";
  if (digital > 70) return "high-fidelity visual/audio, limited haptic";
  if (digital > 50) return "good visual fidelity, improving haptics";
  return "screen-based, early spatial computing";
}

function deriveEducation(digital: number, podAdoption: number): string {
  if (podAdoption > 70) return `${Math.round(70 + podAdoption * 0.2)}% immersive virtual`;
  if (digital > 70) return "mostly virtual with optional physical campuses";
  if (digital > 50) return "hybrid virtual-physical, trending virtual";
  return "primarily physical with digital tools";
}

function deriveWork(
  aiAutonomy: number,
  withdrawal: number,
  podAdoption: number
): string {
  if (aiAutonomy > 80 && withdrawal > 70)
    return `${Math.round(50 + podAdoption * 0.3)}% virtual economy, most physical work automated`;
  if (aiAutonomy > 60) return "most routine work automated, creative/care work remains";
  if (withdrawal > 60) return "widespread gig economy, declining full-time employment";
  return "traditional employment with growing automation pressure";
}

function deriveReligion(
  meaning: number,
  escapism: number,
  podAdoption: number
): string {
  if (escapism > 80 && podAdoption > 50)
    return "digital spirituality movements dominant, traditional religion in decline";
  if (meaning > 70) return "splintered into digital and physical congregations";
  if (meaning > 50) return "declining traditional practice, new meaning movements emerging";
  return "traditional institutions weakened but persisting";
}

function deriveFamily(podAdoption: number, demographic: number): string {
  if (podAdoption > 60 && demographic > 70)
    return "mixed pod-physical households, reproduction increasingly assisted/artificial";
  if (podAdoption > 40) return "pod-physical hybrid families, smaller by choice";
  if (demographic > 60) return "smaller families, aging populations, multi-generational decline";
  return "traditional structures under demographic pressure";
}
