export interface WorkItem {
  id: string;
  title: string;
  description: string;
  role: string;
  year?: string;
  href?: string;
}

export const WORK: WorkItem[] = [
  {
    id: "possible",
    title: "POSSIBLE Marketing Event",
    description:
      "Built the positioning for POSSIBLE from scratch. Over three years it became the major industry event for marketing. Launched by MMA Global, later acquired by Hive.",
    role: "Positioning & Brand Strategy",
    year: "2022–2024",
    href: "https://possibleevent.com/",
  },
  {
    id: "mma-rebrand",
    title: "MMA Global → Marketing + Media Alliance",
    description:
      "Led the repositioning of MMA Global from the Mobile Marketing Association to the Marketing + Media Alliance, a CMO-led industry group. New identity and name launched in 2025.",
    role: "Repositioning & Identity",
    year: "2025",
    href: "https://mmaglobal.com/",
  },
  {
    id: "mbriyo",
    title: "Mbriyo Ventures",
    description:
      "Co-founded Mbriyo, a vertical AI investor and incubator, and developed its brand and positioning.",
    role: "Co-founder & Venture Partner",
    href: "https://mbriyo.ventures",
  },
];
