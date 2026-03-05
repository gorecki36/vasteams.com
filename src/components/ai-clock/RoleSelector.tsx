"use client";

import { ROLES } from "@/lib/roles";

interface Props {
  activeRole: string | null;
  onSelect: (roleId: string | null) => void;
}

export default function RoleSelector({ activeRole, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {ROLES.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelect(activeRole === role.id ? null : role.id)}
          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-all duration-150 ${
            activeRole === role.id
              ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
              : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
          }`}
        >
          {role.shortName}
        </button>
      ))}
    </div>
  );
}
