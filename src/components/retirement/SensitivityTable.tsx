"use client";

import type { SensitivityRow } from "@/lib/retirement";

interface SensitivityTableProps {
  rows: SensitivityRow[];
}

function signalDot(signal: "safe" | "tight" | "danger"): string {
  if (signal === "safe") return "bg-emerald-400";
  if (signal === "tight") return "bg-amber-400";
  return "bg-red-400";
}

function signalText(signal: "safe" | "tight" | "danger"): string {
  if (signal === "safe") return "text-emerald-400";
  if (signal === "tight") return "text-amber-400";
  return "text-red-400";
}

export default function SensitivityTable({ rows }: SensitivityTableProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400 mb-1">
          What-If Scenarios
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          How your outcome changes under different assumptions.
        </p>
      </div>

      <div className="border border-zinc-800 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 px-4 py-2">
                Scenario
              </th>
              <th className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 px-4 py-2">
                Money runs out
              </th>
              <th className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 px-4 py-2">
                Safety margin
              </th>
              <th className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 px-4 py-2 w-8">
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.scenario} className="border-b border-zinc-900 last:border-0">
                <td className="text-[11px] font-mono text-zinc-300 px-4 py-2.5">
                  {row.scenario}
                </td>
                <td className="text-[11px] font-mono text-zinc-400 px-4 py-2.5">
                  {row.moneyRunsOutAge !== null ? `Age ${row.moneyRunsOutAge}` : "Never"}
                </td>
                <td className={`text-[11px] font-mono px-4 py-2.5 ${signalText(row.signal)}`}>
                  {row.safetyMargin > 0 ? "+" : ""}{row.safetyMargin} yrs
                </td>
                <td className="px-4 py-2.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${signalDot(row.signal)}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
