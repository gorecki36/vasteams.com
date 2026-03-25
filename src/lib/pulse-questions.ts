export interface PulseQuestion {
  id: string;
  column: string;
  baselineText: string;
  weeklyText: string;
  label: string;
  construct: "substitution" | "expansion" | "meaning" | "efficacy" | "role_breadth" | "addiction" | "progress";
}

export const PULSE_QUESTIONS: PulseQuestion[] = [
  {
    id: "q1",
    column: "q1_substitution",
    baselineText: "Since I started using AI, it has replaced thinking I would normally do myself.",
    weeklyText: "Compared to last week, AI replaced more of the thinking I would normally do myself.",
    label: "Substitution",
    construct: "substitution",
  },
  {
    id: "q2",
    column: "q2_expansion",
    baselineText: "Since I started using AI, it has helped me see questions, options, or answers I wouldn't have reached on my own.",
    weeklyText: "Compared to last week, AI helped me see more questions, options, or answers I wouldn't have reached on my own.",
    label: "Expansion",
    construct: "expansion",
  },
  {
    id: "q3",
    column: "q3_meaning",
    baselineText: "Since I started using AI, my work feels more meaningful.",
    weeklyText: "Compared to last week, using AI made my work feel more meaningful.",
    label: "Meaning",
    construct: "meaning",
  },
  {
    id: "q4",
    column: "q4_efficacy",
    baselineText: "Since I started using AI, I feel more confident in my ability to do my job well.",
    weeklyText: "Compared to last week, I felt more confident in my ability to do my job well.",
    label: "Confidence",
    construct: "efficacy",
  },
  {
    id: "q5",
    column: "q5_role_breadth",
    baselineText: "Since I started using AI, I feel more able to expand beyond my usual role.",
    weeklyText: "Compared to last week, AI made me feel more able to expand beyond my usual role.",
    label: "Role Breadth",
    construct: "role_breadth",
  },
  {
    id: "q6",
    column: "q6_addiction",
    baselineText: "Since I started using AI, I find it harder to stop working or disengage from work.",
    weeklyText: "Compared to last week, AI made it harder for me to stop working or disengage from work.",
    label: "Compulsion",
    construct: "addiction",
  },
  {
    id: "q7",
    column: "q7_progress",
    baselineText: "Since I started using AI, I have made real progress in how I work and grow professionally.",
    weeklyText: "Compared to last week, I made more real progress in how I work and grow with AI.",
    label: "Growth",
    construct: "progress",
  },
];

export const BASELINE_SCALE: Record<number, string> = {
  1: "Much less",
  2: "Less",
  3: "Slightly less",
  4: "Same",
  5: "Slightly more",
  6: "More",
  7: "Much more",
};

export const WEEKLY_SCALE: Record<number, string> = {
  1: "Much less",
  2: "Less",
  3: "Slightly less",
  4: "Same",
  5: "Slightly more",
  6: "More",
  7: "Much more",
};
