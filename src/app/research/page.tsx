import Link from "next/link";
import type { Metadata } from "next";
import { RESEARCH, type ResearchItem } from "@/lib/research";

export const metadata: Metadata = {
  title: "Marketing Research & Webinars",
  description:
    "Webinars, reports, and stage presentations on AI, marketing measurement, and brand strategy by Vas Bakopoulos at MMA Global.",
  alternates: {
    canonical: "https://vasteams.com/research",
  },
};

const TYPE_LABELS: Record<ResearchItem["type"], string> = {
  webinar: "Webinar",
  report: "Report",
  talk: "Talk",
  podcast: "Podcast",
  stage: "Stage",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  // Hide day for items where we only know the year
  if (dateStr.endsWith("-01-01") && !dateStr.includes("2026-01")) {
    return d.toLocaleDateString("en-US", { year: "numeric" });
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ResearchRow({ item }: { item: ResearchItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block py-5 border-b border-zinc-800/50 hover:border-gold/30 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
        <span className="text-[11px] text-zinc-600 tracking-widest uppercase shrink-0 w-28">
          {formatDate(item.date)}
        </span>
        <span className="flex-1 text-sm text-zinc-300 group-hover:text-gold transition-colors">
          {item.title}
        </span>
        <span className="flex items-center gap-3 shrink-0">
          {item.partner && (
            <span className="text-[10px] text-zinc-600 tracking-widest uppercase">
              {item.partner}
            </span>
          )}
          <span className="text-[10px] text-zinc-700 tracking-widest uppercase border border-zinc-800 px-2 py-0.5">
            {TYPE_LABELS[item.type]}
          </span>
        </span>
      </div>
      <p className="text-xs text-zinc-600 leading-relaxed mt-2 sm:ml-34 sm:pl-6 max-w-2xl">
        {item.description}
      </p>
    </a>
  );
}

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col font-mono">
      {/* Header */}
      <header className="px-6 md:px-8 pt-10 pb-8 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          className="text-xs text-zinc-600 hover:text-gold tracking-widest uppercase transition-colors"
        >
          &larr; Home
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/work"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-gold transition-colors"
          >
            Work
          </Link>
          <a
            href="https://marketingembeddings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-gold transition-colors"
          >
            Marketing Embeddings
          </a>
          <Link
            href="/projects"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-gold transition-colors"
          >
            Quick Builds
          </Link>
          <Link
            href="/about"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-gold transition-colors"
          >
            About
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 md:px-8 py-16 max-w-4xl">
        <h1 className="text-xl font-bold text-zinc-100 tracking-wide mb-2">
          Research
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-12">
          Research I&apos;ve led and presented through MMA Global, working with
          industry partners across measurement, AI, brand strategy, and media.
        </p>

        <div className="flex flex-col">
          {RESEARCH.map((item) => (
            <ResearchRow key={item.id} item={item} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-zinc-900">
        <p className="text-[11px] text-zinc-700 tracking-wide">
          built by{" "}
          <Link href="/" className="hover:text-zinc-500 transition-colors">
            vas
          </Link>
        </p>
      </footer>
    </div>
  );
}
