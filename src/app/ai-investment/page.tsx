import type { Metadata } from "next";
import AiInvestmentPage from "@/components/ai-investment/AiInvestmentPage";

export const metadata: Metadata = {
  title: "The AI Investment Economy — Where the Money Actually Flows",
  description:
    "Interactive data story mapping the AI investment boom across 6 infrastructure layers — from raw materials to applications. Public stocks, ETFs, and private access routes for each layer. Historical cycle comparison with dot-com, crypto, and railroad booms.",
  openGraph: {
    title: "The AI Investment Economy",
    description:
      "6-layer AI infrastructure stack with public/private investability, historical cycle comparison, and the bottlenecks money can't solve quickly.",
  },
  alternates: {
    canonical: "https://vasteams.com/ai-investment",
  },
};

export default function AiInvestment() {
  return <AiInvestmentPage />;
}
