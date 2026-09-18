// 從 Wikimedia Commons 下載圖片，授權資訊一併記錄
// PEOPLE：人物照片 → public/people/，src/data/portraits.json
//   只抓英文維基百科標記為自由授權的主圖（pageimages 預設 pilicense=free）
//   值寫 "File:..." 就直接用那張 Commons 圖，不查維基百科
// IMAGES：概念與經典研究的附圖 → public/images/，src/data/images.json
// 用法：node scripts/fetch-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";

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
  watson: "File:John Broadus Watson.JPG",
  // harlow：維基百科主圖是恆河猴實驗的圖，不是本人，不用
  seligman: "File:Martin Seligman Philadelphia 2009.jpg",
  "anna-o": "File:Pappenheim 1882.jpg",
  // AlfredAdler.jpg 有商業圖庫浮水印，授權可疑，改用公有領域的這張
  adler: "File:Alfred Adler.jpg",
  frankl: "File:Viktor Frankl2.jpg",
  glasser: "File:WilliamGlasser.jpg",
  berne: "File:Eric Berne at his wedding in 1942.jpg",
  "virginia-satir": "File:VirginiaSatir.jpg",
  "kubler-ross": "File:Elisabeth Kübler-Ross, 1978 (cropped).jpg",
  holland: "John_L._Holland",
  axline: "Virginia_Axline",
  kalff: "Dora_Kalff",
};

// [Commons 檔名, 中文說明]
const IMAGES = {
  psychoanalysis: [["File:Sigmund Freud's couch.jpg", "佛洛伊德的躺椅，現存於倫敦的佛洛伊德博物館。當事人躺在上面自由聯想，分析師坐在後方，不在當事人的視線內。"]],
  cbt: [["File:Cognitive behavioral therapy - basic tenets.svg", "認知行為治療的基本模型：想法（thoughts）、情緒（feelings）、行為（behavior）三者互相影響，中間是更深層的核心信念（core beliefs）。"]],
  "family-therapy": [["File:Ty Lee genogram.png", "家系圖（genogram）範例：用固定的符號畫出三代家庭成員、彼此關係與重要事件，是家族治療常用的評估工具。"]],
  "pavlov-dog": [
    ["File:One of Pavlov's dogs.jpg", "巴夫洛夫實驗用過的狗之一，製成標本保存在俄羅斯梁贊的巴夫洛夫博物館。"],
    ["File:Pavlov's dog conditioning.svg", "古典制約示意圖（圖中用鈴鐺代表聲音刺激）：一開始只有食物會讓狗流口水；聲音與食物反覆一起出現後，只有聲音也會讓狗流口水。"],
  ],
  "little-albert": [["File:Little-albert.jpg", "1920 年實驗影片的畫面，原圖說寫著「現在他連聖誕老人都怕」。Albert 被制約害怕白老鼠之後，恐懼類化到聖誕老人面具的白鬍子等毛茸茸的東西。"]],
  "skinner-box": [
    ["File:Skinner box photo 02.jpg", "實驗室裡的史金納箱。老鼠按壓箱內的槓桿，就會得到食物。"],
    ["File:Skinner box scheme 01.svg", "史金納箱的構造示意：槓桿、給食器、當作訊號的燈號，以及可以通電的地板（用來呈現懲罰）。"],
  ],
  "bobo-doll": [["File:Bobo doll-en.svg", "波波玩偶是一種充氣的不倒翁，底部有重物，打倒後會自己彈回來。"]],
  "harlow-monkeys": [["File:Natural of Love Typical response to cloth mother surrogate in fear test.jpg", "Harlow 論文中的圖：幼猴受到驚嚇時，會跑去緊緊抱住絨布媽媽，而不是給奶的鐵絲媽媽。"]],
  "learned-helplessness": [["File:Shuttle Box Dog Orange.png", "實驗使用的梭箱（shuttle box）：狗只要跳過中間的矮隔板，就能逃到不會電擊的另一側。"]],
  milgram: [
    ["File:Milgram experiment v2.svg", "實驗配置：實驗者（E）要求受試者（老師 T）對隔壁房間的學生（L）施以電擊。學生其實是演員，並沒有真的被電。"],
    ["File:Milgram Experiment advertising.png", "米爾格倫刊登在報紙上的招募廣告，以「記憶研究」的名義徵求受試者，參加一小時付 4 美元。"],
  ],
  rorschach: [["File:Rorschach blot 01.jpg", "羅夏克墨漬測驗十張圖卡中的第一張。受測者要回答「這看起來像什麼」。"]],
  sandplay: [
    ["File:Sandspiel2.jpg", "沙遊治療的沙盤：當事人在裝了沙的淺盒裡擺放小物件，用畫面表達難以說出口的內在經驗。"],
    ["File:Sandspiel Figuren1.jpg", "沙遊室架上的小物件，包括人物、動物、建築、交通工具與自然物，讓當事人自由挑選。"],
  ],
  "art-therapy": [["File:Art Mediums commonly used for Art Therapy.JPG", "藝術治療常用的媒材。治療師會依當事人的狀況選擇，例如容易控制的色鉛筆，或比較能釋放情緒的顏料與黏土。"]],
  "play-therapy": [["File:놀이치료.jpg", "遊戲治療室的地板上擺滿玩具（韓國諮商機構的情境照）。玩具種類多元，讓孩子能用遊戲表達說不出口的感受。"]],
  dementia: [["File:Alzheimer's disease brain comparison.jpg", "正常大腦（左）與重度阿茲海默症大腦（右）的切面示意：阿茲海默症的大腦皮質明顯萎縮，負責記憶的海馬迴（hippocampus）縮小，腦室變大。"]],
  genogram: [["File:Ty Lee genogram.png", "家系圖範例：方形代表男性、圓形代表女性，線條代表婚姻、親子與關係的品質，旁邊註記年齡與重要事件。"]],
  "ace-study": [["File:The ACE Pyramid.gif", "美國疾病管制與預防中心的 ACE 金字塔：由下往上，說明童年逆境經驗如何經過社會、情緒與認知發展受損、危險行為、疾病，一路影響到早逝。"]],
};

