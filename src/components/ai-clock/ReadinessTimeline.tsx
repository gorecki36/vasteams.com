"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HistoryPoint } from "@/lib/ai-benchmarks";
import { BENCHMARK_COUNT } from "@/lib/ai-benchmarks";
import type { RoleDefinition } from "@/lib/roles";
import { computeReadinessFromBenchmarks } from "@/lib/roles";

interface Props {
  history: HistoryPoint[];
  role: RoleDefinition | null;
}

interface ChartPoint {
  date: string;
  label: string;
  readiness: number;
  benchmarkCount: number;
}

export default function ReadinessTimeline({ history, role }: Props) {
  const chartData = useMemo(() => {
    if (!role || history.length === 0) return [];
    return history.map((point): ChartPoint => ({
      date: point.date,
      label: new Date(point.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      readiness: computeReadinessFromBenchmarks(role, point.benchmarks),
      benchmarkCount: point.benchmarkCount,
    }));
  }, [history, role]);

  if (chartData.length === 0) return null;

  const hasPartialData = chartData.some((d) => d.benchmarkCount < BENCHMARK_COUNT);

  return (
    <div className="border border-zinc-800 bg-zinc-900/30 p-4 mb-6">
      <h3 className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
        Readiness over time
        {role && (
          <span className="text-zinc-600"> / {role.shortName}</span>
        )}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fontFamily: "monospace", fill: "#52525b" }}
            axisLine={{ stroke: "#27272a" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fontFamily: "monospace", fill: "#52525b" }}
            axisLine={{ stroke: "#27272a" }}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload as ChartPoint;
              const partial = d.benchmarkCount < BENCHMARK_COUNT;
              return (
                <div
                  className="border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-[11px]"
                  style={{ borderRadius: 4 }}
                >
                  <div className="text-zinc-400">{d.label}</div>
                  <div className="text-emerald-400 font-bold mt-0.5">
                    {d.readiness}% readiness
                  </div>
                  <div className={`mt-0.5 ${partial ? "text-amber-500/70" : "text-zinc-600"}`}>
                    {d.benchmarkCount}/{BENCHMARK_COUNT} benchmarks
                    {partial && " (extrapolated)"}
                  </div>
                </div>
              );
            }}
          />
          <Area
            type="stepAfter"
            dataKey="readiness"
            stroke="#34d399"
            strokeWidth={1.5}
            fill="url(#emeraldGradient)"
            dot={false}
            activeDot={{ r: 3, fill: "#34d399", stroke: "#18181b", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {hasPartialData && (
        <p className="text-[9px] font-mono text-zinc-600 mt-2 leading-relaxed">
          Earlier data points are based on fewer benchmarks (some didn&apos;t exist yet).
          Missing scores are extrapolated from the average of available benchmarks.
        </p>
      )}
    </div>
  );
}
