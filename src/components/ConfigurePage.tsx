"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SliderValues, getDefaultSliders, INPUT_FORCES } from "@/lib/forces";
import { computeWorldState } from "@/lib/worldEngine";
import { computeTimeSeries } from "@/lib/outcomeEngine";
import ForceSliders from "./ForceSliders";
import PresetButtons from "./PresetButtons";
import WorldPanel from "./WorldPanel";
import CompoundingChart from "./CompoundingChart";
import NavBar from "./NavBar";

/** Encode 7 force values as dash-separated string for URL */
function encodeForces(sliders: SliderValues): string {
  return INPUT_FORCES.map((f) => sliders[f.id] ?? 50).join("-");
}

/** Decode force string from URL */
function decodeForcesFromURL(): SliderValues | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const f = params.get("f");
  if (!f) return null;

  const values = f.split("-").map(Number);

  // v=2 format: 7 input forces
  if (values.length === INPUT_FORCES.length && !values.some(isNaN)) {
    const sliders: SliderValues = {};
    INPUT_FORCES.forEach((force, i) => {
      sliders[force.id] = values[i];
    });
    return sliders;
  }

  // v=1 legacy format: 12 forces
  if (values.length === 12 && !values.some(isNaN)) {
    return {
      ai_acceleration: values[0],
      climate_crisis: values[1],
      neural_interface: values[8],
      corporate_power: values[3],
      demographic_collapse: values[6],
      digital_immersion: values[2],
      global_convergence: values[11],
    };
  }

  return null;
}

// Pod adoption threshold: crossing the chasm (early adopters → early majority ≈ 16%)
const POD_MAINSTREAM_THRESHOLD = 16;

/** Find interpolated year where pod adoption first crosses the mainstream threshold. */
function findMomentYear(
  sliders: SliderValues,
  regionId: string
): number {
  let prev = { year: 2025, pod: computeWorldState(sliders, 2025, regionId).computed.podAdoption };
  if (prev.pod >= POD_MAINSTREAM_THRESHOLD) return prev.year;

  for (let y = 2030; y <= 2100; y += 5) {
    const pod = computeWorldState(sliders, y, regionId).computed.podAdoption;
    if (pod >= POD_MAINSTREAM_THRESHOLD) {
      const ratio = (POD_MAINSTREAM_THRESHOLD - prev.pod) / (pod - prev.pod);
      return Math.round(prev.year + ratio * (y - prev.year));
    }
    prev = { year: y, pod };
  }
  // Never crosses in range
  return 2100;
}

export default function ConfigurePage() {
  const router = useRouter();
  const [sliders, setSliders] = useState<SliderValues>(getDefaultSliders);
  const [activePreset, setActivePreset] = useState<string | null>(
    "slow_burn"
  );
  const [selectedYear, setSelectedYear] = useState(2090);

  // Load from URL on mount
  useEffect(() => {
    const fromUrl = decodeForcesFromURL();
    if (fromUrl) {
      setSliders(fromUrl);
      setActivePreset(null);
    }
  }, []);

  // MoM year: when pod adoption crosses early adopters → mainstream
  const momentYear = useMemo(
    () => findMomentYear(sliders, "portland"),
    [sliders]
  );

  // Snap selected year to MoM whenever forces change
  useEffect(() => {
    setSelectedYear(momentYear);
  }, [momentYear]);

  // World state at the user-selected year
  const worldState = useMemo(
    () => computeWorldState(sliders, selectedYear, "portland"),
    [sliders, selectedYear]
  );

  // Truncate to 2100 — after that all curves converge to 100
  const timeSeriesData = useMemo(
    () => computeTimeSeries(sliders, "portland").filter((pt) => pt.year <= 2100),
    [sliders]
  );

  const handleSliderChange = useCallback((id: string, value: number) => {
    setSliders((prev) => ({ ...prev, [id]: value }));
    setActivePreset(null);
  }, []);

  const handlePreset = useCallback(
    (values: SliderValues, presetId: string) => {
      setSliders(values);
      setActivePreset(presetId);
    },
    []
  );

  // Build search params for NavBar and Next button
  const searchParams = `?v=2&f=${encodeForces(sliders)}`;

  const handleNext = () => {
    router.push(`/matrix-moment/story${searchParams}`);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <NavBar searchParams={searchParams} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Input forces + presets */}
          <div className="lg:col-span-5 space-y-6">
            <ForceSliders values={sliders} onChange={handleSliderChange} />
            <PresetButtons
              activePreset={activePreset}
              onSelect={handlePreset}
            />

            {/* Next button */}
            <button
              onClick={handleNext}
              className="w-full py-3 font-mono text-sm uppercase tracking-widest border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-200"
            >
              Next: Story &rarr;
            </button>
          </div>

          {/* Right column: Chart + World panel */}
          <div className="lg:col-span-7 space-y-6">
            <CompoundingChart
              data={timeSeriesData}
              momentYear={momentYear}
            />
            <WorldPanel
              worldState={worldState}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
