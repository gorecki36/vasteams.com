"use client";

import { useState, useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import {
  STACK_LAYERS,
  BOTTLENECK_INDICATORS,
  type StackLayer,
  type BottleneckIndicator,
} from "@/lib/ai-investment-data";

// ─── Crowding labels ────────────────────────────────────────────────────────

const CROWDING_LABELS: Record<string, { text: string; color: string }> = {
  low: { text: "Low crowding", color: "text-emerald-400" },
  medium: { text: "Medium crowding", color: "text-amber-400" },
  high: { text: "High crowding", color: "text-red-400" },
};

// ─── Sparkline colors per indicator ──────────────────────────────────────────

const INDICATOR_COLORS: Record<string, string> = {
  copper: "#34d399",
  uranium: "#f59e0b",
  electricity: "#3b82f6",
  hbm: "#a78bfa",
};

function MiniSparkline({ data, color, id }: { data: number[]; color: string; id: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const gradientId = `spark-${id}`;

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
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

// ─── SVG Icons per layer ────────────────────────────────────────────────────

function LayerIcon({ id, className }: { id: string; className?: string }) {
  const cn = className ?? "w-5 h-5";
  switch (id) {
    case "raw-materials":
      return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn}>
          <path d="M10 2L7 8l-5 2 3 6h10l3-6-5-2z" />
          <path d="M7 8l3-6 3 6" />
          <line x1="5" y1="16" x2="15" y2="16" />
          <line x1="10" y1="16" x2="10" y2="18" />
        </svg>
      );
    case "power-energy":
      return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn}>
          <path d="M11 1L5 11h4l-2 8 8-10h-4z" fill="currentColor" opacity="0.15" />
          <path d="M11 1L5 11h4l-2 8 8-10h-4z" />
        </svg>
      );
    case "data-centers":
      return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn}>
          <rect x="3" y="2" width="14" height="5" rx="1" />
          <rect x="3" y="9" width="14" height="5" rx="1" />
          <circle cx="6" cy="4.5" r="0.8" fill="currentColor" />
          <circle cx="6" cy="11.5" r="0.8" fill="currentColor" />
          <line x1="9" y1="4.5" x2="14" y2="4.5" />
          <line x1="9" y1="11.5" x2="14" y2="11.5" />
          <line x1="10" y1="16" x2="10" y2="18" />
          <line x1="7" y1="18" x2="13" y2="18" />
        </svg>
      );
    case "chips-silicon":
      return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn}>
          <rect x="5" y="5" width="10" height="10" rx="1" />
          <rect x="7" y="7" width="6" height="6" rx="0.5" fill="currentColor" opacity="0.1" />
          <line x1="7" y1="3" x2="7" y2="5" /><line x1="10" y1="3" x2="10" y2="5" /><line x1="13" y1="3" x2="13" y2="5" />
          <line x1="7" y1="15" x2="7" y2="17" /><line x1="10" y1="15" x2="10" y2="17" /><line x1="13" y1="15" x2="13" y2="17" />
          <line x1="3" y1="7" x2="5" y2="7" /><line x1="3" y1="10" x2="5" y2="10" /><line x1="3" y1="13" x2="5" y2="13" />
          <line x1="15" y1="7" x2="17" y2="7" /><line x1="15" y1="10" x2="17" y2="10" /><line x1="15" y1="13" x2="17" y2="13" />
        </svg>
      );
    case "models-platforms":
      return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn}>
          <circle cx="10" cy="4" r="2" />
          <circle cx="5" cy="12" r="2" />
          <circle cx="15" cy="12" r="2" />
          <circle cx="10" cy="16" r="1.5" />
          <line x1="10" y1="6" x2="5" y2="10" />
          <line x1="10" y1="6" x2="15" y2="10" />
          <line x1="5" y1="14" x2="10" y2="14.5" />
          <line x1="15" y1="14" x2="10" y2="14.5" />
        </svg>
      );
    case "applications":
      return (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn}>
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <line x1="3" y1="7" x2="17" y2="7" />
          <circle cx="5.5" cy="5" r="0.7" fill="currentColor" />
          <circle cx="8" cy="5" r="0.7" fill="currentColor" />
          <rect x="6" y="10" width="8" height="2" rx="0.5" />
          <rect x="6" y="13.5" width="5" height="1.5" rx="0.5" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Visual weight config ───────────────────────────────────────────────────

