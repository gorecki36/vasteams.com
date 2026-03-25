"use client";

import type { BayesianResult } from "@/lib/decision-simulator";

interface BayesianUpdateProps {
  result: BayesianResult;
  edge: number;
}

export default function BayesianUpdate({ result, edge }: BayesianUpdateProps) {
  const priorPct = result.prior * 100;
  const posteriorPct = result.posterior * 100;
  const delta = posteriorPct - priorPct;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
          4. Bayesian Update
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          Your base rate is the starting point. Your specific advantages update
          it — but proportionally, not dramatically. This is the realistic
          probability.
        </p>
      </div>

      {/* Before / After bars */}
      <div className="space-y-4">
        {/* Prior */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Prior (base rate)
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {priorPct.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-zinc-900 border border-zinc-800 relative">
            <div
              className="absolute top-0 left-0 h-full bg-zinc-600 transition-all"
              style={{ width: `${priorPct}%` }}
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-3 px-2">
          <span className="text-zinc-700">→</span>
          <span className="text-[10px] font-mono text-zinc-600">
            Your edge ({(edge * 100).toFixed(0)}%) updates the probability
          </span>
        </div>

        {/* Posterior */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
              Posterior (updated)
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {posteriorPct.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-zinc-900 border border-zinc-800 relative">
            <div
              className="absolute top-0 left-0 h-full bg-emerald-500/60 transition-all"
              style={{ width: `${posteriorPct}%` }}
            />
            {/* Prior ghost line */}
            <div
              className="absolute top-0 h-full border-r border-zinc-500 border-dashed"
              style={{ left: `${priorPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Delta callout */}
      <div className="border border-zinc-800 px-3 py-2">
        <p className="text-[11px] font-mono text-zinc-400">
          Update:{" "}
          <span className={delta > 0 ? "text-emerald-400" : "text-zinc-400"}>
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}pp
          </span>
          {" "}({priorPct.toFixed(0)}% → {posteriorPct.toFixed(0)}%)
        </p>
        <p className="text-[10px] font-mono text-zinc-600 mt-1">
          P(success | your edge) = prior × (1 + edge × K) / normalizer
        </p>
      </div>
    </section>
  );
}
