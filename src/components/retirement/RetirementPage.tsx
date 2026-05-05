"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RetirementForm from "./RetirementForm";
import RunwayChart from "./RunwayChart";
import RetirementScorecard from "./RetirementScorecard";
import MonteCarloChart from "./MonteCarloChart";
import SensitivityTable from "./SensitivityTable";
import { analyzeRetirement, computeSensitivity, runMonteCarlo } from "@/lib/retirement";
import type { RetirementInputs } from "@/lib/retirement";

type Phase = "input" | "results";

export default function RetirementPage() {
  const [inputs, setInputs] = useState<RetirementInputs | null>(null);
  const [phase, setPhase] = useState<Phase>("input");

  const analysis = useMemo(
    () => (inputs ? analyzeRetirement(inputs) : null),
    [inputs]
  );

  const sensitivity = useMemo(
    () => (inputs ? computeSensitivity(inputs) : []),
    [inputs]
  );

  const monteCarlo = useMemo(
    () => (inputs ? runMonteCarlo(inputs) : null),
    [inputs]
  );

  const handleFormSubmit = (i: RetirementInputs) => {
    setInputs(i);
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setInputs(null);
    setPhase("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/projects"
            className="text-[11px] font-mono text-zinc-500 hover:text-gold transition-colors"
          >
            ← back
          </Link>
          {phase !== "input" && (
            <button
              onClick={handleReset}
              className="text-[11px] font-mono text-zinc-500 hover:text-gold transition-colors"
            >
              Start over
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="text-xl sm:text-2xl font-mono text-zinc-200 mb-3">
            Retirement Timing Optimizer
          </h1>
          <p className="text-[11px] font-mono text-zinc-500 max-w-lg mx-auto leading-relaxed">
            Two curves intersect: when your money runs out vs when you die.
            Optimize for quality of time without going broke.
          </p>
        </div>

        {/* Phase: Input */}
        {phase === "input" && <RetirementForm onSubmit={handleFormSubmit} />}

        {/* Phase: Results */}
        {phase === "results" && inputs && analysis && (
          <div className="space-y-20">
            <div className="border-b border-zinc-800 pb-4">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
                Retiring at
              </p>
              <h2 className="text-lg font-mono text-zinc-200">
                Age {inputs.retirementAge}
              </h2>
            </div>

            <RunwayChart analysis={analysis} retirementAge={inputs.retirementAge} />

            <RetirementScorecard analysis={analysis} retirementAge={inputs.retirementAge} />

            {monteCarlo && (
              <MonteCarloChart mc={monteCarlo} retirementAge={inputs.retirementAge} />
            )}

            <SensitivityTable rows={sensitivity} />

            {/* Reset button */}
            <div className="pt-8 border-t border-zinc-900">
              <button
                onClick={handleReset}
                className="w-full py-3 text-sm font-mono uppercase tracking-widest border border-zinc-800 text-zinc-500 hover:text-gold hover:border-gold/50 transition-all"
              >
                Try Different Inputs
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-[9px] font-mono text-zinc-700 leading-relaxed">
            Gompertz survival model with Bayesian hazard modifiers. Financial projection
            uses year-by-year compounding with inflation adjustment and life-stage cost
            modifiers. All computation runs locally — no data is sent or stored.
          </p>
          <p className="text-[9px] font-mono text-zinc-800 mt-2">
            Built by{" "}
            <Link
              href="/"
              className="text-zinc-600 hover:text-gold transition-colors"
            >
              Vas Bakopoulos
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
