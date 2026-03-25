"use client";

import type { PulseScores } from "@/lib/pulse-scoring";

interface Props {
  userScores: PulseScores;
}

const DIMENSIONS = [
  {
    key: "substitution" as const,
    label: "Substitution",
    desc: "How much AI is doing your thinking",
    color: "#d97706",
    bgClass: "bg-amber-50 border-amber-200",
    textClass: "text-amber-700",
  },
  {
    key: "expansion" as const,
    label: "Expansion",
    desc: "New doors AI is opening for you",
    color: "#059669",
    bgClass: "bg-emerald-50 border-emerald-200",
    textClass: "text-emerald-700",
  },
  {
    key: "agency" as const,
    label: "Agency",
    desc: "Control + confidence + growth",
    color: "#2563eb",
    bgClass: "bg-blue-50 border-blue-200",
    textClass: "text-blue-700",
  },
  {
    key: "meaning" as const,
    label: "Meaning",
    desc: "Does AI make your work matter more?",
    color: "#7c3aed",
    bgClass: "bg-purple-50 border-purple-200",
    textClass: "text-purple-700",
  },
  {
    key: "risk" as const,
    label: "Compulsion",
    desc: "Can you stop working when you should?",
    color: "#dc2626",
    bgClass: "bg-red-50 border-red-200",
    textClass: "text-red-700",
  },
];

function getVerdict(key: string, value: number): string {
  if (key === "risk") {
    if (value <= 3) return "Healthy boundary";
    if (value === 4) return "No change";
    if (value <= 5) return "Watch this";
    return "Red flag";
  }
  if (key === "substitution") {
    if (value <= 3) return "Doing your own thinking";
    if (value === 4) return "No change";
    if (value <= 5) return "Leaning on AI";
    return "AI-dependent";
  }
  if (value <= 2) return "Declining";
  if (value === 3) return "Slightly down";
  if (value === 4) return "No change";
  if (value === 5) return "Growing";
  if (value === 6) return "Strong growth";
  return "Major shift";
}

export default function PulseBaselineChart({ userScores }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6">
      <h3 className="text-sm text-zinc-700 font-medium tracking-wide mb-1">
        Your Baseline
      </h3>
      <p className="text-sm text-zinc-500 mb-6">
        How AI has shifted your work compared to before. Center line = no change.
      </p>

      <div className="space-y-4">
        {DIMENSIONS.map((d) => {
          const value = userScores[d.key] as number;
          const pct = ((value - 1) / 6) * 100;
          const verdict = getVerdict(d.key, value);

          return (
            <div key={d.key} className="flex items-center gap-4">
              {/* Score box */}
              <div
                className={`border rounded-lg w-20 shrink-0 py-2.5 text-center ${d.bgClass}`}
              >
                <p className={`text-2xl font-bold ${d.textClass} leading-none`}>
                  {value.toFixed(1)}
                </p>
                <p className={`text-[10px] font-medium ${d.textClass} mt-1`}>
                  {d.label}
                </p>
              </div>

              {/* Bar + labels */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-zinc-500 truncate">
                    {d.desc}
                  </span>
                  <span
                    className="text-xs font-medium shrink-0 ml-2"
                    style={{ color: d.color }}
                  >
                    {verdict}
                  </span>
                </div>

                {/* Bar */}
                <div className="relative h-7 bg-zinc-100 rounded overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 w-px bg-zinc-400 z-10"
                    style={{ left: "50%" }}
                  />

                  {value !== 4 && (
                    <div
                      className="absolute top-1 bottom-1 rounded-sm"
                      style={{
                        backgroundColor: d.color,
                        opacity: 0.2,
                        left: value < 4 ? `${pct}%` : "50%",
                        width: `${Math.abs(pct - 50)}%`,
                      }}
                    />
                  )}

                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-20 border-2 border-white"
                    style={{
                      backgroundColor: d.color,
                      left: `calc(${pct}% - 7px)`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-5 text-xs text-zinc-500 pl-24">
        <span>&larr; Less than before AI</span>
        <span className="text-zinc-400 font-medium">|&nbsp; No change</span>
        <span>More than before AI &rarr;</span>
      </div>
    </div>
  );
}
