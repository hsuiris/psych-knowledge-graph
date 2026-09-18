"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { graphData } from "@/lib/graph";
import { CATEGORY_LIST } from "@/lib/categories";
import { GUIDE_GROUPS, guidesByGroup } from "@/data/guides";

// Pre-group concepts by category once (module scope — data is static).
const CONCEPTS_BY_CATEGORY = CATEGORY_LIST.map((cat) => ({
  cat,
  nodes: graphData.nodes
    .filter((n) => n.category === cat.id)
    .sort((a, b) => a.label.localeCompare(b.label, "zh-Hant")),
}));

export default function KnowledgeNav() {
  const pathname = usePathname();
  const activeConcept = pathname.startsWith("/concept/")
    ? decodeURIComponent(pathname.slice("/concept/".length))
    : null;
  const activeGuide = pathname.startsWith("/apply/")
    ? decodeURIComponent(pathname.slice("/apply/".length))
    : null;

  return (
    <nav aria-label="知識庫導覽" className="text-sm">
      <Link href="/" className="block">
        <span className="text-base font-bold tracking-tight text-slate-900">
          心理學知識庫
        </span>
      </Link>

      {/* top-level sections */}
      <ul className="mt-4 space-y-0.5">
        <NavLink href="/" active={pathname === "/"} label="🧠 知識圖譜" />
        <NavLink
          href="/apply"
          active={pathname === "/apply"}
          label="🧭 應用指南"
        />
      </ul>

      {/* concept categories */}
      <Section title="概念分類">
        {CONCEPTS_BY_CATEGORY.map(({ cat, nodes }) => {
          const containsActive = nodes.some((n) => n.id === activeConcept);
          return (
            <details key={cat.id} open={containsActive} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 text-slate-600 hover:bg-slate-100">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: cat.color }}
                />
                <span className="flex-1 font-medium">{cat.label}</span>
                <span className="text-xs text-slate-400">{nodes.length}</span>
                <span
                  aria-hidden
                  className="text-xs text-slate-400 transition group-open:rotate-90"
                >
                  ▸
                </span>
              </summary>
              <ul className="mt-0.5 mb-1 ml-3 border-l border-slate-200 pl-2">
                {nodes.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/concept/${n.id}`}
                      className={`block rounded-md px-2 py-1 text-[13px] transition ${
                        n.id === activeConcept
                          ? "bg-indigo-50 font-medium text-indigo-700"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </Section>

      {/* applied guides */}
      <Section title="應用指南">
        {GUIDE_GROUPS.map((group) => (
          <div key={group.id} className="mb-2">
            <p className="px-2 py-1 text-xs font-medium text-slate-400">
              {group.label}
            </p>
            <ul>
              {guidesByGroup(group.id).map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/apply/${g.id}`}
                    className={`flex items-center gap-2 rounded-md px-2 py-1 text-[13px] transition ${
                      g.id === activeGuide
                        ? "bg-indigo-50 font-medium text-indigo-700"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                  >
                    <span aria-hidden>{g.emoji}</span>
                    <span>{g.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    </nav>
  );
}

function NavLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`block rounded-md px-2 py-1.5 font-medium transition ${
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      {children}
    </div>
  );
}
