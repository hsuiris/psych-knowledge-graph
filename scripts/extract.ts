/**
 * LLM graph extraction / expansion.
 *
 * Reads a source text file, asks a cloud LLM to extract psychology concepts
 * and their relations as graph JSON, then merges the result into
 * src/data/graph.json (de-duplicating by node id).
 *
 * Usage:
 *   ANTHROPIC_API_KEY=...  npx tsx scripts/extract.ts path/to/source.txt
 *   OPENAI_API_KEY=...     npx tsx scripts/extract.ts path/to/source.txt
 *
 * No API key set?  The website still runs on the hand-built seed graph;
 * this script is only for growing it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import "dotenv/config";

const CATEGORIES = ["therapy", "theory", "disorder", "assessment", "technique", "ethics"];
const GRAPH_PATH = resolve(process.cwd(), "src/data/graph.json");

interface Node {
  id: string;
  label: string;
  category: string;
  description: string;
  aliases?: string[];
}
interface Link {
  source: string;
  target: string;
  relation: string;
}
interface Graph {
  nodes: Node[];
  links: Link[];
}

const SYSTEM = `你是諮商與臨床心理學的知識圖譜建構專家。
從提供的文本中抽取核心「概念」與概念之間的「關係」，輸出為 JSON。
規則：
- 每個概念是一個節點，category 必須是其中之一：${CATEGORIES.join(", ")}
  (therapy=治療學派, theory=理論概念, disorder=心理疾患, assessment=評估診斷, technique=諮商技術, ethics=倫理專業)
- id 用英文小寫 kebab-case；label 用繁體中文（必要時括註英文/縮寫）。
- description 為繁體中文 1-3 句的精確說明。
- 關係的 source/target 必須對應到節點 id；relation 是繁中的簡短關係詞（如「用於治療」「理論基礎」「包含」「相關」）。
- 只輸出 JSON，格式：{"nodes":[...],"links":[...]}，不要任何額外文字。`;

function buildPrompt(text: string): string {
  return `請從以下文本抽取心理諮商/臨床心理知識圖譜：\n\n"""\n${text.slice(0, 12000)}\n"""`;
}

async function callAnthropic(text: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: "user", content: buildPrompt(text) }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text as string;
}

async function callOpenAI(text: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildPrompt(text) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content as string;
}

function parseGraph(raw: string): Graph {
  const cleaned = raw.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const json = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(json) as Graph;
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.links)) {
    throw new Error("LLM output missing nodes/links arrays");
  }
  return parsed;
}

function merge(base: Graph, add: Graph): { graph: Graph; added: number } {
  const ids = new Set(base.nodes.map((n) => n.id));
  let added = 0;
  for (const n of add.nodes) {
    if (!n.id || !CATEGORIES.includes(n.category)) continue;
    if (!ids.has(n.id)) {
      base.nodes.push(n);
      ids.add(n.id);
      added++;
    }
  }
  const linkKey = (l: Link) => `${l.source}->${l.target}`;
  const existing = new Set(base.links.map(linkKey));
  for (const l of add.links) {
    if (!ids.has(l.source) || !ids.has(l.target)) continue; // drop dangling
    if (!existing.has(linkKey(l))) {
      base.links.push(l);
      existing.add(linkKey(l));
    }
  }
  return { graph: base, added };
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("用法: npx tsx scripts/extract.ts <source.txt>");
    process.exit(1);
  }
  const text = readFileSync(resolve(process.cwd(), file), "utf8");

  let raw: string;
  if (process.env.ANTHROPIC_API_KEY) {
    console.log("→ 使用 Anthropic Claude 抽取…");
    raw = await callAnthropic(text);
  } else if (process.env.OPENAI_API_KEY) {
    console.log("→ 使用 OpenAI 抽取…");
    raw = await callOpenAI(text);
  } else {
    console.error(
      "未偵測到 API 金鑰。請設定 ANTHROPIC_API_KEY 或 OPENAI_API_KEY（可放在 .env）。"
    );
    process.exit(1);
  }

  const extracted = parseGraph(raw);
  const base = JSON.parse(readFileSync(GRAPH_PATH, "utf8")) as Graph;
  const { graph, added } = merge(base, extracted);
  writeFileSync(GRAPH_PATH, JSON.stringify(graph, null, 2) + "\n", "utf8");
  console.log(
    `✓ 抽取 ${extracted.nodes.length} 概念，新增 ${added} 個。` +
      `目前共 ${graph.nodes.length} 概念 / ${graph.links.length} 關係。`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
