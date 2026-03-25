"use client";

import { useState } from "react";
import type { DecisionOption, DecisionScenario } from "@/lib/decision-simulator";
import { BASE_RATE_PRESETS, PAYOFF_UNITS, SUNK_COST_UNITS } from "@/lib/decision-simulator";

function makeOption(index: number): DecisionOption {
  return {
    id: `opt-${index}`,
    name: "",
    bestPayoff: 0,
    bestProbability: 0.5,
    worstPayoff: 0,
  };
}

interface ScenarioFormProps {
  onSubmit: (scenario: DecisionScenario) => void;
}

export default function ScenarioForm({ onSubmit }: ScenarioFormProps) {
  const [name, setName] = useState("");
  const [options, setOptions] = useState<DecisionOption[]>([
    makeOption(0),
    makeOption(1),
  ]);
  const [payoffUnit, setPayoffUnit] = useState<string>("$");
  const [customUnit, setCustomUnit] = useState("");
  const [baseRate, setBaseRate] = useState(0.5);
  const [baseRatePreset, setBaseRatePreset] = useState<string | null>(null);
  const [sunkCost, setSunkCost] = useState(0);
  const [sunkCostUnit, setSunkCostUnit] = useState("$");
  const [edge, setEdge] = useState(0.2);

  const updateOption = (index: number, patch: Partial<DecisionOption>) => {
    setOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, ...patch } : o))
    );
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions((prev) => [...prev, makeOption(prev.length)]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handlePreset = (presetLabel: string) => {
    const preset = BASE_RATE_PRESETS.find((p) => p.label === presetLabel);
    if (preset) {
      setBaseRate(preset.rate);
      setBaseRatePreset(presetLabel);
    } else {
      setBaseRatePreset(null);
    }
  };

  const unit = payoffUnit === "custom" ? customUnit || "units" : payoffUnit;

  const canSubmit =
    name.trim() !== "" &&
    options.every((o) => o.name.trim() !== "") &&
    options.some((o) => o.bestPayoff !== 0 || o.worstPayoff !== 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      name,
      options,
      payoffUnit: unit,
      baseRate,
      sunkCost,
      sunkCostUnit,
      edge,
      biasFlags: {
        survivorshipRisk: false,
        sunkCostInfluence: false,
        baseRateIgnored: false,
      },
    });
  };

  return (
    <section className="space-y-8">
      {/* Decision Name */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
          What are you deciding?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Should I leave my job for a startup?"
          className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2.5 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Payoff Unit */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
          Payoff unit
        </label>
        <div className="flex gap-2">
          {PAYOFF_UNITS.map((u) => (
            <button
              key={u}
              onClick={() => setPayoffUnit(u)}
              className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                payoffUnit === u
                  ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
        {payoffUnit === "custom" && (
          <input
            type="text"
            value={customUnit}
            onChange={(e) => setCustomUnit(e.target.value)}
            placeholder="e.g. months, satisfaction"
            className="mt-2 w-48 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
          />
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            Options ({options.length}/4)
          </label>
          {options.length < 4 && (
            <button
              onClick={addOption}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              + Add option
            </button>
          )}
        </div>

        {options.map((opt, i) => (
          <div
            key={opt.id}
            className="border border-zinc-800 p-4 space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-600 w-3">
                {String.fromCharCode(65 + i)}
              </span>
              <input
                type="text"
                value={opt.name}
                onChange={(e) => updateOption(i, { name: e.target.value })}
                placeholder={i === 0 ? "Stay at current job" : i === 1 ? "Join the startup" : `Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 bg-transparent border-b border-zinc-800 pb-1 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
              />
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(i)}
                  className="text-zinc-600 hover:text-zinc-400 text-xs font-mono"
                >
                  ×
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Best case payoff */}
              <div>
                <label className="block text-[10px] font-mono text-zinc-600 mb-1">
                  Best-case payoff ({unit})
                </label>
                <input
                  type="number"
                  value={opt.bestPayoff || ""}
                  onChange={(e) =>
                    updateOption(i, { bestPayoff: Number(e.target.value) })
                  }
                  placeholder="250000"
                  className="w-full bg-zinc-900 border border-zinc-800 px-2 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              {/* Probability */}
              <div>
                <label className="block text-[10px] font-mono text-zinc-600 mb-1">
                  Best-case probability: {(opt.bestProbability * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opt.bestProbability * 100}
                  onChange={(e) =>
                    updateOption(i, {
                      bestProbability: Number(e.target.value) / 100,
                    })
                  }
                  className="slider w-full mt-1"
                />
              </div>

              {/* Worst case payoff */}
              <div>
                <label className="block text-[10px] font-mono text-zinc-600 mb-1">
                  Worst-case payoff ({unit})
                </label>
                <input
                  type="number"
                  value={opt.worstPayoff || ""}
                  onChange={(e) =>
                    updateOption(i, { worstPayoff: Number(e.target.value) })
                  }
                  placeholder="-50000"
                  className="w-full bg-zinc-900 border border-zinc-800 px-2 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Base Rate */}
      <div className="space-y-3">
        <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500">
          Base rate: {(baseRate * 100).toFixed(0)}%
          {baseRatePreset && (
            <span className="text-zinc-600 normal-case ml-2">({baseRatePreset})</span>
          )}
        </label>
        <input
          type="range"
          min="1"
          max="99"
          value={baseRate * 100}
          onChange={(e) => {
            setBaseRate(Number(e.target.value) / 100);
            setBaseRatePreset(null);
          }}
          className="slider w-full"
        />
        <div className="flex flex-wrap gap-1.5">
          {BASE_RATE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.label)}
              title={preset.source}
              className={`px-2 py-1 text-[10px] font-mono border transition-colors ${
                baseRatePreset === preset.label
                  ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                  : "border-zinc-800 text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {preset.label} ({(preset.rate * 100).toFixed(0)}%)
            </button>
          ))}
        </div>
      </div>

      {/* Sunk Cost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            Already invested (sunk cost)
          </label>
          <input
            type="number"
            value={sunkCost || ""}
            onChange={(e) => setSunkCost(Number(e.target.value))}
            placeholder="0"
            className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm font-mono text-zinc-200 placeholder:text-zinc-700 focus:border-emerald-500/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
            Sunk cost unit
          </label>
          <div className="flex gap-2">
            {SUNK_COST_UNITS.map((u) => (
              <button
                key={u}
                onClick={() => setSunkCostUnit(u)}
                className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                  sunkCostUnit === u
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                    : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edge */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
          Your edge: {(edge * 100).toFixed(0)}%
        </label>
        <p className="text-[10px] font-mono text-zinc-600 mb-2">
          How much better is YOUR situation vs the average? 0% = average, 100% = significant advantages.
        </p>
        <input
          type="range"
          min="0"
          max="100"
          value={edge * 100}
          onChange={(e) => setEdge(Number(e.target.value) / 100)}
          className="slider w-full"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 text-sm font-mono uppercase tracking-widest border transition-all ${
          canSubmit
            ? "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
            : "border-zinc-800 text-zinc-600 cursor-not-allowed"
        }`}
      >
        Analyze Decision
      </button>
    </section>
  );
}
