import { WorldState } from "./worldEngine";

/**
 * System prompt for Claude Haiku — converts world state into a visual scene description.
 */
export function buildImageSystemPrompt(): string {
  return `You are a visual scene designer for a speculative fiction simulator.

Your job: describe ONLY what someone sees looking out their window. No humans, no faces, no figures.

Rules:
- 60-80 words, one paragraph
- Cinematic composition, muted color palette
- Focus on: sky, architecture, nature, technology, atmosphere
- Ground details in the world state data provided
- No metaphors, no narration — pure visual description
- Write as a scene description for an image generator`;
}

/**
 * User prompt for Haiku — feeds world state fields + story excerpt.
 */
export function buildImageUserPrompt(
  worldState: WorldState,
  storyExcerpt: string
): string {
  const last200Words = storyExcerpt.split(/\s+/).slice(-200).join(" ");

  return `Describe the view outside this character's window.

WORLD STATE:
- Year: ${worldState.year}
- Location: ${worldState.location}
- Cities: ${worldState.physical_world.cities}
- Climate: ${worldState.physical_world.climate}
- Nature: ${worldState.physical_world.nature}
- Dominant interface: ${worldState.dominant_interface}
- Autonomous robots: ${worldState.technology.autonomous_robots}
- AR glasses: ${worldState.technology.ar_glasses}
- Cultural mood: ${worldState.cultural_mood}
- Pod adoption: ${worldState.pod_adoption_pct}%
- Infrastructure: ${worldState.physical_infrastructure_state}

STORY EXCERPT (for atmosphere):
${last200Words}

Write ONLY the visual scene description. 60-80 words.`;
}

/**
 * Wraps the Haiku scene description with gpt-image-1 style instructions.
 */
export function formatForImageGen(
  sceneDescription: string,
  worldState: WorldState
): string {
  const eraPrefix =
    worldState.year <= 2040
      ? "Near-future"
      : worldState.year <= 2080
        ? "Mid-future"
        : "Far-future";

  return `${eraPrefix} ${worldState.location}, year ${worldState.year}. View through a window frame, looking outward. No people, no faces, no human figures.

${sceneDescription}

Style: photorealistic with painterly quality, muted tones with subtle emerald tint, cinematic lighting, atmospheric depth. Window frame visible at edges.`;
}

/**
 * Fallback: deterministic scene prompt built directly from world state
 * when no Anthropic API key is available for Haiku.
 */
export function buildFallbackScenePrompt(worldState: WorldState): string {
  const ws = worldState;
  const decay = ws.computed.physicalDecay;
  const temp = ws.computed.climateTemp;

  let sky = "overcast sky";
  if (temp > 3) sky = "hazy amber sky, thick with particulates";
  else if (temp > 2) sky = "pale sky with an orange-brown haze at the horizon";
  else if (temp > 1.5) sky = "slightly hazy sky";

  let cityscape = "modern city skyline";
  if (decay > 75) cityscape = "crumbling towers overtaken by vegetation, robotic maintenance drones hovering";
  else if (decay > 50) cityscape = "half-lit buildings, some dark and abandoned, green patches reclaiming rooftops";
  else if (decay > 30) cityscape = "aging cityscape with scattered construction drones and overgrown facades";

  let tech = "";
  if (ws.computed.podAdoption > 50) tech = "Pod-district towers glow faintly with blue-white light. ";
  if (ws.computed.aiAutonomy > 60) tech += "Autonomous vehicles glide silently below. ";
  if (ws.computed.digitalLife > 70) tech += "AR overlay markers float in the air outside. ";

  return formatForImageGen(
    `${sky}. ${cityscape}. ${tech}${ws.physical_world.nature}.`,
    worldState
  );
}
