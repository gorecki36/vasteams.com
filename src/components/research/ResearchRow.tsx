"use client";

import { type ResearchItem } from "@/lib/research";

const TYPE_LABELS: Record<ResearchItem["type"], string> = {
  webinar: "Webinar",
  report: "Report",
  talk: "Talk",
  podcast: "Podcast",
  stage: "Stage",
};

const ACTION_LABELS: Record<ResearchItem["type"], string> = {
  webinar: "Read",
  report: "Read",
  talk: "Watch",
  podcast: "Listen",
  stage: "Watch",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  // Items with -01-01 are year-only placeholders, not real Jan 1 events.
  if (dateStr.endsWith("-01-01")) {
    return d.toLocaleDateString("en-US", { year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

const thumbBg =
  "repeating-linear-gradient(45deg, transparent 0, transparent 6px, rgba(255,255,255,0.025) 6px, rgba(255,255,255,0.025) 7px), #141414";

export function ResearchRow({ item }: { item: ResearchItem }) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className="group grid grid-cols-1 lg:grid-cols-[180px_1fr_200px] gap-y-4 lg:gap-x-14 items-start py-12 border-b border-white/[0.07] transition-colors hover:bg-white/[0.015]"
    >
      {/* Meta */}
      <div className="pt-1.5">
        <p className="font-mono text-[12.5px] font-medium text-white tracking-[0.06em] mb-2.5">
          {formatDate(item.date)}
        </p>
        <p className="font-mono text-[10.8px] font-medium text-white/30 tracking-[0.22em] uppercase mb-1.5">
          {TYPE_LABELS[item.type]}
        </p>
        {item.partner && (
          <p className="font-mono text-[10.8px] text-white/55 tracking-[0.16em] uppercase">
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
      </div>

      {/* Right: thumb + arrow */}
      <div className="flex flex-col items-end gap-5">
        <div
          className="w-[200px] aspect-[5/3] overflow-hidden border border-white/[0.07] relative"
          style={{ background: thumbBg }}
        >
          {item.image && (
            // External image hosts (mmaglobal.com) can return non-200; onError
            // hides the broken <img> so the striped placeholder shows through.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt=""
              className="w-full h-full object-cover grayscale opacity-70 brightness-[0.85] transition-[filter,opacity,transform] duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <span className="font-mono text-[11.8px] uppercase tracking-[0.16em] text-white/55 transition-colors group-hover:text-gold">
          {ACTION_LABELS[item.type]} &rarr;
        </span>
      </div>
    </a>
  );
}
