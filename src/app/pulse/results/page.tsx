import type { Metadata } from "next";
import PulseDashboard from "@/components/pulse/PulseDashboard";

export const metadata: Metadata = {
  title: "Results — The Pulse",
  description: "Your AI work pulse baseline and trends.",
};

export default function ResultsPage() {
  return <PulseDashboard mode="personal" view="baseline" />;
}
