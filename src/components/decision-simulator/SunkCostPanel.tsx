"use client";

import type { EVResult } from "@/lib/decision-simulator";

interface SunkCostPanelProps {
  sunkCost: number;
  sunkCostUnit: string;
  evResults: EVResult[];
  unit: string;
  flagged: boolean;
}

export default function SunkCostPanel({
  sunkCost,
  sunkCostUnit,
  evResults,
  unit,
  flagged,
}: SunkCostPanelProps) {
  const hasSunkCost = sunkCost > 0;
  const bestEV = Math.max(...evResults.map((r) => r.ev));

  return (
    <section
      className={`space-y-4 ${flagged ? "ring-1 ring-amber-500/30 p-4 -m-4" : ""}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
            3. Sunk Cost Isolation
          </h2>
          {flagged && (
            <span className="text-[9px] font-mono text-amber-400 border border-amber-500/30 px-1.5 py-0.5 mb-1">
              BIAS FLAGGED
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          Whatever you&apos;ve already spent is gone either way. The only
          rational question: looking forward, which option has better expected
          value?
        </p>
      </div>

      {hasSunkCost ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* With sunk cost */}
          <div className="border border-zinc-800 p-4 space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              With sunk cost (biased view)
            </h3>
            <div className="text-2xl font-mono text-zinc-400">
              {sunkCost.toLocaleString()} {sunkCostUnit}
            </div>
            <p className="text-[10px] font-mono text-zinc-600 leading-relaxed">
              &quot;I&apos;ve already put in {sunkCost.toLocaleString()}{" "}
              {sunkCostUnit}, I can&apos;t stop now.&quot;
            </p>
            <div className="border-t border-zinc-800 pt-2">
              <p className="text-[10px] font-mono text-zinc-600">
                This framing makes quitting feel like wasting{" "}
                {sunkCost.toLocaleString()} {sunkCostUnit}. But
                continuing won&apos;t un-spend it.
              </p>
            </div>
          </div>

          {/* Without sunk cost */}
          <div className="border border-emerald-500/30 p-4 space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              Without sunk cost (correct view)
            </h3>
            <div className="text-2xl font-mono text-emerald-400 line-through decoration-zinc-600">
              {sunkCost.toLocaleString()} {sunkCostUnit}
            </div>
            <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
              &quot;Starting from today, which option has the highest expected
              value?&quot;
            </p>
            <div className="border-t border-zinc-800 pt-2">
              <p className="text-[10px] font-mono text-zinc-400">
                Forward-looking best EV:{" "}
                <span className="text-emerald-400">
                  {bestEV.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  {unit !== "custom" ? unit : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-zinc-800 p-4">
          <p className="text-[11px] font-mono text-zinc-500">
            No sunk cost reported. Your decision is unbiased on this dimension.
          </p>
        </div>
      )}
    </section>
  );
}
