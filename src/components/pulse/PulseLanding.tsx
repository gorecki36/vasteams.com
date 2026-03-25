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
            Is AI making me sharper or just faster?
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
              Built on{" "}
              <a
                href="https://arxiv.org/pdf/2601.20245"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-zinc-700 transition-colors"
              >
                published research
              </a>
              : cognitive offloading, epistemic
              curiosity, meaningful work, self-efficacy, role breadth, and work
              addiction. 7 questions.
            </p>
          </div>

          {/* Three paths */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Baseline */}
            <Link
              href="/pulse/baseline"
              className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-400 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">1.</div>
              <h2 className="text-base font-bold text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Set your baseline
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                Take this once. How has AI changed your work so far?
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
              <h2 className="text-base font-bold text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                Weekly check-in
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                How did things shift compared to last week?
              </p>
              <span className="text-sm text-emerald-600 font-medium">
                Check in &rarr;
              </span>
            </Link>

            {/* Results */}
            <Link
              href="/pulse/results"
              className="bg-white border border-zinc-200 rounded-lg p-6 hover:border-zinc-400 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">3.</div>
              <h2 className="text-base font-bold text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                See your results
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                Your baseline, trends, and how you compare to others.
              </p>
              <span className="text-sm text-emerald-600 font-medium">
                View &rarr;
              </span>
            </Link>
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
