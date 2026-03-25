"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

interface DataPoint {
  x: number;
  y: number;
  isUser?: boolean;
}

interface QuadrantLabel {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

interface Props {
  title: string;
  xLabel: string;
  yLabel: string;
  userPoint?: { x: number; y: number };
  populationPoints: { x: number; y: number }[];
  quadrantLabels: QuadrantLabel;
}

export default function PulseQuadrantMap({
  title,
  xLabel,
  yLabel,
  userPoint,
  populationPoints,
  quadrantLabels,
}: Props) {
  const allPoints: DataPoint[] = [
    ...populationPoints.map((p) => ({ ...p, isUser: false })),
    ...(userPoint ? [{ ...userPoint, isUser: true }] : []),
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <h3 className="text-sm text-zinc-700 font-medium tracking-wide mb-3">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-1 mb-3 text-[10px] text-zinc-500">
        <span className="text-left">{quadrantLabels.topLeft}</span>
        <span className="text-right">{quadrantLabels.topRight}</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[1, 7]}
            ticks={[1, 2, 3, 4, 5, 6, 7]}
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={{ stroke: "#d4d4d8" }}
            label={{
              value: xLabel,
              position: "bottom",
              fill: "#71717a",
              fontSize: 10,
              offset: 5,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[1, 7]}
            ticks={[1, 2, 3, 4, 5, 6, 7]}
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={{ stroke: "#d4d4d8" }}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              fill: "#71717a",
              fontSize: 10,
              offset: 0,
            }}
          />
          <ReferenceLine x={4} stroke="#a1a1aa" strokeDasharray="6 3" />
          <ReferenceLine y={4} stroke="#a1a1aa" strokeDasharray="6 3" />
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
          <Scatter data={allPoints} fill="#a1a1aa">
            {allPoints.map((point, i) => (
              <Cell
                key={i}
                fill={point.isUser ? "#18181b" : "#a1a1aa"}
                r={point.isUser ? 7 : 4}
                stroke={point.isUser ? "#fff" : "none"}
                strokeWidth={point.isUser ? 2 : 0}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-1 mt-1 text-[10px] text-zinc-500">
        <span className="text-left">{quadrantLabels.bottomLeft}</span>
        <span className="text-right">{quadrantLabels.bottomRight}</span>
      </div>

      {userPoint && (
        <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-500">
          <span className="w-2 h-2 bg-zinc-900 rounded-full inline-block" />
          You
          <span className="w-2 h-2 bg-zinc-300 rounded-full inline-block ml-2" />
          Others
        </div>
      )}
    </div>
  );
}
