"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import GraphCanvas from "@/components/GraphCanvas";
import SearchBar from "@/components/SearchBar";
import DetailPanel from "@/components/DetailPanel";
import Legend from "@/components/Legend";
import { CATEGORY_LIST } from "@/lib/categories";
import { graphData } from "@/lib/graph";
import type { CategoryId } from "@/lib/types";

const ALL = new Set<CategoryId>(CATEGORY_LIST.map((c) => c.id));

const count = (kind: "concept" | "person" | "study") =>
  graphData.nodes.filter((n) =>
    kind === "concept" ? n.category !== "person" && n.category !== "study" : n.category === kind
  ).length;

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(
    new Set(ALL)
  );
  const [focusId, setFocusId] = useState<string | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);

  const focusNode = useCallback((id: string) => {
    setSelectedId(id);
    setFocusId(id);
    setFocusNonce((n) => n + 1);
  }, []);

  // Honour ?focus=<id> when arriving from a concept page.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("focus");
    if (id) focusNode(id);
  }, [focusNode]);

  const toggleCategory = useCallback((id: CategoryId) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-800">
      <GraphCanvas
        selectedId={selectedId}
        onSelect={setSelectedId}
        activeCategories={activeCategories}
        focusId={focusId}
        focusNonce={focusNonce}
      />

      {/* Top overlay: title + search + legend */}
      {/* 側欄打開時往左縮，搜尋框才不會被側欄蓋住 */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 p-5 sm:p-7 ${
          selectedId ? "md:right-[28rem]" : ""
        }`}
      >
        <div className="pointer-events-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                心理諮商知識圖譜
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                探索諮商與臨床心理學的核心概念。點擊節點查看說明，沿著關係探索相連的知識。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/apply"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                <span aria-hidden>🧭</span>
                實用應用指南
              </Link>
              <SearchBar onPick={focusNode} />
            </div>
          </div>
          <Legend active={activeCategories} onToggle={toggleCategory} />
        </div>
      </div>

      {/* Bottom-left stats */}
      <div className="pointer-events-none absolute bottom-4 left-5 z-10 text-xs text-slate-500">
        {count("concept")} 個概念 · {count("person")} 位人物 · {count("study")} 個經典研究 · {graphData.links.length} 條關係
      </div>

      <DetailPanel
        selectedId={selectedId}
        onSelect={(id) => (id ? focusNode(id) : setSelectedId(null))}
      />
    </main>
  );
}
