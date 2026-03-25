"use client";

interface BiasAuditProps {
  sunkCostLabel: string;
  onComplete: (flags: {
    survivorshipRisk: boolean;
    sunkCostInfluence: boolean;
    baseRateIgnored: boolean;
  }) => void;
}

import { useState } from "react";

const QUESTIONS = [
  {
    key: "survivorshipRisk" as const,
    question:
      "Are you basing your probability on success stories you've seen?",
    subtext: "Survivorship bias check — failures don't get interviews.",
  },
  {
    key: "sunkCostInfluence" as const,
    question: "Would you still choose this if you hadn't already invested",
    dynamic: true,
    subtext: "Sunk cost check — past investment shouldn't drive future choices.",
  },
  {
    key: "baseRateIgnored" as const,
    question:
      "Did you set your probability before seeing the base rate?",
    subtext: "Base rate neglect — most people anchor on anecdotes, not data.",
  },
];

export default function BiasAudit({ sunkCostLabel, onComplete }: BiasAuditProps) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const allAnswered = QUESTIONS.every((q) => q.key in answers);

  const toggle = (key: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    onComplete({
      survivorshipRisk: answers.survivorshipRisk ?? false,
      sunkCostInfluence: answers.sunkCostInfluence ?? false,
      baseRateIgnored: answers.baseRateIgnored ?? false,
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-sm font-mono uppercase tracking-widest text-amber-400 mb-1">
          Bias Audit
        </h2>
        <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
          Quick check before results. Honest answers improve accuracy.
        </p>
      </div>

      <div className="space-y-4">
        {QUESTIONS.map((q) => {
          const questionText = q.dynamic
            ? `${q.question} ${sunkCostLabel}?`
            : q.question;
          const answered = q.key in answers;
          const isYes = answers[q.key];

          return (
            <div
              key={q.key}
              className={`border p-4 transition-colors ${
                answered && isYes
                  ? "border-amber-500/30 bg-amber-500/5"
                  : answered
                  ? "border-zinc-800"
                  : "border-zinc-800"
              }`}
            >
              <p className="text-sm font-mono text-zinc-300 mb-1">
                {questionText}
              </p>
              <p className="text-[10px] font-mono text-zinc-600 mb-3">
                {q.subtext}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(q.key, true)}
                  className={`px-4 py-1.5 text-xs font-mono border transition-colors ${
                    answered && isYes
                      ? "border-amber-500/50 text-amber-400 bg-amber-500/10"
                      : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => toggle(q.key, false)}
                  className={`px-4 py-1.5 text-xs font-mono border transition-colors ${
                    answered && !isYes
                      ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                      : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={!allAnswered}
        className={`w-full py-3 text-sm font-mono uppercase tracking-widest border transition-all ${
          allAnswered
            ? "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
            : "border-zinc-800 text-zinc-600 cursor-not-allowed"
        }`}
      >
        Show Results
      </button>
    </section>
  );
}
