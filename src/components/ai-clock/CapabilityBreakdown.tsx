"use client";

import type { CapabilityScore } from "@/lib/ai-benchmarks";
import type { RoleDefinition, CapabilityWeight } from "@/lib/roles";

interface Props {
  prompt: CapabilityScore[];
  agentic: CapabilityScore[];
  role: RoleDefinition | null;
}

const WEIGHT_STYLES: Record<CapabilityWeight, { label: string; className: string }> = {
  high: { label: "Core", className: "text-emerald-400 border-emerald-500/40" },
  medium: { label: "Useful", className: "text-zinc-400 border-zinc-600" },
  low: { label: "Minor", className: "text-zinc-600 border-zinc-700" },
};

const WEIGHT_ORDER: Record<CapabilityWeight, number> = { high: 0, medium: 1, low: 2 };

function sortByWeight(caps: CapabilityScore[], role: RoleDefinition | null) {
  if (!role) return caps;
  return [...caps].sort((a, b) => {
    const wa = role.weights[a.id] as CapabilityWeight | undefined;
    const wb = role.weights[b.id] as CapabilityWeight | undefined;
    return (WEIGHT_ORDER[wa ?? "low"] ?? 2) - (WEIGHT_ORDER[wb ?? "low"] ?? 2);
  });
}

function ProgressBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-zinc-800 mt-2">
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

function CapabilityCard({
  cap,
  role,
  accentColor,
}: {
  cap: CapabilityScore;
  role: RoleDefinition | null;
  accentColor: string;
}) {
  const weight = role?.weights[cap.id] as CapabilityWeight | undefined;
  const isHighlight = role != null && weight === "high";
  const style = weight ? WEIGHT_STYLES[weight] : null;
  const dimmed = role != null && weight === "low";

  return (
    <div
      className={`border p-4 transition-all duration-300 ${
        isHighlight
          ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
          : "border-zinc-800"
      } ${dimmed ? "opacity-50" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <h3 className="text-sm font-mono text-zinc-300 truncate">{cap.name}</h3>
          {role && style && (
            <span className={`text-[9px] font-mono uppercase tracking-wider border px-1.5 py-0.5 shrink-0 ${style.className}`}>
              {style.label}
            </span>
          )}
        </div>
        <span
          className="text-lg font-mono font-bold shrink-0"
          style={{ color: accentColor }}
        >
          {cap.score}%
        </span>
      </div>
      <ProgressBar score={cap.score} color={accentColor} />
      <p className="text-[11px] font-mono text-zinc-500 mt-3">
        {cap.whatItTests}
      </p>
      <p className="text-[11px] font-mono text-zinc-600 mt-1">
        {cap.marketingApplication}
      </p>
      <div className="flex items-baseline justify-between mt-3">
        <span className="text-[10px] font-mono text-zinc-600">
          {cap.benchmark} <span className="text-zinc-700">· Artificial Analysis</span>
        </span>
        <span
          className="text-[11px] font-mono"
          style={{ color: accentColor, opacity: 0.6 }}
        >
          {cap.bestModel} leads
        </span>
      </div>
    </div>
  );
}

export default function CapabilityBreakdown({ prompt, agentic, role }: Props) {
  const sortedPrompt = sortByWeight(prompt, role);
  const sortedAgentic = sortByWeight(agentic, role);

  return (
    <div className="space-y-10">
      {/* Prompt-Level Skills */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-emerald-500/80 mb-1 font-mono">
          Prompt-Level Skills
        </h2>
        <p className="text-[11px] font-mono text-zinc-600 mb-4">
          Can AI produce the right answer when asked?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedPrompt.map((cap) => (
            <CapabilityCard
              key={cap.id}
              cap={cap}
              role={role}
              accentColor="#10b981"
            />
          ))}
        </div>
      </section>

      {/* Agentic Execution */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-amber-500/80 mb-1 font-mono">
          Agentic Execution
        </h2>
        <p className="text-[11px] font-mono text-zinc-600 mb-4">
          Can AI complete the full task autonomously?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedAgentic.map((cap) => (
            <CapabilityCard
              key={cap.id}
              cap={cap}
              role={role}
              accentColor="#f59e0b"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
