"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import TaskReadinessBars from "./TaskReadinessBars";
import CapabilityBreakdown from "./CapabilityBreakdown";
import ReadinessTimeline from "./ReadinessTimeline";
import {
  ROLES,
  SENIORITY_LEVELS,
  JOB_TASKS,
  ROLE_TASK_PROFILES,
  TECHNICAL_SHARE,
  computeReadinessFromWeights,
  computeLayerReadinessFromWeights,
  roleFromNumericWeights,
  tasksToBenchmarkWeights,
} from "@/lib/roles";
import type { BenchmarkData } from "@/lib/ai-benchmarks";

export default function AiClockPage() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [seniorityId, setSeniorityId] = useState<string>("mid");
  const [taskWeights, setTaskWeights] = useState<Record<string, number>>(
    SENIORITY_LEVELS.find((l) => l.id === "mid")?.taskWeights ?? {}
  );
  const [customized, setCustomized] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/ai-benchmarks");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeSeniority = useMemo(
    () => SENIORITY_LEVELS.find((l) => l.id === seniorityId) ?? SENIORITY_LEVELS[2],
    [seniorityId]
  );

  const technicalShare = useMemo(
    () => TECHNICAL_SHARE[seniorityId] ?? 40,
    [seniorityId]
  );

  const selectSeniority = (id: string) => {
    const level = SENIORITY_LEVELS.find((l) => l.id === id);
    if (!level) return;
    setSeniorityId(id);
    setTaskWeights({ ...level.taskWeights });
    setCustomized(false);
    setTemplateName(null);
  };

  const applyRoleTemplate = (roleId: string) => {
    const profile = ROLE_TASK_PROFILES[roleId];
    if (!profile) return;
    setTaskWeights({ ...profile });
    setCustomized(true);
    const roleName = ROLES.find((r) => r.id === roleId)?.shortName ?? roleId;
    setTemplateName(roleName);
  };

  const updateTaskWeight = (taskId: string, value: number) => {
    setTaskWeights((prev) => ({ ...prev, [taskId]: value }));
    setCustomized(true);
    setTemplateName(null);
  };

  const resetToSeniority = () => {
    selectSeniority(seniorityId);
  };

  // Convert user's task weights to benchmark-level weights for readiness calc
  const benchmarkWeights = useMemo(
    () => tasksToBenchmarkWeights(taskWeights),
    [taskWeights]
  );

  const allScores = useMemo(() => {
    if (!data) return [];
    return [...data.prompt, ...data.agentic];
  }, [data]);

  const promptReadiness = useMemo(() => {
    if (!data) return 0;
    return computeLayerReadinessFromWeights(benchmarkWeights, allScores, "prompt");
  }, [data, benchmarkWeights, allScores]);

  const agenticReadiness = useMemo(() => {
    if (!data) return 0;
    return computeLayerReadinessFromWeights(benchmarkWeights, allScores, "agentic");
  }, [data, benchmarkWeights, allScores]);

  const totalReadiness = useMemo(() => {
    if (!data) return 0;
    return computeReadinessFromWeights(benchmarkWeights, allScores);
  }, [data, benchmarkWeights, allScores]);

  const careerExposure = useMemo(
    () => Math.round((totalReadiness * technicalShare) / 100),
    [totalReadiness, technicalShare]
  );

  const syntheticRole = useMemo(() => {
    const label = templateName
      ? `${templateName} template`
      : customized
      ? "Custom profile"
      : activeSeniority.name;
    const shortLabel = templateName ?? (customized ? "Custom" : activeSeniority.shortName);
    return roleFromNumericWeights(
      "custom",
      label,
      shortLabel,
      benchmarkWeights
    );
  }, [benchmarkWeights, customized, templateName, activeSeniority]);

  const updatedAgo = useMemo(() => {
    if (!data?.updatedAt) return null;
    const diff = Date.now() - new Date(data.updatedAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-sm font-mono text-zinc-600 tracking-widest uppercase animate-pulse">
          Loading benchmarks...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-sm font-mono text-red-400">
          {error ?? "Failed to load data"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            &larr; back
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-lg font-mono tracking-widest text-emerald-400 uppercase">
            The AI Capability Clock
          </h1>
          <p className="text-sm font-mono text-zinc-500 mt-2">
            How much of YOUR marketing job is AI-ready?
          </p>
          <p className="text-[11px] font-mono text-zinc-500 mt-3 max-w-2xl mx-auto leading-relaxed">
            Pick your seniority, then adjust how much each capability matters in your daily work.
            Your <span className="text-emerald-400">Career Exposure</span> score combines AI readiness with
            the technical share of your job &mdash; which varies sharply by level (roughly
            <span className="text-zinc-300"> 70% at entry</span>, falling to
            <span className="text-zinc-300"> 12% at C-suite</span>).
          </p>
          <p className="text-[10px] font-mono text-zinc-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            The other portion of your work &mdash; leadership, relationships, creative judgment, strategic vision
            &mdash; remains distinctly human. But that share is much smaller early in your career than it is later on.
          </p>
        </div>

        {/* Step 1: Seniority */}
        <div className="mb-6">
          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest text-center mb-3">
            Step 1 &mdash; What&apos;s your experience level?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SENIORITY_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => selectSeniority(level.id)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-all duration-150 ${
                  seniorityId === level.id
                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                {level.shortName}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-zinc-600 text-center mt-3">
            Technical share of daily work at this level:{" "}
            <span className="text-zinc-300">{technicalShare}%</span>
          </p>
        </div>

        {/* Step 2: Job task sliders */}
        <div className="border border-zinc-800 bg-zinc-900/30 p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
              Step 2 &mdash; How much of YOUR job is each task?
            </p>
            {(customized || templateName) && (
              <button
                onClick={resetToSeniority}
                className="text-[10px] font-mono text-amber-400 hover:text-amber-300 uppercase tracking-widest border border-amber-500/40 px-2 py-1 hover:border-amber-400 transition"
              >
                Reset to {activeSeniority.shortName}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {JOB_TASKS.map((task) => {
              const value = taskWeights[task.id] ?? 0;
              return (
                <div key={task.id}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-mono text-zinc-300 font-bold">
                      {task.name}
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {value}%
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-600 mb-1 leading-tight">
                    {task.description}
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={value}
                    onChange={(e) => updateTaskWeight(task.id, parseInt(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              );
            })}
          </div>

          {/* Quick start from role template */}
          <div className="mt-5 pt-4 border-t border-zinc-800">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
              Or start from a role template
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => applyRoleTemplate(role.id)}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest border transition ${
                    templateName === role.shortName
                      ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {role.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Scope note */}
          <p className="text-[10px] font-mono text-zinc-600 mt-4 pt-4 border-t border-zinc-800 leading-relaxed">
            The Clock measures AI&apos;s capability on the technical part of each task. Human delivery
            (standing in front of people, reading the room, building trust on stage) is not measured and is assumed to remain human.
          </p>
        </div>

        {/* Summary stats with Career Exposure as the headline */}
        <div className="border border-emerald-500/30 bg-emerald-500/5 p-5 mb-6">
          <div className="flex items-center justify-center gap-8 text-center flex-wrap">
            <div>
              <div className="text-5xl font-mono font-bold text-emerald-400">
                {careerExposure}%
              </div>
              <div className="text-[10px] font-mono text-emerald-400/70 uppercase tracking-widest mt-1">
                Career Exposure
              </div>
              <div className="text-[9px] font-mono text-zinc-500 mt-1">
                readiness &times; technical share
              </div>
            </div>
            <div className="text-zinc-700">=</div>
            <div>
              <div className="text-2xl font-mono font-bold text-zinc-100">
                {totalReadiness}%
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                AI Readiness
              </div>
              <div className="text-[9px] font-mono text-zinc-600 mt-1">
                your weighted mix
              </div>
            </div>
            <div className="text-zinc-700">&times;</div>
            <div>
              <div className="text-2xl font-mono font-bold text-zinc-100">
                {technicalShare}%
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                Technical share
              </div>
              <div className="text-[9px] font-mono text-zinc-600 mt-1">
                {activeSeniority.shortName} level
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-zinc-800 text-center">
            <div>
              <div className="text-lg font-mono font-bold text-emerald-400">
                {promptReadiness}%
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                Prompt layer
              </div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-amber-400">
                {agenticReadiness}%
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                Agentic layer
              </div>
            </div>
          </div>
          <p className="text-[10px] font-mono text-zinc-600 text-center mt-4">
            Data from Artificial Analysis. Current leading model across benchmarks:{" "}
            <span className="text-zinc-300">{data.bestOverall.name}</span>
            {updatedAgo && <> &middot; updated {updatedAgo}</>}
          </p>
        </div>

        {/* Exposure over time — placed right after the headline score */}
        {data.history && data.history.length > 0 && (
          <ReadinessTimeline
            history={data.history}
            role={syntheticRole}
            technicalShare={technicalShare}
          />
        )}

        {/* Task readiness bars */}
        <div className="border border-zinc-800 bg-zinc-900/30 p-5 mb-6">
          <TaskReadinessBars scores={allScores} taskWeights={taskWeights} />
        </div>

        {/* Capability Breakdown */}
        <div className="mb-10">
          <CapabilityBreakdown
            prompt={data.prompt}
            agentic={data.agentic}
            role={syntheticRole}
          />
        </div>

        {/* Employment Impact panel — always shown */}
        <div className="border border-zinc-800 bg-zinc-900/20 p-5 mb-10">
          <h3 className="text-xs uppercase tracking-widest text-emerald-400 mb-4 font-mono">
            Employment impact by level
          </h3>
          <p className="text-[11px] font-mono text-zinc-400 leading-relaxed mb-4">
            AI Readiness stays in the 75-85% range across all levels because frontier AI is broadly capable.
            What varies is <span className="text-zinc-200">exposure</span> (how much of the job AI touches) and
            <span className="text-zinc-200"> replacement</span> (whether humans are removed). Career Exposure captures the first half.
            The data below shows the second half.
          </p>
          <table className="w-full text-[11px] font-mono">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 text-zinc-500 uppercase tracking-wider">Level</th>
                <th className="text-right py-2 text-zinc-500 uppercase tracking-wider">Task exposure</th>
                <th className="text-right py-2 text-zinc-500 uppercase tracking-wider">Employment change</th>
                <th className="text-left py-2 pl-4 text-zinc-500 uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-zinc-900">
                <td className="py-2 text-zinc-200">Entry / Junior (22-25)</td>
                <td className="text-right py-2 text-amber-400">~90%</td>
                <td className="text-right py-2 text-red-400">&minus;20% YoY</td>
                <td className="py-2 pl-4">Stanford AI Index 2026; BCG</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-2 text-zinc-200">Mid (manager, 3-6 yr)</td>
                <td className="text-right py-2 text-amber-400">~90%</td>
                <td className="text-right py-2 text-zinc-400">declining</td>
                <td className="py-2 pl-4">BCG (90% of marketing manager tasks exposed)</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-2 text-zinc-200">Senior / Very Senior (35+)</td>
                <td className="text-right py-2 text-zinc-400">~60%</td>
                <td className="text-right py-2 text-emerald-400">steady / growing</td>
                <td className="py-2 pl-4">Stanford AI Index 2026</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[11px] font-mono text-zinc-500 leading-relaxed mt-4">
            The divergence lives in replacement, not readiness. Senior roles require trust, accountability, relationships,
            and cross-functional judgment that AI is capable of assisting but rarely trusted to own outright.
            The entry-level tasks that used to train the pipeline (first drafts, reports, media plans, landing pages)
            are the same tasks AI handles most cleanly.
          </p>
          <div className="mt-4 space-y-1 text-[10px] text-zinc-600">
            <p className="text-zinc-500 uppercase tracking-wider mb-1">Sources</p>
            <p>
              <a
                href="https://hai.stanford.edu/ai-index/2026-ai-index-report"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
              >
                Stanford AI Index 2026
              </a>
              {" \u2014 "}Employment in AI-exposed occupations: ages 22-25 declined ~20% YoY; ages 35+ held steady or grew.
            </p>
            <p>
              <a
                href="https://www.bcg.com/publications/2022/human-tech-equation-for-improving-marketing-roi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
              >
                BCG 2022/2026
              </a>
              {" \u2014 "}90% of marketing manager tasks exposed to AI disruption.
            </p>
            <p>
              <a
                href="https://martech.org/we-need-to-talk-more-about-ais-impact-on-early-career-marketers/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
              >
                MarTech (2026)
              </a>
              {" \u2014 "}AI&apos;s impact on early-career marketers.
            </p>
          </div>
        </div>

        {/* How Scores Work */}
        <div className="border border-zinc-800 bg-zinc-900/20 p-5 mb-10">
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 font-mono">
            How scores work
          </h3>
          <div className="space-y-2 text-[11px] font-mono text-zinc-500 leading-relaxed">
            <p>
              Each capability maps to exactly one AI benchmark. The score shown is the
              <span className="text-zinc-300"> best raw accuracy across all frontier models</span> &mdash;
              no normalization, no human baselines.
            </p>
            <p>
              <span className="text-emerald-400/70">Prompt-level</span> = % of test questions answered correctly in a single turn.
              {" "}<span className="text-amber-400/70">Agentic</span> = % of multi-step tasks completed autonomously using tools.
            </p>
            <p>
              <span className="text-zinc-300">AI Readiness</span> is a weighted average of capability scores using your
              slider values as weights. <span className="text-zinc-300">Technical share</span> is the percentage of daily work
              that is technical at your seniority level (O*NET, AMA, ANA benchmarks).{" "}
              <span className="text-emerald-400">Career Exposure = Readiness &times; Technical share.</span>
            </p>
          </div>
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 mt-6 font-mono">
            Why seniority matters
          </h3>
          <div className="space-y-2 text-[11px] font-mono text-zinc-500 leading-relaxed">
            <p>
              Marketing roles require a mix of technical, interpersonal, creative, and strategic skills.
              The ratio shifts sharply with seniority: entry-level marketers spend most of their day on technical or executable tasks,
              while executives spend most of theirs on leadership, relationships, and judgment.
              A uniform &quot;AI can do 80% of the technical work&quot; reads very differently depending on what share technical is for you.
            </p>
            <div className="mt-3 space-y-1.5 text-[10px] text-zinc-600">
              <p className="text-zinc-500 uppercase tracking-wider">Sources</p>
              <p>
                <a
                  href="https://www.nber.org/papers/w31222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
                >
                  Eisfeldt, Schubert &amp; Zhang (2023)
                </a>
                {" \u2014 "}Generative AI and Firm Values. NBER w31222. 40% white-collar exposure vs 9% blue-collar.
              </p>
              <p>
                <a
                  href="https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
                >
                  McKinsey Global Institute (2023)
                </a>
                {" \u2014 "}The Economic Potential of Generative AI. 60-70% of work activities automatable; $0.8-1.2T in marketing/sales.
              </p>
              <p>
                <a
                  href="https://www.bcg.com/publications/2022/human-tech-equation-for-improving-marketing-roi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
                >
                  BCG (2022)
                </a>
                {" \u2014 "}The Human-Tech Equation. 10/20/70 framework: 30% tech, 70% human factors.
              </p>
              <p>
                <a
                  href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
                >
                  World Economic Forum (2025)
                </a>
                {" \u2014 "}Future of Jobs Report. 39% of key skills will change by 2030; analytical thinking #1.
              </p>
              <p>
                <a
                  href="https://www.aeaweb.org/articles?id=10.1257/pandp.20181019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
                >
                  Brynjolfsson, Mitchell &amp; Rock (2018)
                </a>
                {" \u2014 "}What Can Machines Learn. Stanford/MIT SML rubric across 18,156 O*NET tasks.
              </p>
              <p>
                <a
                  href="https://www.onetonline.org/link/summary/11-2021.00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2"
                >
                  O*NET (ongoing)
                </a>
                {" \u2014 "}Marketing Managers occupation profile. Communication/interpersonal activities dominate daily work.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800 pt-6 text-center">
          <p className="text-[10px] font-mono text-zinc-700 tracking-wide">
            Data: {data.sources?.join(" \u00b7 ") || "Mock data"} &middot; Raw benchmark accuracy
          </p>
          <p className="text-[10px] font-mono text-zinc-700 tracking-wide mt-1">
            Scores = % of test items answered/completed correctly
          </p>
        </footer>
      </main>
    </div>
  );
}
