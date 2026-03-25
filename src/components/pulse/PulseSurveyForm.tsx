"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PULSE_QUESTIONS, BASELINE_SCALE, WEEKLY_SCALE } from "@/lib/pulse-questions";
import { getCurrentWeekMonday } from "@/lib/pulse-scoring";

type Answers = Record<string, number>;

interface Props {
  mode: "baseline" | "weekly";
}

export default function PulseSurveyForm({ mode }: Props) {
  const router = useRouter();
  const isBaseline = mode === "baseline";
  const scale = isBaseline ? BASELINE_SCALE : WEEKLY_SCALE;

  const [answers, setAnswers] = useState<Answers>(() =>
    Object.fromEntries(PULSE_QUESTIONS.map((q) => [q.id, 4]))
  );
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pulse_email");
    if (!saved) {
      router.push("/pulse");
      return;
    }
    setEmail(saved);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    const body = {
      email,
      week_of: getCurrentWeekMonday(),
      type: mode,
      q1_substitution: answers.q1,
      q2_expansion: answers.q2,
      q3_meaning: answers.q3,
      q4_efficacy: answers.q4,
      q5_role_breadth: answers.q5,
      q6_addiction: answers.q6,
      q7_progress: answers.q7,
    };

    const res = await fetch("/api/pulse/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 409) {
      router.push(isBaseline ? "/pulse/results" : "/pulse/trends");
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setErrorMsg(data.error || "Something went wrong.");
      return;
    }

    router.push(isBaseline ? "/pulse/results" : "/pulse/trends");
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <p className="text-sm text-zinc-500 font-mono">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f5] text-zinc-800 flex flex-col font-mono">
      <div className="px-6 md:px-10 pt-10 pb-4">
        <Link
          href="/pulse"
          className="text-sm text-zinc-500 hover:text-emerald-600 tracking-wide transition-colors"
        >
          &larr; Back
        </Link>
      </div>

      <header className="px-6 md:px-10 pb-8">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-wide mb-2">
          {isBaseline ? "Your Baseline" : "Weekly Check-in"}
        </h1>
        <p className="text-base text-zinc-500">
          {isBaseline
            ? "How has AI changed your work so far? This establishes your starting point."
            : `Week of ${getCurrentWeekMonday()} \u2014 How did things shift?`}
        </p>
      </header>

      <main className="flex-1 px-6 md:px-10 pb-16 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white border border-zinc-200 rounded-lg px-6 py-4 mb-2">
            <p className="text-sm text-zinc-600">
              {isBaseline
                ? "Rate each statement compared to before you started using AI. 4 = about the same."
                : "Rate each statement compared to last week. 4 = no change."}
            </p>
          </div>

          {PULSE_QUESTIONS.map((q, i) => (
            <div
              key={q.id}
              className="bg-white border border-zinc-200 rounded-lg p-6"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-sm text-emerald-600 font-bold shrink-0">
                  {i + 1}.
                </span>
                <p className="text-base text-zinc-800 leading-relaxed">
                  {isBaseline ? q.baselineText : q.weeklyText}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-zinc-400">{scale[1]}</span>
                  <span className="text-xs text-zinc-400">{scale[4]}</span>
                  <span className="text-xs text-zinc-400">{scale[7]}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={answers[q.id]}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: Number(e.target.value),
                    }))
                  }
                  className="slider-light w-full"
                />
                <div className="text-center mt-1">
                  <span
                    className={`text-sm font-medium ${
                      answers[q.id] === 4
                        ? "text-zinc-400"
                        : answers[q.id] > 4
                          ? "text-emerald-600"
                          : "text-amber-600"
                    }`}
                  >
                    {scale[answers[q.id]]}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {status === "error" && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-zinc-900 rounded-lg px-6 py-4 text-base text-white font-medium tracking-wide hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {status === "loading"
              ? "Submitting..."
              : isBaseline
                ? "Set my baseline"
                : "Submit this week"}
          </button>
        </form>
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
