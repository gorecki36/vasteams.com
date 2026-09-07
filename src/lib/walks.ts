export type Walk = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  imageAlt: string;
};

/** Walks published so far, newest first. */
export const WALKS: Walk[] = [
  {
    slug: "incentive-to-think",
    title: "Does AI increase or erode our incentive to think?",
    summary:
      "Cheaper cognition should mean more cognition. But the frontier of human advantage keeps moving, and the machine is climbing the same staircase.",
    date: "7 Sep 2026",
    image: "/retriever/ai-staircase.jpg",
    imageAlt:
      "Two figures climbing a staircase, one of them wired with circuitry",
  },
];
