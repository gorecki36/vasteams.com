import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{
        background: "#0A0A0A",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header className="px-6 md:px-10 pt-8 flex items-center justify-between relative z-10">
        <div>
          <span
            className="text-xl font-bold tracking-widest"
            style={{
              color: "#E5E5E5",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            VAS<span className="text-gold">T</span>{" "}
            <span style={{ color: "#3A3A3A" }}>//</span>
          </span>
          <p
            className="text-[10px] tracking-[0.25em] uppercase mt-0.5"
            style={{ color: "#525252" }}
          >
            Research, Build, Repeat.
          </p>
        </div>
        <nav className="flex items-center gap-6">
          {[
            { href: "/research", label: "Research" },
            { href: "/work", label: "Work" },
            { href: "/projects", label: "Builds" },
            { href: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs tracking-widest uppercase hover:text-gold transition-colors"
              style={{ color: "#525252" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center px-6 md:px-10 relative">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-0">
          {/* Left: type */}
          <div className="flex-1 md:pr-8">
            <h1
              style={{
                fontSize: "clamp(3rem, 9vw, 7.5rem)",
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
              className="mt-6 md:mt-8 max-w-md"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                color: "#666666",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              When answers are free, questions are
              the only advantage left.
            </p>
          </div>

          {/* Right: black omega with gold halo */}
          <div className="flex-shrink-0 relative flex items-center justify-center">
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
                fontSize: "clamp(12rem, 30vw, 24rem)",
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
      <footer className="px-6 md:px-10 py-6 flex items-center justify-between relative z-10">
        <p className="text-[11px] tracking-wide" style={{ color: "#3A3A3A" }}>
          built by{" "}
          <Link href="/about" className="hover:text-neutral-400 transition-colors" style={{ color: "#3A3A3A" }}>
            vas
          </Link>
        </p>
        <a
          href="https://marketingembeddings.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-wide hover:text-neutral-400 transition-colors"
          style={{ color: "#3A3A3A" }}
        >
          Marketing Embeddings
        </a>
      </footer>
    </div>
  );
}
