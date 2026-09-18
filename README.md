# 心理諮商知識圖譜

> An interactive knowledge graph of counseling and clinical psychology, in Traditional Chinese.

諮商與臨床心理學的核心概念，用一張可以點的圖譜串起來。60 個概念、78 條關係，分成六大類。點一個概念，看得到它的定義、英文原文，以及它跟哪些概念有什麼關係，再沿著關係往下探索。

**網站：https://hsuiris.github.io/psych-knowledge-graph/**

![知識圖譜首頁](docs/screenshots/hero.png)

## 為什麼做這個

教科書用章節排列知識，但概念之間其實是網狀的。移情和反移情是一組對應關係，兩者都是精神分析的工作素材；暴露療法屬於認知行為治療的技術，用來處理焦慮症和創傷後壓力症。這些關係在書裡要跨章節才拼得出來，圖譜可以直接看到。

## 功能

### 點概念看說明，沿關係探索

點任何一個節點，右側出現說明與相關概念。相關概念依關係類型分組，例如精神分析「運用」移情、移情「對應」反移情。點相關概念會直接跳過去，圖譜跟著聚焦，其他節點淡化。

![點選概念後的側欄](docs/screenshots/selected.png)

### 每個概念都有獨立頁面

60 個概念各有一頁，含定義、別名、關係列表，網址可以直接分享。這些頁面是靜態產生的，搜尋引擎爬得到。

![概念頁](docs/screenshots/concept.png)

### 實用應用指南

六個生活情境的導覽頁，把相關概念串成一條閱讀路線，例如青少年心理、職場團隊、員工心理。

![應用指南](docs/screenshots/apply.png)

### 其他

- 六大分類著色：治療學派、理論概念、心理疾患、評估診斷、諮商技術、倫理專業。點圖例可以只看某幾類。
- 模糊搜尋：輸入概念名稱、英文或別名，選取後圖譜自動聚焦。
- 樞紐概念（連結數 4 以上）在任何縮放層級都顯示名稱。

## 技術

| 項目 | 選擇 | 理由 |
| --- | --- | --- |
| 框架 | Next.js 16 App Router + TypeScript | 60 個概念頁用 `generateStaticParams` 靜態產生 |
| 圖譜 | react-force-graph-2d（Canvas） | 60 節點的力導向布局，拖曳與縮放都順 |
| 搜尋 | Fuse.js | 純前端模糊比對，不需要後端或金鑰 |
| 樣式 | Tailwind CSS 4 | |
| 部署 | GitHub Pages，靜態輸出 | 全站零後端、零金鑰，71 頁全部預先產生 |

## 資料

節點與關係放在 `src/data/graph.json`，概念說明放在 `src/data/details.ts`。

```jsonc
{
  "nodes": [
    { "id": "cbt", "label": "認知行為治療 (CBT)", "category": "therapy",
      "aliases": ["CBT"], "description": "…" }
  ],
  "links": [
    { "source": "cbt", "target": "depression", "relation": "用於治療" }
  ]
}
```

`category` 必為 `therapy`、`theory`、`disorder`、`assessment`、`technique`、`ethics` 其中之一。

`scripts/extract.ts` 是擴充用的腳本：讀一份來源文本，請 LLM 抽出概念與關係，再合併進圖譜，依 id 去重、自動丟棄接不到節點的邊。擴充要自己的 API 金鑰，網站本體不需要。

```bash
export ANTHROPIC_API_KEY=...   # 或 OPENAI_API_KEY
npm run extract path/to/source.txt
```

## 本機跑起來

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 靜態輸出到 out/
```

## 下一步

- 語意搜尋：把 Fuse.js 的字面比對換成 embedding，讓「我一直想討好別人」這種描述也搜得到相關概念。
- 概念說明補上來源出處。

## 授權

程式碼 MIT。概念說明為自行整理，不是教科書逐字內容。
