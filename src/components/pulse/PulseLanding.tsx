"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import PulseHeroLandscape from "./PulseHeroLandscape";

export default function PulseLanding() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setAuthenticated(true);
      return;
    }

    const supabase = createBrowserSupabaseClient();

    // Handle PKCE code in URL (redirected from magic link)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        window.history.replaceState(null, "", "/pulse");
        setAuthenticated(!error);
      });
      return;
    }

    // Handle hash fragment tokens
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
          window.history.replaceState(null, "", "/pulse");
          setAuthenticated(!error);
        });
        return;
      }
    }

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoginStatus("loading");
    setErrorMsg("");
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/pulse`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setLoginStatus("idle");
    } else {
      setLoginStatus("sent");
    }
  }

  if (authenticated === null) {
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

          {authenticated ? (
            /* Authenticated — show 3 options */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          ) : (
            /* Not authenticated — show email form */
            <>
              {loginStatus === "sent" ? (
                <div className="border border-emerald-300 bg-emerald-50 rounded-lg p-6">
                  <p className="text-base text-emerald-700 mb-2">Check your email.</p>
                  <p className="text-sm text-zinc-600">
                    We sent a magic link to{" "}
                    <strong className="text-zinc-900">{email}</strong>. Click it to
                    get started.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="text-sm text-zinc-600 block mb-2">
                      Enter your email to get started
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3.5 text-base text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                  {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                  <button
                    type="submit"
                    disabled={loginStatus === "loading"}
                    className="w-full bg-zinc-900 rounded-lg px-6 py-3.5 text-base text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {loginStatus === "loading" ? "Sending..." : "Get started"}
                  </button>
                  <p className="text-xs text-zinc-500 text-center">
                    No password. We send a magic link each time.
                  </p>
                </form>
              )}
            </>
          )}
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
