"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CAPEX_REVENUE_DATA } from "@/lib/ai-investment-data";

export default function CapExRevenueGap() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-2">
          The CapEx vs Revenue Gap
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Hyperscaler capital expenditure vs AI-generated revenue.{" "}
          <span className="text-zinc-300">
            The gap between spending and revenue IS the story.
          </span>
        </p>
      </div>

      <div className="border border-zinc-800 p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={CAPEX_REVENUE_DATA}
            margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
          >
            <defs>
              <linearGradient id="capExGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{
                fontSize: 11,
                fontFamily: "monospace",
                fill: "#52525b",
              }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 10,
                fontFamily: "monospace",
                fill: "#52525b",
              }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
              tickFormatter={(v: number) => `$${v}B`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                if (!d) return null;
                const ratio =
                  d.revenue > 0 ? (d.capEx / d.revenue).toFixed(1) : "∞";
                return (
                  <div className="border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-[11px]">
                    <div className="text-zinc-400 mb-1">{d.label}</div>
                    <div className="text-red-400">
                      CapEx: ${d.capEx}B
                    </div>
                    <div className="text-emerald-400">
                      AI Revenue: ${d.revenue}B
                    </div>
                    <div className="text-zinc-500 mt-1">
                      Ratio: {ratio}:1
                    </div>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="capEx"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#capExGradient)"
              dot={{ r: 3, fill: "#ef4444", stroke: "#18181b", strokeWidth: 1 }}
              activeDot={{ r: 5 }}
              name="CapEx"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{
                r: 3,
                fill: "#34d399",
                stroke: "#18181b",
                strokeWidth: 1,
              }}
              activeDot={{ r: 5 }}
              name="AI Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex gap-6 mt-3 justify-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-red-400 inline-block" />
            <span className="text-[10px] font-mono text-zinc-500">
              Hyperscaler CapEx ($B)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
            <span className="text-[10px] font-mono text-zinc-500">
              Gen AI Vendor Revenue ($B)
            </span>
          </div>
        </div>

        {/* Data provenance */}
        <p className="text-[9px] font-mono text-zinc-700 text-center mt-2">
          CapEx 2020–2024 from earnings reports &amp; Platformonomics. 2025–2026 projected (analyst consensus, Futurum).
          Revenue line is estimated throughout — see sources.
        </p>
      </div>

      {/* Narrative */}
      <div className="border-l-2 border-red-500/30 pl-4 py-2">
        <p className="text-sm text-zinc-400 leading-relaxed">
          <span className="text-zinc-200">
            Hyperscaler CapEx is 10–20x generative AI revenue.
          </span>{" "}
          Not all CapEx is AI-specific, but the acceleration from 2024 onward is
          primarily AI-driven. Note the 2023 dip — a post-pandemic pullback
          before the AI ramp. Today&apos;s leaders are profitable: only 20% of
          tech companies are unprofitable vs 36% during dot-com (Bernstein).{" "}
          <span className="text-zinc-600">
            Note: the revenue line uses estimated figures — the gap is
            directionally right, not precise.
          </span>
        </p>
      </div>
    </section>
  );
}
