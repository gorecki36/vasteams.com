"use client";

import Link from "next/link";
import CycleComparison from "./CycleComparison";
import InvestmentStack from "./InvestmentStack";
import CapExRevenueGap from "./CapExRevenueGap";
import { SOURCES } from "@/lib/ai-investment-data";

export default function AiInvestmentPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <Link
          href="/"
          className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          &larr; back
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-20">
        {/* ─── Section 1: Hero ──────────────────────────────────────── */}
        <section className="text-center space-y-8">
          <div>
            <h1 className="text-lg sm:text-xl font-mono tracking-widest text-emerald-400 uppercase">
              The AI Investment Economy
            </h1>
            <p className="text-sm font-mono text-zinc-500 mt-3 max-w-xl mx-auto leading-relaxed">
              Everyone&apos;s watching the top of the stack.
              <br />
              The real story is at the bottom.
            </p>
          </div>

        </section>

        {/* ─── Section 2: Cycle Comparison ──────────────────────────── */}
        <CycleComparison />

        {/* ─── Section 3: CapEx vs Revenue ──────────────────────────── */}
        <CapExRevenueGap />

        {/* ─── Section 4: Investment Stack ──────────────────────────── */}
        <InvestmentStack />

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="border-t border-zinc-800 pt-8 pb-4 space-y-6">
          {/* Sources */}
          <div>
            <h3 className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">
              Sources
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {SOURCES.map((source) => (
                <span key={source.label}>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {source.label} &nearr;
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-zinc-700">
                      {source.label}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] font-mono text-zinc-700 leading-relaxed max-w-xl">
            Personal research, not financial advice. Companies mentioned as
            examples within infrastructure categories — not as investment
            recommendations. Past performance does not indicate future results.
            Do your own due diligence.
          </p>

          {/* Built by */}
          <p className="text-[11px] font-mono text-zinc-700">
            built by{" "}
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              vas
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
