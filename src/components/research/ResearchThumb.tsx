"use client";

import { useState } from "react";
import { type ResearchItem } from "@/lib/research";

export const TYPE_LABELS: Record<ResearchItem["type"], string> = {
  webinar: "Webinar",
  report: "Report",
  talk: "Talk",
  podcast: "Podcast",
  stage: "Stage",
};

// Full-colour thumbnail. The image sits "contained" on a blurred copy of
// itself, so portrait report covers and wide banners both fill the frame.
// If there is no image, or the host refuses it, a gold partner tile shows
// instead of an empty dark box.
export function ResearchThumb({ item, className = "" }: { item: ResearchItem; className?: string }) {
  const [failed, setFailed] = useState(false);
  const showImage = item.image && !failed;

  return (
    <div
      className={`relative overflow-hidden border border-white/[0.1] aspect-[16/10] ${className}`}
      style={{
        background: showImage ? "#141414" : "linear-gradient(135deg, #1d1a12 0%, #0f0f0f 70%)",
      }}
    >
      {showImage ? (
        <>
          <div
            aria-hidden
            className="absolute -inset-5 bg-cover bg-center"
            style={{ backgroundImage: `url("${item.image}")`, filter: "blur(18px) brightness(0.45)" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="relative w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setFailed(true)}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <span className="text-gold font-light text-xl leading-tight">{item.partner ?? "MMA"}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
            {TYPE_LABELS[item.type]}
          </span>
        </div>
      )}
    </div>
  );
}
