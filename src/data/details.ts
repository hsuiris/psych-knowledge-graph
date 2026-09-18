// Extended, long-form content for each concept, keyed by node id.
// Kept separate from graph.json so the structural graph stays lean and the
// LLM extraction script doesn't have to round-trip prose.
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

export const DETAILS: Record<string, ConceptDetail> = {
  // ---- 治療學派 ----
  psychoanalysis: {
    detail:
      "精神分析將心理結構區分為本我、自我與超我，並主張童年經驗與被壓抑的衝突會以症狀、口誤與夢的形式浮現。治療透過自由聯想、夢的解析與對移情的詮釋，使潛意識素材逐漸被理解與整合，屬於長期、洞察取向的工作。後續發展出客體關係、自我心理學與自體心理學等流派。",
    figures: ["佛洛伊德 (Sigmund Freud)", "安娜·佛洛伊德 (Anna Freud)"],
    reading: ["Freud, S. (1900). 夢的解析 (The Interpretation of Dreams)"],
  },
  cbt: {
    detail:
      "認知行為治療（Cognitive Behavioral Therapy, CBT）由精神科醫師 Aaron T. Beck 於 1960 年代發展，與 Albert Ellis 的理情行為治療 (REBT) 同屬認知取向的先驅。它的出發點是一個看似簡單卻深刻的觀察：真正困擾我們的，往往不是事件本身，而是我們對事件的「解讀」。\n\n同一件事——例如訊息已讀不回——有人解讀成「他在忙」而平靜，有人解讀成「他討厭我」而焦慮。CBT 主張，只要學會辨識並調整這些不準確的想法，連帶的情緒與行為就會跟著改變。它也是目前實證研究最充分、被各國治療指引廣泛推薦的心理治療之一。",
    sections: [
      {
        heading: "核心理念：認知模式",
        body:
          "Beck 提出「認知模式」：事件 → 自動化思考 → 情緒與行為。我們在情境中會冒出一閃即逝、未經檢驗的「自動化思考」，而它們又受更深層的「核心信念」與「中介信念（規則與假設）」影響。\n\n當這些想法出現系統性偏誤，也就是「認知扭曲」（如災難化、非黑即白、讀心術、過度類化），便容易不成比例地放大負向情緒。CBT 的工作，就是把這些自動冒出的念頭攤開來檢視。",
      },
      {
        heading: "主要技術",
        body:
          "CBT 是結構化、目標明確的短程治療，常見技術包括：(1) 思考記錄表，捕捉並檢驗自動化思考的證據；(2) 認知重構，以蘇格拉底式提問發展更平衡的想法；(3) 行為實驗，實際驗證自己的負向預測；(4) 行為活化，用活動安排打破憂鬱的退縮循環；(5) 暴露法，用於焦慮與恐懼。治療師也常指派「家庭作業」，把練習延伸到日常生活。",
      },
      {
        heading: "適用對象",
        body:
          "CBT 對憂鬱症、各類焦慮症、強迫症、創傷後壓力症、失眠與飲食障礙等都有良好效果，也被改編為兒少、伴侶與團體形式，並衍生出辯證行為治療 (DBT)、接納與承諾治療 (ACT) 與正念認知治療 (MBCT) 等「第三波」取向。",
      },
      {
        heading: "實證基礎",
        body:
          "CBT 是被研究得最多的心理治療。對中度至重度憂鬱，研究顯示其療效可與抗憂鬱藥物相當，且在預防復發上往往更具長期優勢；對焦慮與強迫症，含暴露成分的 CBT 更被列為第一線治療。",
      },
    ],
    figures: ["Aaron T. Beck", "Albert Ellis", "Judith S. Beck"],
    reading: [
      "Beck, A. T. (1979). Cognitive Therapy of Depression",
      "Beck, J. S. (2011). Cognitive Behavior Therapy: Basics and Beyond",
    ],
    sources: [
      {
        label: "認知治療入門指南（香港大學 JCA-Connect）",
        url: "https://www.socsc.hku.hk/JCA-Connect/wp-content/uploads/pdf/4.%20%E8%AA%8D%E7%9F%A5%E6%B2%BB%E7%99%82%E5%85%A5%E9%96%80%E6%8C%87%E5%8D%97.pdf",
      },
      {
        label: "認知行為治療怎麼做？快速看懂 CBT 核心要點（Lifewell）",
        url: "https://www.lifewellpsy.com/psychology/cognitive-behavioral-therapy/",
      },
      {
        label: "認知行為治療（CBT）是什麼？（賽馬會心導遊+計劃）",
        url: "https://www.jcthplus.org/article/what-is-cognitive-behavioral-therapy",
      },
    ],
  },
  "person-centered": {
    detail:
      "個人中心治療相信每個人都具有朝向成長的「自我實現傾向」，治療師的任務是提供能釋放這股潛能的關係條件。Rogers 提出三個核心條件：真誠一致、無條件正向關懷與同理理解。治療是非指導性的，重視當事人的主觀經驗與自我引導。",
    figures: ["Carl Rogers"],
    reading: ["Rogers, C. (1951). Client-Centered Therapy"],
  },
  gestalt: {
    detail:
      "完形治療強調「此時此地」的覺察與經驗的整體性，認為改變來自於充分接觸當下而非分析過去。治療師常運用空椅法、誇大、實驗等技術，協助當事人完成未竟事務並重新整合被否認的部分。",
    figures: ["Fritz Perls", "Laura Perls"],
  },
  dbt: {
    detail:
      "辯證行為治療最初為慢性自殺與邊緣型人格者設計，核心是「接納」與「改變」之間的辯證平衡。標準療程包含個別治療、技巧訓練團體、電話教練與治療師諮詢團隊，技巧涵蓋正念、情緒調節、人際效能與痛苦耐受四大模組。",
    figures: ["Marsha Linehan"],
    reading: [
      "Linehan, M. (1993). Cognitive-Behavioral Treatment of Borderline Personality Disorder",
    ],
  },
  act: {
    detail:
      "接納與承諾治療屬第三波行為治療，目標是提升「心理彈性」而非直接消除症狀。它包含六大歷程：接納、認知脫鉤、接觸當下、以自我為脈絡、價值澄清與承諾行動，理論根植於關係框架理論 (RFT)。",
    figures: ["Steven C. Hayes"],
    reading: ["Hayes, S. C. (1999). Acceptance and Commitment Therapy"],
  },
  "family-therapy": {
    detail:
      "家族治療把問題放在家庭系統的互動脈絡中理解，而非個人病理。不同學派各有重點：結構派關注界限與次系統、策略派關注互動循環、Bowen 取向關注分化與多世代傳遞。介入常以改變溝通模式與家庭結構為目標。",
    figures: ["Salvador Minuchin", "Murray Bowen"],
  },
  narrative: {
    detail:
      "敘事治療屬後現代取向，認為人是透過故事來理解自己，而問題常來自被「問題飽和」的主流敘事。治療師協助當事人將問題「外化」（人不等於問題），並透過尋找獨特結果來重寫更貼近其價值的替代故事。",
    figures: ["Michael White", "David Epston"],
    reading: ["White, M., & Epston, D. (1990). Narrative Means to Therapeutic Ends"],
  },
  sfbt: {
    detail:
      "焦點解決短期治療聚焦於當事人想要的未來與既有的資源，而非問題的成因。代表性技術包含奇蹟問句、量尺問句與例外問句，協助找出「什麼時候問題較少」並加以放大。療程通常簡短而目標導向。",
    figures: ["Steve de Shazer", "Insoo Kim Berg"],
    reading: ["de Shazer, S. (1985). Keys to Solution in Brief Therapy"],
  },
  mbct: {
    detail:
      "正念認知治療把正念練習與認知治療結合，主要用於預防反覆發作的憂鬱。它幫助當事人對負向念頭採取「去中心化」的觀察立場，辨識復發的早期徵兆，避免陷入反芻的惡性循環。",
    figures: ["Zindel Segal", "Mark Williams", "John Teasdale"],
    reading: [
      "Segal, Williams, & Teasdale (2002). Mindfulness-Based Cognitive Therapy for Depression",
    ],
  },
  emdr: {
    detail:
      "眼動減敏與歷程更新以「適應性訊息處理」模式為基礎，認為創傷記憶因未被充分處理而持續引發痛苦。治療透過雙側刺激（如眼動）在八個階段中協助記憶再加工，使其失去過度的情緒強度，常用於 PTSD。",
    figures: ["Francine Shapiro"],
    reading: ["Shapiro, F. (2001). Eye Movement Desensitization and Reprocessing"],
  },

  // ---- 理論概念 ----
  unconscious: {
    detail:
      "潛意識指個體無法直接覺察、卻持續影響行為與情緒的心理內容，是精神分析理論的基石。佛洛伊德認為它會透過夢、口誤與症狀「洩漏」，並區分了意識、前意識與潛意識三個層次。",
    figures: ["佛洛伊德 (Sigmund Freud)"],
  },
  "defense-mechanism": {
    detail:
      "防衛機制是自我為了減輕焦慮、保護心理平衡而採用的潛意識策略，由安娜·佛洛伊德系統化。常見者包括壓抑、否認、投射、合理化、退化與較成熟的昇華；防衛的成熟度被視為心理健康的指標之一。",
    figures: ["安娜·佛洛伊德 (Anna Freud)"],
  },
  transference: {
    detail:
      "移情指當事人把過去重要關係中的情感與期待，不自覺地投射到治療師身上。精神分析視其為珍貴的工作素材——治療室裡重演的關係模式，正是可被觀察與修通之處。",
  },
  countertransference: {
    detail:
      "反移情是治療師對當事人所產生的情感反應。古典觀點視其為治療師需克服的盲點，現代取向則認為它也提供關於當事人的重要線索，關鍵在於透過自我覺察與督導加以辨識與運用。",
  },
  attachment: {
    detail:
      "依附理論（Attachment Theory）由英國精神科醫師 John Bowlby 在 1950–60 年代提出，用以解釋嬰兒為何會與主要照顧者形成強烈的情感連結。Bowlby 主張，依附是演化所塑造的生存機制——幼兒透過親近照顧者來獲得保護與安全感，而照顧者就像一個讓孩子能安心向外探索世界的「安全堡壘」。\n\n他進一步提出「內在運作模式（internal working models）」：孩子會從與照顧者的互動中，逐漸形成對「自己是否值得被愛」與「他人是否可靠」的內在藍圖，並延續影響日後的人際關係與情緒調節。Bowlby 的合作者 Mary Ainsworth 則以實驗讓理論落地。",
    sections: [
      {
        heading: "陌生情境與依附類型",
        body:
          "Ainsworth 設計了「陌生情境測驗」，觀察嬰兒在與母親分離、重聚時的反應，至今仍是評估嬰兒依附的經典方法。她歸納出三種類型：安全型（分離時難過、重聚後能被安撫並繼續探索）、焦慮矛盾型（過度黏附、重聚後難以平復）、逃避型（看似獨立、刻意忽略照顧者）。後續研究者 Main 與 Solomon 又補充了「混亂型」，較常見於受創或受虐的孩子。",
      },
      {
        heading: "內在運作模式",
        body:
          "依附經驗會內化為一套關於自我與他人的預期，像濾鏡般影響我們如何詮釋他人的行為、如何在親密關係中求助或退縮。這也是為什麼早期依附被認為與成年後的情緒調節與人際模式息息相關。",
      },
      {
        heading: "成人依附",
        body:
          "1980 年代起，Hazan 與 Shaver 把依附概念延伸到成人愛情，發展出安全、焦慮、逃避等成人依附風格，影響我們在伴侶關係中的安全感、衝突因應與親密程度。情緒取向治療 (EFT) 等取向便以此為理論基礎。",
      },
      {
        heading: "臨床意義",
        body:
          "依附理論深刻影響了發展心理學、親職教育與心理治療。理解一個人的依附史，有助於說明其在關係中的焦慮或迴避，也是邊緣型人格、創傷與親密關係困擾的重要切入點。",
      },
    ],
    figures: ["John Bowlby", "Mary Ainsworth", "Mary Main"],
    reading: [
      "Bowlby, J. (1969). Attachment and Loss, Vol. 1",
      "Ainsworth, M. et al. (1978). Patterns of Attachment",
    ],
    sources: [
      {
        label: "Mary Ainsworth 陌生情境測驗與依附類型（Lee Psy Clinic）",
        url: "https://www.leepsyclinic.com/2026/02/ainsworth-strange-situation.html",
      },
      {
        label: "依附理論—探索人類情感的發展（臺師大 期刊 PDF）",
        url: "http://contemporary.cere.ntnu.edu.tw/sites/default/files/public/2001_9%E5%8D%B73%E6%9C%9F_68-85_%E4%BE%9D%E9%99%84%E7%90%86%E8%AB%96%E2%80%94%E6%8E%A2%E7%B4%A2%E4%BA%BA%E9%A1%9E%E6%83%85%E6%84%9F%E7%9A%84%E7%99%BC%E5%B1%95.pdf",
      },
      {
        label: "依附理論的起源：我們為什麼會依賴別人（泛科學）",
        url: "https://pansci.asia/archives/99774",
      },
    ],
  },
  "classical-conditioning": {
    detail:
      "古典制約由 Pavlov 在唾液反射研究中發現：原本中性的刺激與非制約刺激反覆配對後，便能單獨引發制約反應。消弱、類化與自發恢復等現象，構成了暴露療法等行為技術的理論基礎。",
    figures: ["Ivan Pavlov", "John B. Watson"],
  },
  "operant-conditioning": {
    detail:
      "操作制約由 Skinner 提出，主張行為的發生頻率取決於其後果：增強會提高、懲罰會降低該行為。不同的增強時制（如間歇增強）對行為的維持與抗消弱性有重要影響。",
    figures: ["B. F. Skinner", "Edward Thorndike"],
    reading: ["Skinner, B. F. (1953). Science and Human Behavior"],
  },
  "cognitive-distortion": {
    detail:
      "認知扭曲是系統性偏誤的思考型態，會放大負向情緒。常見類型包括非黑即白、災難化、過度類化、讀心術與情緒推理等；辨識並命名這些扭曲是認知行為治療的重要步驟。",
    figures: ["Aaron T. Beck", "David Burns"],
  },
  "automatic-thoughts": {
    detail:
      "自動化思考是情境中自發、快速浮現的即時念頭，往往未經檢驗便被當成事實。CBT 透過思考記錄表協助當事人捕捉這些念頭、檢視證據，並發展更平衡的替代想法。",
  },
  schema: {
    detail:
      "基模是個體對自我、他人與世界的深層核心信念，會像濾鏡般選擇性地處理訊息。早期不適應基模（如缺陷/被遺棄）是慢性人際與情緒困擾的根源，並發展出專門的基模治療。",
    figures: ["Jeffrey Young"],
    reading: ["Young, J. E. (2003). Schema Therapy"],
  },
  empathy: {
    detail:
      "同理心是設身處地理解他人主觀經驗的能力，可分為認知同理（理解觀點）與情感同理（共感情緒）。在 Rogers 的理論中，準確的同理理解是促成治療性改變的核心條件之一。",
  },
  "unconditional-positive-regard": {
    detail:
      "無條件正向關懷指治療師不帶評價地接納當事人的整體存在，而非僅在其符合期待時才給予肯定。Rogers 認為這種接納能讓當事人安全地探索自我，減少防衛。",
    figures: ["Carl Rogers"],
  },
  "self-efficacy": {
    detail:
      "自我效能是 Bandura 提出的概念，指個體對自己能否完成特定任務的信念，會影響努力程度與面對挫折的堅持度。它的四個來源為：成功經驗、替代經驗、言語說服與生理情緒狀態。",
    figures: ["Albert Bandura"],
    reading: ["Bandura, A. (1997). Self-Efficacy: The Exercise of Control"],
  },
  resilience: {
    detail:
      "心理韌性是個體在面對逆境、創傷或重大壓力時，仍能適應並回復良好功能的能力。研究指出韌性並非罕見的天賦，而是來自家庭、社會支持與自我調節等保護因子的「平凡奇蹟」。",
    figures: ["Ann Masten"],
  },
  "trauma-informed": {
    detail:
      "創傷知情是一種服務取向，強調理解創傷的普遍性與深遠影響，並在制度與互動中避免造成二次傷害。其核心原則包括安全、可信賴、選擇、協作與賦權，重視「發生了什麼事」而非「你有什麼毛病」。",
  },

  // ---- 心理疾患 ----
  depression: {
    detail:
      "憂鬱症（重鬱症，Major Depressive Disorder）不只是「心情不好」或「想開一點就好」，而是一種會影響思考、情緒、身體與行為的疾病。其核心是持續至少兩週的情緒低落，或對原本喜歡的事物失去興趣與愉悅感（即「無快感」）。\n\n它是全球造成失能的主要原因之一，可能發生在任何年齡。重要的是，憂鬱症是可以治療的——多數人透過適當的心理治療、藥物或兩者合併，能獲得明顯改善。",
    sections: [
      {
        heading: "主要症狀",
        body:
          "除了情緒低落與失去興趣，常見症狀還包括：睡眠改變（失眠或嗜睡）、食慾與體重變化、疲憊無力、專注與決策困難、動作遲緩或激躁、過度的罪惡感或無價值感，以及反覆出現的死亡或自殺念頭。DSM-5 要求這些症狀持續兩週以上、且造成明顯的功能損害才達診斷。",
      },
      {
        heading: "成因：生物—心理—社會",
        body:
          "憂鬱症通常是多重因素交織的結果：生物面（腦內神經傳導物質、內分泌與遺傳體質）、心理面（負向思考模式、低自尊、完美主義、早年失落經驗）、以及社會面（重大生活壓力、人際衝突、缺乏支持）。它很少有單一原因，而是體質與壓力長期交互作用的結果。",
      },
      {
        heading: "治療方式",
        body:
          "實證有效的治療包括：認知行為治療（調整負向想法、重建日常活動）、人際治療（處理人際與角色變動）、以及抗憂鬱藥物（如 SSRI）。對中重度個案，心理治療與藥物合併常效果最佳；嚴重或難治型可能再考慮其他生物治療。及早就醫與持續追蹤是關鍵。",
      },
      {
        heading: "求助與安全",
        body:
          "若出現持續的絕望感或自殺念頭，請盡快尋求專業協助。在台灣可撥打 1925（依舊愛我）安心專線或 1995 生命線。憂鬱症不是軟弱，求助是有效且重要的一步。",
      },
    ],
    figures: ["Aaron T. Beck（憂鬱的認知理論）"],
    reading: ["American Psychiatric Association (2022). DSM-5-TR"],
    sources: [
      {
        label: "關於憂鬱症（臺灣憂鬱症防治協會）",
        url: "https://www.depression.org.tw/knowledge/info.asp?/68.html",
      },
      {
        label: "抑鬱症（重度抑鬱障礙）診斷與治療（Mayo Clinic）",
        url: "https://www.mayoclinic.org/zh-hans/diseases-conditions/depression/diagnosis-treatment/drc-20356013",
      },
      {
        label: "憂鬱（三軍總醫院 衛教資料 PDF）",
        url: "https://wwwv.tsgh.ndmutsgh.edu.tw/files/web/192/contents/10039/B17%E6%86%82%E9%AC%B1.pdf",
      },
    ],
  },
  anxiety: {
    detail:
      "焦慮症是一群以過度、難以控制的擔憂與生理激發為特徵的疾患，涵蓋廣泛性焦慮症、恐慌症、社交焦慮症與特定畏懼症。其核心常是對威脅的高估與對自身因應能力的低估，暴露與認知重構是有效的治療。",
  },
  ptsd: {
    detail:
      "創傷後壓力症發生於經歷或目睹創傷事件後，症狀分為再經驗（如閃回、惡夢）、逃避、認知與情緒的負向改變，以及過度警覺四大群。實證治療包括延長暴露、認知處理治療與 EMDR。",
  },
  ocd: {
    detail:
      "強迫症由侵入性、引發焦慮的強迫思考，以及為了中和焦慮而重複的強迫行為構成，兩者形成惡性循環。第一線治療是暴露不反應法 (ERP)，必要時合併血清素類藥物。",
  },
  schizophrenia: {
    detail:
      "思覺失調症是一種精神病性疾患，症狀包含正性（妄想、幻覺、混亂言語）、負性（情感平板、退縮、動機缺乏）與認知功能障礙。治療以抗精神病藥物為基礎，並結合心理社會復健與家庭支持。",
  },
  bipolar: {
    detail:
      "雙相情緒障礙以情緒在躁/輕躁與憂鬱兩極之間擺盪為特徵：第一型至少一次完整躁症發作，第二型則為輕躁加重鬱。治療核心是情緒穩定劑，並輔以心理教育與規律作息以預防復發。",
  },
  bpd: {
    detail:
      "邊緣型人格障礙以情緒劇烈不穩、人際關係紛亂、自我認同混亂、衝動行為與對被遺棄的強烈恐懼為特徵。它與早期依附創傷高度相關，辯證行為治療、心智化治療與基模治療皆有實證支持；應避免污名化。",
  },
  "eating-disorder": {
    detail:
      "飲食障礙包含厭食症、暴食症與嗜食症等，核心常涉及身體意象扭曲與以飲食/體重來調節情緒與控制感。其中厭食症具高度醫療風險，青少年個案常採用以家庭為基礎的治療 (FBT)。",
  },
  adhd: {
    detail:
      "注意力不足過動症是一種神經發展疾患，核心為與年齡不相稱的注意力不集中、過動與衝動，常自兒童期持續至成人。治療常結合行為策略、環境結構化與藥物（如中樞神經興奮劑）。",
  },
  asd: {
    detail:
      "自閉症類群障礙以社交溝通困難，以及侷限、重複的行為、興趣或感官反應為特徵，且嚴重度呈光譜分布。早期介入、結構化教學與支持性環境有助於發展，近年也強調神經多樣性的觀點。",
  },
  "substance-use": {
    detail:
      "物質使用障礙是對物質的失控使用，導致顯著的損害、耐受性增加與戒斷，嚴重度呈連續向度。有效介入包括動機式晤談、認知行為治療、藥物輔助治療與減害策略。",
  },

  // ---- 評估診斷 ----
  dsm5: {
    detail:
      "DSM 由美國精神醫學會編纂，提供標準化的類別式診斷準則，是北美臨床與研究的主要參考。最新為 2022 年的 DSM-5-TR；它常被批評過於類別化，因而與更具向度觀點的取向並存討論。",
    figures: ["美國精神醫學會 (APA)"],
    reading: ["American Psychiatric Association (2022). DSM-5-TR"],
  },
  icd11: {
    detail:
      "ICD 是世界衛生組織的國際疾病分類，第 11 版 (ICD-11) 於 2022 年正式生效，廣泛用於全球醫療統計與健保給付。其精神與行為障礙章節在若干診斷上採取較具向度性的取向。",
    figures: ["世界衛生組織 (WHO)"],
  },
  "psych-assessment": {
    detail:
      "心理衡鑑是整合臨床晤談、標準化測驗與行為觀察，以回答轉介問題、形成診斷與治療建議的歷程。良好的衡鑑重視工具的信度與效度，並將多來源資料交叉驗證後整合詮釋。",
  },
  mse: {
    detail:
      "心理狀態檢查是對當事人「當下」心理功能的系統性觀察，內容涵蓋外觀與行為、情緒與情感、言語與思考歷程、知覺、認知（定向、記憶、注意）以及病識感與判斷力，等同精神科的「理學檢查」。",
  },
  "clinical-interview": {
    detail:
      "臨床晤談是蒐集病史、症狀與脈絡並同時建立關係的核心方法，可分為結構式、半結構式與非結構式。結構式晤談信度高、利於研究；非結構式則更具彈性與臨床深度。",
  },
  wais: {
    detail:
      "魏氏智力測驗是應用最廣的標準化智力工具，提供整體智商以及語文理解、知覺推理、工作記憶與處理速度等指數分數。其結果建立在常模對照之上，需由受訓的專業人員施測與解釋。",
    figures: ["David Wechsler"],
  },
  mmpi: {
    detail:
      "明尼蘇達多相人格量表是以實證計分編製的自陳式測驗，用於評估人格與精神病理。它內建多組效度量表以偵測作答態度（如誇大或防衛），現行版本包括 MMPI-2 與 MMPI-3。",
  },
  bdi: {
    detail:
      "貝克憂鬱量表由 Beck 編製，是 21 題的自陳式工具，用於量化憂鬱症狀的嚴重程度與追蹤治療進展。它操作簡便、心理計量性質良好，但屬篩檢與評估工具，不能單獨用於診斷。",
    figures: ["Aaron T. Beck"],
  },

  // ---- 諮商技術 ----
  "therapeutic-alliance": {
    detail:
      "治療同盟指治療師與當事人之間的合作關係，Bordin 將其分為情感連結、目標共識與任務協議三個成分。大量研究顯示，它是跨學派最穩定的療效預測因子之一，並非任何取向的專利。",
    figures: ["Edward Bordin"],
  },
  "case-conceptualization": {
    detail:
      "個案概念化是把蒐集到的資訊整合成「為何此人、在此時、出現此問題並持續至今」的工作假設，常以生理—心理—社會架構組織。它連結評估與介入，並隨治療進展持續修正。",
  },
  exposure: {
    detail:
      "暴露療法讓當事人在安全的情境下，有計畫地面對所迴避的刺激或情境，以打破「迴避—焦慮」的循環。其機轉可由習慣化或抑制學習解釋，形式包括漸進暴露、洪水法與內感受暴露。",
  },
  "cognitive-restructuring": {
    detail:
      "認知重構是辨識、檢驗並修正不適應思考的 CBT 核心技術，常透過蘇格拉底式提問引導當事人檢視支持與反對某想法的證據，進而發展更貼近現實、更具功能性的替代觀點。",
  },
  "motivational-interviewing": {
    detail:
      "動機式晤談是以個案為中心、同時具方向性的會談取向，用以化解改變的矛盾心理。其精神強調合作、接納、喚出與同理，核心技術為 OARS（開放式問句、肯定、反映、摘要），並有意地強化「改變語言」。",
    figures: ["William R. Miller", "Stephen Rollnick"],
    reading: ["Miller, W. R., & Rollnick, S. (2013). Motivational Interviewing (3rd ed.)"],
  },
  "crisis-intervention": {
    detail:
      "危機介入是對處於急性心理危機者提供的即時、短期處置，目標是穩定情緒、確保安全並連結資源，而非深層治療。常見架構強調建立關係、評估安全、確認問題與發展可行的因應計畫。",
  },
  "suicide-risk": {
    detail:
      "自殺風險評估系統性地評估自殺意念、計畫、意圖與可取得的方法，並權衡風險與保護因子。其成果應導向具體的安全計畫；C-SSRS 等結構化工具有助於標準化評估，但臨床判斷與關係仍不可取代。",
  },
  "group-therapy": {
    detail:
      "團體治療透過成員間的互動與團體歷程促成改變。Yalom 歸納出多項療效因子，如普同感、利他、人際學習與凝聚力——成員從「不是只有我這樣」的體驗與彼此回饋中獲益。",
    figures: ["Irvin Yalom"],
    reading: ["Yalom, I. (2005). The Theory and Practice of Group Psychotherapy"],
  },
  mindfulness: {
    detail:
      "正念是有意識地、不帶評價地覺察當下經驗的能力，源於冥想傳統並由 Kabat-Zinn 引入臨床（MBSR）。它是 DBT、ACT、MBCT 等第三波治療的共同核心，有助於降低反芻與情緒反應性。",
    figures: ["Jon Kabat-Zinn"],
    reading: ["Kabat-Zinn, J. (1990). Full Catastrophe Living"],
  },

  // ---- 倫理專業 ----
  "counseling-ethics": {
    detail:
      "諮商倫理是規範專業實務的原則體系，常以五大原則為核心：尊重自主、受益、不傷害、公正與忠誠。各專業學會（如 APA、ACA）皆訂有倫理守則，作為決策與自律的依據。",
  },
  confidentiality: {
    detail:
      "保密是保護當事人資訊的基本倫理義務，也是信任的基礎；但它並非絕對。當出現傷害自己或他人的風險、兒少或弱勢受虐，或受法律強制（如法院命令）時，保密即有其例外。",
  },
  "informed-consent": {
    detail:
      "知後同意是當事人在充分了解服務的性質、目標、風險、收費與自身權益後，於具備決定能力的前提下自願同意接受服務。它不是一次性的簽署，而是貫穿治療歷程的持續溝通。",
  },
  "dual-relationship": {
    detail:
      "雙重關係指治療關係之外，治療師與當事人同時存在的其他關係（如社交、商業或親屬）。它可能損及客觀性與專業界限、增加剝削風險，因此應審慎評估並盡量避免可預見的傷害。",
  },
  supervision: {
    detail:
      "督導是資深者協助受督者提升專業能力、處理個案困境並確保服務品質的歷程，兼具教育、支持與守門三重功能。督導關係中也可能出現「平行歷程」，即治療關係的動力在督導中被重演。",
  },
  "cultural-competence": {
    detail:
      "文化敏感度是覺察自身偏誤、理解當事人文化背景，並調整實務以提供合宜服務的能力，常被概念化為覺察、知識與技巧三面向。近年更強調「文化謙遜」——以終身學習與不評斷的姿態面對差異。",
  },
};
