export interface ResearchItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "webinar" | "report" | "talk" | "podcast" | "stage";
  partner?: string;
  href: string;
  external?: boolean;
  image?: string;
}

export const RESEARCH: ResearchItem[] = [
  {
    id: "built-to-report-not-drive",
    title: "Built to Report, Not to Drive: What Separates the Top 30% of Marketers",
    description:
      "MMA and Marketbridge research finds most marketing analytics systems explain performance but don't improve it. Only 30% of marketers consistently use data to drive strategic decisions.",
    date: "2026-04-08",
    type: "webinar",
    partner: "Marketbridge",
    href: "https://mmaglobal.com/webinars/built-report-not-drive-what-separates-top-30-marketers",
    external: true,
    image: "https://mmaglobal.com/files/styles/document_thumbnail_large/public/mmaglobal.com/image/s20260408a94123am-20260408.jpg?itok=YY4XS2bn",
  },
  {
    id: "brand-marketing-accountability",
    title: "The State of Brand Marketing Accountability",
    description:
      "How marketers can defend brand investments through better measurement. Distinguishes \"Brand Accountable\" organizations from \"Brand Vulnerable\" ones across budget allocation, measurement confidence, and marketing-finance alignment.",
    date: "2026-03-19",
    type: "webinar",
    partner: "Wpromote",
    href: "https://mmaglobal.com/webinars/state-brand-marketing-accountability",
    external: true,
    image: "https://mmaglobal.com/files/styles/large/public/webinarsd-20230512_12.png?itok=4i1m5I4K",
  },
  {
    id: "state-of-performance",
    title: "The State of Performance Marketing",
    description:
      "MMA's first global survey on performance marketing, with 400+ senior marketers worldwide. Performance now dominates budgets but lacks strategic ownership — the study highlights growing complexity, capability gaps, and the urgency to unify measurement, martech, and talent.",
    date: "2026-01-28",
    type: "webinar",
    partner: "Adobe",
    href: "https://mmaglobal.com/webinars/state-performance-marketing",
    external: true,
    image: "https://mmaglobal.com/files/styles/large/public/webinarsd-20230512_12.png?itok=4i1m5I4K",
  },
  {
    id: "state-of-personalization",
    title: "The State of Personalization",
    description:
      "60% of organizations claim established personalization programs, but most remain channel-first and manually executed. Average campaign lift sits around 24%, with significant untapped potential due to measurement gaps and workflow bottlenecks.",
    date: "2025-11-04",
    type: "webinar",
    partner: "EY / Monks",
    href: "https://mmaglobal.com/webinar-state-personalization-november-4-2025",
    external: true,
    image: "https://mmaglobal.com/files/styles/medium/public/features/mma-education-decoding-ai-1_-_78_2.png?itok=I0YLnw3A",
  },
  {
    id: "state-of-consumer-ai",
    title: "The State of Consumer AI",
    description:
      "Survey of 2,400 U.S. consumers on how AI is integrating into daily life. Covers adoption rates, AI's role in shopping and creative expression, and the tension between expectations for smarter experiences and demands for data protection.",
    date: "2025-10-15",
    type: "webinar",
    partner: "Kantar",
    href: "https://mmaglobal.com/webinars/state-consumer-ai",
    external: true,
    image: "https://mmaglobal.com/files/styles/large/public/webinarsd-20230512_6.png?itok=-6TbE-Np",
  },
  {
    id: "state-of-video-ctv-2025",
    title: "2025 State of Video & CTV",
    description:
      "Survey of 100+ senior marketers reveals video as the most essential marketing tactic. Covers CTV adoption, budget shifts, and strategic insights for the year ahead.",
    date: "2025-09-17",
    type: "webinar",
    partner: "Teads",
    href: "https://mmaglobal.com/news/new-study-teads-and-mma-reveals-video-most-essential-marketing-tactic",
    external: true,
    image: "https://mmaglobal.com/files/styles/extra_large/public/s20250916a125305_am-20250916_0.jpg?itok=GJzD5UeO",
  },
  {
    id: "cmo-summit-2025",
    title: "CMO Summit 2025 — 8 Research Sessions",
    description:
      "Eight sessions covering Brand as Performance, personalization, targeting strategy, consumer AI habits, creative intelligence, and the new creative revolution in video.",
    date: "2025-07-21",
    type: "stage",
    href: "https://www.mmaglobal.com/cmosummit2025/agenda",
    external: true,
  },
  {
    id: "consortium-ai-personalization",
    title: "Consortium for AI Personalization (CAP)",
    description:
      "Multi-year research initiative testing whether AI-driven personalization can create omnichannel experiences that outperform current ads. Seven completed studies show an average +195% lift from AI-driven personalization for creative ad placement.",
    date: "2025-01-01",
    type: "report",
    href: "https://mmaglobal.com/consortium-for-ai-personalization",
    external: true,
    image: "https://www.mmaglobal.com/files/upload/group2327-20230803.png",
  },
  {
    id: "ai-operating-model-bcg",
    title: "AI Disruption of Marketing Operating Models",
    description:
      "Joint research with BCG exploring how AI is reshaping the marketing operating model — from in-house vs. agency boundaries to creative and media workflow disruption, and how accountability for performance is evolving across functions.",
    date: "2025-01-01",
    type: "report",
    partner: "BCG",
    href: "https://mmaglobal.com/ai-driven-operating-model",
    external: true,
    image: "https://mmaglobal.com/files/logos/bcg_monogram_cmyk_green_002-1.png",
  },
  {
    id: "breakthroughs-audience-strategy",
    title: "Breakthroughs in Audience Strategy: Debunking the Short and Long-Term Myth",
    description:
      "Challenges the conventional split between brand-building and performance tactics. Introduces the Movable Middles audience strategy and how it delivers measurable, repeatable results across both short- and long-term outcomes.",
    date: "2024-09-25",
    type: "webinar",
    partner: "TransUnion",
    href: "https://www.mmaglobal.com/webinars/breakthroughs-audience-strategy-debunking-short-and-long-term-myth-marketing",
    external: true,
    image: "https://mmaglobal.com/files/styles/large/public/mmawebinarseriesrevsolution-20230510_0_0.png?itok=9u6bUMQu",
  },
  {
    id: "brandnomics",
    title: "Brandnomics: The Science Behind Brand-Driven Financial Growth",
    description:
      "Balancing brand and performance marketing with case studies showing brand favorables activate at a 6x rate versus non-favorables. Features real-world examples from Ally Financial and Kroger.",
    date: "2024-06-12",
    type: "webinar",
    href: "https://www.mmaglobal.com/webinars/revolution-series-revolutionizing-brand-marketing",
    external: true,
    image: "https://mmaglobal.com/files/styles/large/public/mmawebinarseriesrevsolution-20230510_0.png?itok=_shmxBTt",
  },
  {
    id: "state-of-mta-2024",
    title: "The State of Multi-Touch Attribution 2024",
    description:
      "9th annual MTA study covering how marketers are adjusting media investments, the tension between short-term activation and brand building, and AI's growing role in marketing measurement.",
    date: "2024-06-05",
    type: "webinar",
    href: "https://www.mmaglobal.com/webinars/state-multi-touch-attribution-2024",
    external: true,
    image: "https://mmaglobal.com/files/styles/large/public/default_images/mma-webinars-20221014.jpg?itok=nMZUhHWJ",
  },
  {
    id: "brand-as-performance-initiative",
    title: "Brand as Performance Research Initiative",
    description:
      "Breakthrough methodology backed by $2M+ in research, 40,000+ surveys, and sales data from hundreds of thousands of households. Demonstrates that brand marketing delivers short-term results, and the long-term impact is up to 6x the short-term effect.",
    date: "2024-01-01",
    type: "report",
    partner: "TransUnion",
    href: "https://mmaglobal.com/brand-as-performance-research-initiative",
    external: true,
    image: "https://mmaglobal.com/files/upload/bap-sidebar-min.jpg",
  },
  {
    id: "actual-possibility-ai-alc",
    title: "The Actual Possibility of AI as Told by the Marketers from MMA's AI Leadership Coalition",
    description:
      "Live demo of AI-generated personas research — compressing consumer insights from three months to three prompts.",
    date: "2024-01-01",
    type: "talk",
    href: "https://www.youtube.com/watch?v=L6idxPVABdY",
    external: true,
  },
  {
    id: "movable-middles-podcast",
    title: "TransUnion \"No Hype\" Podcast — Movable Middles",
    description:
      "Live recording from Brave New Worlds 2024. Explores how a unified audience strategy targeting \"movable middles\" — people neither loyal nor disloyal — can deliver proven outcomes in both the short and long term.",
    date: "2024-01-01",
    type: "podcast",
    partner: "TransUnion",
    href: "https://www.transunion.com/podcasts/movable-middles",
    external: true,
  },
  {
    id: "measuring-brand-value",
    title: "Measuring Brand Value",
    description:
      "How to bridge the gap between marketing and finance when it comes to measuring brand ROI. Covers frameworks for improving alignment and making brand investments more defensible.",
    date: "2023-11-15",
    type: "webinar",
    href: "https://mmaglobal.com/webinars/measurement-bridging-finance-marketing-gap",
    external: true,
    image: "https://mmaglobal.com/files/styles/large/public/mmagreatdebatesmeasurement-20230510_0.png?itok=giwEUxWT",
  },
  {
    id: "state-of-gen-ai-2023",
    title: "State of Generative AI and its Application in Marketing",
    description:
      "Early benchmarking of how marketers are adopting generative AI — where it's being applied, what's working, and where the gap between expectation and execution lives.",
    date: "2023-09-06",
    type: "webinar",
    href: "https://mmaglobal.com/webinars/decision-series-state-gen-ai",
    external: true,
  },
  {
    id: "state-of-cx-maturity",
    title: "State of CX Maturity and Best Practices",
    description:
      "Benchmarking study on customer experience maturity across organizations. Identifies what separates CX leaders from laggards in data use, personalization, and cross-functional alignment.",
    date: "2023-08-16",
    type: "webinar",
    href: "https://mmaglobal.com/webinars/decision-series-state-cx-maturity",
    external: true,
  },
  {
    id: "state-of-data-maturity",
    title: "State of Data Maturity",
    description:
      "How marketers are thinking about data maturity — from first-party data strategies to cross-functional data governance and the organizational readiness required to act on insights.",
    date: "2023-07-12",
    type: "webinar",
    href: "https://mmaglobal.com/webinars/decision-series-state-data-maturity",
    external: true,
  },
  {
    id: "state-of-mta-2023",
    title: "State of Multi-Touch Attribution",
    description:
      "How measurement and attribution tools are used today to build trust and accountability in marketing. Covers the biggest challenges marketers face with their attribution efforts.",
    date: "2023-06-14",
    type: "webinar",
    href: "https://mmaglobal.com/webinars/decision-series-state-mta",
    external: true,
  },
  {
    id: "state-of-ai-marketing-2023",
    title: "State of AI in Marketing",
    description:
      "Preview of benchmarking data on the application of AI in marketing and customer experience. Maps where marketers are in their AI adoption journey and what's holding them back.",
    date: "2023-06-07",
    type: "webinar",
    href: "https://mmaglobal.com/webinars/decision-series-state-ai-marketing",
    external: true,
  },
];
