"use client";

import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { graphData } from "@/lib/graph";
import { CATEGORIES } from "@/lib/categories";
import type { GraphNode } from "@/lib/types";

interface Props {
  onPick: (id: string) => void;
}

export default function SearchBar({ onPick }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(graphData.nodes, {
        // 名稱與別名優先；簡介權重低，避免搜「薩提爾模式」時先跳出簡介提到它的人物
        keys: [
          { name: "label", weight: 3 },
          { name: "aliases", weight: 2 },
          { name: "description", weight: 0.5 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    []
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  }, [query, fuse]);

  useEffect(() => setActive(0), [query]);

  // close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pick = (node: GraphNode) => {
    onPick(node.id);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="搜尋概念，例如「焦慮」「依附」「CBT」…"
        className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {results.map((node, i) => (
            <li key={node.id}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(node)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
                  i === active ? "bg-slate-100" : ""
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: CATEGORIES[node.category].color }}
                />
                <span className="flex-1">
                  <span className="block text-sm text-slate-800">
                    {node.label}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {CATEGORIES[node.category].label}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
