import type { Metadata } from "next";
import PulseDashboard from "@/components/pulse/PulseDashboard";

export const metadata: Metadata = {
  title: "Admin — The Pulse",
  description: "Aggregate AI work pulse data and diagnostic maps.",
};

export default function AdminPage() {
  return <PulseDashboard mode="admin" />;
}
