import type { Figure } from "@/lib/media";

// 概念與經典研究的附圖。點圖片會開新分頁看原尺寸（示意圖在側欄裡會縮得比較小）
// imgClass 控制圖片最大高度：側欄窄，預設壓低；獨立頁面比較寬，可以放大
export default function Figures({
  items,
  className = "",
  imgClass = "max-h-80",
}: {
  items: Figure[];
  className?: string;
  imgClass?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={`space-y-5 ${className}`}>
      {items.map((f) => (
        <figure key={f.src}>
          <a href={f.src} target="_blank" rel="noopener noreferrer" title="開啟原圖">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.src}
              alt={f.caption}
              loading="lazy"
              className={`${imgClass} w-full rounded-xl border border-slate-200 bg-white object-contain p-1`}
            />
          </a>
          <figcaption className="mt-1.5 text-xs leading-relaxed text-slate-500">
            {f.caption}
            <span className="ml-1 text-slate-400">
              {f.source ? (
                <a href={f.source} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 hover:underline">
                  （{f.author}，{f.license}）
                </a>
              ) : (
                "（本站繪製）"
              )}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
