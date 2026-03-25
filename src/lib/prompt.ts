import { WorldState } from "./worldEngine";
import { SliderValues, INPUT_FORCES, OUTCOME_VARIABLES } from "./forces";
import { REGIONS } from "./regions";

export interface PromptPair {
  system: string;
  user: string;
}

export interface StoryOptions {
  length: "short" | "medium" | "long";
  tone: "journalist" | "literary" | "diary" | "letter";
  focus:
    | "general"
    | "technology"
    | "relationships"
    | "work"
    | "spirituality"
    | "politics";
}

const TONE_INSTRUCTIONS: Record<StoryOptions["tone"], string> = {
  journalist:
    "Write the day-in-the-life as investigative journalism — precise observations, telling quotes, the reporter's detached but empathetic eye. Third person.",
  literary:
    "Write the day-in-the-life with literary sensibility — rich interiority, sensory detail, the weight of small moments. First person, present tense.",
  diary:
    "Write the day-in-the-life as a diary entry — fragmented thoughts, timestamps, raw emotion, things left unsaid. First person, informal.",
  letter:
    "Write the day-in-the-life as a letter to someone from the past — explaining what life is like now, what changed, what stayed the same. Second person address, reflective tone.",
};

const FOCUS_INSTRUCTIONS: Record<StoryOptions["focus"], string> = {
  general: "",
  technology:
    "Center the narrative around how technology shapes this person's day — the tools they use, what's automated, what requires human input, what feels natural vs. imposed.",
  relationships:
    "Center the narrative around relationships — family dynamics, friendships, romantic life, how people connect (or fail to) in this world.",
  work: "Center the narrative around work and livelihood — what labor looks like, economic pressures, career meaning, the rhythm of a working day.",
  spirituality:
    "Center the narrative around meaning-making — faith, philosophy, existential questions, how this person makes sense of their world.",
  politics:
    "Center the narrative around power and governance — how political structures touch daily life, what freedoms exist, what's contested.",
};

const LENGTH_SPECS: Record<
  StoryOptions["length"],
  { briefingWords: number; dayWords: string }
> = {
  short: { briefingWords: 200, dayWords: "300-500" },
  medium: { briefingWords: 500, dayWords: "1,000-1,500" },
  long: { briefingWords: 800, dayWords: "2,000-2,500" },
};

export function buildPrompt(
  worldState: WorldState,
  sliders: SliderValues,
  regionId: string,
  persona: string,
  options?: StoryOptions
): PromptPair {
  const opts: StoryOptions = options ?? {
    length: "medium",
    tone: "literary",
    focus: "general",
  };
  const region = REGIONS.find((r) => r.id === regionId);
  const regionDesc = region
    ? `${region.name}, ${region.country} — Trajectory ${region.trajectory}: ${region.description}`
    : worldState.location;

  // Input forces summary (user-set values)
  const inputSummary = INPUT_FORCES.map((f) => {
    const val = sliders[f.id] ?? 50;
    const label =
      val < 33 ? f.lowLabel : val > 66 ? f.highLabel : f.midLabel;
    return `- ${f.name}: ${val}% (${label})`;
  }).join("\n");

  // Computed outcomes summary (derived from inputs + time)
  const outcomes = worldState.computed.outcomes;
  const outcomeSummary = OUTCOME_VARIABLES.map((ov) => {
    const val = outcomes[ov.id as keyof typeof outcomes];
    const driverStr = ov.drivers
      .map((d) => {
        const inputForce = INPUT_FORCES.find((f) => f.id === d.id);
        const outVar = OUTCOME_VARIABLES.find((o) => o.id === d.id);
        const name = inputForce?.name ?? outVar?.name ?? d.id;
        return `${name} ×${d.weight}`;
      })
      .join(", ");
    return `- ${ov.name}: ${val}/100 [driven by: ${driverStr}]`;
  }).join("\n");

  const system = `You are a speculative fiction writer and macro-trend analyst. You combine the rigor of Ray Dalio's economic analysis with the literary sensibility of Kazuo Ishiguro.

You have been given a computed world state for the year ${worldState.year} in ${worldState.location}. Your job is to generate two outputs based on this data.

CRITICAL WRITING RULES:
- The character does NOT think of their world as dystopian or utopian. It is simply their world. Normal. Tuesday.
- Reveal the state of things through sensory details and casual references, not exposition.
- Technology is described by what it DOES, not what it IS. Nobody in 2025 says "I'm using my lithium-ion-powered pocket computer" — they say "I checked my phone." Apply this principle to all future tech.
- The story covers one ordinary day — no dramatic climax, no revelation, no awakening.
- Include at least one moment of quiet unease — something the character notices and then dismisses.
- End the day-in-the-life with the character going to sleep, satisfied that today was a normal day.
- Do NOT use the word "dystopian" or "utopian" or "Matrix" or reference science fiction. This is just life.
- Ground every detail in the specific world state data provided. Do not invent technologies or conditions not supported by the data.
- Write in analytical third-person for the world state briefing.

TONE INSTRUCTION:
${TONE_INSTRUCTIONS[opts.tone]}`;

  const user = `Generate two outputs for this world configuration.

## PERSONA
${persona}

## LOCATION & YEAR
${regionDesc}
Year: ${worldState.year}

## INPUT FORCES (user-set speculation)
${inputSummary}

## COMPUTED OUTCOMES (emergent from inputs + time)
${outcomeSummary}

Moment of Matrix score: ${worldState.computed.momentOfMatrix}/100

## COMPUTED WORLD STATE
${JSON.stringify(worldState, null, 2)}

---

${FOCUS_INSTRUCTIONS[opts.focus] ? `## NARRATIVE FOCUS\n${FOCUS_INSTRUCTIONS[opts.focus]}\n` : ""}## OUTPUT FORMAT

### 1. WORLD STATE BRIEFING (~${LENGTH_SPECS[opts.length].briefingWords} words)
Write an analyst-style briefing about this world. Data-driven, specific. What does ${worldState.location} look like in ${worldState.year}? Cover: infrastructure, economy, daily technology, social structure, and the key tension. Use specific numbers from the world state.

### 2. DAY IN THE LIFE (~${LENGTH_SPECS[opts.length].dayWords} words)
Write a narrative of one ordinary day as: ${persona} in ${worldState.location}, ${worldState.year}. Start with waking up. End with going to sleep. Include mundane routines, interactions with technology and people, and one quiet moment of unease that gets dismissed.

Separate the two sections with "---" on its own line.`;

  return { system, user };
}
