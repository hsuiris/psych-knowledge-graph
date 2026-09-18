"use client";

import { CATEGORY_LIST } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

interface Props {
  active: Set<CategoryId>;
  onToggle: (id: CategoryId) => void;
}

export default function Legend({ active, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_LIST.map((c) => {
        const on = active.has(c.id);
        return (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
              on
                ? "border-slate-300 bg-white text-slate-800 shadow-sm"
                : "border-slate-200 bg-transparent text-slate-400"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full transition"
              style={{
                background: on ? c.color : "transparent",
                border: `1.5px solid ${c.color}`,
              }}
            />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
