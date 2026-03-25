"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { SliderValues, getDefaultSliders, INPUT_FORCES } from "@/lib/forces";
import { computeWorldState } from "@/lib/worldEngine";
import CoordinateSelectors from "./CoordinateSelectors";
import StoryOptions, {
  StoryLength,
  StoryTone,
  StoryFocus,
} from "./StoryOptions";
import GenerateButton from "./GenerateButton";
import OutputDisplay from "./OutputDisplay";
import NavBar from "./NavBar";
import GlobalMap from "./GlobalMap";

// ── URL helpers ──────────────────────────────────────────────────

function encodeForces(sliders: SliderValues): string {
  return INPUT_FORCES.map((f) => sliders[f.id] ?? 50).join("-");
}

function decodeStateFromURL(): {
  sliders: SliderValues;
  year?: number;
  regionId?: string;
  persona?: string;
  storyLength?: StoryLength;
  tone?: StoryTone;
  focus?: StoryFocus;
  compareMode?: boolean;
  yearB?: number;
} | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const f = params.get("f");
  if (!f) return null;

  const values = f.split("-").map(Number);

  let sliders: SliderValues | null = null;

  // v=2 format: 7 input forces
  if (values.length === INPUT_FORCES.length && !values.some(isNaN)) {
    sliders = {};
    INPUT_FORCES.forEach((force, i) => {
      sliders![force.id] = values[i];
    });
  }

  // v=1 legacy format: 12 forces
  if (!sliders && values.length === 12 && !values.some(isNaN)) {
    sliders = {
      ai_acceleration: values[0],
      climate_crisis: values[1],
      neural_interface: values[8],
      corporate_power: values[3],
      demographic_collapse: values[6],
      digital_immersion: values[2],
      global_convergence: values[11],
    };
  }

  if (!sliders) return null;

  const y = params.get("y");
  const l = params.get("l");
  const p = params.get("p");

  return {
    sliders,
    year: y ? parseInt(y) : undefined,
    regionId: l ?? undefined,
    persona: p ?? undefined,
    storyLength: (params.get("len") as StoryLength) || undefined,
    tone: (params.get("tone") as StoryTone) || undefined,
    focus: (params.get("focus") as StoryFocus) || undefined,
    compareMode: params.get("cmp") === "1",
    yearB: params.has("yb") ? parseInt(params.get("yb")!) : undefined,
  };
}

// ── Component ────────────────────────────────────────────────────

