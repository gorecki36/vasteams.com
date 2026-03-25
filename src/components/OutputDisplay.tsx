"use client";

import { useState } from "react";

interface Props {
  text: string;
  loading: boolean;
  textB?: string;
  loadingB?: boolean;
  yearA?: number;
  yearB?: number;
  imageUrl?: string;
  imageLoading?: boolean;
  onRequestImage?: () => void;
  imageUrlB?: string;
  imageLoadingB?: boolean;
  onRequestImageB?: () => void;
}

type Tab = "briefing" | "day" | "window";

/**
 * Split generated text into briefing + day sections.
 * Strategy: look for the "Day in the Life" header first (most reliable),
 * then fall back to the last `---` separator.
 */
function splitSections(text: string): { briefing: string; day: string } {
  // Pattern: any markdown header containing "day in the life" or "your day"
  // Must handle formats like: "# OUTPUT 2: DAY IN THE LIFE", "## A Day in the Life", "## Your Day"
  const dayHeaderPattern =
    /^#{1,3}\s+.*(?:Day\s+in\s+the\s+Life|DAY\s+IN\s+THE\s+LIFE|Your\s+Day)/im;

  const match = text.match(dayHeaderPattern);
  if (match && match.index !== undefined && match.index > 0) {
    // Trim trailing --- from briefing
    const briefing = text
      .slice(0, match.index)
      .replace(/\n*\s*---\s*\n*$/, "")
      .trim();
    const day = text.slice(match.index).trim();
    return { briefing, day };
  }

  // Fallback: split on last --- that has substantial content on both sides
  const parts = text.split(/\n+\s*---\s*\n+/);
  if (parts.length >= 2) {
    const briefing = parts.slice(0, -1).join("\n\n").trim();
    const day = parts[parts.length - 1].trim();
    if (briefing.length > 50 && day.length > 50) {
      return { briefing, day };
    }
  }

  // No reliable split — everything goes to briefing
  return { briefing: text, day: "" };
}

function SingleOutput({
  text,
  loading,
  label,
  imageUrl,
  imageLoading,
  onRequestImage,
}: {
  text: string;
  loading: boolean;
  label?: string;
  imageUrl?: string;
  imageLoading?: boolean;
  onRequestImage?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("briefing");

  const { briefing, day: dayStory } = splitSections(text);
  const content = activeTab === "briefing" ? briefing : dayStory;
  const hasStory = text.length > 0 && !loading;

  const tabs: { id: Tab; label: string }[] = [
    { id: "briefing", label: "World State" },
    { id: "day", label: "Your Day" },
    { id: "window", label: "Window View" },
  ];

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 flex-1 min-w-0">
      {label && (
        <div className="px-4 py-1.5 border-b border-zinc-800 bg-zinc-800/50">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            {label}
          </span>
        </div>
      )}
      <div className="flex border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${
              activeTab === tab.id
                ? "text-emerald-400 border-b border-emerald-500 -mb-px"
                : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-5 max-h-[600px] overflow-y-auto">
        {activeTab === "window" ? (
          <WindowViewContent
            imageUrl={imageUrl}
            imageLoading={imageLoading}
            hasStory={hasStory}
            onRequestImage={onRequestImage}
          />
        ) : loading && !text ? (
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-sm">
            <span className="inline-block w-3 h-3 border border-zinc-600 border-t-emerald-500 rounded-full animate-spin" />
            Constructing world state...
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none font-mono">
            {content.split("\n").map((line, i) => {
              if (line.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-emerald-400 text-sm font-bold mt-4 mb-2"
                  >
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-emerald-400 text-base font-bold mt-4 mb-2"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="text-zinc-200 font-bold my-1">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="text-zinc-400 text-sm ml-4 my-0.5">
                    {renderInlineMarkdown(line.slice(2))}
                  </li>
                );
              }
              if (line.trim() === "") {
                return <div key={i} className="h-3" />;
              }
              return (
                <p key={i} className="text-zinc-400 text-sm leading-relaxed my-1">
                  {renderInlineMarkdown(line)}
                </p>
              );
            })}
            {loading && (
              <span className="inline-block w-2 h-4 bg-emerald-500/60 animate-pulse ml-0.5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WindowViewContent({
  imageUrl,
  imageLoading,
  hasStory,
  onRequestImage,
}: {
  imageUrl?: string;
  imageLoading?: boolean;
  hasStory: boolean;
  onRequestImage?: () => void;
}) {
  if (imageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <span className="inline-block w-5 h-5 border-2 border-zinc-600 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-zinc-500 font-mono text-sm">
          Rendering world...
        </span>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="relative">
        <img
          src={imageUrl}
          alt="Window view of the world"
          className="w-full h-auto rounded"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 rounded-b">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80">
            Window View
          </span>
        </div>
      </div>
    );
  }

  if (!hasStory) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <button
          disabled
          className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-zinc-800 text-zinc-600 cursor-not-allowed"
        >
          Generate a story first
        </button>
        <span className="text-zinc-600 font-mono text-xs">
          The window view is generated from story context
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <button
        onClick={onRequestImage}
        className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-emerald-700 text-emerald-400 hover:bg-emerald-900/20 hover:border-emerald-500 transition-colors"
      >
        Visualize the window view
      </button>
      <span className="text-zinc-600 font-mono text-xs">
        ~$0.04 per image
      </span>
    </div>
  );
}

export default function OutputDisplay({
  text,
  loading,
  textB,
  loadingB,
  yearA,
  yearB,
  imageUrl,
  imageLoading,
  onRequestImage,
  imageUrlB,
  imageLoadingB,
  onRequestImageB,
}: Props) {
  if (!text && !textB && !loading && !loadingB) return null;

  // Comparison mode: side by side
  if (textB !== undefined) {
    return (
      <div className="flex gap-4">
        <SingleOutput
          text={text}
          loading={loading}
          label={yearA ? String(yearA) : "Year A"}
          imageUrl={imageUrl}
          imageLoading={imageLoading}
          onRequestImage={onRequestImage}
        />
        <SingleOutput
          text={textB}
          loading={!!loadingB}
          label={yearB ? String(yearB) : "Year B"}
          imageUrl={imageUrlB}
          imageLoading={imageLoadingB}
          onRequestImage={onRequestImageB}
        />
      </div>
    );
  }

  // Single mode
  return (
    <SingleOutput
      text={text}
      loading={loading}
      imageUrl={imageUrl}
      imageLoading={imageLoading}
      onRequestImage={onRequestImage}
    />
  );
}

function renderInlineMarkdown(text: string) {
  // Simple bold and italic rendering
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-zinc-200">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="text-zinc-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
