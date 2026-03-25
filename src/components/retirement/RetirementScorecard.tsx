"use client";

import type { RetirementAnalysis } from "@/lib/retirement";

interface RetirementScorecardProps {
  analysis: RetirementAnalysis;
  retirementAge: number;
}

function signalColor(signal: "safe" | "tight" | "danger"): string {
  if (signal === "safe") return "text-emerald-400";
  if (signal === "tight") return "text-amber-400";
  return "text-red-400";
}

function signalBorder(signal: "safe" | "tight" | "danger"): string {
  if (signal === "safe") return "border-emerald-500/30";
  if (signal === "tight") return "border-amber-500/30";
  return "border-red-500/30";
}

export default function RetirementScorecard({ analysis, retirementAge }: RetirementScorecardProps) {
  const { moneyRunsOutAge, expectedDeathAge, safetyMargin, monthlyPostRetirementBudget, signal, verdict } = analysis;

  const financialRunway = moneyRunsOutAge !== null
    ? moneyRunsOutAge - retirementAge
    : 100 - retirementAge;

  const metrics = [
    {
      label: "Financial Runway",
      value: moneyRunsOutAge !== null ? `${financialRunway} years` : "∞",
      sub: moneyRunsOutAge !== null ? `Money out at ${moneyRunsOutAge}` : "Never runs out",
      signal: moneyRunsOutAge === null ? "safe" as const : financialRunway > 20 ? "safe" as const : financialRunway > 10 ? "tight" as const : "danger" as const,
    },
    {
      label: "Life Expectancy",
      value: `${expectedDeathAge}`,
      sub: "Median survival age",
      signal: "tight" as const,
    },
    {
      label: "Safety Margin",
      value: `${safetyMargin > 0 ? "+" : ""}${safetyMargin} yrs`,
      sub: safetyMargin > 0 ? "Money outlasts you" : "You outlast your money",
      signal: safetyMargin >= 10 ? "safe" as const : safetyMargin >= 0 ? "tight" as const : "danger" as const,
    },
    {
      label: "Monthly Budget",
      value: `$${monthlyPostRetirementBudget.toLocaleString()}`,
      sub: "Post-retirement (approx)",
      signal: monthlyPostRetirementBudget > 5000 ? "safe" as const : monthlyPostRetirementBudget > 3000 ? "tight" as const : "danger" as const,
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400">
        Scorecard
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className={`border ${signalBorder(m.signal)} p-4 space-y-1`}>
            <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-600">
              {m.label}
            </p>
            <p className={`text-xl font-mono ${signalColor(m.signal)}`}>
              {m.value}
            </p>
            <p className="text-[9px] font-mono text-zinc-600">
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className={`border ${signalBorder(signal)} p-4`}>
        <p className={`text-[11px] font-mono ${signalColor(signal)} leading-relaxed`}>
          {verdict}
        </p>
      </div>
    </section>
  );
}
