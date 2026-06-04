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

const navLinkClass =
  "font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors";

const bioLinkClass =
  "text-white border-b border-white/10 hover:text-gold hover:border-gold/60 transition-colors pb-px";

const roleLinkClass =
  "font-mono uppercase tracking-[0.14em] text-[11px] text-white/55 hover:text-gold transition-colors";

export default function AboutPage() {
  return (
    <div className="bg-[#0c0c0c] text-white" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
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
        </nav>
      </header>

      {/* Hero — full-bleed photo with overlay */}
      <section
        className="relative h-screen min-h-[640px] flex items-end overflow-hidden"
        style={{ background: "linear-gradient(135deg, #141414 0%, #1a1a1a 50%, #0c0c0c 100%)" }}
      >
        <Image
          src="/about/vas-hi.jpg"
          alt="Vas on stage, waving to the audience"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_32%]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,12,12,0.55) 0%, rgba(12,12,12,0.15) 28%, rgba(12,12,12,0.40) 60%, rgba(12,12,12,0.95) 100%)",
          }}
        />
        <div className="relative z-10 w-full max-w-[960px] px-6 md:px-16 pb-16 md:pb-24">
          <p className="font-mono uppercase tracking-[0.24em] text-[11px] text-white/30 mb-7">
            About
          </p>
          <h1
            className="text-white font-light leading-[0.98] tracking-[-0.035em] mb-7"
            style={{ fontSize: "clamp(3.25rem, 7.5vw, 7rem)" }}
          >
            Vas <span className="text-gold font-normal">Bakopoulos</span>.
          </h1>
          <p
            className="text-white/55 font-light leading-[1.7] max-w-[52ch]"
            style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.2rem)" }}
          >
            Head of Research at{" "}
            <a
              href="https://mmaglobal.com"
              target="_blank"
              rel="noopener noreferrer"
              className={bioLinkClass}
            >
              MMA Global
            </a>
            . Writer of{" "}
            <a
              href="https://marketingembeddings.com"
              target="_blank"
              rel="noopener noreferrer"
              className={bioLinkClass}
            >
              Marketing Embeddings
            </a>
            , a newsletter for CMOs, CTOs, and media leaders adapting to AI.
          </p>
        </div>
      </section>

      {/* About body — asymmetric 1fr / 1.4fr grid */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-28 items-start">
          {/* Left: role list */}
          <aside>
            <p className="font-mono uppercase tracking-[0.24em] text-[11px] text-white/30 mb-8">
              01 / Currently
            </p>
            <div>
              <p className="text-white text-base font-normal mb-1.5 tracking-[-0.005em]">
                Head of Research
              </p>
              <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-white/55">
                <a
                  href="https://mmaglobal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={roleLinkClass}
                >
                  MMA Global
                </a>
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/[0.09]">
              <p className="text-white text-base font-normal mb-1.5 tracking-[-0.005em]">
                Writer &amp; Founder
              </p>
              <p className="font-mono uppercase tracking-[0.14em] text-[11px] text-white/55">
                <a
                  href="https://marketingembeddings.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={roleLinkClass}
                >
                  Marketing Embeddings
                </a>
              </p>
            </div>
          </aside>

          {/* Right: bio */}
          <div
            className="text-white/55 font-light leading-[1.85] space-y-7 max-w-[60ch]"
            style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.2rem)" }}
          >
            <p>
              I work with marketing leaders worldwide through events, think tanks,
              and industry research. I hear what CMOs are actually worried about,
              not what they say on panels.
            </p>
            <p>
              I also work closely with AI companies building the tools reshaping our
              industry. I see firsthand what works, what doesn&rsquo;t, and where
              the gap between promise and reality lives.
            </p>
            <p>
              <strong className="text-white font-normal">Marketing Embeddings</strong>{" "}
              is where I publish the thinking behind that work. Weekly essays,
              benchmarks, and workflows for CMOs, CTOs, and media leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="px-6 md:px-16 py-16 md:py-20 border-t border-white/[0.07]">
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-28 items-start">
          <aside>
            <p className="font-mono uppercase tracking-[0.24em] text-[11px] text-white/30">
              02 / Connect
            </p>
          </aside>
          <div>
            <a
              href="mailto:one@vasteams.com"
              className="inline-block text-white font-light tracking-[-0.015em] border-b border-white/[0.09] pb-2 hover:text-gold hover:border-gold/60 transition-colors"
              style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)" }}
            >
              one@vasteams.com
            </a>
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
