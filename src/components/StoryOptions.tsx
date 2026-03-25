"use client";

export type StoryLength = "short" | "medium" | "long";
export type StoryTone = "journalist" | "literary" | "diary" | "letter";
export type StoryFocus =
  | "general"
  | "technology"
  | "relationships"
  | "work"
  | "spirituality"
  | "politics";

interface Props {
  length: StoryLength;
  tone: StoryTone;
  focus: StoryFocus;
  onLengthChange: (v: StoryLength) => void;
  onToneChange: (v: StoryTone) => void;
  onFocusChange: (v: StoryFocus) => void;
}

const LENGTHS: { value: StoryLength; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

const TONES: { value: StoryTone; label: string }[] = [
  { value: "journalist", label: "Journalist" },
  { value: "literary", label: "Literary" },
  { value: "diary", label: "Diary" },
  { value: "letter", label: "Letter" },
];

const FOCUSES: { value: StoryFocus; label: string }[] = [
  { value: "general", label: "General" },
  { value: "technology", label: "Tech" },
  { value: "relationships", label: "Relationships" },
  { value: "work", label: "Work" },
  { value: "spirituality", label: "Spirituality" },
  { value: "politics", label: "Politics" },
];

function ToggleRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="text-xs text-zinc-400 font-mono block mb-1">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
              value === opt.value
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StoryOptions({
  length,
  tone,
  focus,
  onLengthChange,
  onToneChange,
  onFocusChange,
}: Props) {
  return (
    <div className="space-y-2">
      <h2 className="text-[10px] uppercase tracking-widest text-emerald-500/80 mb-1 font-mono">
        Story Options
      </h2>
      <ToggleRow
        label="Length"
        options={LENGTHS}
        value={length}
        onChange={onLengthChange}
      />
      <ToggleRow
        label="Tone"
        options={TONES}
        value={tone}
        onChange={onToneChange}
      />
      <ToggleRow
        label="Focus"
        options={FOCUSES}
        value={focus}
        onChange={onFocusChange}
      />
    </div>
  );
}
