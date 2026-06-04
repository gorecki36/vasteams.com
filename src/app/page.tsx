"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/research", label: "Research" },
  { href: "/work", label: "Work" },
  { href: "https://marketingembeddings.com", label: "Newsletter", external: true },
  { href: "/projects", label: "Builds" },
  { href: "/about", label: "About" },
];

const navLinkClass =
  "font-mono text-sm uppercase tracking-[0.18em] text-white/55 hover:text-gold transition-colors";

function NavLink({
  href,
  label,
  external,
  className,
}: {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
}) {
  const cls = className ?? navLinkClass;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden bg-[#0A0A0A] text-white"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="px-5 md:px-10 pt-6 md:pt-8 flex items-start justify-between relative z-20">
        <div>
          <span
            className="text-2xl md:text-3xl font-bold tracking-[0.22em] leading-none text-[#E5E5E5]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            VAS<span className="text-gold">T</span>{" "}
            <span className="text-white/15">//</span>
          </span>
          <p
            className="text-[11px] md:text-xs tracking-[0.28em] uppercase mt-2 text-white/30"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Research, Build, Repeat.
          </p>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 pt-1.5">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-px transition-all duration-300"
            style={{
              background: "#888",
              transform: menuOpen ? "rotate(45deg) translateY(4px)" : "none",
            }}
          />
          <span
            className="block w-5 h-px transition-all duration-300"
            style={{
              background: "#888",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-px transition-all duration-300"
            style={{
              background: "#888",
              transform: menuOpen ? "rotate(-45deg) translateY(-4px)" : "none",
            }}
          />
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-[#0A0A0A]/95"
          onClick={() => setMenuOpen(false)}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              {...link}
              className="font-mono text-lg tracking-[0.18em] uppercase text-white/55 hover:text-gold transition-colors"
            />
          ))}
        </div>
      )}

      {/* Hero */}
      <main className="flex-1 flex items-center px-5 md:px-10 relative">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-0">
          {/* Left: type */}
          <div className="flex-1 md:pr-8 relative z-[2]">
            {/* Eyebrow with hairline rules */}
            <div className="flex items-center gap-5 mb-8">
              <div className="h-px w-8 bg-white/[0.07]" />
              <span
                className="font-mono uppercase tracking-[0.32em] text-[11px] text-white/30"
              >
                Vas Bakopoulos
              </span>
              <div className="h-px flex-1 max-w-16 bg-white/[0.07]" />
            </div>

            <h1
              style={{
                fontSize: "clamp(3.5rem, 10vw, 9rem)",
                lineHeight: 1.05,
                fontWeight: 200,
                color: "#E5E5E5",
                letterSpacing: "-0.03em",
              }}
            >
              Questions
              <br />
              is all
              <br />
              we&apos;ve{" "}
              <span style={{ fontWeight: 500, color: "#D4A017" }}>got</span>
            </h1>

            <p
              className="mt-8 md:mt-10 font-light text-white/55"
              style={{
                fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)",
                lineHeight: 1.65,
                maxWidth: "32ch",
              }}
            >
              When answers are free, questions are the only advantage left.
            </p>
          </div>

          {/* Right: black omega with gold halo. Halos brighten on hover. */}
          <div className="group w-full md:w-auto flex-shrink-0 relative flex items-center justify-center md:justify-end cursor-default">
            {/* Outer halo: wide, soft gold bloom */}
            <div
              className="absolute blur-[120px] opacity-25 group-hover:opacity-40 transition-opacity duration-700 motion-reduce:transition-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, #D4A017 0%, #8B6914 40%, transparent 70%)",
                width: "130%",
                height: "130%",
                top: "-15%",
                left: "-15%",
              }}
            />
            {/* Mid halo: concentrated around the form */}
            <div
              className="absolute blur-[70px] opacity-35 group-hover:opacity-50 transition-opacity duration-700 motion-reduce:transition-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, #FDE68A 0%, #D4A017 30%, transparent 65%)",
                width: "90%",
                height: "90%",
                top: "5%",
                left: "5%",
              }}
            />
            {/* Under-glow: stronger at the bottom */}
            <div
              className="absolute blur-[80px] opacity-40 group-hover:opacity-[0.55] transition-opacity duration-700 motion-reduce:transition-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, #FDE68A 0%, #D4A017 35%, transparent 65%)",
                width: "70%",
                height: "50%",
                bottom: "-10%",
                left: "15%",
              }}
            />
            {/* Inner cavity glow: hot white-gold core */}
            <div
              className="absolute blur-[35px] opacity-45 group-hover:opacity-[0.65] transition-opacity duration-700 motion-reduce:transition-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, #FFFFFF 0%, #FDE68A 30%, #D4A017 55%, transparent 75%)",
                width: "30%",
                height: "30%",
                top: "32%",
                left: "35%",
              }}
            />
            {/* The omega: pure black, thicker per design review */}
            <span
              className="relative select-none"
              style={{
                fontSize: "clamp(14rem, 35vw, 28rem)",
                lineHeight: 0.85,
                fontWeight: 400,
                color: "#000000",
                WebkitTextFillColor: "#000000",
              }}
            >
              &Omega;
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 md:px-10 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/[0.07] relative z-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
          &copy; 2026 &nbsp;·&nbsp; built by{" "}
          <Link href="/about" className="text-white/55 hover:text-gold transition-colors">
            vas
          </Link>
        </p>
        <a
          href="mailto:one@vasteams.com"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 hover:text-gold transition-colors"
        >
          one@vasteams.com
        </a>
      </footer>
    </div>
  );
}
