export interface PersonaGroup {
  label: string;
  personas: string[];
}

export const PERSONA_GROUPS: PersonaGroup[] = [
  {
    label: "The Workers",
    personas: [
      "High school teacher",
      "Long-haul truck driver",
      "Nurse",
      "Software engineer",
      "Farmer",
      "Factory worker",
      "Gig economy driver",
      "Investment banker",
    ],
  },
  {
    label: "The Creators",
    personas: [
      "Journalist",
      "Novelist",
      "Architect",
      "Film director",
      "Game designer",
      "Chef / restaurant owner",
      "Musician",
    ],
  },
  {
    label: "The Leaders",
    personas: [
      "Mayor of a mid-sized city",
      "CEO of a pod manufacturing company",
      "Military general",
      "Religious leader",
      "University president",
      "Union organizer",
    ],
  },
  {
    label: "The Edge Cases",
    personas: [
      "Amish community elder",
      "Deep-sea fisherman",
      "Antarctic research scientist",
      "Prison inmate",
      "Astronaut on Mars colony",
      "Last farmer in Iowa",
      "Pod maintenance engineer",
      "AI ethics researcher",
    ],
  },
  {
    label: "The Life Stages",
    personas: [
      "7-year-old child",
      "Teenager",
      "New parent",
      "Retiree",
      "95-year-old who remembers before",
    ],
  },
];

export function getAllPersonas(): string[] {
  return PERSONA_GROUPS.flatMap((g) => g.personas);
}
