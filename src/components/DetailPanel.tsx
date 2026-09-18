"use client";

import Link from "next/link";
import { nodeById, neighborsOf, type Neighbor } from "@/lib/graph";
import { CATEGORIES } from "@/lib/categories";
import { DETAILS } from "@/data/details";
import { createLinker, findNodeId, shortLabel } from "@/lib/linkify";
import { portraitOf } from "@/lib/portraits";

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const paragraphs = (text: string) => text.split(/\n\n+/).filter(Boolean);

export default function DetailPanel({ selectedId, onSelect }: Props) {
  const node = selectedId ? nodeById.get(selectedId) : null;
  if (!node) return null;

  const cat = CATEGORIES[node.category];
  const detail = DETAILS[node.id];
  const portrait = portraitOf(node.id);
  const name = shortLabel(node.label);
  const aliases = node.aliases?.filter((a) => !node.label.includes(a)) ?? [];
  const neighbors = neighborsOf(node.id);

  // 內文裡提到的概念變成連結，點了就跳過去；每個概念只連第一次出現的地方
  const linkify = createLinker(node.id);
  const linked = (text: string) =>
    linkify(text, (id, t, key) => (
      <button
        key={key}
        onClick={() => onSelect(id)}
        className="font-medium text-indigo-600 underline decoration-indigo-300 decoration-1 underline-offset-4 hover:text-indigo-500 hover:decoration-indigo-500"
      >
        {t}
      </button>
    ));

  // 關係依方向與類型分組：「佛洛伊德 創立 [精神分析]」「[佛洛伊德] 創立 精神分析」
  const groups = new Map<string, { outgoing: boolean; relation: string; items: Neighbor[] }>();
  for (const n of neighbors) {
    const key = `${n.outgoing}|${n.relation}`;
    if (!groups.has(key)) groups.set(key, { outgoing: n.outgoing, relation: n.relation, items: [] });
    groups.get(key)!.items.push(n);
  }

  return (
    <aside className="absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white/95 shadow-xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: `${cat.color}22`, color: cat.color }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
            {cat.label}
          </span>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{node.label}</h2>
          {(node.years || aliases.length > 0) && (
            <p className="mt-1 text-xs text-slate-500">
              {[node.years, ...aliases].filter(Boolean).join(" · ")}
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

      {/* key 換了就重新掛載，切換概念時捲軸回到最上面 */}
      <div key={node.id} className="flex-1 overflow-y-auto p-5">
        {portrait && (
          <figure className="mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portrait.src}
              alt={node.label}
              className="h-48 w-40 rounded-xl object-cover object-top shadow-sm"
            />
            <figcaption className="mt-1.5 text-[11px] leading-snug text-slate-400">
              照片：
              <a href={portrait.source} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 hover:underline">
                {portrait.author}，{portrait.license}
              </a>
            </figcaption>
          </figure>
        )}

        <p className="text-sm font-medium leading-relaxed text-slate-700">
          {linked(node.description)}
        </p>

        {detail && (
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
            {paragraphs(detail.detail).map((p, i) => (
              <p key={i}>{linked(p)}</p>
            ))}
            {detail.sections?.map((sec) => (
              <section key={sec.heading} className="pt-2">
                <h3 className="mb-1.5 text-sm font-semibold text-slate-800">{sec.heading}</h3>
                <div className="space-y-3">
                  {paragraphs(sec.body).map((p, i) => (
                    <p key={i}>{linked(p)}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {detail?.figures && detail.figures.length > 0 && (
          <>
            <h3 className="mt-6 mb-2 text-xs font-semibold tracking-wider text-slate-500">重要人物</h3>
            <div className="flex flex-wrap gap-2">
              {detail.figures.map((f) => {
                const id = findNodeId(f);
                const person = id ? nodeById.get(id) : undefined;
                if (person?.category !== "person") {
                  return (
                    <span key={f} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                      {f}
                    </span>
                  );
                }
                const photo = portraitOf(person.id);
                return (
                  <button
                    key={f}
                    onClick={() => onSelect(person.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-xs text-slate-700 transition hover:bg-slate-100"
                  >
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.src} alt="" className="h-6 w-6 rounded-full object-cover object-top" />
                    ) : (
                      <span className="h-6 w-6 rounded-full" style={{ background: `${CATEGORIES.person.color}33` }} />
                    )}
                    {f}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <h3 className="mt-6 mb-2 text-xs font-semibold tracking-wider text-slate-500">
          關係（{neighbors.length}）
        </h3>
        <div className="space-y-2.5">
          {[...groups.values()].map((g) => {
            const chips = g.items.map((n) => {
              const c = CATEGORIES[n.node.category];
              return (
                <button
                  key={n.node.id}
                  onClick={() => onSelect(n.node.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {n.node.label}
                </button>
              );
            });
            const verb = <span className="text-xs text-slate-500">{g.relation}</span>;
            const self = <span className="text-xs text-slate-800">{name}</span>;
            return (
              <div key={`${g.outgoing}|${g.relation}`} className="flex flex-wrap items-center gap-1.5">
                {g.outgoing ? <>{self}{verb}{chips}</> : <>{chips}{verb}{self}</>}
              </div>
            );
          })}
        </div>

        <Link
          href={`/concept/${node.id}`}
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/90 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
        >
          開啟獨立頁面 →
        </Link>
      </div>
    </aside>
  );
}
