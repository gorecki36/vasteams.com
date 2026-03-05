"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CapabilityScore } from "@/lib/ai-benchmarks";
import type { RoleDefinition, CapabilityWeight } from "@/lib/roles";

interface Props {
  prompt: CapabilityScore[];
  agentic: CapabilityScore[];
  role: RoleDefinition | null;
}

function CustomTick({
  payload,
  x,
  y,
  textAnchor,
  allCapabilities,
  role,
}: {
  payload: { value: string };
  x: number;
  y: number;
  textAnchor: "start" | "middle" | "end" | "inherit";
  allCapabilities: CapabilityScore[];
  role: RoleDefinition | null;
}) {
  const cap = allCapabilities.find((c) => c.shortName === payload.value);
  const weight = role?.weights[cap?.id ?? ""] as CapabilityWeight | undefined;
  const color = !role
    ? "#a1a1aa"
    : weight === "high"
      ? "#34d399"
      : weight === "medium"
        ? "#a1a1aa"
        : "#52525b";

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      style={{ fontSize: 10, fill: color, fontFamily: "monospace" }}
    >
      {payload.value}
    </text>
  );
}

export default function CapabilityRadar({ prompt, agentic, role }: Props) {
  const allCapabilities = [...prompt, ...agentic];

  // Build unified data array with both scores per axis
  const data = allCapabilities.map((cap) => ({
    name: cap.shortName,
    prompt: prompt.find((p) => p.id === cap.id)?.score ?? 0,
    agentic: agentic.find((a) => a.id === cap.id)?.score ?? 0,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={380}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#27272a" />
        <PolarAngleAxis
          dataKey="name"
          tick={(props: Record<string, unknown>) => (
            <CustomTick
              {...(props as { payload: { value: string }; x: number; y: number; textAnchor: "start" | "middle" | "end" | "inherit" })}
              allCapabilities={allCapabilities}
              role={role}
            />
          )}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "#52525b", fontFamily: "monospace" }}
          axisLine={false}
        />
        <Radar
          name="Prompt-Level"
          dataKey="prompt"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.12}
          strokeWidth={2}
        />
        <Radar
          name="Agentic"
          dataKey="agentic"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.08}
          strokeWidth={2}
          strokeDasharray="4 3"
        />
        <Legend
          wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }}
          iconType="square"
          iconSize={8}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
