// 下載人物照片到 public/people/，授權資訊寫進 src/data/portraits.json
// 只抓英文維基百科標記為自由授權的主圖（pageimages 預設 pilicense=free）
// 值寫 "File:..." 就直接用那張 Commons 圖，不查維基百科
// 用法：node scripts/fetch-portraits.mjs
import { writeFileSync } from "node:fs";

const PEOPLE = {
  freud: "Sigmund_Freud",
  "anna-freud": "Anna_Freud",
  rogers: "Carl_Rogers",
  beck: "Aaron_T._Beck",
  ellis: "Albert_Ellis",
  perls: "Fritz_Perls",
  linehan: "Marsha_M._Linehan",
  hayes: "Steven_C._Hayes",
  bowlby: "John_Bowlby",
  ainsworth: "Mary_Ainsworth",
  pavlov: "Ivan_Pavlov",
  skinner: "B._F._Skinner",
  bandura: "Albert_Bandura",
  // 維基百科主圖不是自由授權，改用 Commons 上另一張
  minuchin: "File:Salvador Minuchin (2013).jpg",
  "michael-white": "Michael_White_(psychotherapist)",
  "de-shazer": "Steve_de_Shazer",
  "kabat-zinn": "Jon_Kabat-Zinn",
  // shapiro：Commons 唯一一張是講台遠景，看不清臉，不用
  "william-miller": "William_R._Miller",
  yalom: "Irvin_D._Yalom",
  wechsler: "David_Wechsler",
};

const UA = { "User-Agent": "psych-knowledge-graph/1.0 (https://github.com/hsuiris/psych-knowledge-graph)" };
const api = async (host, params) =>
  (await fetch(`https://${host}/w/api.php?format=json&formatversion=2&${new URLSearchParams(params)}`, { headers: UA })).json();
const strip = (html = "") => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
// Artist 欄常見「Unknown author」重複兩次，或只填上傳者 email；後者改用 Credit 欄
const author = (m) => {
  const a = strip(m.Artist?.value);
  if (!a || /unknown author/i.test(a)) return "作者不詳";
  return a.includes("@") ? strip(m.Credit?.value) : a.replace(/^User:/, "");
};

const out = {};
for (const [id, title] of Object.entries(PEOPLE)) {
  let file = title;
  if (!title.startsWith("File:")) {
    const page = (await api("en.wikipedia.org", { action: "query", prop: "pageimages", piprop: "name", titles: title, redirects: 1 })).query.pages[0];
    if (!page?.pageimage) { console.log(`✗ ${id}: 沒有自由授權照片`); continue; }
    file = `File:${page.pageimage}`;
  }
  const info = (await api("commons.wikimedia.org", { action: "query", prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: 330, titles: file })).query.pages[0]?.imageinfo?.[0];
  if (!info) { console.log(`✗ ${id}: Commons 查不到 ${file}`); continue; }
  const m = info.extmetadata;
  const ext = info.thumburl.match(/\.(jpe?g|png)$/i)?.[1].toLowerCase().replace("jpeg", "jpg") ?? "jpg";
  const img = await fetch(info.thumburl, { headers: UA });
  if (!img.ok) { console.log(`✗ ${id}: 下載失敗 ${img.status}`); continue; }
  writeFileSync(`public/people/${id}.${ext}`, Buffer.from(await img.arrayBuffer()));
  out[id] = {
    src: `/people/${id}.${ext}`,
    author: author(m),
    license: strip(m.LicenseShortName?.value),
    source: info.descriptionurl,
  };
  console.log(`✓ ${id}: ${out[id].license} / ${out[id].author}`);
}
writeFileSync("src/data/portraits.json", JSON.stringify(out, null, 2) + "\n");
