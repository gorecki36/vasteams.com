"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import type { RetirementAnalysis } from "@/lib/retirement";

interface RunwayChartProps {
  analysis: RetirementAnalysis;
  retirementAge: number;
}

function formatDollar(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
}

export default function RunwayChart({ analysis, retirementAge }: RunwayChartProps) {
  const { yearData, moneyRunsOutAge, expectedDeathAge } = analysis;

  // Clamp net worth for display (don't let extreme negatives break the chart)
  const chartData = yearData.map((d) => ({
    age: d.age,
    netWorth: Math.max(d.netWorth, 0),
    rawNetWorth: d.netWorth,
    survival: Math.round(d.survivalProbability * 100),
  }));

  const maxNetWorth = Math.max(...chartData.map((d) => d.netWorth));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
          Financial Runway vs Survival Curve
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          The two curves that define your retirement. Green = your money. Amber = your probability of being alive. Where they intersect is what matters.
        </p>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
          >
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="age"
              tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
              label={{
                value: "Age",
                position: "insideBottom",
                offset: -2,
                style: { fontSize: 9, fontFamily: "monospace", fill: "#52525b" },
              }}
            />

            {/* Left Y: Net Worth */}
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
              tickFormatter={formatDollar}
              domain={[0, maxNetWorth * 1.1]}
              label={{
                value: "Net Worth",
                angle: -90,
                position: "insideLeft",
                offset: 16,
                style: { fontSize: 9, fontFamily: "monospace", fill: "#52525b" },
              }}
            />

            {/* Right Y: Survival % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
              label={{
                value: "Survival %",
                angle: 90,
                position: "insideRight",
                offset: 16,
                style: { fontSize: 9, fontFamily: "monospace", fill: "#52525b" },
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono space-y-1">
                    <p className="text-[10px] text-zinc-400">Age {d.age}</p>
                    <p className="text-[10px] text-emerald-400">
                      Net worth: {formatDollar(d.rawNetWorth)}
                    </p>
                    <p className="text-[10px] text-amber-400">
                      Survival: {d.survival}%
                    </p>
                  </div>
                );
              }}
            />

            {/* Danger zone: money runs out before expected death */}
            {moneyRunsOutAge !== null && moneyRunsOutAge < expectedDeathAge && (
              <ReferenceArea
                x1={moneyRunsOutAge}
                x2={expectedDeathAge}
                yAxisId="left"
                fill="#ef4444"
                fillOpacity={0.08}
                label={{
                  value: "Danger zone",
                  position: "center",
                  style: { fontSize: 9, fontFamily: "monospace", fill: "#ef4444" },
                }}
              />
            )}

            {/* Retirement age line */}
            <ReferenceLine
              x={retirementAge}
              yAxisId="left"
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: `Retire ${retirementAge}`,
                position: "top",
                style: { fontSize: 9, fontFamily: "monospace", fill: "#10b981" },
              }}
            />

            {/* Money runs out line */}
            {moneyRunsOutAge !== null && (
              <ReferenceLine
                x={moneyRunsOutAge}
                yAxisId="left"
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: `Broke ${moneyRunsOutAge}`,
                  position: "top",
                  style: { fontSize: 9, fontFamily: "monospace", fill: "#ef4444" },
                }}
              />
            )}

            {/* Expected death line */}
            <ReferenceLine
              x={expectedDeathAge}
              yAxisId="left"
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: `Median ${expectedDeathAge}`,
                position: "top",
                style: { fontSize: 9, fontFamily: "monospace", fill: "#f59e0b" },
              }}
            />

            {/* Net Worth area */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="netWorth"
              stroke="#10b981"
              strokeWidth={1.5}
              fill="url(#netWorthGradient)"
              dot={false}
            />

            {/* Survival line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="survival"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
