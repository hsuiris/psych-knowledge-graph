import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, allGuideIds } from "@/data/guides";
import { nodeById } from "@/lib/graph";
import { CATEGORIES } from "@/lib/categories";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return allGuideIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const guide = getGuide(id);
  if (!guide) return { title: "找不到指南" };
  return {
    title: `${guide.title}｜實用心理學應用指南`,
    description: guide.tagline,
    openGraph: {
      title: `${guide.title}｜實用心理學應用指南`,
      description: guide.tagline,
      type: "article",
    },
  };
}

function paragraphs(text: string): string[] {
  return text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

export default async function GuidePage({ params }: PageProps) {
  const { id } = await params;
  const guide = getGuide(id);
  if (!guide) notFound();

  const accent = guide.accent;
  const related = guide.relatedConcepts
    .map((cid) => nodeById.get(cid))
    .filter((n): n is NonNullable<typeof n> => Boolean(n));

  // Build the table of contents; principles become nested sub-items.
  const toc: TocItem[] = [
    { id: "intro", label: "概述" },
    { id: "principles", label: "核心原理" },
    ...guide.principles.map((p, i) => ({
      id: `principle-${i}`,
      label: p.name,
      level: 1,
    })),
    { id: "scenarios", label: "生活情境怎麼用" },
  ];
  if (guide.pitfalls?.length) toc.push({ id: "pitfalls", label: "常見誤區" });
  if (guide.reflection?.length)
    toc.push({ id: "reflection", label: "給自己的提問" });
  if (related.length) toc.push({ id: "related", label: "延伸概念" });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <div className="h-1 w-full" style={{ background: accent }} />

      <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            知識圖譜
          </Link>
          <span>/</span>
          <Link href="/apply" className="hover:text-slate-700">
            應用指南
          </Link>
        </nav>

        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
          {/* article */}
          <article className="max-w-3xl">
            {/* hero */}
            <header>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: `${accent}1f`, color: accent }}
              >
                <span aria-hidden>{guide.emoji}</span>
                {guide.audience}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {guide.title}
              </h1>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">
                {guide.tagline}
              </p>
            </header>

            {/* intro */}
            <section id="intro" className="mt-8 space-y-4 scroll-mt-8">
              {paragraphs(guide.intro).map((p, i) => (
                <p key={i} className="text-base leading-loose text-slate-600">
                  {p}
                </p>
              ))}
            </section>

            {/* principles */}
            <section id="principles" className="mt-10 scroll-mt-8">
              <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                核心原理
              </h2>
              <div className="space-y-5">
                {guide.principles.map((p, i) => (
                  <div
                    key={p.name}
                    id={`principle-${i}`}
                    className="scroll-mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <span
                        className="h-4 w-1 rounded-full"
                        style={{ background: accent }}
                      />
                      {p.name}
                    </h3>
                    <div className="space-y-3">
                      {paragraphs(p.body).map((para, j) => (
                        <p key={j} className="text-sm leading-loose text-slate-600">
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* scenarios */}
            <section id="scenarios" className="mt-10 scroll-mt-8">
              <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                生活情境怎麼用
              </h2>
              <div className="space-y-4">
                {guide.scenarios.map((s, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <p className="border-b border-slate-200 bg-slate-50 px-5 py-4 text-base font-medium leading-relaxed text-slate-900">
                      「{s.situation}」
                    </p>
                    <div className="space-y-4 px-5 py-4">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          其實發生了什麼
                        </p>
                        <p className="text-sm leading-loose text-slate-600">
                          {s.insight}
                        </p>
                      </div>
                      <div>
                        <p
                          className="mb-1 text-xs font-semibold uppercase tracking-wider"
                          style={{ color: accent }}
                        >
                          可以這樣做
                        </p>
                        <p className="text-sm leading-loose text-slate-700">
                          {s.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* pitfalls */}
            {guide.pitfalls && guide.pitfalls.length > 0 && (
              <section id="pitfalls" className="mt-10 scroll-mt-8">
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-rose-600">
                    常見誤區
                  </h2>
                  <ul className="space-y-2">
                    {guide.pitfalls.map((p, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm leading-relaxed text-slate-700"
                      >
                        <span aria-hidden className="text-rose-500">
                          ✕
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* reflection */}
            {guide.reflection && guide.reflection.length > 0 && (
              <section id="reflection" className="mt-10 scroll-mt-8">
                <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                  給自己的提問
                </h2>
                <ul className="space-y-3">
                  {guide.reflection.map((q, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm"
                    >
                      <span
                        aria-hidden
                        className="font-semibold"
                        style={{ color: accent }}
                      >
                        {i + 1}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* related concepts in the graph */}
            {related.length > 0 && (
              <section id="related" className="mt-10 scroll-mt-8">
                <h2 className="mb-3 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">
                  想深入理論？這些概念在知識圖譜裡
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.map((n) => {
                    const cat = CATEGORIES[n.category];
                    return (
                      <Link
                        key={n.id}
                        href={`/concept/${n.id}`}
                        className="group flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: cat.color }}
                          />
                          <span className="text-xs text-slate-500">{cat.label}</span>
                        </span>
                        <span className="font-medium text-slate-800 group-hover:text-slate-900">
                          {n.label}
                        </span>
                        <span className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {n.description}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* footer nav */}
            <div className="mt-12 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition"
                style={{ background: accent }}
              >
                ← 看其他應用指南
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                前往知識圖譜
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
