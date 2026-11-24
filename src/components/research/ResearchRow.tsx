import { type ResearchItem } from "@/lib/research";
import { ResearchThumb, TYPE_LABELS } from "./ResearchThumb";

const ACTION_LABELS: Record<ResearchItem["type"], string> = {
  webinar: "Read",
  report: "Read",
  talk: "Watch",
  podcast: "Listen",
  stage: "View agenda",
};

export function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  // Items with -01-01 are year-only placeholders, not real Jan 1 events.
  if (dateStr.endsWith("-01-01")) {
    return d.toLocaleDateString("en-US", { year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export function ResearchCard({ item }: { item: ResearchItem }) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className="group block"
    >
      <ResearchThumb item={item} className="mb-4" />
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/45 mb-2">
        {formatDate(item.date)} · {TYPE_LABELS[item.type]}
        {item.partner && <> · {item.partner}</>}
      </p>
      <p className="text-white font-light text-xl leading-[1.3] tracking-[-0.01em] transition-colors group-hover:text-gold">
        {item.title}
      </p>
    </a>
  );
}

export function ResearchRow({ item }: { item: ResearchItem }) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className="group grid grid-cols-1 lg:grid-cols-[170px_1fr_300px] gap-y-4 lg:gap-x-12 items-start py-10 border-b border-white/[0.07] transition-colors hover:bg-white/[0.015]"
    >
      {/* Meta */}
      <div className="pt-1.5">
        <p className="font-mono text-[12.5px] font-medium text-white tracking-[0.06em] mb-2.5">
          {formatDate(item.date)}
        </p>
        <p className="font-mono text-xs font-medium text-white/30 tracking-[0.22em] uppercase mb-1.5">
          {TYPE_LABELS[item.type]}
        </p>
        {item.partner && (
          <p className="font-mono text-xs text-white/55 tracking-[0.16em] uppercase">
            <span className="text-white/30">with </span>
            {item.partner}
          </p>
        )}
      </div>

      {/* Content */}
      <div>
        <p
          className="text-white font-light leading-[1.25] tracking-[-0.015em] mb-4 max-w-[38ch] transition-colors group-hover:text-gold"
          style={{ fontSize: "clamp(1.25rem, 1.7vw, 1.55rem)" }}
        >
          {item.title}
        </p>
        <p className="text-base font-light leading-[1.65] text-white/55 max-w-[60ch]">
          {item.description}
        </p>
        <span className="inline-block mt-5 font-mono text-sm uppercase tracking-[0.16em] text-white/55 transition-colors group-hover:text-gold">
          {ACTION_LABELS[item.type]} &rarr;
        </span>
      </div>

      {/* Thumb */}
      <ResearchThumb item={item} />
    </a>
  );
}
