import type { Metadata } from "next";
import PulseLanding from "@/components/pulse/PulseLanding";

export const metadata: Metadata = {
  title: "The Pulse — Weekly Check-in",
  description:
    "Is AI making you sharper or just faster? 45-second weekly pulse tracking how AI shapes your thinking, meaning, and growth at work.",
  openGraph: {
    title: "The Pulse",
    description:
      "Weekly self-assessment: is AI substituting your thinking or expanding it?",
  },
  alternates: {
    canonical: "https://vasteams.com/pulse",
  },
};

export default function PulsePage() {
  return <PulseLanding />;
}
