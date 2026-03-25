"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { PULSE_QUESTIONS, BASELINE_SCALE, WEEKLY_SCALE } from "@/lib/pulse-questions";
import { getCurrentWeekMonday } from "@/lib/pulse-scoring";
import PulseHeroLandscape from "./PulseHeroLandscape";

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
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "sent">("idle");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setAuthenticated(true);
      return;
    }
    const supabase = createBrowserSupabaseClient();

    // Handle hash tokens first (magic link redirect lands here)
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ error }) => {
          if (!error) {
            window.history.replaceState(null, "", window.location.pathname);
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
          }
        });
        return; // Don't check getUser — setSession will handle it
      }
    }

    // No hash — check existing session
    supabase.auth.getUser().then(({ data }) => {
      setAuthenticated(!!data.user);
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoginStatus("loading");
    // Store where to go after auth
    sessionStorage.setItem("pulse_redirect", `/pulse/${mode}`);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/pulse/baseline`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setLoginStatus("idle");
    } else {
      setLoginStatus("sent");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const body = {
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

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const key = isBaseline ? "pulse_demo_baseline" : "pulse_demo_history";
      if (isBaseline) {
        sessionStorage.setItem(key, JSON.stringify(body));
      } else {
        const existing = JSON.parse(sessionStorage.getItem(key) || "[]");
        existing.push(body);
        sessionStorage.setItem(key, JSON.stringify(existing));
      }
      router.push(isBaseline ? "/pulse/results" : "/pulse/trends");
      return;
    }

    // Submit directly via Supabase client (no API middleman)
    const supabase = createBrowserSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setStatus("error");
      setErrorMsg("Not authenticated. Please sign in again.");
      return;
    }

    const { error: insertError } = await supabase.from("responses").insert({
      user_id: user.id,
      ...body,
    });

    if (insertError) {
      // Unique constraint = already submitted this week
      if (insertError.code === "23505") {
        router.push(isBaseline ? "/pulse/results" : "/pulse/trends");
        return;
      }
      setStatus("error");
      setErrorMsg(insertError.message || "Something went wrong.");
      return;
    }

    router.push(isBaseline ? "/pulse/results" : "/pulse/trends");
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <p className="text-sm text-zinc-500 font-mono">Loading...</p>
      </div>
    );
  }

  if (authenticated === false) {
    return (
      <div className="min-h-screen bg-[#faf9f5] text-zinc-800 flex flex-col font-mono">
        <div className="px-6 md:px-10 pt-10 pb-4">
          <Link href="/pulse" className="text-sm text-zinc-500 hover:text-emerald-600 tracking-wide transition-colors">
            &larr; Back
          </Link>
        </div>
        <main className="flex-1 flex items-center justify-center px-6 md:px-10">
          <div className="max-w-md w-full">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
              The Pulse
            </h1>
            <p className="text-base text-zinc-500 mb-6">
              Enter your email to get started. No password needed.
            </p>
            <div className="mb-6">
              <PulseHeroLandscape height={180} />
            </div>
            {loginStatus === "sent" ? (
              <div className="border border-emerald-300 bg-emerald-50 rounded-lg p-6">
                <p className="text-base text-emerald-700 mb-2">Check your email.</p>
                <p className="text-sm text-zinc-600">
                  We sent a magic link to <strong className="text-zinc-900">{email}</strong>.
                  Click it to continue.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3.5 text-base text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none transition-colors"
                />
                {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                <button
                  type="submit"
                  disabled={loginStatus === "loading"}
                  className="w-full bg-zinc-900 rounded-lg px-6 py-3.5 text-base text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {loginStatus === "loading" ? "Sending..." : "Send magic link"}
                </button>
                <p className="text-xs text-zinc-500 text-center">
                  We&apos;ll email you a link. No password, no account to remember.
                </p>
              </form>
            )}
          </div>
        </main>
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
                {/* Scale labels above slider */}
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-zinc-400">{scale[1]}</span>
                  <span className="text-xs text-zinc-400">{scale[4]}</span>
                  <span className="text-xs text-zinc-400">{scale[7]}</span>
                </div>
                {/* Slider */}
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
                {/* Current value */}
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
