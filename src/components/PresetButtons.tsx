"use client";

import { PRESETS } from "@/lib/presets";
import { SliderValues } from "@/lib/forces";

interface Props {
  activePreset: string | null;
  onSelect: (values: SliderValues, presetId: string) => void;
}

export default function PresetButtons({ activePreset, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-widest text-emerald-500/80 mb-3 font-mono">
        Presets
      </h2>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.values, preset.id)}
            title={preset.description}
            className={`px-3 py-1.5 text-xs font-mono border transition-all duration-150 ${
              activePreset === preset.id
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}
