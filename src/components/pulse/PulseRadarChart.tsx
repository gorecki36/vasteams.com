"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PulseScores } from "@/lib/pulse-scoring";

interface Props {
  userScores: PulseScores;
  avgScores?: PulseScores;
}

const DIMENSIONS = [
  { key: "substitution", label: "Substitution" },
  { key: "expansion", label: "Expansion" },
  { key: "agency", label: "Agency" },
  { key: "meaning", label: "Meaning" },
  { key: "risk", label: "Risk" },
] as const;

export default function PulseRadarChart({ userScores, avgScores }: Props) {
  const data = DIMENSIONS.map((d) => ({
    dimension: d.label,
    you: userScores[d.key as keyof PulseScores] as number,
    ...(avgScores ? { avg: avgScores[d.key as keyof PulseScores] as number } : {}),
  }));

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-sm text-zinc-300 font-medium tracking-wide mb-1">
        Your AI Profile
      </h3>
      <p className="text-sm text-zinc-500 mb-4">
        4 = about the same as before AI. Your shape shows how AI has shifted your work so far.
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#71717a", fontSize: 11, fontFamily: "monospace" }}
          />
          <PolarRadiusAxis
            domain={[1, 7]}
            tickCount={4}
            tick={{ fill: "#3f3f46", fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            name="You"
            dataKey="you"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ r: 4, fill: "#10b981" }}
          />
          {avgScores && (
            <Radar
              name="Population avg"
              dataKey="avg"
              stroke="#52525b"
              fill="#52525b"
              fillOpacity={0.05}
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
            />
          )}
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
