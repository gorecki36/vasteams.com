"use client";

import Link from "next/link";
import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import PulseHeroLandscape from "./PulseHeroLandscape";

export default function PulseLanding() {
  // Handle magic link redirect — Supabase puts tokens in the hash fragment
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash.includes("access_token")) return;

    // Parse tokens from hash
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      const supabase = createBrowserSupabaseClient();
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (!error) {
          // Force a server round-trip so middleware can set cookies
          window.location.href = "/pulse/results";
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f5] text-zinc-800 flex flex-col font-mono">
      <div className="px-6 md:px-10 pt-10 pb-4">
        <Link
          href="/projects"
          className="text-sm text-zinc-500 hover:text-emerald-600 tracking-wide transition-colors"
        >
          &larr; Projects
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 md:px-10">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-wide mb-3">
            The Pulse
          </h1>
          <p className="text-lg text-zinc-500 mb-6">
            Is AI making you sharper or just faster?
          </p>

          {/* Hero landscape */}
          <div className="mb-8">
            <PulseHeroLandscape height={240} />
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-8">
            <p className="text-base text-zinc-700 leading-relaxed mb-4">
              A 45-second check-in that tracks how AI shapes your thinking,
              meaning, and growth at work. Not productivity. Not satisfaction.
              The deeper stuff.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Built on published research: cognitive offloading, epistemic
              curiosity, meaningful work, self-efficacy, role breadth, and work
              addiction. 7 questions.
            </p>
          </div>

          {/* Two paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Baseline */}
            <Link
              href="/pulse/baseline"
              className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-400 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">1.</div>
              <h2 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Set your baseline
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                Take this once. How has AI changed your work compared to before
                you started using it?
              </p>
              <span className="text-sm text-emerald-600 font-medium">
                Start &rarr;
              </span>
            </Link>

            {/* Weekly */}
            <Link
              href="/pulse/weekly"
              className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-400 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">2.</div>
              <h2 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Weekly check-in
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                Take this each week. How did things shift compared to last week?
                Track your trajectory over time.
              </p>
              <span className="text-sm text-emerald-600 font-medium">
                Check in &rarr;
              </span>
            </Link>
          </div>

          {/* What you learn */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6">
            <h2 className="text-sm text-emerald-600 font-medium tracking-wide uppercase mb-4">
              What you learn
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-emerald-600 shrink-0">1.</span>
                <span className="text-base text-zinc-700">
                  Whether AI is <strong className="text-zinc-900">substituting</strong> your thinking or <strong className="text-zinc-900">expanding</strong> it
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 shrink-0">2.</span>
                <span className="text-base text-zinc-700">
                  Your trajectory across 5 dimensions, week over week
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 shrink-0">3.</span>
                <span className="text-base text-zinc-700">
                  A <strong className="text-zinc-900">Fragile Augmentation</strong> flag if AI helps you function but not grow
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 shrink-0">4.</span>
                <span className="text-base text-zinc-700">
                  How you compare to everyone else taking this pulse
                </span>
              </div>
            </div>
          </div>
        </div>
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
