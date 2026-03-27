"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { computeScores, rowToRaw } from "@/lib/pulse-scoring";
import PulseBaselineChart from "./PulseBaselineChart";
import PulseTrendCards from "./PulseTrendCards";
import PulseQuadrantMap from "./PulseQuadrantMap";
import PulseLandscape from "./PulseLandscape";

interface Props {
  mode: "personal" | "admin";
  view?: "baseline" | "trends";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseRow = Record<string, any>;

interface AggregateRow {
  week_of: string;
  count: number;
  avg_q1: number;
  avg_q2: number;
  avg_q3: number;
  avg_q4: number;
  avg_q5: number;
  avg_q6: number;
  avg_q7: number;
}

export default function PulseDashboard({ mode, view }: Props) {
  const router = useRouter();
  const [baselineResponse, setBaselineResponse] = useState<ResponseRow | null>(null);
  const [weeklyResponses, setWeeklyResponses] = useState<ResponseRow[]>([]);
  const [aggregates, setAggregates] = useState<AggregateRow[]>([]);
  const [individuals, setIndividuals] = useState<{ q1: number; q2: number; q3: number; q4: number; q5: number; q6: number; q7: number; isCurrentUser: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Auto-detect which view to show
  const activeView = view ?? (weeklyResponses.length > 0 ? "trends" : "baseline");

  useEffect(() => {
    async function load() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const baselineStr = sessionStorage.getItem("pulse_demo_baseline");
        const history = JSON.parse(sessionStorage.getItem("pulse_demo_history") || "[]");
        const now = new Date();

        const parsedBaseline = baselineStr ? JSON.parse(baselineStr) : null;
        if (parsedBaseline) {
          const totalEntries = history.length + 1;
          const d = new Date(now);
          d.setDate(d.getDate() - (totalEntries - 1) * 7);
          const day = d.getUTCDay();
          const diff = day === 0 ? -6 : 1 - day;
          const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff));
          setBaselineResponse({ ...parsedBaseline, week_of: monday.toISOString().slice(0, 10) });
        }

        if (history.length > 0) {
          const weeklyRows = history.map((entry: ResponseRow, idx: number) => {
            const weeksAgo = history.length - 1 - idx;
            const d = new Date(now);
            d.setDate(d.getDate() - weeksAgo * 7);
            const day = d.getUTCDay();
            const diff = day === 0 ? -6 : 1 - day;
            const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff));
            return { ...entry, week_of: monday.toISOString().slice(0, 10) };
          });
          setWeeklyResponses(weeklyRows);
        }

