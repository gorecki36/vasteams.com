import type { Metadata } from "next";
import PulseDashboard from "@/components/pulse/PulseDashboard";

export const metadata: Metadata = {
  title: "Weekly Trends — The Pulse",
  description: "Your cumulative AI work pulse trends over time.",
};

export default function TrendsPage() {
  return <PulseDashboard mode="personal" view="trends" />;
}
