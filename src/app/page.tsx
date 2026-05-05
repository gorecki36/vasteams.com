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

function NavLink({ href, label, external, className }: {
  href: string; label: string; external?: boolean; className?: string;
}) {
  const cls = className ?? "text-sm tracking-widest uppercase hover:text-gold transition-colors";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={{ color: "#525252" }}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} style={{ color: "#525252" }}>
      {label}
    </Link>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{
        background: "#0A0A0A",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header className="px-5 md:px-10 pt-6 md:pt-8 flex items-center justify-between relative z-20">
        <div>
          <span
            className="text-2xl md:text-3xl font-bold tracking-widest"
            style={{
              color: "#E5E5E5",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            VAS<span className="text-gold">T</span>{" "}
            <span style={{ color: "#3A3A3A" }}>//</span>
          </span>
          <p
            className="text-[11px] md:text-xs tracking-[0.25em] uppercase mt-1"
            style={{ color: "#525252" }}
          >
            Research, Build, Repeat.
          </p>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
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
          className="md:hidden fixed inset-0 z-10 flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(10, 10, 10, 0.97)" }}
          onClick={() => setMenuOpen(false)}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              {...link}
              className="text-lg tracking-widest uppercase hover:text-gold transition-colors"
            />
          ))}
        </div>
      )}

      {/* Hero */}
      <main className="flex-1 flex items-center px-5 md:px-10 relative">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-0">
          {/* Left: type */}
          <div className="flex-1 md:pr-8">
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
              className="mt-6 md:mt-8"
              style={{
                fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)",
                color: "#666666",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              When answers are free, questions are the only advantage left.
            </p>
          </div>

          {/* Right: black omega with gold halo */}
          <div className="w-full md:w-auto flex-shrink-0 relative flex items-center justify-center md:justify-end">
            {/* Outer halo: wide, soft gold bloom */}
            <div
              className="absolute blur-[120px] opacity-25"
              style={{
                background: "radial-gradient(ellipse at center, #D4A017 0%, #8B6914 40%, transparent 70%)",
                width: "130%",
                height: "130%",
                top: "-15%",
                left: "-15%",
              }}
            />
            {/* Mid halo: concentrated around the form */}
            <div
              className="absolute blur-[70px] opacity-35"
              style={{
                background: "radial-gradient(ellipse at center, #FDE68A 0%, #D4A017 30%, transparent 65%)",
                width: "90%",
                height: "90%",
                top: "5%",
                left: "5%",
              }}
            />
            {/* Under-glow: stronger at the bottom */}
            <div
              className="absolute blur-[80px] opacity-40"
              style={{
                background: "radial-gradient(ellipse at center, #FDE68A 0%, #D4A017 35%, transparent 65%)",
                width: "70%",
                height: "50%",
                bottom: "-10%",
                left: "15%",
              }}
            />
            {/* Inner cavity glow: hot white-gold core */}
            <div
              className="absolute blur-[35px] opacity-45"
              style={{
                background: "radial-gradient(ellipse at center, #FFFFFF 0%, #FDE68A 30%, #D4A017 55%, transparent 75%)",
                width: "30%",
                height: "30%",
                top: "32%",
                left: "35%",
              }}
            />
            {/* The omega: pure black */}
            <span
              className="relative select-none"
              style={{
                fontSize: "clamp(14rem, 35vw, 28rem)",
                lineHeight: 0.85,
                fontWeight: 200,
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
      <footer className="px-5 md:px-10 py-6 flex items-center justify-between relative z-10">
        <p className="text-[11px] tracking-wide" style={{ color: "#3A3A3A" }}>
          built by{" "}
          <Link href="/about" className="hover:text-neutral-400 transition-colors" style={{ color: "#3A3A3A" }}>
            vas
          </Link>
        </p>
        <span />
      </footer>
    </div>
  );
}
