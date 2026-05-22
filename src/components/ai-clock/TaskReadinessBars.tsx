"use client";

import { useMemo } from "react";
import { JOB_TASKS } from "@/lib/roles";
import type { CapabilityScore } from "@/lib/ai-benchmarks";

interface Props {
  scores: CapabilityScore[];
  taskWeights: Record<string, number>;
}

/**
 * Bar chart showing AI readiness per job task.
 * Each task score is the weighted average of its underlying benchmark scores
 * (per the task's benchmarkWeights mapping).
 * User's task-weight is indicated by bar opacity — tasks you care about stand out.
 */
export default function TaskReadinessBars({ scores, taskWeights }: Props) {
  const taskReadiness = useMemo(() => {
    return JOB_TASKS.map((task) => {
      let weightedSum = 0;
      let totalWeight = 0;
      for (const [benchmarkId, weight] of Object.entries(task.benchmarkWeights)) {
        const cap = scores.find((s) => s.id === benchmarkId);
        if (cap == null) continue;
        weightedSum += cap.score * weight;
        totalWeight += weight;
      }
      const readiness = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
      const userWeight = taskWeights[task.id] ?? 0;
      return { ...task, readiness, userWeight };
    });
  }, [scores, taskWeights]);

  const maxUserWeight = Math.max(...taskReadiness.map((t) => t.userWeight), 1);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
          AI readiness per task
        </h3>
        <p className="text-[10px] font-mono text-zinc-600">
          Bar length = readiness. Bar opacity = how much it matters in your job.
        </p>
      </div>
      {taskReadiness.map((task) => {
        const opacity = 0.25 + (task.userWeight / maxUserWeight) * 0.75;
        return (
          <div key={task.id}>
            <div className="flex justify-between items-baseline mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono text-zinc-200 font-bold">
                  {task.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-600">
                  weight: <span className="text-emerald-400">{task.userWeight}%</span>
                </span>
              </div>
              <span className="text-[12px] font-mono text-emerald-400 font-bold">
                {task.readiness}%
              </span>
            </div>
            <div className="relative h-4 bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${task.readiness}%`,
                  opacity,
                }}
              />
            </div>
            <p className="text-[10px] font-mono text-zinc-600 mt-1">
              {task.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
