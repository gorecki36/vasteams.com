"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { CYCLE_DATA, CYCLE_META } from "@/lib/ai-investment-data";
import type { CycleKey, CycleMeta } from "@/lib/ai-investment-data";

const ALL_KEYS = Object.keys(CYCLE_META) as CycleKey[];

export default function CycleComparison() {
  const [visible, setVisible] = useState<Record<CycleKey, boolean>>({
    aiCapEx: true,
    nasdaq: true,
    crypto: false,
    railroad: false,
    dow1929: false,
    nikkei: false,
    electric: false,
    auto: false,
  });

  const toggle = (key: CycleKey) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const visibleKeys = ALL_KEYS.filter((k) => visible[k]);

  // Filter data to years where at least one visible series has data
  const filteredData = CYCLE_DATA.filter((d) =>
    visibleKeys.some((k) => d[k] != null)
  );

  // Y domain based on visible series
  const maxVal = Math.max(
    ...filteredData.flatMap((d) =>
      visibleKeys
        .filter((k) => d[k] != null)
        .map((k) => d[k] as number)
    ),
    200
  );

  const modernKeys = ALL_KEYS.filter((k) => CYCLE_META[k].group === "modern");
  const historicalKeys = ALL_KEYS.filter(
    (k) => CYCLE_META[k].group === "historical"
  );

  function ToggleButton({ k, meta }: { k: CycleKey; meta: CycleMeta }) {
    const isOn = visible[k];
    return (
      <button
        onClick={() => toggle(k)}
        className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all duration-200 ${
          isOn
            ? "border-zinc-600 text-zinc-200"
            : "border-zinc-700 text-zinc-400 opacity-70"
        }`}
        style={{
          borderColor: isOn ? meta.color + "60" : undefined,
        }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
          style={{ backgroundColor: isOn ? meta.color : "#52525b" }}
        />
        {meta.label}
      </button>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-2">
          Where Are We in the Cycle?
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Eight investment booms normalized to the same starting point. The X
          axis shows years from the start of each boom.{" "}
          <span className="text-zinc-300">
            Toggle curves on to compare velocity across eras.
          </span>{" "}
          <span className="text-zinc-600">
            Historical &amp; NASDAQ data from FRED. Crypto from CoinMarketCap. AI CapEx from earnings reports (2025–26 projected).
          </span>
        </p>
      </div>

      {/* Toggle buttons — grouped */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mr-1 w-16 shrink-0">
            Modern
          </span>
          {modernKeys.map((k) => (
            <ToggleButton key={k} k={k} meta={CYCLE_META[k]} />
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mr-1 w-16 shrink-0">
            Historical
          </span>
          {historicalKeys.map((k) => (
            <ToggleButton key={k} k={k} meta={CYCLE_META[k]} />
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="border border-zinc-800 p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={filteredData}
            margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
          >
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{
                fontSize: 11,
                fontFamily: "monospace",
                fill: "#52525b",
              }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
              label={{
                value: "Years from cycle start",
                position: "insideBottom",
                offset: -2,
                style: {
                  fontSize: 10,
                  fontFamily: "monospace",
                  fill: "#3f3f46",
                },
              }}
            />
            <YAxis
              domain={[0, Math.ceil(maxVal / 100) * 100]}
              tick={{
                fontSize: 10,
                fontFamily: "monospace",
                fill: "#52525b",
              }}
              axisLine={{ stroke: "#27272a" }}
              tickLine={false}
            />
            <ReferenceLine
              y={100}
              stroke="#3f3f46"
              strokeDasharray="3 3"
              label={{
                value: "100 (base)",
                position: "right",
                style: {
                  fontSize: 9,
                  fontFamily: "monospace",
                  fill: "#52525b",
                },
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-[11px]">
                    <div className="text-zinc-400 mb-1">Year {label}</div>
                    {payload.map((p) => (
                      <div key={p.dataKey as string} className="flex gap-2">
                        <span style={{ color: p.color }}>
                          {CYCLE_META[p.dataKey as CycleKey]?.label}:
                        </span>
                        <span className="text-zinc-200">{p.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            {visibleKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CYCLE_META[key].color}
                strokeWidth={key === "aiCapEx" ? 2.5 : 1.5}
                dot={{ r: key === "aiCapEx" ? 4 : 2.5, fill: CYCLE_META[key].color }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Narrative callout */}
      <div className="border-l-2 border-emerald-500/30 pl-4 py-2">
        <p className="text-sm text-zinc-400 leading-relaxed">
          <span className="text-zinc-200">
            AI CapEx at Year 4 (2024) is tracking NASDAQ-like velocity.
          </span>{" "}
          Years 0–4 are from earnings reports. The dot-com peaked at Year 5 ({" "}
          <span className="text-emerald-400">529</span> indexed) and crashed at
          Year 6.{" "}
          <span className="text-zinc-500">
            AI CapEx Year 5–6 are analyst projections
          </span>{" "}
          — reaching{" "}
          <span className="text-blue-400">733</span> at Year 6, surpassing the
          dot-com peak by 39%. Note the 2023 dip (Year 3) — a real pause before
          the AI ramp.
        </p>
        {visible.railroad && (
          <p className="text-xs text-zinc-500 mt-2">
            The railroad boom peaked at{" "}
            <span className="text-violet-400">908</span> (Year 7) before the
            Panic of 1873. Most railroad companies went bankrupt — but the
            tracks remained and transformed America. The closest historical
            parallel to AI infrastructure.
          </p>
        )}
        {visible.crypto && (
          <p className="text-xs text-zinc-600 mt-2">
            Crypto peaked at 124x its 2017 base — a speculation cycle of a
            different magnitude. Toggle it off to compare the infrastructure
            curves directly.
          </p>
        )}
      </div>
    </section>
  );
}
