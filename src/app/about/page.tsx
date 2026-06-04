import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vas Bakopoulos — Head of Research at MMA Global, writer of Marketing Embeddings newsletter for 20,000+ CMOs, CTOs, and media leaders.",
  alternates: {
    canonical: "https://vasteams.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col">
      <header className="px-6 md:px-10 pt-8 pb-6 flex items-center justify-between font-mono">
        <Link
          href="/"
          className="text-xs text-zinc-600 hover:text-gold tracking-widest uppercase transition-colors"
        >
          &larr; Back
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/research"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-gold transition-colors"
          >
            Research
          </Link>
          <Link
            href="/work"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-gold transition-colors"
          >
            Work
          </Link>
          <a
            href="https://marketingembeddings.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-gold transition-colors"
          >
            Marketing Embeddings
          </a>
          <Link
            href="/projects"
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-gold transition-colors"
          >
            Quick Builds
          </Link>
        </nav>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_1.4fr]">
        {/* Left: editorial text panel */}
        <section className="px-6 md:px-12 lg:px-16 xl:px-20 py-14 lg:py-20 flex flex-col justify-center order-2 lg:order-1">
          <h1 className="text-[11px] uppercase tracking-[0.35em] text-zinc-500 mb-10 font-mono">
            About
          </h1>

          <div className="space-y-7 text-base md:text-lg text-zinc-300 leading-[1.7] font-light max-w-xl">
            <p>
              I&apos;m{" "}
              <a
                href="https://www.linkedin.com/in/vbakopoulos/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                Vas
              </a>
              . Head of Research at{" "}
              <a
                href="https://mmaglobal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                MMA
              </a>
              , where I work with marketing leaders worldwide through events,
              think tanks, and industry research. I hear what CMOs are actually
              worried about&mdash;not what they say on panels. I also work
              closely with AI companies building the tools reshaping our
              industry. I see firsthand what works, what doesn&apos;t, and where
              the gap between promise and reality lives.
            </p>

            <p>
              I write{" "}
              <a
                href="https://marketingembeddings.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 transition-colors"
              >
                Marketing Embeddings
              </a>
              , a newsletter for CMOs, CTOs, and media leaders on AI-driven
              marketing trends, benchmarks, and workflows.
            </p>
          </div>

          <div className="mt-14 pt-10 border-t border-zinc-800/70 max-w-xl">
            <p className="text-[10px] tracking-[0.35em] uppercase text-zinc-600 mb-3 font-mono">
              Get in touch
            </p>
            <a
              href="mailto:one@vasteams.com"
              className="text-base md:text-lg text-zinc-300 hover:text-gold transition-colors border-b border-zinc-800 hover:border-gold/50 pb-1"
            >
              one@vasteams.com
            </a>
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="text-xs text-zinc-600 hover:text-gold tracking-widest uppercase transition-colors font-mono"
            >
              &larr; Home
            </Link>
          </div>
        </section>

        {/* Right: full-bleed photograph */}
        <div className="relative h-[55vh] sm:h-[65vh] lg:h-auto lg:min-h-[640px] order-1 lg:order-2">
          <Image
            src="/about/vas-hi.jpg"
            alt="Vas on stage, waving to the audience"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </main>
    </div>
  );
}
