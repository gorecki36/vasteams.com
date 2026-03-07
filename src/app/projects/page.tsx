import PortfolioHome from "@/components/PortfolioHome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick Builds — Observations, Benchmarks & Simulations",
  description:
    "Interactive data stories on AI investment, marketing benchmarks, and future simulations. Built by Vas Bakos.",
  openGraph: {
    title: "Quick Builds — Vas Bakos",
    description:
      "Interactive data stories on AI investment, marketing benchmarks, and future simulations.",
  },
  alternates: {
    canonical: "https://vasteams.com/projects",
  },
};

export default function ProjectsPage() {
  return <PortfolioHome />;
}
