import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { WALKS } from "@/lib/walks";

export const metadata: Metadata = {
  title: "Retriever: Two Dogs and a Language Model",
  description:
    "Long walks with my dogs, spent talking to ChatGPT about something I'm trying to understand. The questions are mine, the writing is the model's.",
  openGraph: {
    title: "Retriever: Vas Bakopoulos",
    description:
      "Long walks with my dogs, spent talking to ChatGPT about something I'm trying to understand.",
  },
  alternates: {
    canonical: "https://vasteams.com/retriever",
  },
};

const navLinkClass =
  "font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors";

export default function RetrieverPage() {
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
          className="group font-mono text-xl md:text-2xl tracking-[0.18em] font-bold text-white leading-none"
        >
          VAS<span className="text-gold">T</span>{" "}
          <span className="text-white/30 group-hover:text-white/55 transition-colors">//</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <Link href="/research" className={navLinkClass}>Research</Link>
          <Link href="/work" className={navLinkClass}>Work</Link>
          <a
            href="https://marketingembeddings.com"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass}
          >
            Marketing Embeddings
          </a>
          <Link href="/projects" className={navLinkClass}>Quick Builds</Link>
          <Link href="/retriever" className="font-mono text-sm uppercase tracking-[0.16em] text-gold">Retriever</Link>
          <Link href="/about" className={navLinkClass}>About</Link>
        </nav>
      </header>

      {/* Hero: photo left, copy right */}
      <section className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] border-b border-white/[0.07]">
        <div className="relative min-h-[300px] md:min-h-[460px] bg-black overflow-hidden">
          <Image
            src="/retriever-dogs.jpg"
            alt="A golden retriever and a black staffie waiting by the door"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 52vw"
            className="object-cover opacity-95"
          />
        </div>
        <div className="px-6 py-12 md:px-14 md:py-14 flex flex-col justify-center">
          <h1
            className="text-white font-light leading-[0.98] tracking-[-0.035em]"
            style={{ fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
          >
            Retriever.
          </h1>
          <p className="mt-5 text-[1.35rem] font-light leading-[1.35] tracking-[-0.015em] text-white/75">
            Walk and talk &ldquo;essays&rdquo; about the future of AI.
          </p>
          <p className="mt-7 max-w-[46ch] text-white/55 font-light leading-[1.65] text-[1.05rem]">
            I take long walks with my dogs every day, and increasingly I spend
            them talking to ChatGPT about something I&apos;m trying to
            understand. I ask questions, argue with the answers, follow the
            threads that interest me, and try to figure out what I actually
            think. If, by the end of the walk, I&apos;ve learned something or
            changed my mind, I&apos;ll share what came out of the conversation
            here.
          </p>
        </div>
      </section>

      {/* Walks */}
      <section className="px-6 md:px-16 py-10 md:py-14 flex-1">
        <div className="max-w-[1160px] mx-auto">
          {WALKS.length === 0 ? (
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-white/30 py-10 border-t border-white/[0.07]">
              First walk coming soon
            </p>
          ) : (
            <>
              {/* Latest walk, featured */}
              <Link
                href={`/retriever/${WALKS[0].slug}`}
                className="group grid grid-cols-1 md:grid-cols-2 border border-white/[0.07] bg-[#141414] overflow-hidden no-underline transition-colors hover:border-gold/45"
              >
                <div className="relative min-h-[220px] md:min-h-[340px] bg-black overflow-hidden">
                  <Image
                    src={WALKS[0].image}
                    alt={WALKS[0].imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-7 md:p-10 flex flex-col justify-center">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold mb-6">
                    Walk {String(WALKS.length).padStart(3, "0")} / {WALKS[0].date}
                  </p>
                  <h2 className="text-[1.7rem] md:text-[2.1rem] font-light leading-[1.15] tracking-[-0.025em] text-white group-hover:text-gold transition-colors max-w-[22ch]">
                    {WALKS[0].title}
                  </h2>
                  <p className="mt-5 max-w-[52ch] text-[1rem] font-light leading-[1.6] text-white/55">
                    {WALKS[0].summary}
                  </p>
                  <span className="mt-8 font-mono text-[11.5px] uppercase tracking-[0.2em] text-white/55 group-hover:text-gold transition-colors">
                    Read{" "}
                    <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300">
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>

              {/* Earlier walks */}
              {WALKS.slice(1).map((walk, i) => (
                <Link
                  key={walk.slug}
                  href={`/retriever/${walk.slug}`}
                  className={`group grid grid-cols-1 md:grid-cols-[76px_1fr_170px_84px] gap-3 md:gap-7 md:items-baseline py-6 border-b border-white/[0.07] no-underline ${
                    i === 0 ? "border-t mt-10" : ""
                  }`}
                >
                  <span className="font-mono text-[12px] tracking-[0.14em] text-white/25">
                    {String(WALKS.length - 1 - i).padStart(3, "0")}
                  </span>
                  <div>
                    <h2 className="text-[1.35rem] md:text-[1.55rem] font-light leading-[1.25] tracking-[-0.02em] text-white group-hover:text-gold transition-colors">
                      {walk.title}
                    </h2>
                    <p className="mt-2 max-w-[60ch] text-[0.95rem] font-light leading-[1.5] text-white/45">
                      {walk.summary}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30">
                    {walk.date}
                  </span>
                  <span className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-white/55 md:text-right group-hover:text-gold transition-colors">
                    Read{" "}
                    <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300">
                      &rarr;
                    </span>
                  </span>
                </Link>
              ))}
            </>
          )}
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