function getLayerStyle(layer: StackLayer) {
  if (layer.highlight) {
    // Bottom 3 layers (1–3): heavier, brighter
    return {
      borderLeft: "4px",
      borderClass: "border-l-4",
      nameColor: "text-zinc-100",
      taglineColor: "text-zinc-400",
      iconColor: "text-emerald-400",
      metricColor: "text-emerald-300",
      py: "py-4",
      bgHover: "hover:bg-zinc-900/40",
    };
  }
  // Top 3 layers (4–6): lighter, dimmer
  return {
    borderLeft: layer.level === 4 ? "2px" : "1px",
    borderClass: layer.level === 4 ? "border-l-2" : "border-l",
    nameColor: "text-zinc-400",
    taglineColor: "text-zinc-600",
    iconColor: "text-zinc-500",
    metricColor: "text-zinc-400",
    py: "py-3",
    bgHover: "hover:bg-zinc-900/20",
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function InvestmentStack() {
  const [expanded, setExpanded] = useState<string | null>("power-energy");

  // Display: apps at top, raw materials at bottom
  const layers = [...STACK_LAYERS].reverse();

  // Build indicator lookup once
  const indicatorMap = useMemo(() => {
    const map: Record<string, BottleneckIndicator> = {};
    for (const ind of BOTTLENECK_INDICATORS) map[ind.id] = ind;
    return map;
  }, []);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-2">
          The Investment Stack — Beyond the Obvious
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Six layers of AI infrastructure. Most attention goes to the top.{" "}
          <span className="text-zinc-300">
            The hardest bottlenecks — and the longest runways — are at the bottom.
          </span>
        </p>
      </div>

      {/* Stack with side annotation */}
      <div className="flex gap-6">
        {/* Side annotation — desktop only */}
        <div className="hidden lg:flex flex-col items-center justify-between py-2 shrink-0 w-8">
          <span className="text-[9px] font-mono text-zinc-600 whitespace-nowrap [writing-mode:vertical-lr] rotate-180 tracking-wider uppercase">
            Most attention
          </span>
          <div className="flex-1 w-px bg-gradient-to-b from-zinc-700 via-emerald-600/40 to-emerald-500 my-3" />
          <span className="text-[9px] font-mono text-emerald-500/70 whitespace-nowrap [writing-mode:vertical-lr] rotate-180 tracking-wider uppercase">
            Longest runway
          </span>
        </div>

        {/* Layer stack */}
        <div className="flex-1 space-y-1">
          {layers.map((layer) => {
            const isExpanded = expanded === layer.id;
            const crowding = CROWDING_LABELS[layer.crowding];
            const style = getLayerStyle(layer);

            return (
              <div
                key={layer.id}
                className={`border transition-all duration-300 cursor-pointer ${
                  layer.highlight
                    ? `${layer.color} ${style.borderClass}`
                    : `border-zinc-800 ${style.borderClass}`
                } ${isExpanded ? "bg-zinc-900/50" : style.bgHover}`}
                onClick={() => setExpanded(isExpanded ? null : layer.id)}
              >
                {/* Layer header — always visible */}
                <div className={`flex items-center justify-between px-4 ${style.py}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={style.iconColor}>
                      <LayerIcon id={layer.id} />
                    </span>
                    <div className="min-w-0">
                      <span className={`text-sm font-mono tracking-wide ${style.nameColor}`}>
                        {layer.name}
                      </span>
                      <p className={`text-[11px] ${style.taglineColor} truncate`}>
                        {layer.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-3">
                    <span className={`text-[11px] font-mono ${style.metricColor} hidden sm:inline`}>
                      {layer.keyMetric}
                    </span>
                    <span className={`text-[10px] font-mono ${crowding.color}`}>
                      {crowding.text}
                    </span>
                    <span className="text-zinc-600 text-xs select-none">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>
                </div>

                {/* Expanded content — 3 column layout */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-3 border-t border-zinc-800/50">
                    {/* Key metric on mobile (hidden on sm+) */}
                    <p className="text-[11px] font-mono text-emerald-300 sm:hidden pl-8 mb-3">
                      {layer.keyMetric}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr] gap-6 ml-8">
                      {/* ── Column 1: Key Insight ── */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                          Key Insight
                        </p>
                        <p className="text-sm text-zinc-100 leading-relaxed">
                          {layer.insight}
                        </p>
                        <p className="text-sm text-zinc-400 italic leading-relaxed">
                          {layer.whyItMatters}
                        </p>

                        {/* Bottleneck callout */}
                        <div className="border-l-2 border-amber-500/60 bg-amber-950/10 px-4 py-2.5">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-500/80 mb-1">
                            Bottleneck
                          </p>
                          <p className="text-sm text-zinc-200">{layer.bottleneck}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                              Timeline
                            </span>
                            <span className="text-[11px] font-mono text-zinc-400">
                              {layer.timeline}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ── Column 2: Stats & Charts ── */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                          By the Numbers
                        </p>

                        {/* Stat cards — stacked */}
                        {layer.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="border border-zinc-800 bg-zinc-900/40 px-3 py-2.5"
                          >
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                                {stat.label}
                              </p>
                              {stat.source && (
                                <p className="text-[9px] font-mono text-zinc-700 shrink-0">
                                  {stat.source}
                                </p>
                              )}
                            </div>
                            <p className="text-lg font-mono text-zinc-100 mt-0.5">
                              {stat.value}
                            </p>
                          </div>
                        ))}

                        {/* Sparkline indicators */}
                        {layer.indicatorIds && layer.indicatorIds.length > 0 &&
                          layer.indicatorIds.map((indId) => {
                            const ind = indicatorMap[indId];
                            if (!ind) return null;
                            const color = INDICATOR_COLORS[indId] ?? "#71717a";
                            return (
                              <div
                                key={indId}
                                className="border border-zinc-800 bg-zinc-900/40 px-3 py-3 space-y-2"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                                      {ind.label}
                                    </p>
                                    <p
                                      className="text-lg font-mono font-bold mt-0.5"
                                      style={{ color }}
                                    >
                                      {ind.value}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-mono text-zinc-400 mt-1 shrink-0">
                                    {ind.trend}
                                  </span>
                                </div>
                                <MiniSparkline data={ind.sparkline} color={color} id={indId} />
                                <div className="flex items-end justify-between gap-2">
                                  <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">
                                    {ind.framing}
                                  </p>
                                  <span className="text-[9px] font-mono text-zinc-600 whitespace-nowrap shrink-0">
                                    {ind.fredSeries ? (
                                      <a
                                        href={`https://fred.stlouisfed.org/series/${ind.fredSeries}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-zinc-400 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        FRED {ind.lastUpdated}
                                      </a>
                                    ) : (
                                      <span>est. {ind.lastUpdated}</span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* ── Column 3: Key Players ── */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                          Key Players
                        </p>
                        {layer.companies.map((co) => (
                          <div
                            key={co.name}
                            className="border border-zinc-800 bg-zinc-900/30 px-3 py-2 space-y-0.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-mono text-zinc-300">
                                {co.name}
                              </span>
                              {co.access === "public" && co.ticker && (
                                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-1.5 py-0.5 shrink-0">
                                  {co.ticker}
                                </span>
                              )}
                              {co.access === "etf" && co.ticker && (
                                <span className="text-[9px] font-mono text-blue-400 bg-blue-950/40 border border-blue-800/30 px-1.5 py-0.5 shrink-0">
                                  {co.ticker}
                                </span>
                              )}
                              {co.access === "private" && (
                                <span className="text-[9px] font-mono text-zinc-600 bg-zinc-800/40 px-1.5 py-0.5 shrink-0">
                                  Private
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-mono text-zinc-600">
                              {co.category}
                            </p>
                            {co.via && (
                              <p className="text-[9px] font-mono text-zinc-700">
                                via {co.via}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
