"use client";

import { useMemo, useState } from "react";
import { SliderValues } from "@/lib/forces";
import { computeWorldState } from "@/lib/worldEngine";
import { REGIONS } from "@/lib/regions";

interface Props {
  sliders: SliderValues;
  year: number;
  selectedRegion: string;
  onRegionChange: (regionId: string) => void;
}

// Approximate lat/lng for each region
const COORDS: Record<string, [number, number]> = {
  portland: [45.52, -122.68],
  san_francisco: [37.77, -122.42],
  new_york: [40.71, -74.01],
  tokyo: [35.68, 139.69],
  seoul: [37.57, 126.98],
  london: [51.51, -0.13],
  berlin: [52.52, 13.4],
  stockholm: [59.33, 18.07],
  dubai: [25.2, 55.27],
  singapore: [1.35, 103.82],
  sydney: [-33.87, 151.21],
  lagos: [6.52, 3.38],
  nairobi: [-1.29, 36.82],
  mumbai: [19.08, 72.88],
  bangalore: [12.97, 77.59],
  jakarta: [-6.21, 106.85],
  sao_paulo: [-23.55, -46.63],
  mexico_city: [19.43, -99.13],
  cairo: [30.04, 31.24],
  shanghai: [31.23, 121.47],
  shenzhen: [22.54, 114.06],
  beijing: [39.9, 116.4],
  moscow: [55.76, 37.62],
  riyadh: [24.71, 46.68],
  tehran: [35.69, 51.39],
};

const MAP_W = 800;
const MAP_H = 380;
const LAT_TOP = 72;
const LAT_BOT = -50;

function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOT)) * MAP_H;
  return [x, y];
}

