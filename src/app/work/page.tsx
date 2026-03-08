import Link from "next/link";
import type { Metadata } from "next";
import { WORK, type WorkItem } from "@/lib/work";

export const metadata: Metadata = {
  title: "Brand Strategy & Positioning Work",
  description:
    "Positioning, creative direction, and brand strategy by Vas Bakopoulos. Including POSSIBLE event and the MMA Global rebrand.",
  alternates: {
    canonical: "https://vasteams.com/work",
  },
};

function WorkCard({ item }: { item: WorkItem }) {
  const content = (
    <>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-sm font-bold text-zinc-100 tracking-wide">
          {item.title}
        </h2>
        <span className="text-[10px] text-zinc-700 tracking-widest uppercase">
          {item.year}
        </span>
      </div>
      <p className="text-[11px] text-emerald-500/70 tracking-widest uppercase mb-3">
        {item.role}
      </p>
      <p className="text-sm text-zinc-500 leading-relaxed">
        {item.description}
      </p>
      {item.href && (
        <span className="inline-block mt-4 text-xs text-zinc-600 group-hover:text-emerald-400 tracking-widest uppercase transition-colors">
          View &rarr;
        </span>
      )}
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block border border-zinc-800 p-6 hover:border-emerald-500/30 transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="border border-zinc-800 p-6">
      {content}
    </div>
  );
}

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col font-mono">
      {/* Header */}
      <header className="px-6 md:px-8 pt-10 pb-8 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          className="text-xs text-zinc-600 hover:text-emerald-400 tracking-widest uppercase transition-colors"
        >
          &larr; Home
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/research"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-emerald-400 transition-colors"
          >
            Research
          </Link>
          <a
            href="https://marketingembeddings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-emerald-400 transition-colors"
          >
            Marketing Embeddings
          </a>
          <Link
            href="/projects"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-emerald-400 transition-colors"
          >
            Quick Builds
          </Link>
          <Link
            href="/about"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-emerald-400 transition-colors"
          >
            About
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 md:px-8 py-16 max-w-4xl">
        <h1 className="text-xl font-bold text-zinc-100 tracking-wide mb-2">
          Work
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-12">
          Positioning, creative direction, and brand strategy.
        </p>

        <div className="flex flex-col gap-4">
          {WORK.map((item) => (
            <WorkCard key={item.id} item={item} />
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
