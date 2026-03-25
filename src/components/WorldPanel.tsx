"use client";

import { useState } from "react";
import { WorldState } from "@/lib/worldEngine";
import { OutcomeValues } from "@/lib/outcomeEngine";
import { OUTCOME_VARIABLES, INPUT_FORCES } from "@/lib/forces";

interface Props {
  worldState: WorldState;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

// Resolve driver IDs → readable names (INPUT_FORCES + OUTCOME_VARIABLES)
const DRIVER_NAMES: Record<string, string> = {};
for (const f of INPUT_FORCES) DRIVER_NAMES[f.id] = f.name;
for (const o of OUTCOME_VARIABLES) DRIVER_NAMES[o.id] = o.name;

// World state metric definitions
const WORLD_STATE_METRICS: {
  id: string;
  label: string;
  description: string;
  drivers: string;
  getValue: (c: WorldState["computed"]) => string;
  getColor: (c: WorldState["computed"]) => string;
  getBarValue: (c: WorldState["computed"]) => number;
  barMax?: number;
}[] = [
  {
    id: "podAdoption",
    label: "Pod Adoption",
    description:
      "Percentage of population living primarily in immersive digital pods. Requires AI infrastructure, neural interfaces, affordable economics, AND social/climate pressure to drive adoption.",
    drivers: "AI Autonomy gate (50-80%), Neural Interface gate (20-50%), Pod Economics gate (20-60%), Social demand (meaning crisis, trust collapse, escapism), Climate emergency (>2°C)",
    getValue: (c) => `${c.podAdoption}%`,
    getColor: () => "emerald",
    getBarValue: (c) => c.podAdoption,
  },
  {
    id: "aiAutonomy",
    label: "AI Autonomy",
    description:
      "How much infrastructure and decision-making AI manages independently. Sigmoid growth curve accelerated by the AI Acceleration input force.",
    drivers: "AI Acceleration (primary), Time (sigmoid growth)",
    getValue: (c) => `${c.aiAutonomy}%`,
    getColor: () => "emerald",
    getBarValue: (c) => c.aiAutonomy,
  },
  {
    id: "digitalLife",
    label: "Digital Life",
    description:
      "Share of waking life spent in digital environments — from screen time through AR to full neural immersion.",
    drivers: "Digital Immersion (primary), Neural Interface adoption (boost), Time (linear growth)",
    getValue: (c) => `${c.digitalLife}%`,
    getColor: () => "emerald",
    getBarValue: (c) => c.digitalLife,
  },
  {
    id: "physicalDecay",
    label: "Phys. Decay",
    description:
      "Deterioration of physical infrastructure — roads, buildings, public spaces. Rises as population shifts to pods and climate degrades maintenance capacity.",
    drivers: "Pod Adoption ×60%, Climate Crisis ×20%, Time (baseline decay)",
    getValue: (c) => `${c.physicalDecay}%`,
    getColor: (c) =>
      c.physicalDecay > 60 ? "red" : c.physicalDecay > 30 ? "amber" : "emerald",
    getBarValue: (c) => c.physicalDecay,
  },
  {
    id: "climateTemp",
    label: "Climate",
    description:
      "Global mean temperature rise above pre-industrial baseline. Drives climate emergency push for pod adoption above 2°C.",
    drivers: "Climate Crisis input (primary), Time (cumulative warming)",
    getValue: (c) => `+${c.climateTemp}°C`,
    getColor: (c) =>
      c.climateTemp > 3 ? "red" : c.climateTemp > 2 ? "amber" : "emerald",
    getBarValue: (c) => c.climateTemp,
    barMax: 5,
  },
  {
    id: "populationPct",
    label: "Population",
    description:
      "Global population as percentage of 2025 level. Declines with demographic collapse, modulated by regional trajectory.",
    drivers: "Demographic Collapse (primary), Regional modifiers, Time",
    getValue: (c) => `${c.populationPct}%`,
    getColor: () => "emerald",
    getBarValue: (c) => c.populationPct,
  },
  {
    id: "gdpDecline",
    label: "GDP Decline",
    description:
      "Contraction of global economic output — 0 = robust growth, 100 = total collapse. AI productivity offsets decline; climate, demographics, and withdrawal accelerate it.",
    drivers: "Climate Crisis ×30%, Demographics ×25%, Meaning Crisis ×20%, Corporate ×10%, AI offsets (−15%)",
    getValue: (c) => `${c.gdpDecline}%`,
    getColor: (c) =>
      c.gdpDecline > 60 ? "red" : c.gdpDecline > 30 ? "amber" : "emerald",
    getBarValue: (c) => c.gdpDecline,
  },
  {
    id: "unemployment",
    label: "Unemployment",
    description:
      "Effective unemployment and labor non-participation — 0 = full employment, 100 = near-total displacement by AI and disengagement.",
    drivers: "AI Acceleration ×45%, Corporate Power ×20%, Digital Immersion ×20%, Meaning Crisis ×15%",
    getValue: (c) => `${c.unemployment}%`,
    getColor: (c) =>
      c.unemployment > 60 ? "red" : c.unemployment > 30 ? "amber" : "emerald",
    getBarValue: (c) => c.unemployment,
  },
];

// Qualitative fact definitions
const QUALITATIVE_FACTS: {
  id: string;
  label: string;
  description: string;
  getValue: (ws: WorldState) => string;
}[] = [
  {
    id: "interface",
    label: "Interface",
    description:
      "Dominant human-computer interface technology. Progresses from smartphones → AR glasses → consumer neural → full-immersion neural link based on neural adoption and digital immersion levels.",
    getValue: (ws) => ws.dominant_interface,
  },
  {
    id: "economy",
    label: "Economy",
    description:
      "Prevailing economic model. Shifts based on corporate power concentration, AI autonomy, pod adoption, and economic withdrawal levels.",
    getValue: (ws) => ws.economic_model,
  },
  {
    id: "mood",
    label: "Mood",
    description:
      "Dominant cultural mood. Derived from meaning levels, trust levels, pod adoption, climate severity, and demographic trends.",
    getValue: (ws) => ws.cultural_mood,
  },
  {
    id: "tension",
    label: "Tension",
    description:
      "The defining societal tension of the era. Determined by which forces and outcomes are most extreme — AI dominance, pod divide, corporate control, climate, or meaning crisis.",
    getValue: (ws) => ws.key_tension,
  },
];

function Bar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    pct > 70
      ? "bg-red-500/60"
      : pct > 40
        ? "bg-amber-500/60"
        : "bg-emerald-500/60";
  return (
    <div className="w-16 h-1.5 bg-zinc-800 ml-2">
      <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function ExpandDetail({
  description,
  drivers,
}: {
  description: string;
  drivers: string;
}) {
  return (
    <div className="mb-2 mt-1 space-y-1">
      <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
        {description}
      </p>
      <p className="text-[10px] text-zinc-600 font-mono">{drivers}</p>
    </div>
  );
}

export default function WorldPanel({
  worldState,
  selectedYear,
  onYearChange,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const c = worldState.computed;

  const toggle = (id: string) =>
    setExpandedId(expandedId === id ? null : id);

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 p-4">
      {/* Year selector header */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-mono whitespace-nowrap">
          World @ <span className="text-emerald-400">{selectedYear}</span>
        </h2>
        <input
          type="range"
          min={2025}
          max={2100}
          step={5}
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="slider flex-1"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-3">
        {/* Left: World State */}
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono mb-2">
            World State
          </h3>
          <div className="space-y-0.5">
            {WORLD_STATE_METRICS.map((m) => {
              const colorClass =
                m.getColor(c) === "red"
                  ? "text-red-400"
                  : m.getColor(c) === "amber"
                    ? "text-amber-400"
                    : "text-emerald-400";
              return (
                <div key={m.id}>
                  <div
                    className="flex items-center justify-between py-0.5 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                    onClick={() => toggle(m.id)}
                  >
                    <span className="text-xs text-zinc-500 font-mono flex-1">
                      {m.label}
                    </span>
                    <span
                      className={`text-xs font-mono tabular-nums ${colorClass}`}
                    >
                      {m.getValue(c)}
                    </span>
                    <Bar value={m.getBarValue(c)} max={m.barMax} />
                  </div>
                  {expandedId === m.id && (
                    <ExpandDetail
                      description={m.description}
                      drivers={m.drivers}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Qualitative facts */}
          <div className="mt-3 pt-2 border-t border-zinc-800 space-y-0.5">
            {QUALITATIVE_FACTS.map((f) => (
              <div key={f.id}>
                <div
                  className="text-[10px] text-zinc-500 font-mono py-0.5 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                  onClick={() => toggle(f.id)}
                >
                  <span className="text-zinc-600">{f.label}:</span>{" "}
                  {f.getValue(worldState)}
                </div>
                {expandedId === f.id && (
                  <p className="text-[10px] text-zinc-600 font-mono leading-relaxed mb-2 mt-1">
                    {f.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Computed Outcomes */}
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono mb-2">
            Computed Outcomes
          </h3>
          <div className="space-y-0.5">
            {OUTCOME_VARIABLES.map((ov) => {
              const value = c.outcomes[ov.id as keyof OutcomeValues];
              const pct = Math.min(100, value);
              const barColor =
                pct > 66
                  ? "bg-red-500/60"
                  : pct > 33
                    ? "bg-amber-500/60"
                    : "bg-emerald-500/60";
              const textColor =
                pct > 66
                  ? "text-red-400"
                  : pct > 33
                    ? "text-amber-400"
                    : "text-emerald-400";

              return (
                <div key={ov.id}>
                  <div
                    className="flex items-center justify-between py-0.5 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                    onClick={() => toggle(ov.id)}
                  >
                    <span className="text-xs text-zinc-500 font-mono flex-1">
                      {ov.name}
                    </span>
                    <span
                      className={`text-xs font-mono tabular-nums w-8 text-right ${textColor}`}
                    >
                      {value}
                    </span>
                    <div className="w-16 h-1.5 bg-zinc-800 ml-2">
                      <div
                        className={`h-full ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  {expandedId === ov.id && (
                    <div className="mb-2 mt-1 space-y-1">
                      <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                        {ov.description}
                      </p>
                      <div className="text-[10px] text-zinc-600 font-mono">
                        {ov.drivers.map((d, i) => (
                          <span key={d.id}>
                            {DRIVER_NAMES[d.id] ?? d.id} ×
                            {Math.round(d.weight * 100)}%
                            {i < ov.drivers.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-[10px] text-zinc-700 font-mono mt-3">
            click any row to expand
          </div>
        </div>
      </div>
    </div>
  );
}
