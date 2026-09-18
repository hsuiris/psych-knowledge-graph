import raw from "@/data/portraits.json";

// 照片由 scripts/fetch-portraits.mjs 從 Wikimedia Commons 下載，授權資訊一併記錄
export interface Portrait {
  src: string;
  author: string;
  license: string;
  source: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const portraits = raw as Record<string, Portrait>;

export function portraitOf(id: string): Portrait | undefined {
  const p = portraits[id];
  return p && { ...p, src: BASE + p.src };
}
