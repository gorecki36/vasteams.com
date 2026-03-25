"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { CapabilityScore } from "@/lib/ai-benchmarks";
import type { RoleDefinition, CapabilityWeight } from "@/lib/roles";

const WEIGHT_ORDER: Record<CapabilityWeight, number> = { high: 0, medium: 1, low: 2 };

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
  const isAgentic = cap?.layer === "agentic";

  const weight = role?.weights[cap?.id ?? ""] as CapabilityWeight | undefined;
  const color = !role
    ? isAgentic ? "#f59e0b" : "#34d399"
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

/** Custom dot — emerald for prompt, amber for agentic */
function LayerDot(props: Record<string, unknown>) {
  const { cx, cy, index, allCapabilities } = props as {
    cx: number;
    cy: number;
    index: number;
    allCapabilities: CapabilityScore[];
  };
  const cap = allCapabilities[index];
  const fill = cap?.layer === "agentic" ? "#f59e0b" : "#10b981";
  return <circle cx={cx} cy={cy} r={3.5} fill={fill} stroke={fill} strokeWidth={1} fillOpacity={0.9} />;
}

export default function CapabilityRadar({ prompt, agentic, role }: Props) {
  // Sort by role weight (high first) when a role is selected
  const allCapabilities = role
    ? [...prompt, ...agentic].sort((a, b) => {
        const wa = role.weights[a.id] as CapabilityWeight | undefined;
        const wb = role.weights[b.id] as CapabilityWeight | undefined;
        return (WEIGHT_ORDER[wa ?? "low"]) - (WEIGHT_ORDER[wb ?? "low"]);
      })
    : [...prompt, ...agentic];

  const data = allCapabilities.map((cap) => ({
    name: cap.shortName,
    score: cap.score,
    fullMark: 100,
  }));

  return (
    <div>
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
            dataKey="score"
            stroke="#a1a1aa"
            fill="#10b981"
            fillOpacity={0.08}
            strokeWidth={1.5}
            strokeOpacity={0.4}
            dot={(props: Record<string, unknown>) => (
              <LayerDot key={`dot-${props.index}`} {...props} allCapabilities={allCapabilities} />
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-1 text-[10px] font-mono">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-500">Prompt-level</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-zinc-500">Agentic</span>
        </span>
      </div>
    </div>
  );
}
