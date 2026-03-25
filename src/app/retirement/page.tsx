import type { Metadata } from "next";
import RetirementPage from "@/components/retirement/RetirementPage";

export const metadata: Metadata = {
  title: "Retirement Timing Optimizer — When Should You Actually Retire?",
  description:
    "Two curves intersect: your financial runway vs your life expectancy. Gompertz survival model meets year-by-year financial projection. Find your optimal retirement age.",
  openGraph: {
    title: "Retirement Timing Optimizer",
    description:
      "When your money runs out vs when you die. Optimize for quality of time without going broke.",
  },
  alternates: {
    canonical: "https://vasteams.com/retirement",
  },
};

export default function Retirement() {
  return <RetirementPage />;
}
