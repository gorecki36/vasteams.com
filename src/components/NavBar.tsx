"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  /** URL search string including '?' — passed through to nav links */
  searchParams?: string;
}

const STEPS = [
  { href: "/matrix-moment/configure", label: "Configure", step: 1 },
  { href: "/matrix-moment/story", label: "Story", step: 2 },
] as const;

export default function NavBar({ searchParams = "" }: Props) {
  const pathname = usePathname();

  const currentStep = pathname === "/matrix-moment/story" ? 2 : 1;

  return (
    <header className="border-b border-zinc-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            &larr;
          </Link>
          <Link href="/matrix-moment" className="group">
            <h1 className="text-lg font-mono tracking-widest text-gold uppercase group-hover:text-gold/80 transition-colors">
              The Matrix Moment
            </h1>
            <p className="text-xs text-zinc-600 font-mono mt-1">
              How close are we?
            </p>
          </Link>
        </div>

        {/* Step indicator */}
        <nav className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            const isActive = step.step === currentStep;
            const href = step.href + searchParams;

            return (
              <div key={step.href} className="flex items-center">
                {i > 0 && (
                  <span className="text-zinc-700 mx-2 font-mono text-xs">
                    &rarr;
                  </span>
                )}
                <Link
                  href={href}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest transition-colors ${
                    isActive
                      ? "text-gold border border-gold/40 bg-gold/10"
                      : "text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  {step.step}. {step.label}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
