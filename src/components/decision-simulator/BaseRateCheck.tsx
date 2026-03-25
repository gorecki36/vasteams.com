"use client";

interface BaseRateCheckProps {
  baseRate: number;
  userEstimate: number; // highest best-case probability from options
  flagged: boolean;
}

export default function BaseRateCheck({
  baseRate,
  userEstimate,
  flagged,
}: BaseRateCheckProps) {
  const baseRatePct = baseRate * 100;
  const userPct = userEstimate * 100;
  const gap = Math.abs(userPct - baseRatePct);
  const isOverconfident = userPct > baseRatePct;

  return (
    <section
      className={`space-y-4 ${flagged ? "ring-1 ring-amber-500/30 p-4 -m-4" : ""}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
            2. Base Rate Reality Check
          </h2>
          {flagged && (
            <span className="text-[9px] font-mono text-amber-400 border border-amber-500/30 px-1.5 py-0.5 mb-1">
              BIAS FLAGGED
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          Before your specific circumstances, how often does this TYPE of thing
          succeed? Most people ignore the base rate and anchor on anecdotes.
        </p>
      </div>

      {/* Number line visualization */}
      <div className="relative">
        <div className="h-2 bg-zinc-900 border border-zinc-800 relative">
          {/* Base rate marker */}
          <div
            className="absolute top-0 h-full bg-zinc-600"
            style={{ left: 0, width: `${baseRatePct}%` }}
          />
          {/* Base rate indicator */}
          <div
            className="absolute -top-1 w-0.5 h-4 bg-zinc-400"
            style={{ left: `${baseRatePct}%` }}
          />
          {/* User estimate indicator */}
          <div
            className="absolute -top-1 w-0.5 h-4 bg-emerald-400"
            style={{ left: `${Math.min(userPct, 100)}%` }}
          />
          {/* Gap highlight */}
          {gap > 5 && (
            <div
              className={`absolute top-0 h-full ${
                isOverconfident ? "bg-amber-500/20" : "bg-blue-500/20"
              }`}
              style={{
                left: `${Math.min(baseRatePct, userPct)}%`,
                width: `${gap}%`,
              }}
            />
          )}
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3">
          <span className="text-[10px] font-mono text-zinc-600">0%</span>
          <span className="text-[10px] font-mono text-zinc-600">100%</span>
        </div>

        {/* Markers */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-0.5 bg-zinc-400 inline-block" />
            <span className="text-[10px] font-mono text-zinc-400">
              Base rate: {baseRatePct.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-0.5 bg-emerald-400 inline-block" />
            <span className="text-[10px] font-mono text-emerald-400">
              Your estimate: {userPct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Gap callout */}
      {gap > 5 && (
        <div
          className={`border px-3 py-2 text-[11px] font-mono ${
            isOverconfident
              ? "border-amber-500/30 text-amber-400"
              : "border-blue-500/30 text-blue-400"
          }`}
        >
          {isOverconfident
            ? `Your estimate is ${gap.toFixed(0)}pp above the base rate. This level of confidence needs strong justification.`
            : `Your estimate is ${gap.toFixed(0)}pp below the base rate — you may be overly cautious.`}
        </div>
      )}
    </section>
  );
}
