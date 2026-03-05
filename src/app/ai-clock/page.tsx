import type { Metadata } from "next";
import AiClockPage from "@/components/ai-clock/AiClockPage";

export const metadata: Metadata = {
  title: "AI Capability Clock — How Ready Is AI for Your Marketing Role?",
  description:
    "Live visualization mapping AI benchmark scores to marketing capabilities. See how close AI is to doing your job.",
  openGraph: {
    title: "AI Capability Clock",
    description:
      "How ready is AI for your marketing role? Live benchmark data mapped to marketing capabilities.",
  },
};

export default function AiClock() {
  return <AiClockPage />;
}
