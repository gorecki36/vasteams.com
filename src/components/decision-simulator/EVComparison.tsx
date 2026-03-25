"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { EVResult } from "@/lib/decision-simulator";

interface EVComparisonProps {
  results: EVResult[];
  unit: string;
}

export default function EVComparison({ results, unit }: EVComparisonProps) {
  const maxEV = Math.max(...results.map((r) => r.ev));
  const data = results.map((r) => ({
    name: r.optionName || r.optionId,
    ev: Math.round(r.ev),
    isWinner: r.ev === maxEV && r.ev > 0,
    breakdown: r.breakdown,
  }));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
          1. Expected Value Comparison
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          Expected value is the weighted average of all possible outcomes.
          The option with the highest EV is mathematically the best bet —
          if you could make this decision 100 times.
        </p>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 10, fontFamily: "monospace", fill: "#71717a" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 11, fontFamily: "monospace", fill: "#a1a1aa" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono">
                    <p className="text-xs text-zinc-300">{d.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {d.breakdown}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="ev" radius={0} barSize={24}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isWinner ? "#10b981" : "#3f3f46"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Math breakdowns */}
      <div className="space-y-1">
        {results.map((r) => (
          <div
            key={r.optionId}
            className={`flex items-center gap-3 px-3 py-2 text-[11px] font-mono border-l-2 ${
              r.ev === maxEV && r.ev > 0
                ? "border-emerald-500 text-emerald-400"
                : "border-zinc-800 text-zinc-500"
            }`}
          >
            <span className="flex-1 truncate">{r.optionName}</span>
            <span className="text-zinc-600 hidden sm:inline">{r.breakdown}</span>
            <span className="font-bold">
              {r.ev.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              {unit !== "custom" ? unit : ""}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
