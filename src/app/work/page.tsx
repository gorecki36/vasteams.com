import Link from "next/link";
import type { Metadata } from "next";
import { WORK, type WorkItem } from "@/lib/work";

export const metadata: Metadata = {
  title: "Brand Strategy & Positioning Work",
  description:
    "Positioning, marketing, and brand strategy by Vas Bakopoulos. Including POSSIBLE event, the MMA Global rebrand, and Mbriyo Ventures.",
  alternates: {
    canonical: "https://vasteams.com/work",
  },
};

const navLinkClass =
  "font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors";

function WorkRow({ item }: { item: WorkItem }) {
  const hasOngoing = item.year && !item.year.includes("—") && !item.year.includes("-") && Number(item.year) >= 2024;
  // "Ongoing" flag: a single-year (no range, no "—") that's recent (2024+).
  // Mbriyo started 2024 and is still active; POSSIBLE and MMA rebrand are bounded.

  const meta = (
    <div className="pt-1.5">
      {item.year && (
        <p className="font-mono text-[12.5px] font-medium text-white tracking-[0.06em] mb-2.5">
          {item.year}
          {hasOngoing && (
            <span className="text-white/30 font-normal tracking-[0.16em]">
              {" "}
              · Ongoing
            </span>
          )}
        </p>
      )}
      <p className="font-mono text-[10.8px] font-medium text-white/30 tracking-[0.22em] uppercase whitespace-pre-line">
        {item.role.replace(" & ", "\n& ")}
      </p>
    </div>
  );

  const body = (
    <div>
      <p
        className="text-white font-light leading-[1.15] tracking-[-0.02em] mb-5 max-w-[22ch] transition-colors group-hover:text-gold"
        style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.15rem)" }}
      >
        {item.title}
      </p>
      <p
        className="font-light leading-[1.7] text-white/55 max-w-[60ch]"
        style={{ fontSize: "1.05rem" }}
      >
        {item.description}
      </p>
    </div>
  );

  const arrow = (
    <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/55 pt-3.5 justify-self-end transition-colors group-hover:text-gold">
      Visit &rarr;
    </span>
  );

  const rowClass =
    "group grid grid-cols-1 lg:grid-cols-[220px_1fr_100px] gap-y-4 lg:gap-x-16 items-start py-14 border-b border-white/[0.07] transition-colors";

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${rowClass} hover:bg-white/[0.015]`}
      >
        {meta}
        {body}
        {arrow}
      </a>
    );
  }

  return (
    <div className={rowClass}>
      {meta}
      {body}
    </div>
  );
}

export default function WorkPage() {
  return (
    <div
      className="bg-[#0c0c0c] text-white min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="px-6 md:px-10 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          aria-label="Home"
          className="group font-mono text-[15px] tracking-[0.18em] font-bold text-white leading-none"
        >
          VAS<span className="text-gold">T</span>{" "}
          <span className="text-white/30 group-hover:text-white/55 transition-colors">//</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <Link href="/research" className={navLinkClass}>Research</Link>
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
              03 / Work
            </p>
            <h1
              className="text-white font-light leading-[0.98] tracking-[-0.035em]"
              style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
            >
              Building brands, events,
              <br />
              &amp; ventures.
            </h1>
          </div>
          <p
            className="text-white/55 font-light leading-[1.65] max-w-[38ch] md:text-right pb-1.5"
            style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}
          >
            Selected work over the past few years. Positioning, identity, and the
            messy middle that turns an idea into something the market actually uses.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="px-6 md:px-16 py-8 md:py-12 flex-1">
        <div className="max-w-[1160px] mx-auto">
          {WORK.map((item) => (
            <WorkRow key={item.id} item={item} />
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
