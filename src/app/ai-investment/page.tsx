import type { Metadata } from "next";
import AiInvestmentPage from "@/components/ai-investment/AiInvestmentPage";

export const metadata: Metadata = {
  title: "The AI Investment Economy — Where the Money Actually Flows",
  description:
    "Interactive data story visualizing the AI investment boom. 6-layer infrastructure stack, historical cycle comparison, and the bottlenecks money can't solve quickly.",
  openGraph: {
    title: "The AI Investment Economy",
    description:
      "Everyone's watching the top of the stack. The real story is at the bottom.",
  },
  alternates: {
    canonical: "https://vasteams.com/ai-investment",
  },
};

export default function AiInvestment() {
  return <AiInvestmentPage />;
}
