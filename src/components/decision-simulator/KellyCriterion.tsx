"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import type { KellyResult } from "@/lib/decision-simulator";

interface KellyCriterionProps {
  result: KellyResult;
  posteriorProbability: number;
}

export default function KellyCriterion({
  result,
  posteriorProbability,
}: KellyCriterionProps) {
  const fullKellyPct = result.fraction * 100;
  const halfKellyPct = result.halfKelly * 100;
  const posteriorPct = posteriorProbability * 100;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
          6. Kelly Criterion
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          Kelly tells you how much to bet when you have an edge. Full Kelly is
          too aggressive — use half or quarter Kelly in practice.
        </p>
      </div>

      {/* Commitment gauge */}
      <div className="border border-zinc-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Optimal commitment
          </span>
          <span className="text-[10px] font-mono text-zinc-600">
            f* = (p×b − q) / b
          </span>
        </div>

        {/* Gauge bar */}
        <div className="relative">
          <div className="h-4 bg-zinc-900 border border-zinc-800 relative">
            {/* Full Kelly */}
            {result.isPositive && (
              <div
                className="absolute top-0 left-0 h-full bg-emerald-500/20 transition-all"
                style={{ width: `${Math.min(fullKellyPct, 100)}%` }}
              />
            )}
            {/* Half Kelly */}
            {result.isPositive && (
              <div
                className="absolute top-0 left-0 h-full bg-emerald-500/40 transition-all"
                style={{ width: `${Math.min(halfKellyPct, 100)}%` }}
              />
            )}
          </div>

          {/* Tick marks */}
          <div className="flex justify-between mt-1">
            {[0, 25, 50, 75, 100].map((tick) => (
              <span
                key={tick}
                className="text-[9px] font-mono text-zinc-700"
              >
                {tick}%
              </span>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-600 block">
              Full Kelly
            </span>
            <span className="text-lg font-mono text-zinc-400">
              {fullKellyPct.toFixed(0)}%
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 block">
              Half Kelly (recommended)
            </span>
            <span className="text-lg font-mono text-emerald-400">
              {halfKellyPct.toFixed(0)}%
            </span>
          </div>
        </div>

        {result.isPositive ? (
          <p className="text-[11px] font-mono text-zinc-400">
            Commit no more than{" "}
            <span className="text-emerald-400">
              {halfKellyPct.toFixed(0)}%
            </span>{" "}
            of available resources.
          </p>
        ) : (
          <p className="text-[11px] font-mono text-red-400">
            No positive edge detected. Kelly says: don&apos;t bet.
          </p>
        )}
      </div>

      {/* Sensitivity chart */}
      <div>
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
          Kelly fraction vs probability
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={result.sensitivityCurve}
              margin={{ top: 4, right: 8, bottom: 4, left: -8 }}
            >
              <defs>
                <linearGradient id="kellyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="p"
                tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
                label={{
                  value: "Probability %",
                  position: "insideBottom",
                  offset: -2,
                  style: { fontSize: 9, fontFamily: "monospace", fill: "#52525b" },
                }}
              />
              <YAxis
                tick={{ fontSize: 9, fontFamily: "monospace", fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
                domain={[0, 100]}
                label={{
                  value: "Kelly %",
                  angle: -90,
                  position: "insideLeft",
                  offset: 16,
                  style: { fontSize: 9, fontFamily: "monospace", fill: "#52525b" },
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 font-mono">
                      <p className="text-[10px] text-zinc-400">
                        At {d.p}% probability → {d.kelly.toFixed(1)}% Kelly
                      </p>
                    </div>
                  );
                }}
              />
              <ReferenceLine
                x={Math.round(posteriorPct)}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  value: "You",
                  position: "top",
                  style: { fontSize: 9, fontFamily: "monospace", fill: "#10b981" },
                }}
              />
              <Area
                type="monotone"
                dataKey="kelly"
                stroke="#10b981"
                strokeWidth={1.5}
                fill="url(#kellyGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
