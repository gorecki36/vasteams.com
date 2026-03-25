"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getDefaultSliders } from "@/lib/forces";
import { computeWorldState } from "@/lib/worldEngine";

const POD_MAINSTREAM_THRESHOLD = 16;

function findMomentYear(sliders: Record<string, number>, regionId: string): number {
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
  return 2100;
}

export default function IntroPage() {
  const momentYear = useMemo(
    () => findMomentYear(getDefaultSliders(), "portland"),
    []
  );

  const urgency = momentYear <= 2050 ? "imminent" : momentYear <= 2070 ? "approaching" : "distant";
  const momColor =
    urgency === "imminent"
      ? "text-red-400"
      : urgency === "approaching"
        ? "text-amber-400"
        : "text-emerald-400";
  const glowColor =
    urgency === "imminent"
      ? "bg-red-500/10"
      : urgency === "approaching"
        ? "bg-amber-500/10"
        : "bg-emerald-500/10";
  const ringColor =
    urgency === "imminent"
      ? "border-red-500/20"
      : urgency === "approaching"
        ? "border-amber-500/20"
        : "border-emerald-500/20";

  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors z-20"
      >
        &larr; back
      </Link>

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow behind orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
        <div
          className={`absolute inset-0 rounded-full ${glowColor} blur-[100px] animate-pulse`}
        />
      </div>

      {/* The orb — Moment of Matrix as visual centerpiece */}
      <div className="relative mb-16">
        {/* Outer rings */}
        <div
          className={`absolute -inset-16 rounded-full border ${ringColor} opacity-30`}
        />
        <div
          className={`absolute -inset-10 rounded-full border ${ringColor} opacity-50`}
        />
        <div
          className={`absolute -inset-4 rounded-full border ${ringColor} opacity-70`}
        />

        {/* Core circle */}
        <div
          className={`w-44 h-44 rounded-full border ${ringColor} flex items-center justify-center`}
        >
          <div className="text-center">
            <div className={`text-5xl font-mono font-bold ${momColor}`}>
              {momentYear}
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-mono mt-2">
              Year of Matrix
            </div>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="text-center max-w-lg px-6 relative z-10">
        <p className="text-2xl text-zinc-100 font-mono leading-relaxed mb-6">
          The simulator: how close are we
          <br />
          to the matrix moment?
        </p>

        <p className="text-sm text-zinc-500 font-mono leading-loose mb-12">
          Seven forces are pulling civilization toward a threshold — the Moment
          of Matrix. Not through war or conspiracy. Through comfort. AI handles
          your work. Neural links make reality optional. The climate makes
          outside unappealing. One Tuesday you realize nothing feels quite real
          anymore. You don&apos;t mind.
        </p>

        <Link
          href="/matrix-moment/configure"
          className="inline-block px-8 py-3.5 font-mono text-sm uppercase tracking-widest border border-emerald-500/70 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-500"
        >
          Set the forces &rarr;
        </Link>

        <p className="text-[10px] text-zinc-700 font-mono mt-6 tracking-wider">
          Adjust 7 macro forces. Pick a year. Meet yourself in that world.
        </p>
      </div>
    </div>
  );
}
