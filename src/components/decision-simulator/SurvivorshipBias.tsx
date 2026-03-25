"use client";

interface SurvivorshipBiasProps {
  baseRate: number;
  survivorshipRatio: number;
  flagged: boolean;
}

export default function SurvivorshipBias({
  baseRate,
  survivorshipRatio,
  flagged,
}: SurvivorshipBiasProps) {
  const baseRatePct = baseRate * 100;
  const total = 100;
  const successes = Math.round(baseRate * total);
  const failures = total - successes;

  // Generate dots for visualization (capped at 20 for readability)
  const displayTotal = 20;
  const displaySuccesses = Math.max(1, Math.round(baseRate * displayTotal));
  const displayFailures = displayTotal - displaySuccesses;

  return (
    <section
      className={`space-y-4 ${flagged ? "ring-1 ring-amber-500/30 p-4 -m-4" : ""}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
            5. Survivorship Bias
          </h2>
          {flagged && (
            <span className="text-[9px] font-mono text-amber-400 border border-amber-500/30 px-1.5 py-0.5 mb-1">
              BIAS FLAGGED
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          You only see the winners. The failures don&apos;t get podcast
          interviews. Your base rate of {baseRatePct.toFixed(0)}% means{" "}
          {failures} out of every {total} attempts fail silently.
        </p>
      </div>

      {/* Ratio visualization */}
      <div className="border border-zinc-800 p-4 space-y-4">
        <div className="text-center">
          <span className="text-3xl font-mono text-zinc-300">
            1
          </span>
          <span className="text-sm font-mono text-zinc-600 mx-2">:</span>
          <span className="text-3xl font-mono text-zinc-500">
            {survivorshipRatio}
          </span>
        </div>
        <p className="text-center text-[10px] font-mono text-zinc-600">
          For every 1 success you see, {survivorshipRatio} failures are invisible
        </p>

        {/* Dot grid */}
        <div className="flex flex-wrap gap-1.5 justify-center pt-2">
          {Array.from({ length: displaySuccesses }).map((_, i) => (
            <div
              key={`s-${i}`}
              className="w-3 h-3 bg-emerald-500"
              title="Visible success"
            />
          ))}
          {Array.from({ length: displayFailures }).map((_, i) => (
            <div
              key={`f-${i}`}
              className="w-3 h-3 bg-zinc-800 border border-zinc-700"
              title="Invisible failure"
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 text-[9px] font-mono text-zinc-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 inline-block" /> Successes
            ({displaySuccesses})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-zinc-800 border border-zinc-700 inline-block" />{" "}
            Failures ({displayFailures})
          </span>
        </div>
      </div>

      {flagged && (
        <div className="border border-amber-500/30 px-3 py-2">
          <p className="text-[11px] font-mono text-amber-400">
            You indicated your probability may be based on visible success
            stories. Consider: are you seeing a representative sample, or
            just the survivors?
          </p>
        </div>
      )}
    </section>
  );
}
