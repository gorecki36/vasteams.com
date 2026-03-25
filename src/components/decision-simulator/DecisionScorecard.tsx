"use client";

import type { DecisionAnalysis, Signal } from "@/lib/decision-simulator";

interface DecisionScorecardProps {
  analysis: DecisionAnalysis;
}

const SIGNAL_STYLES: Record<Signal, { bg: string; text: string; label: string }> = {
  go: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "GO" },
  caution: { bg: "bg-amber-500/10", text: "text-amber-400", label: "CAUTION" },
  stop: { bg: "bg-red-500/10", text: "text-red-400", label: "STOP" },
};

const CONFIDENCE_STYLES: Record<string, { border: string; text: string }> = {
  high: { border: "border-emerald-500/30", text: "text-emerald-400" },
  medium: { border: "border-amber-500/30", text: "text-amber-400" },
  low: { border: "border-zinc-700", text: "text-zinc-400" },
};

export default function DecisionScorecard({ analysis }: DecisionScorecardProps) {
  const confStyle = CONFIDENCE_STYLES[analysis.confidence];
  const goCount = analysis.verdicts.filter((v) => v.signal === "go").length;
  const cautionCount = analysis.verdicts.filter((v) => v.signal === "caution").length;
  const stopCount = analysis.verdicts.filter((v) => v.signal === "stop").length;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
          Decision Scorecard
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          Summary across all 6 mental models.
        </p>
      </div>

      {/* 6-model grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {analysis.verdicts.map((v) => {
          const style = SIGNAL_STYLES[v.signal];
          return (
            <div
              key={v.model}
              className={`border border-zinc-800 p-3 ${style.bg}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  {v.model}
                </span>
                <span className={`text-[9px] font-mono font-bold ${style.text}`}>
                  {style.label}
                </span>
              </div>
              <p className={`text-[10px] font-mono ${style.text} leading-relaxed`}>
                {v.summary}
              </p>
            </div>
          );
        })}
      </div>

      {/* Signal summary bar */}
      <div className="flex items-center gap-4 text-[10px] font-mono">
        <span className="text-emerald-400">{goCount} go</span>
        <span className="text-amber-400">{cautionCount} caution</span>
        <span className="text-red-400">{stopCount} stop</span>
      </div>

      {/* Overall recommendation */}
      <div className={`border ${confStyle.border} p-4 space-y-2`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Recommendation
          </span>
          <span className={`text-[10px] font-mono ${confStyle.text} border ${confStyle.border} px-2 py-0.5`}>
            {analysis.confidence} confidence
          </span>
        </div>
        <p className={`text-sm font-mono ${confStyle.text}`}>
          {analysis.recommendation}
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] font-mono text-zinc-700 leading-relaxed">
        This tool applies mathematical frameworks to structured inputs. It
        cannot account for unmeasured factors, emotional value, or information
        you haven&apos;t provided. Use as one input among many.
      </p>
    </section>
  );
}
