import { graphData } from "./graph";

// 把說明文字裡提到的其他概念／人物換成連結。
// 比對用的詞：完整名稱、去掉括號的名稱、括號裡的原文、別名。
const TERMS = new Map<string, string>();
for (const n of graphData.nodes) {
  const paren = n.label.match(/^(.+?)\s*\((.+)\)$/);
  for (const t of [n.label, ...(paren ? [paren[1], paren[2]] : []), ...(n.aliases ?? [])]) {
    if (t.length >= 2 && !TERMS.has(t)) TERMS.set(t, n.id);
  }
}

// 長的詞排前面，「反移情」才不會被「移情」搶先比對到
const PATTERN = [...TERMS.keys()]
  .sort((a, b) => b.length - a.length)
  .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

const LATIN = /[A-Za-z0-9]/;

// 英文詞要前後不接英數字；單字（姓氏）前面若接著另一個英文名字，代表是別人的全名，
// 例如 Judith S. Beck 不能連到 Aaron T. Beck、Laura Perls 不能連到 Fritz Perls
function boundaryOk(text: string, start: number, term: string): boolean {
  if (!LATIN.test(term[0])) return true;
  const before = text[start - 1] ?? "";
  const after = text[start + term.length] ?? "";
  if (LATIN.test(before) || LATIN.test(after)) return false;
  return term.includes(" ") || !/[A-Za-z]\.?\s$/.test(text.slice(0, start));
}

function* matches(text: string) {
  const re = new RegExp(PATTERN, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (boundaryOk(text, m.index, m[0])) {
      yield { index: m.index, term: m[0], id: TERMS.get(m[0])! };
    } else {
      re.lastIndex = m.index + 1;
    }
  }
}

/** 一段文字裡第一個提到的節點 id，例如「Aaron T. Beck（憂鬱的認知理論）」→ beck */
export function findNodeId(text: string): string | undefined {
  return matches(text).next().value?.id;
}

/**
 * 回傳一個 linkify 函式。同一個 linker 裡每個節點只連第一次出現的地方，
 * 自己不連自己。每次 render 都要重新建立。
 */
export function createLinker(selfId: string) {
  const seen = new Set<string>([selfId]);
  return function linkify<T>(
    text: string,
    link: (id: string, text: string, key: string) => T
  ): (string | T)[] {
    const out: (string | T)[] = [];
    let last = 0;
    for (const m of matches(text)) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      out.push(text.slice(last, m.index), link(m.id, m.term, `${m.id}-${m.index}`));
      last = m.index + m.term.length;
    }
    out.push(text.slice(last));
    return out;
  };
}

/** 去掉括號原文的短名，例如「佛洛伊德 (Sigmund Freud)」→「佛洛伊德」 */
export function shortLabel(label: string): string {
  return label.replace(/\s*\(.+\)$/, "");
}
