"use client";

interface Props {
  loading: boolean;
  onClick: () => void;
  model: string;
  onModelChange: (model: string) => void;
  compareMode?: boolean;
}

export default function GenerateButton({
  loading,
  onClick,
  model,
  onModelChange,
  compareMode,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        disabled={loading}
        className={`flex-1 py-3 font-mono text-sm uppercase tracking-widest border transition-all duration-200 ${
          loading
            ? "border-zinc-700 text-zinc-600 cursor-wait"
            : "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] active:bg-emerald-500/20"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-3 h-3 border border-zinc-600 border-t-emerald-500 rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          compareMode ? "Compare My Worlds" : "Generate My World"
        )}
      </button>
      <select
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 text-zinc-400 text-xs font-mono px-2 py-3 focus:border-emerald-500 focus:outline-none"
        title="Model selection — Haiku is fast & cheap, Sonnet is higher quality"
      >
        <option value="claude-sonnet-4-6">Sonnet</option>
        <option value="claude-haiku-4-5-20251001">Haiku</option>
      </select>
    </div>
  );
}
