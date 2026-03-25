import { WorldState } from "./worldEngine";

export interface PersonaAvailability {
  available: boolean;
  reason?: string;
}

interface PersonaRule {
  /** Substring match against persona name (case-insensitive) */
  match: string;
  /** Returns true when persona is UNAVAILABLE */
  condition: (ws: WorldState) => boolean;
  reason: string;
}

const PERSONA_RULES: PersonaRule[] = [
  {
    match: "investment banker",
    condition: (ws) => ws.computed.outcomes.economic_withdrawal > 75,
    reason: "Traditional banking has collapsed",
  },
  {
    match: "truck driver",
    condition: (ws) => ws.computed.aiAutonomy > 70,
    reason: "Trucking is fully automated",
  },
  {
    match: "factory worker",
    condition: (ws) => ws.computed.aiAutonomy > 80,
    reason: "Factories are fully automated",
  },
  {
    match: "farmer",
    condition: (ws) =>
      ws.computed.podAdoption > 70 && ws.computed.climateTemp > 3,
    reason: "Industrial farming has ended",
  },
  {
    match: "gig economy driver",
    condition: (ws) => ws.computed.aiAutonomy > 65,
    reason: "Ride services are autonomous",
  },
  {
    match: "gig driver",
    condition: (ws) => ws.computed.aiAutonomy > 65,
    reason: "Ride services are autonomous",
  },
  {
    match: "journalist",
    condition: (ws) => ws.computed.outcomes.trust_collapse > 85,
    reason: "Institutional media no longer exists",
  },
  {
    match: "film director",
    condition: (ws) =>
      ws.computed.digitalLife > 85 && ws.computed.podAdoption > 60,
    reason: "Film merged into immersive sim",
  },
  {
    match: "chef",
    condition: (ws) => ws.computed.podAdoption > 75,
    reason: "Physical restaurants are rare",
  },
  {
    match: "restaurant owner",
    condition: (ws) => ws.computed.podAdoption > 75,
    reason: "Physical restaurants are rare",
  },
  {
    match: "university president",
    condition: (ws) => ws.computed.digitalLife > 80,
    reason: "Universities dissolved into networks",
  },
  {
    match: "union organizer",
    condition: (ws) => ws.computed.outcomes.economic_withdrawal > 80,
    reason: "Traditional employment is gone",
  },
  {
    match: "deep-sea fisherman",
    condition: (ws) => ws.computed.climateTemp > 3.5,
    reason: "Ocean ecosystems have collapsed",
  },
  {
    match: "fisherman",
    condition: (ws) => ws.computed.climateTemp > 3.5,
    reason: "Ocean ecosystems have collapsed",
  },
  {
    match: "mayor",
    condition: (ws) => ws.computed.podAdoption > 70,
    reason: "Physical cities largely depopulated",
  },
  {
    match: "military general",
    condition: (ws) => ws.computed.aiAutonomy > 85,
    reason: "Military is AI-managed",
  },
  {
    match: "prison inmate",
    condition: (ws) => ws.computed.podAdoption > 70,
    reason: "Physical incarceration replaced by digital",
  },
];

/**
 * Check whether a persona is "available" in the given world state.
 * Unavailable personas still appear (and are clickable) but are greyed out with a reason.
 */
export function checkPersonaAvailability(
  persona: string,
  worldState: WorldState
): PersonaAvailability {
  const lower = persona.toLowerCase();
  for (const rule of PERSONA_RULES) {
    if (lower.includes(rule.match) && rule.condition(worldState)) {
      return { available: false, reason: rule.reason };
    }
  }
  return { available: true };
}
