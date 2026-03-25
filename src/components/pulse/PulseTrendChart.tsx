"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { computeScores, rowToRaw, type PulseScores } from "@/lib/pulse-scoring";

interface WeekData {
  week_of: string;
  user?: PulseScores;
  avg?: PulseScores;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userResponses: Record<string, any>[];
  aggregates: {
    week_of: string;
    avg_q1: number;
    avg_q2: number;
    avg_q3: number;
    avg_q4: number;
    avg_q5: number;
    avg_q6: number;
    avg_q7: number;
  }[];
}

const SCORE_COLORS: Record<string, string> = {
  substitution: "#d97706",
  expansion: "#059669",
  agency: "#2563eb",
  meaning: "#7c3aed",
  risk: "#dc2626",
};

export default function PulseTrendChart({ userResponses, aggregates }: Props) {
  const weekSet = new Set<string>();
  for (const r of userResponses) weekSet.add(r.week_of as string);
  for (const a of aggregates) weekSet.add(a.week_of);

  const weeks = Array.from(weekSet).sort();

  const userByWeek = new Map(
    userResponses.map((r) => [r.week_of, computeScores(rowToRaw(r))])
  );

  const avgByWeek = new Map(
    aggregates.map((a) => [
      a.week_of,
      computeScores({
        q1: a.avg_q1,
        q2: a.avg_q2,
        q3: a.avg_q3,
        q4: a.avg_q4,
        q5: a.avg_q5,
        q6: a.avg_q6,
        q7: a.avg_q7,
      }),
    ])
  );

  const chartData = weeks.map((w, idx) => {
    const user = userByWeek.get(w);
    const avg = avgByWeek.get(w);
    return {
      week: idx === 0 ? "Baseline" : `Week ${idx}`,
      substitution: user?.substitution,
      expansion: user?.expansion,
      agency: user?.agency,
      meaning: user?.meaning,
      risk: user?.risk,
      avg_substitution: avg?.substitution,
      avg_expansion: avg?.expansion,
      avg_agency: avg?.agency,
      avg_meaning: avg?.meaning,
      avg_risk: avg?.risk,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
        <p className="text-base text-zinc-500">
          No data yet. Complete your first survey to see trends.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6">
      <h3 className="text-sm text-zinc-700 font-medium tracking-wide mb-1">
        Your Trajectory
      </h3>
      <p className="text-sm text-zinc-500 mb-4">
        Solid lines = you. Dashed = population average. First point is your baseline, then weekly check-ins.
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={{ stroke: "#d4d4d8" }}
          />
          <YAxis
            domain={[1, 7]}
            ticks={[1, 2, 3, 4, 5, 6, 7]}
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={{ stroke: "#d4d4d8" }}
          />
          <ReferenceLine y={4} stroke="#a1a1aa" strokeDasharray="6 3" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e4e4e7",
              borderRadius: 8,
              fontSize: 11,
              fontFamily: "monospace",
            }}
            labelStyle={{ color: "#71717a" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }}
          />
          {Object.entries(SCORE_COLORS).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3 }}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              connectNulls
            />
          ))}
          {Object.entries(SCORE_COLORS).map(([key, color]) => (
            <Line
              key={`avg_${key}`}
              type="monotone"
              dataKey={`avg_${key}`}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
              name={`Avg ${key}`}
              connectNulls
              legendType="none"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
