import type { Metadata } from "next";
import IntroPage from "@/components/IntroPage";

export const metadata: Metadata = {
  title: "The Matrix Moment — How Close Are We?",
  description:
    "Interactive simulation: adjust 7 macro forces, pick a year, and meet yourself in that world. How close are we to the matrix moment?",
  openGraph: {
    title: "The Matrix Moment",
    description:
      "Adjust 7 macro forces, pick a year, and meet yourself in that world.",
  },
  alternates: {
    canonical: "https://vasteams.com/matrix-moment",
  },
};

export default function MatrixMoment() {
  return <IntroPage />;
}
