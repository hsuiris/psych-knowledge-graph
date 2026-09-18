import portraits from "@/data/portraits.json";
import commons from "@/data/images.json";
import diagrams from "@/data/diagrams.json";

// 照片與附圖由 scripts/fetch-images.mjs 從 Wikimedia Commons 下載，授權資訊一併記錄；
// 示意圖由 scripts/draw-diagrams.py 繪製，沒有作者欄位
export interface Portrait {
  src: string;
  author: string;
  license: string;
  source: string;
}

export interface Figure {
  src: string;
  caption: string;
  author?: string;
  license?: string;
  source?: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function portraitOf(id: string): Portrait | undefined {
  const p = (portraits as Record<string, Portrait>)[id];
  return p && { ...p, src: BASE + p.src };
}

export function imagesOf(id: string): Figure[] {
  const list = [
    ...((commons as Record<string, Figure[]>)[id] ?? []),
    ...((diagrams as Record<string, Figure[]>)[id] ?? []),
  ];
  return list.map((f) => ({ ...f, src: BASE + f.src }));
}
