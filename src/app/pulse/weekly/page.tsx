import type { Metadata } from "next";
import PulseSurveyForm from "@/components/pulse/PulseSurveyForm";

export const metadata: Metadata = {
  title: "Weekly Check-in — The Pulse",
  description: "Your weekly AI work pulse check-in. How did things shift?",
};

export default function WeeklyPage() {
  return <PulseSurveyForm mode="weekly" />;
}
