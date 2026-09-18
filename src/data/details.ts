import raw from "./details.json";

// Extended, long-form content for each concept, keyed by node id.
// Kept separate from graph.json so the structural graph stays lean and the
// LLM extraction script doesn't have to round-trip prose.
// 內容放在 details.json，方便用程式批次合併；這裡只放型別。
//
// `detail`  — 2-4 sentence extended explanation (繁體中文).
// `figures` — key historical figures associated with the concept.
// `reading` — real, well-known seminal works (no fabricated citations).

export interface ConceptSection {
  heading: string;
  /** paragraphs separated by a blank line (\n\n) */
  body: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface ConceptDetail {
  /** lead overview; paragraphs separated by a blank line (\n\n) */
  detail: string;
  /** optional in-depth sections (核心理念 / 主要技術 / 適用對象 / 實證基礎 …) */
  sections?: ConceptSection[];
  figures?: string[];
  /** seminal works, plain text */
  reading?: string[];
  /** real web references, clickable */
  sources?: SourceLink[];
}

export const DETAILS = raw as Record<string, ConceptDetail>;
