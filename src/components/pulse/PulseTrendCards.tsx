"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { computeScores, rowToRaw } from "@/lib/pulse-scoring";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseRow = Record<string, any>;

interface AggregateRow {
  avg_q1: number;
  avg_q2: number;
  avg_q3: number;
  avg_q4: number;
  avg_q5: number;
  avg_q6: number;
  avg_q7: number;
}

interface Props {
  baselineResponse: ResponseRow | null;
  weeklyResponses: ResponseRow[];
  aggregates: AggregateRow[];
}

const DIMENSIONS = [
  {
    key: "substitution" as const,
    label: "Substitution",
    desc: "How much AI is doing your thinking. Rising = more offloading.",
    color: "#d97706",
    bgClass: "bg-amber-50 border-amber-200",
  },
  {
    key: "expansion" as const,
    label: "Expansion",
    desc: "New doors AI is opening. Rising = AI is broadening your reach.",
    color: "#059669",
    bgClass: "bg-emerald-50 border-emerald-200",
  },
  {
    key: "agency" as const,
    label: "Agency",
    desc: "Confidence + growth combined. Rising = you're getting stronger.",
    color: "#2563eb",
    bgClass: "bg-blue-50 border-blue-200",
  },
  {
    key: "meaning" as const,
    label: "Meaning",
    desc: "Does AI make your work matter more? Rising = more purpose.",
    color: "#7c3aed",
    bgClass: "bg-purple-50 border-purple-200",
  },
  {
    key: "risk" as const,
    label: "Compulsion",
    desc: "Can you stop when you should? Rising = harder to disengage.",
    color: "#dc2626",
    bgClass: "bg-red-50 border-red-200",
  },
];

/** Format YYYY-MM-DD → "Mar 24" */
function formatWeekLabel(weekOf: string): string {
  const [, month, day] = weekOf.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[month - 1]} ${day}`;
}

export default function PulseTrendCards({
  baselineResponse,
  weeklyResponses,
  aggregates,
}: Props) {
  // Build cumulative scores per dimension
  // Baseline score is the starting value
  // Each weekly answer adds (answer - 4) to the running total
  const baselineScores = baselineResponse
    ? computeScores(rowToRaw(baselineResponse))
    : null;

  const weeklyScoresList = weeklyResponses.map((r) => computeScores(rowToRaw(r)));
  const avgScoresList = aggregates.map((a) =>
    computeScores({
      q1: a.avg_q1,
      q2: a.avg_q2,
      q3: a.avg_q3,
      q4: a.avg_q4,
      q5: a.avg_q5,
      q6: a.avg_q6,
      q7: a.avg_q7,
    })
  );

  // For each dimension, build cumulative data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getScore(scores: any, key: string): number {
    return scores[key] as number;
  }

  function buildCumulativeData(dimensionKey: string) {
    const points: { label: string; you: number; avg: number | undefined }[] = [];

    if (dimensionKey === "fragileAugmentation") return points;

    let cumulative = baselineScores
      ? getScore(baselineScores, dimensionKey)
      : 4;
    let avgCumulative = avgScoresList.length > 0
      ? getScore(avgScoresList[0], dimensionKey) ?? 4
      : 4;

    if (baselineScores) {
      const weekOf = baselineResponse?.week_of as string | undefined;
      points.push({
        label: weekOf ? formatWeekLabel(weekOf) : "Baseline",
        you: cumulative,
        avg: avgScoresList[0] ? getScore(avgScoresList[0], dimensionKey) : undefined,
      });
    }

    const avgOffset = baselineScores ? 1 : 0;

    weeklyResponses.forEach((row, idx) => {
      const scores = weeklyScoresList[idx];
      const weeklyValue = getScore(scores, dimensionKey);
      cumulative += weeklyValue - 4; // 4 = no change, 5 = +1, 3 = -1

      const aggIdx = idx + avgOffset;
      const avgWeekly = avgScoresList[aggIdx]
        ? getScore(avgScoresList[aggIdx], dimensionKey)
        : undefined;
      if (avgWeekly !== undefined) {
        avgCumulative += avgWeekly - 4;
      }

      const weekOf = row.week_of as string | undefined;
      points.push({
        label: weekOf ? formatWeekLabel(weekOf) : `W${idx + 1}`,
        you: cumulative,
        avg: avgWeekly !== undefined ? avgCumulative : undefined,
      });
    });

    return points;
  }

  if (!baselineScores && weeklyScoresList.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
        <p className="text-base text-zinc-500">
          No weekly data yet. Complete a check-in to start tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {DIMENSIONS.map((dim) => {
        const data = buildCumulativeData(dim.key);
        if (data.length === 0) return null;

        const currentValue = data[data.length - 1].you;
        const startValue = data[0].you;
        const delta = currentValue - startValue;
        const allValues = data.flatMap((d) => [d.you, d.avg].filter((v): v is number => v !== undefined));
        const minY = Math.floor(Math.min(...allValues) - 0.5);
        const maxY = Math.ceil(Math.max(...allValues) + 0.5);

        return (
          <div
            key={dim.key}
            className={`border rounded-lg p-5 ${dim.bgClass}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3
                  className="text-base font-bold"
                  style={{ color: dim.color }}
                >
                  {dim.label}
                </h3>
                <p className="text-sm text-zinc-500 mt-0.5">{dim.desc}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p
                  className="text-3xl font-bold leading-none"
                  style={{ color: dim.color }}
                >
                  {currentValue.toFixed(1)}
                </p>
                {data.length > 1 && (
                  <p
                    className={`text-sm font-medium mt-1 ${
                      delta > 0
                        ? dim.key === "risk"
                          ? "text-red-600"
                          : "text-emerald-600"
                        : delta < 0
                          ? dim.key === "risk"
                            ? "text-emerald-600"
                            : "text-amber-600"
                          : "text-zinc-400"
                    }`}
                  >
                    {delta > 0 ? "+" : ""}
                    {delta.toFixed(1)} since baseline
                  </p>
                )}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[minY, maxY]}
                  hide
                />
                {baselineScores && (
                  <ReferenceLine
                    y={getScore(baselineScores, dim.key)}
                    stroke="#d4d4d8"
                    strokeDasharray="4 4"
                  />
                )}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e4e4e7",
                    borderRadius: 8,
                    fontSize: 11,
                    fontFamily: "monospace",
                  }}
                  formatter={(value) => typeof value === "number" ? value.toFixed(1) : String(value)}
                />
                {/* Population average */}
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#a1a1aa"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  connectNulls
                />
                {/* User line */}
                <Line
                  type="monotone"
                  dataKey="you"
                  stroke={dim.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: dim.color, stroke: "#fff", strokeWidth: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>

            {data.length === 1 && (
              <p className="text-xs text-zinc-400 text-center mt-1">
                Your starting point. Come back next week to see the trend.
              </p>
            )}
          </div>
        );
      })}

      <p className="text-xs text-zinc-500 text-center pt-2">
        Solid line = you (cumulative). Dashed = population average. Dotted line = your baseline.
      </p>
    </div>
  );
}
