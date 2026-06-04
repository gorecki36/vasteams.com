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
    <div className="min-h-screen bg-black text-zinc-300 font-mono">
      {/* Header */}
      <header className="px-6 md:px-8 pt-10 pb-8 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

      {/* Content */}
      <main className="px-6 md:px-8 py-16 max-w-7xl">
        <h1 className="text-xl font-bold text-zinc-100 tracking-wide mb-12">
          About
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Bio + contact (left) */}
          <div className="lg:col-span-5 lg:order-1 order-2">
            <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
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
                , where I work with marketing
                leaders worldwide through events, think tanks, and industry research.
                I hear what CMOs are actually worried about&mdash;not what they say on
                panels. I also work closely with AI companies building the tools
                reshaping our industry. I see firsthand what works, what doesn&apos;t,
                and where the gap between promise and reality lives.
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

            <div className="mt-12 pt-10 border-t border-zinc-800">
              <p className="text-[11px] text-zinc-600 tracking-widest uppercase mb-3">
                Get in touch
              </p>
              <a
                href="mailto:one@vasteams.com"
                className="text-sm text-zinc-400 hover:text-gold transition-colors border-b border-zinc-800 hover:border-gold/50 pb-0.5"
              >
                one@vasteams.com
              </a>
            </div>
          </div>

          {/* Image (right, larger) */}
          <div className="lg:col-span-7 lg:order-2 order-1 overflow-hidden rounded-lg">
            <Image
              src="/about/vas-hi.jpg"
              alt="Vas on stage, waving to the audience"
              width={2836}
              height={1889}
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="mt-16">
          <Link
            href="/"
            className="text-xs text-zinc-600 hover:text-gold tracking-widest uppercase transition-colors"
          >
            &larr; Home
          </Link>
        </div>
      </main>
    </div>
  );
}
