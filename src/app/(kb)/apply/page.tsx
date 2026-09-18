import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE_GROUPS, guidesByGroup, type Guide } from "@/data/guides";

export const metadata: Metadata = {
  title: "實用心理學應用指南｜看懂人心，用在生活",
  description:
    "把心理學變成生活中用得上的方法——給主管的員工心理學、給父母的青少年心理學，以及職場團隊、自我照顧、自卑超越等實用主題。",
};

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/apply/${guide.id}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: guide.accent }}
      />
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden>
          {guide.emoji}
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          style={{ background: `${guide.accent}1f`, color: guide.accent }}
        >
          {guide.audience}
        </span>
      </div>
      <h3 className="text-xl font-bold tracking-tight text-slate-900">
        {guide.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500">{guide.tagline}</p>
      <span className="mt-auto pt-2 text-sm font-medium text-slate-700 transition group-hover:translate-x-0.5">
        閱讀指南 →
      </span>
    </Link>
  );
}

export default function ApplyLanding() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <div className="h-1 w-full bg-linear-to-r from-indigo-500 via-cyan-400 to-amber-400" />

      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
        <nav className="mb-10 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            知識圖譜
          </Link>
          <span>/</span>
          <span className="text-slate-600">應用指南</span>
        </nav>

        <header className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            實用心理學應用指南
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            知識圖譜帶你認識整個心理學領域；這裡則把這些概念，整理成你在生活與工作中
            <span className="font-medium text-slate-900">真的用得上</span>的方法——
            看懂人心、解決實際處境、也更了解自己。
          </p>
          <p className="mt-3 text-sm text-slate-500">
            每篇指南都連回知識圖譜中的相關概念，想深入理論時隨時可以跳過去。
          </p>
        </header>

        <div className="mt-12 space-y-14">
          {GUIDE_GROUPS.map((group) => {
            const guides = guidesByGroup(group.id);
            if (guides.length === 0) return null;
            return (
              <section key={group.id}>
                <div className="mb-5 flex items-baseline gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {group.label}
                  </h2>
                  <p className="text-sm text-slate-500">{group.blurb}</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {guides.map((g) => (
                    <GuideCard key={g.id} guide={g} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 border-t border-slate-200 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            ← 回到知識圖譜
          </Link>
        </div>
      </div>
    </div>
  );
}
