"use client";

import Link from "next/link";
import { nodeById, neighborsOf } from "@/lib/graph";
import { CATEGORIES } from "@/lib/categories";

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function DetailPanel({ selectedId, onSelect }: Props) {
  const node = selectedId ? nodeById.get(selectedId) : null;
  if (!node) return null;

  const cat = CATEGORIES[node.category];
  const neighbors = neighborsOf(node.id);

  // group neighbours by relation for a tidy list
  const grouped = neighbors.reduce<Record<string, typeof neighbors>>(
    (acc, n) => {
      (acc[n.relation] ??= []).push(n);
      return acc;
    },
    {}
  );

  return (
    <aside className="absolute right-0 top-0 z-30 flex h-full w-full max-w-sm flex-col border-l border-slate-200 bg-white/95 shadow-xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: `${cat.color}22`, color: cat.color }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: cat.color }}
            />
            {cat.label}
          </span>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {node.label}
          </h2>
          {node.aliases && node.aliases.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">
              {node.aliases.join(" · ")}
            </p>
          )}
        </div>
        <button
          onClick={() => onSelect(null)}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="關閉"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-sm leading-relaxed text-slate-600">
          {node.description}
        </p>

        <Link
          href={`/concept/${node.id}`}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/90 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
        >
          查看完整頁面 →
        </Link>

        <h3 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          相關概念（{neighbors.length}）
        </h3>
        <div className="space-y-4">
          {Object.entries(grouped).map(([relation, items]) => (
            <div key={relation}>
              <p className="mb-1.5 text-xs text-slate-400">{relation}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((n) => {
                  const c = CATEGORIES[n.node.category];
                  return (
                    <button
                      key={n.node.id}
                      onClick={() => onSelect(n.node.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: c.color }}
                      />
                      {n.node.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {neighbors.length === 0 && (
            <p className="text-sm text-slate-400">尚無連結的概念。</p>
          )}
        </div>
      </div>
    </aside>
  );
}
