import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Does AI Increase or Erode Our Incentive to Think?",
  description:
    "Cheaper cognition should mean more cognition. But the frontier of human advantage keeps moving, and the machine is climbing the same staircase.",
  openGraph: {
    title: "Does AI increase or erode our incentive to think?",
    description:
      "Cheaper cognition should mean more cognition. But the frontier of human advantage keeps moving.",
    images: ["/retriever/ai-staircase.jpg"],
  },
  alternates: {
    canonical: "https://vasteams.com/retriever/incentive-to-think",
  },
};

const navLinkClass =
  "font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors";

const h2Class =
  "text-white font-light leading-[1.15] tracking-[-0.025em] text-[1.8rem] md:text-[2.1rem] mt-14 mb-6";

const pClass =
  "text-white/65 font-light leading-[1.75] text-[1.08rem] md:text-[1.15rem] mb-6";

export default function IncentiveToThinkPage() {
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

      {/* Hero image */}
      <section className="relative w-full h-[46vw] max-h-[560px] min-h-[240px] bg-black overflow-hidden border-b border-white/[0.07]">
        <Image
          src="/retriever/ai-staircase.jpg"
          alt="Two figures climbing a staircase, one of them wired with circuitry"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </section>

      {/* Title band */}
      <section className="px-6 md:px-16 pt-12 pb-10 md:pt-16 md:pb-12 border-b border-white/[0.07]">
        <div className="max-w-[68ch] mx-auto">
          <p className="font-mono uppercase tracking-[0.24em] text-[11px] text-white/30 mb-7">
            Walk 001
          </p>
          <h1
            className="text-white font-light leading-[1.02] tracking-[-0.035em] max-w-[20ch]"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)" }}
          >
            Does AI increase or erode our incentive to think?
          </h1>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            <span>7 Sep 2026</span>
            <span>ChatGPT</span>
            <span>Lightly edited</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 md:px-16 py-12 md:py-16 flex-1">
        <div className="max-w-[68ch] mx-auto">
          {/* Prose */}
          <article>
            <p className="text-gold font-light leading-[1.45] tracking-[-0.015em] text-[1.3rem] md:text-[1.45rem] border-l-2 border-gold/45 pl-6 mb-12">
              If cheaper cognition means more cognition, what exactly is the unit
              of work that becomes more abundant, and is there a level of it that
              stays ours?
            </p>

            <p className={pClass}>
              If you haven&apos;t read it, &ldquo;The Cognitive Revolution&rdquo;
              gives us a historical frame for what AI may represent. In short it
              says that while the Industrial Revolution transferred much of human
              physical labor to machines, AI may now be doing the same thing to
              cognitive labor. Put differently, as the cost of cognition falls,
              we should expect demand for cognition to rise. We will analyze
              more, model more, write more, diagnose more, and ultimately create
              far more cognitive output than humans alone ever could.
            </p>
            <p className={pClass}>
              That may be directionally right. But the analogy also hides the
              most interesting question. What exactly is the unit of work that
              becomes more abundant? If we assume it is analysis, the logic is
              straightforward: cheaper analysis produces more analysis, just as
              spreadsheets created more financial modeling rather than
              eliminating it. But AI may be different because its promise is not
              simply to automate analysis. It can increasingly decide what
              analysis matters, discover patterns we did not think to look for,
              suggest the next question, and eventually act on the answer. If
              that is true, the cognitive revolution is not just about doing more
              work at a lower cost. It is about AI moving up the stack of
              cognition itself.
            </p>

            <h2 className={h2Class}>The moving frontier</h2>
            <p className={pClass}>
              It helps to imagine cognition as a pyramid. At the bottom are tasks
              such as retrieval, calculation, classification, summarization, and
              routine analysis. Above that sit interpretation, insight,
              synthesis, and question formation. Higher still are judgment,
              decision-making, goal setting, taste, and the definition of what is
              valuable in the first place.
            </p>
            <p className={pClass}>
              At first, AI clearly validates Buhler&apos;s thesis. It removes the
              cost of lower-level cognitive work and allows humans to spend more
              time on higher-level work. Instead of manually producing a
              cross-tab, we can interrogate the data. Instead of spending days
              gathering background on a medical topic, we can begin with a
              sophisticated map of the field and ask better questions. Our
              starting point is higher, and the cost of curiosity is lower.
            </p>

            <figure className="my-12">
              <div className="bg-white p-3 md:p-5">
                <Image
                  src="/retriever/cognitive-pyramid.jpg"
                  alt="A pyramid of cognitive work, from retrieval and calculation at the base to goal setting and values at the top, with AI advancing upward through analysis, synthesis and judgment"
                  width={1242}
                  height={1020}
                  sizes="(max-width: 768px) 100vw, 68ch"
                  className="w-full h-auto"
                />
              </div>
              <figcaption className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/30">
                The moving cognitive frontier
              </figcaption>
            </figure>

            <p className={pClass}>
              The problem is that the frontier does not stay still. AI is already
              moving from answering questions to proposing them, from analysis to
              interpretation, from drafting options to recommending actions. The
              human response is to move upward. But AI moves upward too. The
              traditional labor-transition story assumes that when technology
              automates one layer, people learn a new skill and occupy the next
              layer. The cognitive revolution raises a harder possibility: what
              if the machine keeps climbing the same staircase? And why
              wouldn&apos;t it?
            </p>
            <p className={pClass}>
              That does not mean necessarily human work disappears. It means we
              should be cautious about describing the transition as simply a move
              to a new skill set. The scarce human contribution may migrate
              repeatedly: from analysis to synthesis, from synthesis to judgment,
              from judgment to goal setting, from goal setting perhaps to values,
              accountability, trust, or desire itself. The question is not only
              whether new roles appear, but whether there is a durable frontier at
              which human comparative advantage stabilizes.
            </p>

            <h2 className={h2Class}>More cognition, or less need to think?</h2>
            <p className={pClass}>
              There is a second tension. Buhler&apos;s thesis assumes that
              abundant machine cognition expands the amount of cognition society
              consumes. That is plausible at the system level. Machines may
              perform orders of magnitude more reasoning, analysis, simulation,
              and experimentation than people ever could. But that does not
              necessarily mean humans themselves will think more.
            </p>
            <p className={pClass}>
              AI creates two possible equilibria. In an exploration equilibrium,
              it makes thinking more rewarding. Because the entry cost to a
              subject collapses, people can explore areas that were previously
              inaccessible. A person who knows little about medicine, economics,
              law, or engineering can begin a meaningful inquiry in minutes. Each
              answer becomes a platform for a better question. Curiosity
              compounds. The user is not simply outsourcing thought; AI is
              extending the range of questions the user is capable of asking.
            </p>
            <p className={pClass}>
              But there is also a dependency equilibrium. If the system is
              consistently better at finding the pattern, framing the question,
              evaluating the options, and recommending the next move, the
              incentive to build those abilities ourselves may decline. Why
              struggle through a difficult text if the model can explain it? Why
              learn how to structure an analysis if the system can produce one
              instantly? Why hold a complex map of a field in memory if an agent
              can retrieve and connect it on demand?
            </p>
            <p className={pClass}>
              This is not primarily an argument about intelligence. It is an
              argument about incentives. Human cognitive capability is partly
              produced by practice. Reading, calculating, writing, arguing,
              remembering, and struggling with ambiguity are not just methods for
              producing an output; they are processes through which judgment is
              built. If AI supplies the output while removing too much of the
              process, cognitive output could rise while human cognitive
              development weakens.
            </p>

            <h2 className={h2Class}>Education is the test case</h2>
            <p className={pClass}>
              Education makes the trade-off impossible to ignore. Consider an
              elementary or middle-school student. If AI can write the paragraph,
              solve the equation, summarize the chapter, and explain the
              historical event, the narrow productivity argument says the student
              should use it. But education has never been primarily about
              maximizing the efficiency of producing correct answers. The work is
              formative. We ask children to do things inefficiently because doing
              them changes the person who is doing them.
            </p>
            <p className={pClass}>
              That does not imply that AI should be excluded from education. The
              opposite may be true. Used well, it could dramatically raise the
              level at which students can explore. A child can ask follow-up
              questions without embarrassment, test an idea immediately, move
              across disciplines, receive personalized explanations, and reach
              conceptual territory that would otherwise be years away. AI can
              compress the climb.
            </p>
            <p className={pClass}>
              The design question, then, is not simply &ldquo;How do we use AI in
              school?&rdquo; It is: which cognitive experiences are developmental
              and therefore should not be optimized away? We may need to
              distinguish between cognition as production and cognition as
              formation. The first is about obtaining the best answer. The second
              is about developing the mind capable of recognizing, challenging,
              and using that answer.
            </p>

            <h2 className={h2Class}>
              A different way to read the cognitive revolution
            </h2>
            <p className={pClass}>
              This suggests a modification to Buhler&apos;s argument rather than a
              rejection of it. He may be right that machine cognition will explode
              and that cheaper intelligence will generate far more cognitive
              activity across the economy. But that tells us less about the future
              of human work than it first appears to. The important variable is
              not simply the quantity of cognition. It is how cognitive labor is
              divided between humans and machines, and what that division does to
              human capability and motivation over time.
            </p>
            <p className={pClass}>
              The central question may therefore be: does AI increase or erode our
              incentive to think? The answer will differ by person, institution,
              and use case. For some, AI will be an intellectual exoskeleton. It
              will let them start higher, move faster, make connections they could
              not previously see, and ask increasingly ambitious questions. For
              others, it may become a cognitive autopilot that gradually removes
              the need to understand what happens beneath the interface.
            </p>
            <p className={pClass}>
              That distinction has consequences far beyond productivity. It shapes
              how we should design education, organizations, professional
              development, and AI products themselves. If the only objective is to
              maximize output, we will automate as much of the cognitive pyramid
              as possible. If we also care about maintaining human judgment,
              curiosity, independence, and the ability to set worthwhile goals,
              then some friction may be valuable.
            </p>

            <h2 className={h2Class}>Closing</h2>
            <p className={pClass}>
              The real question of the cognitive revolution is therefore not
              whether machines will think more. They almost certainly will. The
              question is whether abundant machine intelligence expands the
              frontier of human thought, or gradually reduces the need, and
              eventually the incentive, for humans to reach that frontier
              themselves.
            </p>
            <p className={pClass}>
              The optimistic future is not one in which humans preserve some
              protected category of higher-order cognition that machines can never
              touch. That frontier is likely to keep moving. It is one in which
              every time AI raises our starting point, we use that advantage to
              ask better questions, make richer connections, and pursue ambitions
              that were previously beyond us.
            </p>
            <p className={pClass}>
              But there is a deeper reason this matters. Cognition is not only a
              productive input. The process of understanding, questioning, and
              forming judgment is part of what gives people agency: the ability to
              decide what matters, to challenge the answer they are given, and to
              choose rather than merely accept an optimized recommendation.
            </p>
            <p className={pClass}>
              AI may therefore do two things at once. It can raise the ceiling of
              what humans are capable of understanding and accomplishing. And, if
              we increasingly delegate the cognitive processes through which
              judgment is formed, it can also remove the ladder by which we learn
              to reach that ceiling.
            </p>
            <p className={pClass}>
              The challenge of the cognitive revolution is not to keep humans
              doing work that machines can do better. It is to ensure that as
              machines become more capable of thinking for us, humans remain
              capable, and motivated, to think with them, beyond them, and when
              necessary, against them.
            </p>

            <p className="mt-12 pt-7 border-t border-white/[0.07] font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
              Questions by Vas. Written by ChatGPT.
            </p>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-10 border-t border-white/[0.09] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
          &copy; 2026 Vas Bakopoulos
        </p>
        <Link
          href="/retriever"
          className="font-mono text-sm uppercase tracking-[0.16em] text-white/55 hover:text-gold transition-colors"
        >
          &larr; All walks
        </Link>
      </footer>
    </div>
  );
}
