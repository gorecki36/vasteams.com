import type { Metadata } from "next";
import PulseSurveyForm from "@/components/pulse/PulseSurveyForm";

export const metadata: Metadata = {
  title: "Baseline — The Pulse",
  description: "Set your AI work baseline. How has AI changed your work compared to before?",
};

export default function BaselinePage() {
  return <PulseSurveyForm mode="baseline" />;
}
