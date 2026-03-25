"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ScenarioForm from "./ScenarioForm";
import BiasAudit from "./BiasAudit";
import EVComparison from "./EVComparison";
import BaseRateCheck from "./BaseRateCheck";
import SunkCostPanel from "./SunkCostPanel";
import BayesianUpdate from "./BayesianUpdate";
import SurvivorshipBias from "./SurvivorshipBias";
import KellyCriterion from "./KellyCriterion";
import DecisionScorecard from "./DecisionScorecard";
import { analyzeDecision } from "@/lib/decision-simulator";
import type { DecisionScenario } from "@/lib/decision-simulator";

type Phase = "input" | "audit" | "results";

export default function DecisionSimulatorPage() {
  const [scenario, setScenario] = useState<DecisionScenario | null>(null);
  const [phase, setPhase] = useState<Phase>("input");

  const analysis = useMemo(
    () => (scenario ? analyzeDecision(scenario) : null),
    [scenario]
  );

  const handleFormSubmit = (s: DecisionScenario) => {
    setScenario(s);
    setPhase("audit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBiasComplete = (flags: {
    survivorshipRisk: boolean;
    sunkCostInfluence: boolean;
    baseRateIgnored: boolean;
  }) => {
    if (!scenario) return;
    setScenario({ ...scenario, biasFlags: flags });
    setPhase("results");
  };

  const handleReset = () => {
    setScenario(null);
    setPhase("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Derive the user's highest best-case probability for base rate comparison
  const userEstimate = scenario
    ? Math.max(...scenario.options.map((o) => o.bestProbability))
    : 0;

  const sunkCostLabel = scenario
    ? `${scenario.sunkCost.toLocaleString()} ${scenario.sunkCostUnit}`
    : "";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/projects"
            className="text-[11px] font-mono text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            ← back
          </Link>
          {phase !== "input" && (
            <button
              onClick={handleReset}
              className="text-[11px] font-mono text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              New decision
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero - always visible */}
        <div className="text-center mb-16">
          <div className="text-5xl mb-4">⚖</div>
          <h1 className="text-xl sm:text-2xl font-mono text-zinc-200 mb-3">
            The Decision Simulator
          </h1>
          <p className="text-[11px] font-mono text-zinc-500 max-w-lg mx-auto leading-relaxed">
            6 mental models applied to your real decisions. Expected value,
            Bayesian updating, Kelly criterion, base rate analysis, sunk cost
            isolation, and survivorship bias.
          </p>
        </div>

        {/* Phase: Input */}
        {phase === "input" && <ScenarioForm onSubmit={handleFormSubmit} />}

        {/* Phase: Bias Audit */}
        {phase === "audit" && scenario && (
          <BiasAudit
            sunkCostLabel={sunkCostLabel}
            onComplete={handleBiasComplete}
          />
        )}

        {/* Phase: Results */}
        {phase === "results" && scenario && analysis && (
          <div className="space-y-20">
            {/* Decision name header */}
            <div className="border-b border-zinc-800 pb-4">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
                Analyzing
              </p>
              <h2 className="text-lg font-mono text-zinc-200">
                {scenario.name}
              </h2>
            </div>

            <EVComparison results={analysis.ev} unit={scenario.payoffUnit} />

            <BaseRateCheck
              baseRate={scenario.baseRate}
              userEstimate={userEstimate}
              flagged={scenario.biasFlags.baseRateIgnored}
            />

            <SunkCostPanel
              sunkCost={scenario.sunkCost}
              sunkCostUnit={scenario.sunkCostUnit}
              evResults={analysis.ev}
              unit={scenario.payoffUnit}
              flagged={scenario.biasFlags.sunkCostInfluence}
            />

            <BayesianUpdate
              result={analysis.bayesian}
              edge={scenario.edge}
            />

            <SurvivorshipBias
              baseRate={scenario.baseRate}
              survivorshipRatio={analysis.survivorshipRatio}
              flagged={scenario.biasFlags.survivorshipRisk}
            />

            <KellyCriterion
              result={analysis.kelly}
              posteriorProbability={analysis.bayesian.posterior}
            />

            <DecisionScorecard analysis={analysis} />

            {/* Reset button */}
            <div className="pt-8 border-t border-zinc-900">
              <button
                onClick={handleReset}
                className="w-full py-3 text-sm font-mono uppercase tracking-widest border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
              >
                Analyze Another Decision
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-[9px] font-mono text-zinc-700 leading-relaxed">
            Based on 6 mental models: Expected Value, Base Rate Analysis, Sunk
            Cost Fallacy, Bayesian Updating, Survivorship Bias, and Kelly
            Criterion. All computation runs locally in your browser — no data
            is sent or stored.
          </p>
          <p className="text-[9px] font-mono text-zinc-800 mt-2">
            Built by{" "}
            <Link
              href="/"
              className="text-zinc-600 hover:text-emerald-400 transition-colors"
            >
              Vas Bakopoulos
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
