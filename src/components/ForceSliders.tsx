"use client";

import { INPUT_FORCES, SliderValues } from "@/lib/forces";
import { useState } from "react";

interface Props {
  values: SliderValues;
  onChange: (id: string, value: number) => void;
}

export default function ForceSliders({ values, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-emerald-500/80 mb-4 font-mono">
        Input Forces
      </h2>
      {INPUT_FORCES.map((force) => {
        const val = values[force.id] ?? 50;
        const label =
          val < 33
            ? force.lowLabel
            : val > 66
              ? force.highLabel
              : force.midLabel;
        const isExpanded = expandedId === force.id;

        return (
          <div key={force.id} className="group">
            <div
              className="flex items-center justify-between mb-1 cursor-pointer"
              onClick={() =>
                setExpandedId(isExpanded ? null : force.id)
              }
            >
              <span className="text-sm text-zinc-300 font-mono">
                {force.name}
              </span>
              <span className="text-xs text-zinc-500 font-mono tabular-nums">
                {val}%
              </span>
            </div>
            {isExpanded && (
              <p className="text-xs text-zinc-500 mb-2 font-mono leading-relaxed">
                {force.description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={val}
                onChange={(e) =>
                  onChange(force.id, parseInt(e.target.value))
                }
                className="slider w-full"
              />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-zinc-600 font-mono">
                {force.lowLabel}
              </span>
              <span className="text-[10px] text-emerald-600/60 font-mono">
                {label}
              </span>
              <span className="text-[10px] text-zinc-600 font-mono">
                {force.highLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
