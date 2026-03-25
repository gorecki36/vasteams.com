"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import { TimeSeriesPoint } from "@/lib/outcomeEngine";

interface Props {
  data: TimeSeriesPoint[];
  momentYear: number;
}

const OUTCOME_LINES = [
  { key: "meaning_crisis", name: "Meaning Crisis", color: "#a78bfa" },
  { key: "trust_collapse", name: "Trust Collapse", color: "#f97316" },
  { key: "pod_economics", name: "Pod Economics", color: "#06b6d4" },
  { key: "escapism_spiritual", name: "Escapism", color: "#ec4899" },
  { key: "economic_withdrawal", name: "Withdrawal", color: "#eab308" },
  { key: "gdp_decline", name: "GDP Decline", color: "#ef4444" },
  { key: "unemployment", name: "Unemployment", color: "#8b5cf6" },
] as const;

export default function CompoundingChart({ data, momentYear }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Flatten data for recharts
  const chartData = data.map((pt) => ({
    year: pt.year,
    matrix: pt.matrix,
    meaning_crisis: pt.outcomes.meaning_crisis,
    trust_collapse: pt.outcomes.trust_collapse,
    pod_economics: pt.outcomes.pod_economics,
    escapism_spiritual: pt.outcomes.escapism_spiritual,
    economic_withdrawal: pt.outcomes.economic_withdrawal,
    gdp_decline: pt.outcomes.gdp_decline,
    unemployment: pt.outcomes.unemployment,
  }));

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs uppercase tracking-widest text-emerald-500/80 font-mono">
          Moment of Matrix: {momentYear}
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors border border-zinc-700 px-2 py-0.5"
        >
          {expanded ? "Matrix only" : "Show all lines"}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="year"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 10, fill: "#71717a", fontFamily: "monospace" }}
            tickLine={{ stroke: "#3f3f46" }}
            axisLine={{ stroke: "#3f3f46" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#71717a", fontFamily: "monospace" }}
            tickLine={{ stroke: "#3f3f46" }}
            axisLine={{ stroke: "#3f3f46" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 0,
              fontSize: 11,
              fontFamily: "monospace",
            }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <ReferenceLine
            x={momentYear}
            stroke="#34d399"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          >
            <Label
              value={momentYear}
              position="top"
              fill="#34d399"
              fontSize={10}
              fontFamily="monospace"
            />
          </ReferenceLine>
          {/* Matrix line always shown */}
          <Line
            type="monotone"
            dataKey="matrix"
            name="Moment of Matrix"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
          {/* Individual outcome lines when expanded */}
          {expanded &&
            OUTCOME_LINES.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={1}
                strokeDasharray="4 2"
                dot={false}
                activeDot={{ r: 2 }}
              />
            ))}
          {expanded && <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