function toPath(coords: [number, number][]): string {
  return (
    coords
      .map((c, i) => {
        const [x, y] = project(c[0], c[1]);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z"
  );
}

// Simplified continent outlines [lat, lng][]
const CONTINENTS: { name: string; coords: [number, number][] }[] = [
  {
    name: "north_america",
    coords: [
      [49, -125], [54, -130], [58, -137], [60, -141], [64, -166], [70, -162],
      [71, -156], [70, -141], [62, -115], [54, -108], [50, -95], [52, -82],
      [55, -77], [60, -65], [52, -56], [47, -53], [45, -61], [44, -66],
      [42, -70], [40, -74], [35, -76], [30, -82], [25, -80], [25, -90],
      [20, -87], [15, -84], [15, -92], [18, -105], [22, -105], [28, -112],
      [32, -117], [34, -120], [38, -123], [43, -124], [49, -125],
    ],
  },
  {
    name: "south_america",
    coords: [
      [12, -72], [10, -76], [7, -78], [1, -80], [-5, -81], [-15, -76],
      [-18, -70], [-23, -70], [-28, -71], [-40, -73], [-46, -75], [-53, -70],
      [-55, -67], [-55, -64], [-50, -66], [-42, -63], [-35, -57], [-33, -52],
      [-23, -41], [-13, -39], [-5, -35], [-2, -50], [4, -52], [7, -58],
      [10, -63], [12, -72],
    ],
  },
  {
    name: "europe",
    coords: [
      [36, -10], [38, -8], [43, -9], [46, -2], [48, -5], [49, -1], [51, 2],
      [53, 5], [54, 9], [56, 9], [58, 6], [63, 5], [65, 13], [68, 16],
      [70, 20], [70, 30], [67, 41], [62, 40], [60, 30], [56, 22], [55, 20],
      [54, 14], [50, 14], [47, 16], [45, 14], [42, 18], [40, 22], [38, 24],
      [36, 22], [35, 26], [37, 36], [33, 36], [32, 25], [33, 12], [37, 10],
      [36, 0], [36, -10],
    ],
  },
  {
    name: "africa",
    coords: [
      [37, -10], [36, 0], [37, 10], [33, 12], [32, 25], [31, 33], [22, 37],
      [12, 44], [2, 42], [-2, 41], [-10, 40], [-15, 41], [-26, 35],
      [-35, 20], [-34, 18], [-30, 17], [-22, 14], [-17, 12], [-12, 14],
      [-5, 12], [4, 2], [5, -4], [4, -8], [7, -13], [10, -16], [15, -17],
      [20, -17], [25, -15], [30, -10], [35, -6], [37, -10],
    ],
  },
  {
    name: "asia",
    coords: [
      [70, 30], [72, 50], [72, 80], [72, 105], [72, 130], [70, 140],
      [66, 170], [64, 178], [60, 165], [54, 157], [50, 143], [46, 143],
      [42, 132], [38, 130], [35, 129], [34, 127], [38, 122], [35, 120],
      [30, 122], [25, 120], [23, 114], [22, 108], [18, 108], [15, 110],
      [10, 108], [8, 105], [1, 104], [6, 100], [10, 98], [16, 100],
      [21, 93], [22, 88], [20, 88], [16, 82], [22, 78], [10, 77],
      [8, 80], [20, 73], [25, 62], [26, 56], [23, 58], [13, 45],
      [28, 34], [33, 36], [37, 36], [35, 26], [38, 24], [40, 22],
      [42, 18], [47, 16], [50, 14], [54, 14], [55, 20], [56, 22],
      [60, 30], [62, 40], [67, 41], [70, 30],
    ],
  },
  {
    name: "australia",
    coords: [
      [-12, 131], [-12, 136], [-15, 141], [-18, 146], [-24, 153], [-28, 154],
      [-34, 151], [-37, 150], [-39, 146], [-38, 141], [-34, 137], [-33, 134],
      [-32, 132], [-32, 127], [-26, 114], [-22, 114], [-20, 119], [-15, 124],
      [-12, 131],
    ],
  },
  {
    name: "greenland",
    coords: [
      [60, -44], [63, -51], [67, -54], [70, -55], [72, -52], [72, -40],
      [72, -22], [70, -22], [67, -30], [64, -38], [60, -44],
    ],
  },
];

/** 0 = uninhabitable pod wasteland, 100 = thriving physical world */
function livabilityScore(ws: ReturnType<typeof computeWorldState>): number {
  const c = ws.computed;
  return Math.round(
    Math.max(
      0,
      100 -
        (c.podAdoption * 0.2 +
          c.gdpDecline * 0.2 +
          c.unemployment * 0.2 +
          c.outcomes.meaning_crisis * 0.15 +
          c.outcomes.trust_collapse * 0.15 +
          c.physicalDecay * 0.1)
    )
  );
}

function scoreColor(score: number): string {
  if (score >= 70) return "#34d399"; // emerald
  if (score >= 50) return "#fbbf24"; // amber
  if (score >= 30) return "#f97316"; // orange
  return "#ef4444"; // red
}

function scoreLabel(score: number): string {
  if (score >= 70) return "Safe";
  if (score >= 50) return "Transitioning";
  if (score >= 30) return "At risk";
  return "Pod-dominated";
}

export default function GlobalMap({
  sliders,
  year,
  selectedRegion,
  onRegionChange,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Compute world state + livability for every region
  const regionData = useMemo(() => {
    return REGIONS.map((r) => {
      const ws = computeWorldState(sliders, year, r.id);
      const score = livabilityScore(ws);
      const coords = COORDS[r.id];
      const [x, y] = coords ? project(coords[0], coords[1]) : [0, 0];
      return {
        ...r,
        score,
        color: scoreColor(score),
        x,
        y,
        podAdoption: ws.computed.podAdoption,
        gdpDecline: ws.computed.gdpDecline,
        unemployment: ws.computed.unemployment,
      };
    });
  }, [sliders, year]);

  const hovered = regionData.find((r) => r.id === hoveredId);

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[10px] uppercase tracking-widest text-emerald-500/80 font-mono">
          Physical Livability @ {year}
        </h2>
        <div className="flex items-center gap-3 text-[9px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Safe
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Transitioning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            At risk
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            Pod-dominated
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-full"
          style={{ aspectRatio: `${MAP_W}/${MAP_H}` }}
        >
          {/* Background */}
          <rect width={MAP_W} height={MAP_H} fill="#09090b" />

          {/* Continent outlines */}
          {CONTINENTS.map((c) => (
            <path
              key={c.name}
              d={toPath(c.coords)}
              fill="#18181b"
              stroke="#27272a"
              strokeWidth={0.5}
            />
          ))}

          {/* Region dots */}
          {regionData.map((r) => {
            const isSelected = r.id === selectedRegion;
            const isHovered = r.id === hoveredId;
            const radius = isSelected ? 7 : isHovered ? 6 : 4.5;

            return (
              <g key={r.id}>
                {/* Glow */}
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={radius + 4}
                  fill={r.color}
                  opacity={isSelected ? 0.15 : isHovered ? 0.1 : 0.05}
                />
                {/* Dot */}
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={radius}
                  fill={r.color}
                  opacity={isSelected ? 1 : 0.8}
                  stroke={isSelected ? "#fff" : "none"}
                  strokeWidth={isSelected ? 1.5 : 0}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredId(r.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onRegionChange(r.id)}
                />
                {/* Label for selected */}
                {isSelected && (
                  <text
                    x={r.x}
                    y={r.y - 12}
                    textAnchor="middle"
                    fill="#a1a1aa"
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    {r.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hovered && (
          <div
            className="absolute pointer-events-none bg-zinc-900 border border-zinc-700 px-2 py-1.5 z-10"
            style={{
              left: `${(hovered.x / MAP_W) * 100}%`,
              top: `${(hovered.y / MAP_H) * 100}%`,
              transform: "translate(-50%, -130%)",
            }}
          >
            <div className="text-[10px] font-mono text-zinc-300">
              {hovered.name}, {hovered.country}
            </div>
            <div
              className="text-[10px] font-mono font-bold"
              style={{ color: hovered.color }}
            >
              {scoreLabel(hovered.score)} ({hovered.score})
            </div>
            <div className="text-[9px] font-mono text-zinc-500 mt-0.5">
              Pod {hovered.podAdoption}% · GDP↓ {hovered.gdpDecline}% · Unemp{" "}
              {hovered.unemployment}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