        const allCount = (parsedBaseline ? 1 : 0) + history.length;
        if (allCount > 0) {
          const seed = 42;
          const mockWeeks = Array.from({ length: allCount }, (_, idx) => {
            const weeksAgo = allCount - 1 - idx;
            const d = new Date(now);
            d.setDate(d.getDate() - weeksAgo * 7);
            const day = d.getUTCDay();
            const diff = day === 0 ? -6 : 1 - day;
            const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff));
            const t = idx / Math.max(allCount - 1, 1);
            const jitter = (i: number) => Math.sin(seed + i * 7 + idx * 3) * 0.3;
            return {
              week_of: monday.toISOString().slice(0, 10),
              count: 15 + idx * 4,
              avg_q1: 3.4 + t * 0.6 + jitter(1),
              avg_q2: 3.8 + t * 0.8 + jitter(2),
              avg_q3: 3.5 + t * 0.5 + jitter(3),
              avg_q4: 4.8 + t * 0.3 + jitter(4),
              avg_q5: 3.6 + t * 0.6 + jitter(5),
              avg_q6: 3.8 - t * 0.3 + jitter(6),
              avg_q7: 3.9 + t * 0.5 + jitter(7),
            };
          });
          setAggregates(mockWeeks);
        }

        setLoading(false);
        return;
      }

      const email = localStorage.getItem("pulse_email");
      if (!email) { router.push("/pulse"); return; }

      const [resultsRes, aggRes] = await Promise.all([
        fetch(`/api/pulse/results?email=${encodeURIComponent(email)}`),
        fetch(`/api/pulse/aggregate?email=${encodeURIComponent(email)}`),
      ]);

      if (!resultsRes.ok) {
        setError("Failed to load data"); setLoading(false); return;
      }

      const resultsData = await resultsRes.json();
      const allResponses = resultsData.responses ?? [];
      setBaselineResponse(allResponses.find((r: ResponseRow) => r.type === "baseline") ?? null);
      setWeeklyResponses(allResponses.filter((r: ResponseRow) => r.type === "weekly"));

      if (aggRes.ok) {
        const aggData = await aggRes.json();
        setAggregates(aggData.aggregates ?? []);
        setIndividuals(aggData.individuals ?? []);
      }

      setLoading(false);
    }

    load();
  }, [mode, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <p className="text-sm text-zinc-500 font-mono">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-base text-red-600 mb-4">{error}</p>
          <Link href="/pulse" className="text-sm text-zinc-500 hover:text-emerald-600">
            &larr; Back
          </Link>
        </div>
      </div>
    );
  }

  const baselineScores = baselineResponse ? computeScores(rowToRaw(baselineResponse)) : null;
  const latestWeekly = weeklyResponses.length > 0 ? weeklyResponses[weeklyResponses.length - 1] : null;
  const latestScores = latestWeekly ? computeScores(rowToRaw(latestWeekly)) : baselineScores;
  const hasData = baselineResponse !== null || weeklyResponses.length > 0;

  // Individual dots for quadrant maps (gray for others, highlighted for you)
  const otherIndividuals = individuals.filter((i) => !i.isCurrentUser);
  const populationPointsSubExp = otherIndividuals.map((i) => {
    const s = computeScores({ q1: i.q1, q2: i.q2, q3: i.q3, q4: i.q4, q5: i.q5, q6: i.q6, q7: i.q7 });
    return { x: s.substitution, y: s.expansion };
  });
  const populationPointsAgencyMeaning = otherIndividuals.map((i) => {
    const s = computeScores({ q1: i.q1, q2: i.q2, q3: i.q3, q4: i.q4, q5: i.q5, q6: i.q6, q7: i.q7 });
    return { x: s.agency, y: s.meaning };
  });

  return (
    <div className="min-h-screen bg-[#faf9f5] text-zinc-800 flex flex-col font-mono">
      <div className="px-6 md:px-10 pt-10 pb-4">
        <Link href="/pulse" className="text-sm text-zinc-500 hover:text-emerald-600 tracking-wide transition-colors">
          &larr; Back
        </Link>
      </div>

      <header className="px-6 md:px-10 pb-6">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-wide mb-2">
          {mode === "admin" ? "Admin Dashboard" : "Your Results"}
        </h1>

        {/* Tab navigation */}
        {hasData && mode === "personal" && (
          <div className="flex gap-2 mt-4">
            <Link
              href="/pulse/results"
              className={`px-5 py-2.5 text-sm rounded-lg border transition-colors ${
                activeView === "baseline"
                  ? "bg-zinc-900 border-zinc-900 text-white font-medium"
                  : "bg-white border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-800"
              }`}
            >
              Baseline
            </Link>
            <Link
              href="/pulse/trends"
              className={`px-5 py-2.5 text-sm rounded-lg border transition-colors ${
                activeView === "trends"
                  ? "bg-zinc-900 border-zinc-900 text-white font-medium"
                  : "bg-white border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-800"
              }`}
            >
              Weekly Trends
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 px-6 md:px-10 pb-16 max-w-5xl space-y-8">
        {!hasData ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
            <p className="text-base text-zinc-500 mb-4">
              No data yet. Start with your baseline.
            </p>
            <Link href="/pulse/baseline" className="text-base text-emerald-600 hover:text-emerald-700">
              Set your baseline &rarr;
            </Link>
          </div>
        ) : activeView === "baseline" ? (
          <>
            {/* Landscape visualization */}
            {latestScores && <PulseLandscape scores={latestScores} />}

            {/* Baseline view */}
            {baselineScores ? (
              <PulseBaselineChart userScores={baselineScores} />
            ) : (
              <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
                <p className="text-base text-zinc-500 mb-4">
                  You haven&apos;t set a baseline yet.
                </p>
                <Link href="/pulse/baseline" className="text-base text-emerald-600 hover:text-emerald-700">
                  Set your baseline &rarr;
                </Link>
              </div>
            )}

            {/* Fragile Augmentation */}
            {baselineScores?.fragileAugmentation && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-sm text-red-700 font-medium tracking-wide uppercase mb-2">
                  Fragile Augmentation Detected
                </p>
                <p className="text-base text-zinc-700 leading-relaxed">
                  AI is helping you function (high substitution) but not helping
                  you grow (low agency). You&apos;re becoming dependent without
                  building capacity.
                </p>
              </div>
            )}

            <div className="text-center pt-4">
              <Link
                href="/pulse/weekly"
                className="bg-zinc-900 rounded-lg px-8 py-3 text-base text-white font-medium hover:bg-zinc-800 transition-colors inline-block"
              >
                Start weekly check-ins &rarr;
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Landscape visualization */}
            {latestScores && <PulseLandscape scores={latestScores} />}

            {/* Trends view */}
            <PulseTrendCards
              baselineResponse={baselineResponse}
              weeklyResponses={weeklyResponses}
              aggregates={aggregates}
            />

            {/* Fragile Augmentation */}
            {latestScores?.fragileAugmentation && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-sm text-red-700 font-medium tracking-wide uppercase mb-2">
                  Fragile Augmentation Detected
                </p>
                <p className="text-base text-zinc-700 leading-relaxed">
                  AI is helping you function (high substitution) but not helping
                  you grow (low agency). You&apos;re becoming dependent without
                  building capacity.
                </p>
              </div>
            )}

            {/* Quadrant maps */}
            {latestScores && (
              <div>
                <h2 className="text-lg font-bold text-zinc-900 mb-4">Where you are</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PulseQuadrantMap
                    title="Substitution vs Expansion"
                    xLabel="Substitution"
                    yLabel="Expansion"
                    userPoint={{ x: latestScores.substitution, y: latestScores.expansion }}
                    populationPoints={populationPointsSubExp}
                    quadrantLabels={{
                      topLeft: "Amplified",
                      topRight: "Dependent Explorer",
                      bottomLeft: "Stable Operator",
                      bottomRight: "At Risk",
                    }}
                  />
                  <PulseQuadrantMap
                    title="Agency vs Meaning"
                    xLabel="Agency"
                    yLabel="Meaning"
                    userPoint={{ x: latestScores.agency, y: latestScores.meaning }}
                    populationPoints={populationPointsAgencyMeaning}
                    quadrantLabels={{
                      topLeft: "Purposeful but constrained",
                      topRight: "Empowered & meaningful",
                      bottomLeft: "Disengaged",
                      bottomRight: "Efficient but empty",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <Link
                href="/pulse/weekly"
                className="bg-zinc-900 rounded-lg px-8 py-3 text-base text-white font-medium hover:bg-zinc-800 transition-colors inline-block"
              >
                Weekly check-in &rarr;
              </Link>
            </div>
          </>
        )}
      </main>

      <footer className="px-6 md:px-10 py-6 border-t border-zinc-200">
        <p className="text-xs text-zinc-400">
          built by{" "}
          <Link href="/" className="hover:text-zinc-600 transition-colors">
            vas
          </Link>
        </p>
      </footer>
    </div>
  );
}
