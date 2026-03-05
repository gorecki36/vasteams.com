"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import CapabilityRadar from "./CapabilityRadar";
import CapabilityBreakdown from "./CapabilityBreakdown";
import RoleSelector from "./RoleSelector";
import { ROLES, computeLayerReadiness } from "@/lib/roles";
import type { BenchmarkData } from "@/lib/ai-benchmarks";

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
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            &larr; back
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-mono tracking-widest text-emerald-400 uppercase">
            The AI Capability Clock
          </h1>
          <p className="text-sm font-mono text-zinc-500 mt-2">
            How ready is AI for your marketing role?
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-10">
          <RoleSelector activeRole={activeRoleId} onSelect={setActiveRoleId} />
        </div>

        {/* Radar */}
        <div className="border border-zinc-800 bg-zinc-900/30 p-4 mb-6">
          <CapabilityRadar
            prompt={data.prompt}
            agentic={data.agentic}
            role={activeRole}
          />
        </div>

        {/* Summary stats */}
        <div className="flex items-center justify-center gap-8 mb-10 text-center">
          {promptReadiness != null && (
            <div>
              <div className="text-2xl font-mono font-bold text-emerald-400">
                {promptReadiness}%
              </div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                Prompt
              </div>
            </div>
          )}
          {agenticReadiness != null && (
            <div>
              <div className="text-2xl font-mono font-bold text-amber-400">
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

        {/* Capability Breakdown — Two Sections */}
        <div className="mb-10">
          <CapabilityBreakdown
            prompt={data.prompt}
            agentic={data.agentic}
            role={activeRole}
          />
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
