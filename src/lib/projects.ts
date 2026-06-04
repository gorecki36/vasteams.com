export interface Project {
  id: string;
  title: string;
  description: string;
  /** Single-glyph icon shown small in card head + large as watermark */
  icon?: string;
  /** Render the icon bold (used for `//` Matrix Moment) */
  iconBold?: boolean;
  /** Per-card accent color (hex). Drives border + title + watermark on hover. */
  accent?: string;
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
    tags: ["AI", "Economics", "Data story"],
    icon: "↗",
    accent: "#D4A017",
  },
  {
    id: "pulse",
    title: "The Pulse",
    description:
      "Is AI making you sharper or just faster? Weekly 45-second check-in tracking how AI shapes your thinking, meaning, and growth at work.",
    href: "/pulse",
    status: "live",
    tags: ["AI", "Research", "Self-assessment"],
    icon: "◉",
    accent: "#22D3EE",
  },
  {
    id: "ai-clock",
    title: "The AI Capability Clock",
    description:
      "How ready is AI for your marketing role? Live benchmark data mapped to 6 marketing capabilities.",
    href: "/ai-clock",
    status: "live",
    tags: ["AI", "Benchmarks", "Marketing"],
    icon: "◔",
    accent: "#F87171",
  },
  {
    id: "ai-investment",
    title: "The AI Investment Economy",
    description:
      "Where the money actually flows. 6-layer infrastructure stack, historical cycle comparison, and the bottlenecks money can't solve quickly.",
    href: "/ai-investment",
    status: "live",
    tags: ["AI", "Investment", "Data story"],
    icon: "◈",
    accent: "#FBBF24",
  },
  {
    id: "matrix-moment",
    title: "The Matrix Moment",
    description:
      "How close are we to the matrix moment? Adjust 7 macro forces, pick a year, and meet yourself in that world.",
    href: "/matrix-moment",
    status: "live",
    tags: ["Simulation", "AI", "Futures"],
    icon: "//",
    iconBold: true,
    accent: "#10B981",
  },
];
