"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import CapabilityRadar from "./CapabilityRadar";
import CapabilityBreakdown from "./CapabilityBreakdown";
import ReadinessTimeline from "./ReadinessTimeline";
import RoleSelector from "./RoleSelector";
import { ROLES, RELEVANCE, computeLayerReadiness, computeReadiness } from "@/lib/roles";
import type { CapabilityWeight } from "@/lib/roles";
import type { BenchmarkData, CapabilityScore } from "@/lib/ai-benchmarks";

const WEIGHT_LABELS: Record<CapabilityWeight, { label: string; pct: string; color: string }> = {
  high: { label: "High", pct: `${Math.round(RELEVANCE.high * 100)}%`, color: "text-emerald-400" },
  medium: { label: "Med", pct: `${Math.round(RELEVANCE.medium * 100)}%`, color: "text-zinc-400" },
  low: { label: "Low", pct: `${Math.round(RELEVANCE.low * 100)}%`, color: "text-zinc-600" },
};

const WEIGHT_ORDER: Record<CapabilityWeight, number> = { high: 0, medium: 1, low: 2 };

function RoleWeightPanel({
  role,
  allScores,
}: {
  role: import("@/lib/roles").RoleDefinition;
  allScores: CapabilityScore[];
}) {
  // Sort capabilities by weight
  const sorted = [...allScores].sort((a, b) => {
    const wa = role.weights[a.id] as CapabilityWeight;
    const wb = role.weights[b.id] as CapabilityWeight;
    return (WEIGHT_ORDER[wa] ?? 2) - (WEIGHT_ORDER[wb] ?? 2);
  });

  return (
    <div className="space-y-1">
      <h3 className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
        {role.name}
      </h3>
      {sorted.map((cap) => {
        const w = role.weights[cap.id] as CapabilityWeight;
        const info = WEIGHT_LABELS[w];
        const isAgentic = cap.layer === "agentic";
        return (
          <div key={cap.id} className="flex items-center gap-2 py-1">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${isAgentic ? "bg-amber-500" : "bg-emerald-500"}`}
            />
            <span className={`text-[11px] font-mono flex-1 truncate ${info.color}`}>
              {cap.shortName}
            </span>
            <span className={`text-[10px] font-mono ${info.color}`}>
              {info.label}
            </span>
            <span className="text-[10px] font-mono text-zinc-700 w-7 text-right">
              {info.pct}
            </span>
          </div>
        );
      })}
      <p className="text-[9px] font-mono text-zinc-700 mt-3 leading-relaxed">
        Weights determine how much each skill counts toward the readiness scores. Radar shows raw capability.
      </p>
    </div>
  );
}

export default function AiClockPage() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRoleId, setActiveRoleId] = useState<string | null>("cmo");

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

  const activeRole = useMemo(
    () => ROLES.find((r) => r.id === activeRoleId) ?? null,
    [activeRoleId]
  );

  const allScores = useMemo(() => {
    if (!data) return [];
    return [...data.prompt, ...data.agentic];
  }, [data]);

  const promptReadiness = useMemo(() => {
    if (!data || !activeRole) return null;
    return computeLayerReadiness(activeRole, allScores, "prompt");
  }, [data, activeRole, allScores]);

  const agenticReadiness = useMemo(() => {
    if (!data || !activeRole) return null;
    return computeLayerReadiness(activeRole, allScores, "agentic");
  }, [data, activeRole, allScores]);

  const totalReadiness = useMemo(() => {
    if (!data || !activeRole) return null;
    return computeReadiness(activeRole, allScores);
  }, [data, activeRole, allScores]);

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
      {/* Header */}
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
        <div className="text-center mb-8">
          <h1 className="text-lg font-mono tracking-widest text-emerald-400 uppercase">
            The AI Capability Clock
          </h1>
          <p className="text-sm font-mono text-zinc-500 mt-2">
            How ready is AI for the technical side of your marketing role?
          </p>
          <p className="text-[10px] font-mono text-zinc-600 mt-2 max-w-xl mx-auto leading-relaxed">
            Research shows ~25% of marketing skills are technical and AI-automatable.
            The other ~75% — leadership, relationships, creative judgment, strategic vision — remain
            distinctly human. This clock measures only the technical 25%.
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-10">
          <RoleSelector activeRole={activeRoleId} onSelect={setActiveRoleId} />
        </div>

        {/* Radar + Role Weight Panel — side by side */}
        <div className="border border-zinc-800 bg-zinc-900/30 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left: Role weight panel (1/3) */}
            <div className="md:w-1/3 p-3">
              {activeRole ? (
                <RoleWeightPanel role={activeRole} allScores={allScores} />
              ) : (
                <p className="text-[11px] font-mono text-zinc-600">
                  Select a role to see skill relevance weights.
                </p>
              )}
            </div>
            {/* Right: Radar chart (2/3) */}
            <div className="md:w-2/3">
              <CapabilityRadar
                prompt={data.prompt}
                agentic={data.agentic}
                role={activeRole}
              />
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex items-center justify-center gap-8 mb-10 text-center">
          {totalReadiness != null && (
            <div>
              <div className="text-3xl font-mono font-bold text-zinc-100">
                {totalReadiness}%
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                Total
              </div>
            </div>
          )}
          {promptReadiness != null && (
            <div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {promptReadiness}%
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                Prompt
              </div>
            </div>
          )}
          {agenticReadiness != null && (
            <div>
              <div className="text-xl font-mono font-bold text-amber-400">
                {agenticReadiness}%
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                Agentic
              </div>
            </div>
          )}
          <div>
            <div className="text-sm font-mono text-zinc-300">
              {data.bestOverall.name}
            </div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
              Best model
            </div>
          </div>
          {updatedAgo && (
            <div>
              <div className="text-sm font-mono text-zinc-300">
                {updatedAgo}
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                Updated
              </div>
            </div>
          )}
        </div>

        {/* Readiness Timeline */}
        {data.history && data.history.length > 0 && (
          <ReadinessTimeline history={data.history} role={activeRole} />
        )}

        {/* Capability Breakdown — Two Sections */}
        <div className="mb-10">
          <CapabilityBreakdown
            prompt={data.prompt}
            agentic={data.agentic}
            role={activeRole}
          />
        </div>

        {/* How Scores Work */}
        <div className="border border-zinc-800 bg-zinc-900/20 p-5 mb-10">
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 font-mono">
            How scores work
          </h3>
          <div className="space-y-2 text-[11px] font-mono text-zinc-500 leading-relaxed">
            <p>
              Each capability maps to exactly one AI benchmark. The score shown is the
              <span className="text-zinc-300"> best raw accuracy across all frontier models</span> —
              no normalization, no human baselines.
            </p>
            <p>
              <span className="text-emerald-400/70">Prompt-level</span> = % of test questions answered correctly in a single turn.
              {" "}<span className="text-amber-400/70">Agentic</span> = % of multi-step tasks completed autonomously using tools.
            </p>
            <p>
              Readiness scores are weighted averages: <span className="text-emerald-400">High 90%</span>,{" "}
              <span className="text-zinc-400">Medium 50%</span>,{" "}
              <span className="text-zinc-600">Low 20%</span> relevance per role.
              The radar shows raw capability — the scores show what matters to your role.
            </p>
          </div>
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 mt-6 font-mono">
            Why only technical skills?
          </h3>
          <div className="space-y-2 text-[11px] font-mono text-zinc-500 leading-relaxed">
            <p>
              Marketing roles require a mix of technical, interpersonal, creative, and strategic skills.
              Research consistently shows that <span className="text-zinc-300">~20-25% is technical/AI-automatable</span>,
              while ~75-80% is human-centric — leadership, relationships, creative judgment, and strategic vision.
              White-collar occupations average <span className="text-zinc-300">40% task exposure</span> to
              generative AI, with non-routine cognitive tasks most affected.
            </p>
            <div className="mt-3 space-y-1.5 text-[10px] text-zinc-600">
              <p className="text-zinc-500 uppercase tracking-wider">Sources</p>
              <p>
                <a href="https://www.nber.org/papers/w31222" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
                  Eisfeldt, Schubert & Zhang (2023)
                </a>
                {" — "}Generative AI and Firm Values. NBER w31222. 40% white-collar exposure vs 9% blue-collar.
              </p>
              <p>
                <a href="https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
                  McKinsey Global Institute (2023)
                </a>
                {" — "}The Economic Potential of Generative AI. 60-70% of work activities automatable; $0.8-1.2T in marketing/sales.
              </p>
              <p>
                <a href="https://www.bcg.com/publications/2022/human-tech-equation-for-improving-marketing-roi" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
                  BCG (2022)
                </a>
                {" — "}The Human-Tech Equation. 10/20/70 framework: 30% tech, 70% human factors.
              </p>
              <p>
                <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
                  World Economic Forum (2025)
                </a>
                {" — "}Future of Jobs Report. 39% of key skills will change by 2030; analytical thinking #1.
              </p>
              <p>
                <a href="https://www.aeaweb.org/articles?id=10.1257/pandp.20181019" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
                  Brynjolfsson, Mitchell & Rock (2018)
                </a>
                {" — "}What Can Machines Learn. Stanford/MIT SML rubric across 18,156 O*NET tasks.
              </p>
              <p>
                <a href="https://www.onetonline.org/link/summary/11-2021.00" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
                  O*NET (ongoing)
                </a>
                {" — "}Marketing Managers occupation profile. Communication/interpersonal activities dominate daily work.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800 pt-6 text-center">
          <p className="text-[10px] font-mono text-zinc-700 tracking-wide">
            Data: {data.sources?.join(" · ") || "Mock data"} · Raw benchmark accuracy
          </p>
          <p className="text-[10px] font-mono text-zinc-700 tracking-wide mt-1">
            Scores = % of test items answered/completed correctly
          </p>
        </footer>
      </main>
    </div>
  );
}
