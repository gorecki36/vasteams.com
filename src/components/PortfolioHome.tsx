import Link from "next/link";
import { PROJECTS, type Project } from "@/lib/projects";

function ProjectCard({ project }: { project: Project }) {
  const isLive = project.status === "live";

  return (
    <div
      className={`group border border-zinc-800 transition-all duration-300 ${
        isLive
          ? "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:scale-[1.01]"
          : "opacity-50"
      }`}
    >
      {/* Thumbnail area */}
      <div className="aspect-video bg-zinc-900/50 flex items-center justify-center border-b border-zinc-800">
        {isLive ? (
          <div className="text-center">
            <div className={project.iconClass ?? "text-3xl font-mono text-emerald-500/20 font-bold"}>
              {project.icon ?? "//"}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1 tracking-widest uppercase">
              {project.tags?.join(" / ")}
            </div>
          </div>
        ) : (
          <div className="text-xs font-mono text-zinc-700 tracking-widest uppercase">
            Coming soon
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-400 mb-2">
          {project.title}
        </h2>
        <p className="text-sm text-zinc-500 font-mono leading-relaxed mb-4">
          {project.description}
        </p>
        {isLive && (
          <Link
            href={project.href}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            Enter <span>&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="border border-zinc-800/50 border-dashed aspect-[4/3] flex items-center justify-center">
      <div className="text-[10px] font-mono text-zinc-800 tracking-widest uppercase">
        &mdash;
      </div>
    </div>
  );
}

export default function PortfolioHome() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col">
      {/* Back link */}
      <div className="px-8 pt-10 pb-4">
        <Link
          href="/"
          className="text-xs font-mono text-zinc-600 hover:text-emerald-400 tracking-widest uppercase transition-colors"
        >
          &larr; Home
        </Link>
      </div>

      {/* Header */}
      <header className="px-8 pb-12">
        <h1 className="text-2xl font-mono font-bold text-zinc-100 tracking-wide">
          Quick Builds
        </h1>
        <p className="text-sm font-mono text-zinc-600 mt-1 tracking-widest uppercase">
          Observations, Benchmarks &amp; Simulations
        </p>
      </header>

      {/* Grid */}
      <main className="flex-1 px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-zinc-900">
        <p className="text-[11px] font-mono text-zinc-700 tracking-wide">
          built by{" "}
          <Link href="/" className="hover:text-zinc-500 transition-colors">
            vas
          </Link>
        </p>
      </footer>
    </div>
  );
}
