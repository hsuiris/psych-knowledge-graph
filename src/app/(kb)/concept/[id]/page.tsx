import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getConcept, allConceptIds } from "@/lib/concept";
import { CATEGORIES } from "@/lib/categories";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";
import type { GraphNode } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return allConceptIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const concept = getConcept(id);
  if (!concept) return { title: "找不到概念" };
  const { node, detail } = concept;
  const description = (detail?.detail ?? node.description).slice(0, 155);
  return {
    title: `${node.label}｜心理諮商知識圖譜`,
    description,
    openGraph: {
      title: `${node.label}｜心理諮商知識圖譜`,
      description,
      type: "article",
    },
  };
}

function paragraphs(text: string): string[] {
  return text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

function ConceptCard({ node, relation }: { node: GraphNode; relation: string }) {
  const cat = CATEGORIES[node.category];
  return (
    <Link
      href={`/concept/${node.id}`}
      className="group flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: cat.color }} />
        <span className="text-xs text-slate-500">{relation}</span>
      </span>
      <span className="font-medium text-slate-800 group-hover:text-slate-900">
        {node.label}
      </span>
      <span className="line-clamp-2 text-xs leading-relaxed text-slate-500">
        {node.description}
      </span>
    </Link>
  );
}

export default async function ConceptPage({ params }: PageProps) {
  const { id } = await params;
  const concept = getConcept(id);
  if (!concept) notFound();

  const { node, detail, outgoing, incoming, narrative } = concept;
  const cat = CATEGORIES[node.category];
  const related = [...outgoing, ...incoming];

  // Build the table of contents from whichever sections this concept has.
  const toc: TocItem[] = [{ id: "summary", label: "概述" }];
  if (detail?.detail) toc.push({ id: "overview", label: "延伸說明" });
  detail?.sections?.forEach((sec, i) =>
    toc.push({ id: `sec-${i}`, label: sec.heading, level: 1 })
  );
  if (narrative.length) toc.push({ id: "network", label: "在知識網中的位置" });
  if (related.length) toc.push({ id: "related", label: "相關概念" });
  if (detail?.figures?.length || detail?.reading?.length)
    toc.push({ id: "refs", label: "重要人物與參考資料" });
  if (detail?.sources?.length) toc.push({ id: "sources", label: "延伸閱讀" });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* top accent bar */}
      <div className="h-1 w-full" style={{ background: cat.color }} />

      <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            知識圖譜
          </Link>
          <span>/</span>
          <span className="text-slate-600">{cat.label}</span>
        </nav>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
          {/* article */}
          <article className="max-w-3xl">
            {/* hero */}
            <header>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: `${cat.color}22`, color: cat.color }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                {cat.label}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {node.label}
              </h1>
              {node.aliases && node.aliases.length > 0 && (
                <p className="mt-2 text-sm text-slate-500">{node.aliases.join(" · ")}</p>
              )}
            </header>

            {/* summary */}
            <section id="summary" className="scroll-mt-8">
              <p className="mt-6 text-lg leading-relaxed text-slate-700">
                {node.description}
              </p>
            </section>

            {/* extended detail */}
            {detail?.detail && (
              <section id="overview" className="mt-10 scroll-mt-8">
                <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                  延伸說明
                </h2>
                <div className="space-y-4">
                  {paragraphs(detail.detail).map((p, i) => (
                    <p key={i} className="text-base leading-loose text-slate-600">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* in-depth sections */}
            {detail?.sections?.map((sec, i) => (
              <section key={sec.heading} id={`sec-${i}`} className="mt-10 scroll-mt-8">
                <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                  {sec.heading}
                </h2>
                <div className="space-y-4">
                  {paragraphs(sec.body).map((p, j) => (
                    <p key={j} className="text-base leading-loose text-slate-600">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* relationship narrative */}
            {narrative.length > 0 && (
              <section id="network" className="mt-10 scroll-mt-8">
                <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                  在知識網中的位置
                </h2>
                <ul className="space-y-2">
                  {narrative.map((s, i) => (
                    <li key={i} className="text-sm leading-relaxed text-slate-600">
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* related concepts */}
            {related.length > 0 && (
              <section id="related" className="mt-10 scroll-mt-8">
                <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                  相關概念（{related.reduce((n, g) => n + g.nodes.length, 0)}）
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.flatMap((g) =>
                    g.nodes.map((n) => (
                      <ConceptCard key={`${g.relation}-${n.id}`} node={n} relation={g.relation} />
                    ))
                  )}
                </div>
              </section>
            )}

            {/* figures & reading */}
            {(detail?.figures?.length || detail?.reading?.length) && (
              <section id="refs" className="mt-10 scroll-mt-8">
                <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                  重要人物與參考資料
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {detail?.figures && detail.figures.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-slate-500">
                        重要人物
                      </h3>
                      <ul className="space-y-1.5">
                        {detail.figures.map((f) => (
                          <li key={f} className="text-sm text-slate-600">
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {detail?.reading && detail.reading.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-slate-500">
                        參考資料
                      </h3>
                      <ul className="space-y-1.5">
                        {detail.reading.map((r) => (
                          <li key={r} className="text-sm leading-relaxed text-slate-500">
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* web sources */}
            {detail?.sources && detail.sources.length > 0 && (
              <section id="sources" className="mt-10 scroll-mt-8">
                <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                  延伸閱讀 / 資料來源
                </h2>
                <ul className="space-y-2">
                  {detail.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-2 text-sm leading-relaxed text-indigo-600 underline-offset-4 hover:text-indigo-500 hover:underline"
                      >
                        <span aria-hidden>↗</span>
                        <span>{s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* CTA back to graph, focused */}
            <div className="mt-12 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
              <Link
                href={`/?focus=${node.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                在知識圖譜中查看 →
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                ← 回到圖譜
              </Link>
            </div>
          </article>

          {/* right: sticky table of contents */}
          <aside className="hidden xl:block">
            <div className="sticky top-8">
              <TableOfContents items={toc} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
