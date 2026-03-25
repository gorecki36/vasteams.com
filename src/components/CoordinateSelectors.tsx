"use client";

import { REGIONS } from "@/lib/regions";
import { PERSONA_GROUPS } from "@/lib/personas";
import { WorldState } from "@/lib/worldEngine";
import { checkPersonaAvailability } from "@/lib/personaRules";
import { useState, useRef, useEffect } from "react";

interface Props {
  year: number;
  regionId: string;
  persona: string;
  onYearChange: (year: number) => void;
  onRegionChange: (regionId: string) => void;
  onPersonaChange: (persona: string) => void;
  compareMode: boolean;
  onCompareModeChange: (enabled: boolean) => void;
  yearB: number;
  onYearBChange: (year: number) => void;
  /** When provided, personas are checked against world state rules */
  worldState?: WorldState;
}

export default function CoordinateSelectors({
  year,
  regionId,
  persona,
  onYearChange,
  onRegionChange,
  onPersonaChange,
  compareMode,
  onCompareModeChange,
  yearB,
  onYearBChange,
  worldState,
}: Props) {
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowPersonaDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Group regions by trajectory
  const trajectoryLabels: Record<string, string> = {
    A: "Trajectory A — Early Adopters",
    B: "Trajectory B — Leapfrog",
    C: "Trajectory C — State-Directed",
  };

  return (
    <div className="space-y-2">
      <h2 className="text-[10px] uppercase tracking-widest text-emerald-500/80 mb-1 font-mono">
        Coordinates
      </h2>

      {/* Compare toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-mono">
          Compare two years
        </span>
        <button
          onClick={() => onCompareModeChange(!compareMode)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            compareMode ? "bg-emerald-500/40" : "bg-zinc-700"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform ${
              compareMode
                ? "translate-x-5 bg-emerald-400"
                : "translate-x-0 bg-zinc-400"
            }`}
          />
        </button>
      </div>

      {/* Year slider(s) */}
      <div>
        <div className="flex justify-between mb-0.5">
          <span className="text-xs text-zinc-400 font-mono">
            {compareMode ? "Year A" : "Year"}
          </span>
          <span className="text-xs text-emerald-400 font-mono tabular-nums">
            {year}
          </span>
        </div>
        <input
          type="range"
          min={2025}
          max={2150}
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="slider w-full"
        />
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] text-zinc-600 font-mono">2025</span>
          <span className="text-[10px] text-zinc-600 font-mono">2050</span>
          <span className="text-[10px] text-zinc-600 font-mono">2100</span>
          <span className="text-[10px] text-zinc-600 font-mono">2150</span>
        </div>
      </div>

      {compareMode && (
        <div>
          <div className="flex justify-between mb-0.5">
            <span className="text-xs text-zinc-400 font-mono">Year B</span>
            <span className="text-xs text-emerald-400 font-mono tabular-nums">
              {yearB}
            </span>
          </div>
          <input
            type="range"
            min={2025}
            max={2150}
            value={yearB}
            onChange={(e) => onYearBChange(parseInt(e.target.value))}
            className="slider w-full"
          />
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px] text-zinc-600 font-mono">2025</span>
            <span className="text-[10px] text-zinc-600 font-mono">2050</span>
            <span className="text-[10px] text-zinc-600 font-mono">2100</span>
            <span className="text-[10px] text-zinc-600 font-mono">2150</span>
          </div>
        </div>
      )}

      {/* Location */}
      <div>
        <label className="text-xs text-zinc-400 font-mono block mb-0.5">
          Location
        </label>
        <select
          value={regionId}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono px-2 py-1.5 focus:border-emerald-500 focus:outline-none"
        >
          {(["A", "B", "C"] as const).map((traj) => (
            <optgroup key={traj} label={trajectoryLabels[traj]}>
              {REGIONS.filter((r) => r.trajectory === traj).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}, {r.country}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Persona */}
      <div ref={dropdownRef} className="relative">
        <label className="text-xs text-zinc-400 font-mono block mb-0.5">
          Persona
        </label>
        <input
          type="text"
          value={persona}
          onChange={(e) => onPersonaChange(e.target.value)}
          onFocus={() => setShowPersonaDropdown(true)}
          placeholder="Type a persona or pick from list..."
          className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono px-2 py-1.5 focus:border-emerald-500 focus:outline-none"
        />
        {showPersonaDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 max-h-64 overflow-y-auto">
            {PERSONA_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-emerald-500/60 font-mono bg-zinc-800/50">
                  {group.label}
                </div>
                {group.personas.map((p) => {
                  const availability = worldState
                    ? checkPersonaAvailability(p, worldState)
                    : { available: true };
                  return (
                    <button
                      key={p}
                      className={`w-full text-left px-3 py-1.5 text-sm font-mono transition-colors ${
                        availability.available
                          ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                          : "text-zinc-600 hover:bg-zinc-800/50"
                      }`}
                      onClick={() => {
                        onPersonaChange(p);
                        setShowPersonaDropdown(false);
                      }}
                    >
                      <span className={availability.available ? "" : "opacity-50"}>
                        {p}
                      </span>
                      {!availability.available && (
                        <span className="block text-[10px] italic text-zinc-600 mt-0.5">
                          {availability.reason}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
