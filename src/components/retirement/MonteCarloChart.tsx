"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Bar,
  BarChart,
} from "recharts";
import type { MonteCarloResult } from "@/lib/retirement";

interface MonteCarloChartProps {
  mc: MonteCarloResult;
  retirementAge: number;
}

function formatDollar(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
}

// Deterministic color per path index for stable renders
const PATH_COLORS = [
  "rgba(16,185,129,0.08)", // emerald
  "rgba(245,158,11,0.06)", // amber
  "rgba(139,92,246,0.06)", // violet
];

export default function MonteCarloChart({ mc, retirementAge }: MonteCarloChartProps) {
  const ruinPct = Math.round(mc.probRuin * 100);
  const safePct = Math.round(mc.probSafe * 100);

  // Build spaghetti data: pivot paths into age-keyed rows
  // Only take every other path to keep it readable
  const displayPaths = mc.samplePaths.filter((_, i) => i % 2 === 0).slice(0, 75);

  // Find all unique ages across paths
  const allAges = new Set<number>();
  for (const path of displayPaths) {
    for (const p of path) allAges.add(p.age);
  }
  const sortedAges = Array.from(allAges).sort((a, b) => a - b);

  // Build chart data: one row per age, one column per path
  const spaghettiData = sortedAges.map((age) => {
    const row: Record<string, number> = { age };
    for (let i = 0; i < displayPaths.length; i++) {
      const point = displayPaths[i].find((p) => p.age === age);
      if (point) row[`p${i}`] = Math.max(point.netWorth, 0);
    }
    return row;
  });

  // Max net worth for Y axis
  const maxNW = Math.max(
    ...displayPaths.flatMap((path) => path.map((p) => Math.max(p.netWorth, 0)))
  );

  // Merge histograms for the overlaid bar chart
  const allBuckets = new Set<number>();
  for (const h of mc.deathAgeHistogram) allBuckets.add(h.age);
  for (const h of mc.ruinAgeHistogram) allBuckets.add(h.age);
  const histData = Array.from(allBuckets)
    .sort((a, b) => a - b)
    .map((age) => ({
      age: `${age}-${age + 4}`,
      deaths: mc.deathAgeHistogram.find((h) => h.age === age)?.count ?? 0,
      ruins: mc.ruinAgeHistogram.find((h) => h.age === age)?.count ?? 0,
    }));

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
          Monte Carlo Simulation
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          5,000 simulations with randomized market returns and sampled death ages.
          Each path is one possible future.
        </p>
      </div>

      {/* Big probability stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-emerald-500/30 p-5 text-center">
          <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 mb-2">
            Die with money left
          </p>
          <p className="text-4xl font-mono text-emerald-400">{safePct}%</p>
          <p className="text-[9px] font-mono text-zinc-600 mt-1">
            of simulations
          </p>
        </div>
        <div className={`border ${ruinPct > 25 ? "border-red-500/30" : ruinPct > 10 ? "border-amber-500/30" : "border-zinc-800"} p-5 text-center`}>
          <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 mb-2">
            Run out of money while alive
          </p>
          <p className={`text-4xl font-mono ${ruinPct > 25 ? "text-red-400" : ruinPct > 10 ? "text-amber-400" : "text-emerald-400"}`}>
            {ruinPct}%
          </p>
          <p className="text-[9px] font-mono text-zinc-600 mt-1">
            of simulations
          </p>
        </div>
      </div>

      {/* Percentile details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="border border-zinc-800 p-3">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Death age (p10-p90)</p>
          <p className="text-sm font-mono text-amber-400 mt-1">
            {mc.deathAgePercentiles.p10} – {mc.deathAgePercentiles.p90}
          </p>
        </div>
        <div className="border border-zinc-800 p-3">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Median death</p>
          <p className="text-sm font-mono text-amber-400 mt-1">{mc.deathAgePercentiles.p50}</p>
        </div>
        {mc.ruinAgePercentiles && (
          <>
            <div className="border border-zinc-800 p-3">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Ruin age (p10-p90)</p>
              <p className="text-sm font-mono text-red-400 mt-1">
                {mc.ruinAgePercentiles.p10} – {mc.ruinAgePercentiles.p90}
              </p>
            </div>
            <div className="border border-zinc-800 p-3">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Median ruin</p>
              <p className="text-sm font-mono text-red-400 mt-1">{mc.ruinAgePercentiles.p50}</p>
            </div>
          </>
        )}
        <div className="border border-zinc-800 p-3">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Median wealth at death</p>
          <p className="text-sm font-mono text-zinc-300 mt-1">{formatDollar(mc.medianWealthAtDeath)}</p>
        </div>
      </div>

      {/* Spaghetti chart */}
      <div>
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
          75 simulated net worth paths
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={spaghettiData}
              margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
            >
              <XAxis
                dataKey="age"
                tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
                tickFormatter={formatDollar}
                domain={[0, maxNW * 1.05]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const age = payload[0].payload.age;
                  const values = payload
                    .map((p) => Number(p.value))
                    .filter((v) => !isNaN(v));
                  const min = Math.min(...values);
                  const max = Math.max(...values);
                  return (
                    <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono">
                      <p className="text-[10px] text-zinc-400">Age {age}</p>
                      <p className="text-[10px] text-emerald-400">
                        Range: {formatDollar(min)} – {formatDollar(max)}
                      </p>
                    </div>
                  );
                }}
              />
              <ReferenceLine
                x={retirementAge}
                stroke="#10b981"
                strokeDasharray="3 3"
              />
              {displayPaths.map((_, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={`p${i}`}
                  stroke={PATH_COLORS[i % PATH_COLORS.length]}
                  strokeWidth={1}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Death vs Ruin histogram */}
      <div>
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
          When do you die vs when does money run out?
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={histData}
              margin={{ top: 4, right: 8, bottom: 4, left: -8 }}
            >
              <XAxis
                dataKey="age"
                tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono space-y-1">
                      <p className="text-[10px] text-zinc-400">Ages {d.age}</p>
                      <p className="text-[10px] text-amber-400">Deaths: {d.deaths}</p>
                      {d.ruins > 0 && (
                        <p className="text-[10px] text-red-400">Ruin: {d.ruins}</p>
                      )}
                    </div>
                  );
                }}
              />
              <Bar dataKey="deaths" fill="#f59e0b" fillOpacity={0.4} name="Deaths" />
              <Bar dataKey="ruins" fill="#ef4444" fillOpacity={0.5} name="Ruin" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2">
          <span className="text-[9px] font-mono text-amber-400">■ Death distribution</span>
          <span className="text-[9px] font-mono text-red-400">■ Ruin distribution</span>
        </div>
      </div>
    </section>
  );
}
