"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
  /** nesting level: 0 = section, 1 = sub-section */
  level?: number;
}

interface Props {
  items: TocItem[];
}

/**
 * Wikipedia-style table of contents. Anchors jump to in-page sections and the
 * current section is highlighted as you scroll (scroll-spy via
 * IntersectionObserver).
 */
export default function TableOfContents({ items }: Props) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const ids = items.map((i) => i.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) setActive(visible[0].target.id);
      },
      // trigger when a heading reaches the upper third of the viewport
      { rootMargin: "-12% 0px -75% 0px", threshold: 0 }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="本頁目錄" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        本頁目錄
      </p>
      <ul className="border-l border-slate-200">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`-ml-px block border-l-2 py-1.5 transition ${
                  it.level === 1 ? "pl-7 text-[13px]" : "pl-3"
                } ${
                  on
                    ? "border-indigo-500 font-medium text-indigo-600"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
