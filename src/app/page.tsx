import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col font-mono">
      {/* Header */}
      <header className="px-6 md:px-8 pt-12 md:pt-16 pb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-wide">
            Vas Collective
          </h1>
          <p className="text-sm text-zinc-600 mt-1 tracking-widest uppercase">
            Research, Build, Repeat.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/research"
            className="text-xs text-zinc-600 hover:text-emerald-400 tracking-widest uppercase transition-colors"
          >
            Research
          </Link>
          <Link
            href="/work"
            className="text-xs text-zinc-600 hover:text-emerald-400 tracking-widest uppercase transition-colors"
          >
            Work
          </Link>
          <a
            href="https://marketingembeddings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-emerald-400 tracking-widest uppercase transition-colors"
          >
            Marketing Embeddings
          </a>
          <Link
            href="/projects"
            className="text-xs text-zinc-600 hover:text-emerald-400 tracking-widest uppercase transition-colors"
          >
            Quick Builds
          </Link>
          <Link
            href="/about"
            className="text-xs text-zinc-600 hover:text-emerald-400 tracking-widest uppercase transition-colors"
          >
            About
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-8">
        <div className="relative text-center max-w-2xl">
          <span className="absolute inset-0 flex items-center justify-center text-[14rem] md:text-[20rem] text-zinc-700/50 select-none pointer-events-none leading-none">&Omega;</span>
          <div className="relative z-10 py-16 md:py-24">
            <h2 className="text-2xl md:text-3xl text-zinc-100 leading-snug font-light tracking-wide">
              Questions is all we&apos;ve got.
            </h2>
            <p className="text-lg md:text-xl text-zinc-500 mt-4 font-light tracking-wide max-w-md mx-auto">
              When answers are free, questions are the only advantage left.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-8 py-6 border-t border-zinc-900">
        <p className="text-[11px] text-zinc-700 tracking-wide">
          built by{" "}
          <Link href="/about" className="hover:text-zinc-500 transition-colors">
            vas
          </Link>
        </p>
      </footer>
    </div>
  );
}
