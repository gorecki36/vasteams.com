import { SliderValues } from "./forces";

export interface Preset {
  id: string;
  name: string;
  description: string;
  values: SliderValues;
}

export const PRESETS: Preset[] = [
  {
    id: "slow_burn",
    name: "Slow Burn",
    description:
      "Nothing dramatic happens. That's the problem. Every force inches forward, and one day you look up.",
    values: {
      ai_acceleration: 50,
      climate_crisis: 50,
      neural_interface: 50,
      corporate_power: 50,
      demographic_collapse: 50,
      digital_immersion: 50,
      global_convergence: 50,
    },
  },
  {
    id: "early_singularity",
    name: "Early Singularity",
    description:
      "Recursive AI self-improvement arrives a decade early — everything downstream accelerates",
    values: {
      ai_acceleration: 95,
      climate_crisis: 45,
      neural_interface: 85,
      corporate_power: 80,
      demographic_collapse: 55,
      digital_immersion: 90,
      global_convergence: 70,
    },
  },
  {
    id: "climate_endgame",
    name: "Climate Endgame",
    description:
      "The outside becomes unlivable. Pods aren't an escape — they're shelter.",
    values: {
      ai_acceleration: 55,
      climate_crisis: 95,
      neural_interface: 50,
      corporate_power: 60,
      demographic_collapse: 70,
      digital_immersion: 65,
      global_convergence: 30,
    },
  },
  {
    id: "ready_player_one",
    name: "Ready Player One",
    description:
      "Digital worlds become more fun, more social, more real than anything outside. Why would you leave?",
    values: {
      ai_acceleration: 70,
      climate_crisis: 40,
      neural_interface: 90,
      corporate_power: 65,
      demographic_collapse: 60,
      digital_immersion: 95,
      global_convergence: 65,
    },
  },
  {
    id: "voluntary_exodus",
    name: "Voluntary Exodus",
    description:
      "Humanity collectively drifts into digital existence — not by force, but by preference",
    values: {
      ai_acceleration: 70,
      climate_crisis: 55,
      neural_interface: 85,
      corporate_power: 60,
      demographic_collapse: 80,
      digital_immersion: 95,
      global_convergence: 55,
    },
  },
  {
    id: "best_case",
    name: "Best Case",
    description:
      "Institutions reform, tech is regulated, meaning frameworks emerge",
    values: {
      ai_acceleration: 35,
      climate_crisis: 15,
      neural_interface: 30,
      corporate_power: 15,
      demographic_collapse: 20,
      digital_immersion: 25,
      global_convergence: 60,
    },
  },
];