const UA = { "User-Agent": "psych-knowledge-graph/1.0 (https://github.com/hsuiris/psych-knowledge-graph)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const api = async (host, params) => {
  for (let i = 1; ; i++) {
    const res = await fetch(`https://${host}/w/api.php?format=json&formatversion=2&${new URLSearchParams(params)}`, { headers: UA });
    if (res.status !== 429 || i === 5) return res.json();
    await sleep(20000 * i);
  }
};
const strip = (html = "") => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
// Artist 欄常見「Unknown author」重複兩次，或只填上傳者 email；後者改用 Credit 欄
const author = (m) => {
  const a = strip(m.Artist?.value);
  if (!a || /^unknown|unknown author/i.test(a)) return "作者不詳";
  return a.includes("@") ? strip(m.Credit?.value) : a.replace(/^(w:)?User:/, "");
};

async function commons(file, dir, id) {
  const info = (await api("commons.wikimedia.org", { action: "query", prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: 330, titles: file })).query.pages[0]?.imageinfo?.[0];
  if (!info) throw new Error(`Commons 查不到 ${file}`);
  const m = info.extmetadata;
  const ext = info.thumburl.match(/\.(jpe?g|png|gif)$/i)?.[1].toLowerCase().replace("jpeg", "jpg") ?? "jpg";
  const img = await fetch(info.thumburl, { headers: UA });
  if (!img.ok) throw new Error(`下載失敗 ${img.status} ${file}`);
  writeFileSync(`public/${dir}/${id}.${ext}`, Buffer.from(await img.arrayBuffer()));
  return { src: `/${dir}/${id}.${ext}`, author: author(m), license: strip(m.LicenseShortName?.value), source: info.descriptionurl };
}

const out = {};
for (const [id, title] of Object.entries(PEOPLE)) {
  let file = title;
  if (!title.startsWith("File:")) {
    const page = (await api("en.wikipedia.org", { action: "query", prop: "pageimages", piprop: "name", titles: title, redirects: 1 })).query.pages[0];
    if (!page?.pageimage) { console.log(`✗ ${id}: 沒有自由授權照片`); continue; }
    file = `File:${page.pageimage}`;
  }
  out[id] = await commons(file, "people", id);
  console.log(`✓ ${id}: ${out[id].license} / ${out[id].author}`);
  await sleep(1500); // Commons 會對太密集的請求回 429
}
writeFileSync("src/data/portraits.json", JSON.stringify(out, null, 2) + "\n");

mkdirSync("public/images", { recursive: true });
const images = {};
for (const [id, list] of Object.entries(IMAGES)) {
  images[id] = [];
  for (const [i, [file, caption]] of list.entries()) {
    images[id].push({ ...(await commons(file, "images", `${id}-${i + 1}`)), caption });
    console.log(`✓ ${id}-${i + 1}: ${images[id].at(-1).license}`);
    await sleep(1500);
  }
}
writeFileSync("src/data/images.json", JSON.stringify(images, null, 2) + "\n");