export default function StoryPage() {
  // Forces (from URL)
  const [sliders, setSliders] = useState<SliderValues>(getDefaultSliders);

  // Coordinates
  const [year, setYear] = useState(2058);
  const [regionId, setRegionId] = useState("portland");
  const [persona, setPersona] = useState("High school teacher");

  // Story options
  const [storyLength, setStoryLength] = useState<StoryLength>("medium");
  const [tone, setTone] = useState<StoryTone>("literary");
  const [focus, setFocus] = useState<StoryFocus>("general");
  const [model, setModel] = useState("claude-sonnet-4-6");

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [yearB, setYearB] = useState(2090);

  // Output state
  const [output, setOutput] = useState("");
  const [outputB, setOutputB] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [copied, setCopied] = useState(false);

  // Image state
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageUrlB, setImageUrlB] = useState<string | undefined>();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoadingB, setImageLoadingB] = useState(false);

  // Load from URL on mount
  useEffect(() => {
    const fromUrl = decodeStateFromURL();
    if (fromUrl) {
      setSliders(fromUrl.sliders);
      if (fromUrl.year) setYear(fromUrl.year);
      if (fromUrl.regionId) setRegionId(fromUrl.regionId);
      if (fromUrl.persona) setPersona(fromUrl.persona);
      if (fromUrl.storyLength) setStoryLength(fromUrl.storyLength);
      if (fromUrl.tone) setTone(fromUrl.tone);
      if (fromUrl.focus) setFocus(fromUrl.focus);
      if (fromUrl.compareMode) setCompareMode(true);
      if (fromUrl.yearB) setYearB(fromUrl.yearB);
    }
  }, []);

  // Compute world state for persona filtering + story gen
  const worldState = useMemo(
    () => computeWorldState(sliders, year, regionId),
    [sliders, year, regionId]
  );

  // Build search params string for NavBar
  const searchParams = `?v=2&f=${encodeForces(sliders)}`;

  // ── Fetch & stream ──────────────────────────────────────────────

  const fetchAndStream = useCallback(
    async (
      fetchYear: number,
      setText: (updater: string | ((prev: string) => string)) => void,
      setIsLoading: (v: boolean) => void
    ) => {
      setIsLoading(true);
      setText("");

      const storyOpts = { storyLength, tone, focusArea: focus };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sliders,
          year: fetchYear,
          regionId,
          persona,
          model,
          ...storyOpts,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setText(`Error: ${err.error || "Generation failed"}`);
        setIsLoading(false);
        return;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setText(data.text);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setText("Error: No response stream");
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setText(fullText);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      setIsLoading(false);
    },
    [sliders, regionId, persona, model, storyLength, tone, focus]
  );

  // Generate narrative(s)
  const handleGenerate = useCallback(async () => {
    setImageUrl(undefined);
    setImageUrlB(undefined);

    try {
      if (compareMode) {
        await Promise.all([
          fetchAndStream(year, setOutput, setLoading),
          fetchAndStream(yearB, setOutputB, setLoadingB),
        ]);
      } else {
        setOutputB("");
        await fetchAndStream(year, setOutput, setLoading);
      }
    } catch (err) {
      setOutput(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setLoading(false);
      setLoadingB(false);
    }
  }, [compareMode, year, yearB, fetchAndStream]);

  // Request image generation
  const handleRequestImage = useCallback(
    async (
      forYear: number,
      storyText: string,
      setUrl: (v: string | undefined) => void,
      setIsLoading: (v: boolean) => void
    ) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sliders,
            year: forYear,
            regionId,
            storyText,
          }),
        });
        const data = await res.json();
        if (data.imageUrl) {
          setUrl(data.imageUrl);
        } else if (data.error) {
          console.error("Image generation:", data.error);
        }
      } catch (err) {
        console.error("Image generation failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [sliders, regionId]
  );

  // Share URL — encodes full state
  const handleShare = useCallback(() => {
    const forceStr = INPUT_FORCES.map((f) => sliders[f.id] ?? 50).join("-");
    const params = new URLSearchParams({
      v: "2",
      f: forceStr,
      y: String(year),
      l: regionId,
      p: persona,
      len: storyLength,
      tone,
      focus,
    });
    if (compareMode) {
      params.set("cmp", "1");
      params.set("yb", String(yearB));
    }
    const url = `/matrix-moment/story?${params.toString()}`;
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    window.history.replaceState(null, "", url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [
    sliders,
    year,
    regionId,
    persona,
    storyLength,
    tone,
    focus,
    compareMode,
    yearB,
  ]);

  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <NavBar searchParams={searchParams} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Global livability map */}
        <div className="mb-4">
          <GlobalMap
            sliders={sliders}
            year={year}
            selectedRegion={regionId}
            onRegionChange={setRegionId}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left column: Coordinates + Story Options + Generate */}
          <div className="lg:col-span-4 space-y-3">
            <CoordinateSelectors
              year={year}
              regionId={regionId}
              persona={persona}
              onYearChange={setYear}
              onRegionChange={setRegionId}
              onPersonaChange={setPersona}
              compareMode={compareMode}
              onCompareModeChange={setCompareMode}
              yearB={yearB}
              onYearBChange={setYearB}
              worldState={worldState}
            />
            <StoryOptions
              length={storyLength}
              tone={tone}
              focus={focus}
              onLengthChange={setStoryLength}
              onToneChange={setTone}
              onFocusChange={setFocus}
            />
            <GenerateButton
              loading={loading || loadingB}
              onClick={handleGenerate}
              model={model}
              onModelChange={setModel}
              compareMode={compareMode}
            />
            {/* Share button */}
            <button
              onClick={handleShare}
              className="w-full py-2 text-xs font-mono uppercase tracking-widest border border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {copied ? "Link copied!" : "Share this configuration"}
            </button>
          </div>

          {/* Right column: Output */}
          <div className="lg:col-span-8 space-y-4">
            <OutputDisplay
              text={output}
              loading={loading}
              textB={compareMode ? outputB : undefined}
              loadingB={compareMode ? loadingB : undefined}
              yearA={compareMode ? year : undefined}
              yearB={compareMode ? yearB : undefined}
              imageUrl={imageUrl}
              imageLoading={imageLoading}
              onRequestImage={() =>
                handleRequestImage(year, output, setImageUrl, setImageLoading)
              }
              imageUrlB={compareMode ? imageUrlB : undefined}
              imageLoadingB={compareMode ? imageLoadingB : undefined}
              onRequestImageB={
                compareMode
                  ? () =>
                      handleRequestImage(
                        yearB,
                        outputB,
                        setImageUrlB,
                        setImageLoadingB
                      )
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
