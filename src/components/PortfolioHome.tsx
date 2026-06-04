import Link from "next/link";
import { PROJECTS, type Project } from "@/lib/projects";

const navLinkClass =
  "font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors";

function ProjectCard({
  project,
  variant,
}: {
  project: Project;
  variant: "featured" | "compact";
}) {
  const isLive = project.status === "live";
  const isFeatured = variant === "featured";
  const isExternal = isLive && !project.href.startsWith("/");
  const accent = project.accent ?? "#D4A017";

  const padding = isFeatured ? "p-7 pt-7 pb-6" : "p-6 pt-6 pb-5";
  const minHeight = isFeatured ? "min-h-[280px]" : "min-h-[240px]";
  const titleSize = isFeatured ? "text-[1.55rem]" : "text-[1.3rem]";
  const descSize = isFeatured ? "text-[1rem]" : "text-[0.93rem]";
  const watermarkSize = isFeatured ? "text-[11rem]" : "text-[8rem]";

  const baseClass = [
    "group relative flex flex-col bg-[#141414] border border-white/[0.07] overflow-hidden transition-[border-color,transform,background] duration-300",
    padding,
    minHeight,
    isLive
      ? "hover:-translate-y-0.5 hover:border-[color:var(--accent)]/55 hover:bg-[color-mix(in_srgb,var(--accent)_3%,#141414)] no-underline text-inherit"
      : "opacity-45 cursor-default pointer-events-none",
  ].join(" ");

  const cardStyle = { ["--accent" as string]: accent };

  const content = (
    <>
      {/* Watermark glyph (faint, bottom-right) */}
      <span
        aria-hidden
        className={`absolute -right-2 -bottom-6 pointer-events-none select-none leading-none ${watermarkSize} ${
          project.iconBold ? "font-bold" : "font-light"
        } group-hover:opacity-[0.22] transition-opacity duration-300`}
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          color: accent,
          opacity: isLive ? 0.1 : 0.06,
        }}
      >
        {project.icon ?? "//"}
      </span>

      {/* Coming Soon stripe overlay */}
      {!isLive && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(135deg, transparent 0, transparent 8px, rgba(255,255,255,0.015) 8px, rgba(255,255,255,0.015) 9px)",
          }}
        />
      )}

      {/* Head: tag + small glyph */}
      <div className="relative z-[2] flex justify-between items-start gap-4 mb-5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-white/30">
          {isLive ? project.tags?.join(" / ") : "Coming Soon"}
        </p>
        <span
          aria-hidden
          className="font-mono leading-none text-[1.2rem]"
          style={{
            color: accent,
            fontWeight: project.iconBold ? 700 : 400,
          }}
        >
          {project.icon ?? "//"}
        </span>
      </div>

      {/* Title */}
      <h2
        className={`relative z-[2] ${titleSize} font-light leading-[1.2] tracking-[-0.02em] mb-4 max-w-[24ch] transition-colors ${
          isLive
            ? "text-white group-hover:text-[color:var(--accent)]"
            : "text-white/55"
        }`}
      >
        {project.title}
      </h2>

      {/* Description */}
      <p
        className={`relative z-[2] ${descSize} font-light leading-[1.6] text-white/55 mb-6 max-w-[44ch] flex-1`}
      >
        {project.description}
      </p>

      {/* Open / In progress */}
      <span
        className={`relative z-[2] font-mono text-[12px] uppercase tracking-[0.2em] self-start transition-colors ${
          isLive
            ? "text-white/55 group-hover:text-[color:var(--accent)]"
            : "text-white/30"
        }`}
      >
        {isLive ? (
          <>
            Open{" "}
            <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300">
              &rarr;
            </span>
          </>
        ) : (
          "In progress"
        )}
      </span>
    </>
  );

  if (isLive) {
    return (
      <a
        href={project.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={baseClass}
        style={cardStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={baseClass} style={cardStyle} aria-disabled>
      {content}
    </div>
  );
}

export default function PortfolioHome() {
  const featured = PROJECTS.slice(0, 2);
  const compact = PROJECTS.slice(2);

  return (
    <div
      className="bg-[#0c0c0c] text-white min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="px-6 md:px-10 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          aria-label="Home"
          className="group font-mono text-[15px] tracking-[0.18em] font-bold text-white leading-none"
        >
          VAS<span className="text-gold">T</span>{" "}
          <span className="text-white/30 group-hover:text-white/55 transition-colors">//</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <Link href="/research" className={navLinkClass}>
            Research
          </Link>
          <Link href="/work" className={navLinkClass}>
            Work
          </Link>
          <a
            href="https://marketingembeddings.com"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
          >
            Marketing Embeddings
          </a>
          <Link href="/about" className={navLinkClass}>
            About
          </Link>
        </nav>
      </header>

      {/* Hero band */}
      <section className="px-6 md:px-16 pt-12 pb-10 md:pt-20 md:pb-14 border-b border-white/[0.07]">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-16 items-end">
          <div>
            <p className="font-mono uppercase tracking-[0.24em] text-[11px] text-white/30 mb-7">
              02 / Quick Builds
            </p>
            <h1
              className="text-white font-light leading-[0.98] tracking-[-0.035em]"
              style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
            >
              Observations, benchmarks
              <br />
              &amp; simulations.
            </h1>
          </div>
          <p
            className="text-white/55 font-light leading-[1.65] max-w-[38ch] md:text-right pb-1.5"
            style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}
          >
            Interactive data stories on AI investment, marketing benchmarks, and
            future simulations.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="px-6 md:px-16 py-10 md:py-14 flex-1">
        <div className="max-w-[1160px] mx-auto space-y-6">
          {/* Featured row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} variant="featured" />
            ))}
          </div>
          {/* Compact row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compact.map((p) => (
              <ProjectCard key={p.id} project={p} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-10 border-t border-white/[0.09] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
          &copy; 2026 Vas Bakopoulos
        </p>
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors"
        >
          &larr; Home
        </Link>
      </footer>
    </div>
  );
}
