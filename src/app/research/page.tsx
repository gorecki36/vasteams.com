import Link from "next/link";
import type { Metadata } from "next";
import { RESEARCH } from "@/lib/research";
import { ResearchRow } from "@/components/research/ResearchRow";

export const metadata: Metadata = {
  title: "Marketing Research & Webinars",
  description:
    "Webinars, reports, and stage presentations on AI, marketing measurement, and brand strategy by Vas Bakopoulos at MMA Global.",
  alternates: {
    canonical: "https://vasteams.com/research",
  },
};

const navLinkClass =
  "font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors";

export default function ResearchPage() {
  return (
    <div
      className="bg-[#0c0c0c] text-white min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="px-6 md:px-10 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/" className={navLinkClass}>
          &larr; Back
        </Link>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <Link href="/work" className={navLinkClass}>Work</Link>
          <a
            href="https://marketingembeddings.com"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
          >
            Marketing Embeddings
          </a>
          <Link href="/projects" className={navLinkClass}>Quick Builds</Link>
          <Link href="/about" className={navLinkClass}>About</Link>
        </nav>
      </header>

      {/* Hero band */}
      <section className="px-6 md:px-16 pt-12 pb-10 md:pt-20 md:pb-14 border-b border-white/[0.07]">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-16 items-end">
          <div>
            <p className="font-mono uppercase tracking-[0.24em] text-[11px] text-white/30 mb-7">
              01 / Research
            </p>
            <h1
              className="text-white font-light leading-[0.98] tracking-[-0.035em]"
              style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
            >
              Research, talks,
              <br />
              and reports.
            </h1>
          </div>
          <p
            className="text-white/55 font-light leading-[1.65] max-w-[38ch] md:text-right pb-1.5"
            style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}
          >
            Research I&rsquo;ve led and presented through MMA Global, working with
            industry partners across measurement, AI, brand strategy, and media.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="px-6 md:px-16 py-8 md:py-12 flex-1">
        <div className="max-w-[1160px] mx-auto">
          {RESEARCH.map((item) => (
            <ResearchRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-10 border-t border-white/[0.09] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
          &copy; 2026 Vas Bakopoulos
        </p>
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors"
        >
          &larr; Home
        </Link>
      </footer>
    </div>
  );
}
