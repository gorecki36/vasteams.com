"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { BOTTLENECK_INDICATORS } from "@/lib/ai-investment-data";

function MiniSparkline({
  data,
  color,
  id,
}: {
  data: number[];
  color: string;
  id: string;
}) {
  const chartData = data.map((v, i) => ({ i, v }));
  const gradientId = `spark-${id}`;

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart
        data={chartData}
        margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function BottleneckIndicators() {
  const colors = ["#34d399", "#f59e0b", "#3b82f6", "#a78bfa"];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-2">
          Bottleneck Indicators
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
          <span className="text-zinc-300">
            These are the constraints that money can&apos;t solve quickly.
          </span>{" "}
          Commodity prices and input costs tracking the AI infrastructure
          build-out since 2020.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BOTTLENECK_INDICATORS.map((indicator, i) => (
          <div
            key={indicator.id}
            className="border border-zinc-800 p-4 space-y-3 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  {indicator.label}
                </div>
                <div
                  className="text-lg font-mono font-bold mt-1"
                  style={{ color: colors[i] }}
                >
                  {indicator.value}
                </div>
              </div>
              <div className="text-right shrink-0 mt-1">
                <span className="text-[10px] font-mono text-zinc-500 block">
                  {indicator.trend}
                </span>
              </div>
            </div>

            <MiniSparkline
              data={indicator.sparkline}
              color={colors[i]}
              id={indicator.id}
            />

            <div className="flex items-end justify-between gap-2">
              <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
                {indicator.framing}
              </p>
              <span className="text-[9px] font-mono text-zinc-700 whitespace-nowrap shrink-0">
                {indicator.fredSeries ? (
                  <a
                    href={`https://fred.stlouisfed.org/series/${indicator.fredSeries}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-500 transition-colors"
                  >
                    FRED {indicator.lastUpdated}
                  </a>
                ) : (
                  <span>est. {indicator.lastUpdated}</span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Data provenance */}
      <div className="text-[9px] font-mono text-zinc-700 text-center space-y-0.5">
        <p>
          Copper, uranium, electricity: quarterly FRED data, Jan 2020 – Jan 2026.
        </p>
        <p>
          HBM: annual data — 2020–2021 est., 2022 Gartner, 2023–2025 Yole, 2026 BofA proj.
        </p>
      </div>
    </section>
  );
}
