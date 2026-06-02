export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  /** Monospace icon/glyph shown on the card */
  icon?: string;
  /** Optional override for icon styling */
  iconClass?: string;
  href: string;
  status: "live" | "coming_soon";
  tags?: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "ai-economics",
    title: "The Economics of Enterprise AI",
    description:
      "Where AI spend is heading from 2023 to 2030. The value realization gap, three cost phases, and what disciplined intervention looks like.",
    href: "/ai-economics.html",
    status: "live",
    tags: ["AI", "economics", "data story"],
    icon: "↗",
    iconClass: "text-4xl text-gold",
  },
  {
    id: "pulse",
    title: "The Pulse",
    description:
      "Is AI making you sharper or just faster? Weekly 45-second check-in tracking how AI shapes your thinking, meaning, and growth at work.",
    href: "/pulse",
    status: "live",
    tags: ["AI", "research", "self-assessment"],
    icon: "◉",
    iconClass: "text-4xl text-cyan-400",
  },
  {
    id: "ai-clock",
    title: "The AI Capability Clock",
    description:
      "How ready is AI for your marketing role? Live benchmark data mapped to 6 marketing capabilities.",
    href: "/ai-clock",
    status: "live",
    tags: ["AI", "benchmarks", "marketing"],
    icon: "\u25D4",
    iconClass: "text-4xl text-red-400",
  },
  {
    id: "ai-investment",
    title: "The AI Investment Economy",
    description:
      "Where the money actually flows. 6-layer infrastructure stack, historical cycle comparison, and the bottlenecks money can't solve quickly.",
    href: "/ai-investment",
    status: "live",
    tags: ["AI", "investment", "data story"],
    icon: "◈",
    iconClass: "text-4xl text-amber-400",
  },
  {
    id: "matrix-moment",
    title: "The Matrix Moment",
    description:
      "How close are we to the matrix moment? Adjust 7 macro forces, pick a year, and meet yourself in that world.",
    href: "/matrix-moment",
    status: "live",
    tags: ["simulation", "AI", "futures"],
    icon: "//",
    iconClass: "text-3xl font-mono text-emerald-500 font-bold",
  },
];
