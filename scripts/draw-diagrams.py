# 產生網站用的示意圖 SVG 到 public/diagrams/（中文用系統字型）
# 用法：python3 scripts/draw-diagrams.py
from pathlib import Path
from xml.sax.saxutils import escape
OUT = str(Path(__file__).resolve().parent.parent / "public" / "diagrams") + "/"
FONT = "'PingFang TC','Noto Sans TC','Microsoft JhengHei',sans-serif"
INK, MUTED, LINE = "#1e293b", "#64748b", "#cbd5e1"

def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" font-family="{FONT}">'
            f'<rect width="{w}" height="{h}" fill="#ffffff"/>{body}</svg>\n')

def text(x, y, lines, size=15, color=INK, weight=400, anchor="start", gap=1.45):
    if isinstance(lines, str): lines = [lines]
    return "".join(f'<text x="{x}" y="{y + i*size*gap:.1f}" font-size="{size}" fill="{color}" font-weight="{weight}" text-anchor="{anchor}">{escape(l)}</text>' for i, l in enumerate(lines))

def box(x, y, w, h, fill, stroke=None, r=12):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke or fill}" stroke-width="1.5"/>'

def arrow(x1, y1, x2, y2, color=MUTED):
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="2" marker-end="url(#a)"/>')

DEFS = f'<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="{MUTED}"/></marker></defs>'

def save(name, s):
    open(OUT + name, "w").write(s)

# 1. 操作制約 2x2
b = DEFS + text(340, 36, "操作制約的四種後果", 20, weight=700, anchor="middle")
b += text(245, 78, "給予刺激（正）", 16, weight=600, anchor="middle") + text(505, 78, "移除刺激（負）", 16, weight=600, anchor="middle")
b += text(60, 160, ["行為", "變多"], 16, weight=600, anchor="middle") + text(60, 320, ["行為", "變少"], 16, weight=600, anchor="middle")
cells = [
    (120, 96, "#dcfce7", "#16a34a", "正增強", ["給予喜歡的東西"], ["例：幫忙做家事，", "得到爸媽稱讚"]),
    (380, 96, "#dcfce7", "#16a34a", "負增強", ["移除討厭的東西"], ["例：繫上安全帶，", "警示聲就停了"]),
    (120, 256, "#ffe4e6", "#e11d48", "正懲罰", ["給予討厭的東西"], ["例：上課滑手機，", "被老師當眾點名"]),
    (380, 256, "#ffe4e6", "#e11d48", "負懲罰", ["移除喜歡的東西"], ["例：晚歸，", "被沒收手機一週"]),
]
for x, y, fill, st, title, sub, ex in cells:
    b += box(x, y, 250, 140, fill, st) + text(x + 20, y + 36, title, 19, st, 700) + text(x + 20, y + 64, sub, 15, INK, 500) + text(x + 20, y + 94, ex, 14, MUTED)
b += text(340, 430, "「正」代表加入、「負」代表移除，和好壞無關。負增強會讓行為變多，常被誤認為懲罰。", 13.5, MUTED, anchor="middle")
save("operant-2x2.svg", svg(680, 450, b))

# 2. 陌生情境實驗的八個階段
eps = [
    ("1", "進入房間", ["媽媽帶嬰兒進入", "遊戲室（約 30 秒）"], "媽媽 嬰兒", False),
    ("2", "自由探索", ["媽媽坐著，", "嬰兒自己玩玩具"], "媽媽 嬰兒", False),
    ("3", "陌生人進來", ["先安靜坐著，再和", "媽媽聊天、接近嬰兒"], "媽媽 嬰兒 陌生人", False),
    ("4", "第一次分離", ["媽媽離開，", "陌生人陪著嬰兒"], "嬰兒 陌生人", False),
    ("5", "第一次重聚", ["媽媽回來安撫，", "陌生人離開"], "媽媽 嬰兒", True),
    ("6", "嬰兒獨處", ["媽媽再次離開，", "房間只剩嬰兒"], "嬰兒", False),
    ("7", "陌生人回來", ["陌生人進來，", "試著安撫嬰兒"], "嬰兒 陌生人", False),
    ("8", "第二次重聚", ["媽媽回來，", "陌生人離開"], "媽媽 嬰兒", True),
]
COL = {"媽媽": "#6366f1", "嬰兒": "#ec4899", "陌生人": "#f59e0b"}
b = DEFS + text(380, 36, "陌生情境實驗的八個階段", 20, weight=700, anchor="middle")
for i, (n, title, desc, who, key) in enumerate(eps):
    x, y = 30 + (i % 4) * 180, 64 + (i // 4) * 196
    b += box(x, y, 160, 170, "#fdf2f8" if key else "#f8fafc", "#ec4899" if key else LINE)
    b += text(x + 16, y + 32, f"{n}  {title}", 16, "#be185d" if key else INK, 700)
    b += text(x + 16, y + 62, desc, 13.5, MUTED)
    for j, p in enumerate(who.split()):
        cx = x + 24 + j * 48
        b += f'<circle cx="{cx}" cy="{y + 132}" r="9" fill="{COL[p]}"/>' + text(cx, y + 158, p, 11.5, MUTED, anchor="middle")
    if i % 4 != 3: b += arrow(x + 162, y + 85, x + 178, y + 85)
b += text(380, 478, "除了第 1 段，每段約 3 分鐘；嬰兒太難過時會提早結束。", 13.5, MUTED, anchor="middle")
b += text(380, 500, "研究者最看重粉紅框的第 5、8 段：媽媽回來時，嬰兒怎麼反應。", 13.5, "#be185d", 600, anchor="middle")
save("strange-situation.svg", svg(760, 520, b))

# 3. 習得無助實驗的設計
b = DEFS + text(380, 36, "習得無助實驗的設計（Seligman 與 Maier，1967）", 19, weight=700, anchor="middle")
b += text(170, 76, "第一階段：綁在吊帶裡", 15.5, weight=600, anchor="middle") + text(590, 76, "第二階段：梭箱", 15.5, weight=600, anchor="middle")
b += text(590, 96, "跳過矮隔板就能逃開電擊", 13, MUTED, anchor="middle")
rows = [
    ("可逃脫組", ["受到電擊，但按壓面板", "就能讓電擊停止"], ["很快學會跳過隔板"], "#dcfce7", "#16a34a"),
    ("無法逃脫組", ["受到跟可逃脫組一樣的電擊，", "怎麼做都停不下來"], ["多數趴著承受，", "沒有嘗試逃跑"], "#ffe4e6", "#e11d48"),
    ("對照組", ["沒有受到電擊"], ["很快學會跳過隔板"], "#f1f5f9", "#64748b"),
]
for i, (g, p1, p2, fill, st) in enumerate(rows):
    y = 112 + i * 104
    b += box(30, y, 280, 86, fill, st) + text(48, y + 30, g, 16, st, 700) + text(48, y + 54, p1, 13.5, INK)
    b += arrow(318, y + 43, 432, y + 43)
    b += box(440, y, 290, 86, fill, st) + text(458, y + 40, p2, 14.5, INK, 500)
b += text(380, 446, "可逃脫組和無法逃脫組受到的電擊總量相同，差別只在「自己能不能控制」。", 13.5, MUTED, anchor="middle")
save("learned-helplessness.svg", svg(760, 466, b))

# 4. 波波玩偶實驗的流程
b = DEFS + text(380, 36, "波波玩偶實驗的流程（Bandura、Ross 與 Ross，1961）", 19, weight=700, anchor="middle")
b += text(150, 76, "1  看大人怎麼玩（約 10 分鐘）", 15, weight=600, anchor="middle")
groups = [("攻擊楷模組", ["大人對波波玩偶拳打腳踢、", "用木槌敲，邊打邊罵"], "#ffe4e6", "#e11d48"),
          ("非攻擊楷模組", ["大人安靜地組合玩具，", "完全不理會波波玩偶"], "#dcfce7", "#16a34a"),
          ("控制組", ["沒有看到任何大人"], "#f1f5f9", "#64748b")]
for i, (g, d, fill, st) in enumerate(groups):
    y = 92 + i * 92
    b += box(30, y, 250, 78, fill, st) + text(46, y + 28, g, 15.5, st, 700) + text(46, y + 52, d, 13, INK)
b += arrow(290, 222, 330, 222)
b += box(338, 150, 180, 144, "#fef9c3", "#ca8a04") + text(428, 184, "2  小小挫折", 15, "#a16207", 700, anchor="middle")
b += text(428, 214, ["孩子剛開始玩", "很好玩的玩具，", "就被收走了"], 13.5, INK, anchor="middle")
b += arrow(526, 222, 566, 222)
b += box(574, 150, 160, 144, "#e0e7ff", "#6366f1") + text(654, 184, "3  自己玩", 15, "#4338ca", 700, anchor="middle")
b += text(654, 214, ["到有波波玩偶的", "房間玩 20 分鐘，", "研究者在單面鏡後記錄"], 13, INK, anchor="middle")
b += text(380, 392, "結果：看過攻擊楷模的孩子，模仿出許多跟大人一模一樣的動作和罵人的話。", 14, INK, 600, anchor="middle")
b += text(380, 416, "孩子沒有因此得到任何獎勵，說明人光靠「觀察」就能學會新行為。", 13.5, MUTED, anchor="middle")
save("bobo-doll.svg", svg(760, 436, b))

# 5. 暴露療法的焦慮階層（社交焦慮的例子）
steps = [(20, "跟便利商店店員說謝謝"), (35, "上課時舉手問老師一個問題"), (50, "在群組裡主動約朋友吃飯"),
         (70, "小組討論時第一個發言"), (90, "在全班面前上台報告")]
b = DEFS + text(360, 36, "焦慮階層：從最不怕的開始練習", 20, weight=700, anchor="middle")
b += text(360, 60, "以社交焦慮為例，數字是主觀困擾程度（SUDS，0 到 100 分）", 13.5, MUTED, anchor="middle")
for i, (s, t) in enumerate(steps):
    y = 360 - i * 64
    x = 40 + i * 28
    shade = ["#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9"][i]
    b += box(x, y, 450, 50, shade, "#0284c7", 10)
    b += text(x + 18, y + 32, f"{s}", 18, "#075985", 700) + text(x + 70, y + 32, t, 15, INK, 500)
b += arrow(640, 400, 640, 100)
b += text(658, 230, ["往", "上", "練", "習"], 15, MUTED, 600)
b += text(360, 448, "每一階反覆練習，等焦慮明顯下降、不再迴避，再往上一階。", 13.5, MUTED, anchor="middle")
save("exposure-hierarchy.svg", svg(720, 468, b))

# 6. 改變的階段模式
import math
stages = [("無意圖期", "precontemplation", "還不覺得有問題"), ("意圖期", "contemplation", "想改又不想改"),
          ("準備期", "preparation", "打算近期開始"), ("行動期", "action", "開始改變行為"), ("維持期", "maintenance", "持續半年以上")]
b = DEFS + text(380, 36, "改變的階段模式（Prochaska 與 DiClemente）", 19, weight=700, anchor="middle")
cx, cy, R = 380, 290, 185
pts = []
for i, (zh, en, d) in enumerate(stages):
    ang = -math.pi / 2 + i * 2 * math.pi / 5
    x, y = cx + R * math.cos(ang), cy + R * math.sin(ang)
    pts.append((x, y))
for i in range(5):
    (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % 5]
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy); k = 88 / L
    color = "#e11d48" if i == 4 else MUTED
    b += f'<line x1="{x1+dx*k:.0f}" y1="{y1+dy*k:.0f}" x2="{x2-dx*k:.0f}" y2="{y2-dy*k:.0f}" stroke="{color}" stroke-width="2" stroke-dasharray="{"6 5" if i == 4 else "0"}" marker-end="url(#a)"/>'
for (x, y), (zh, en, d) in zip(pts, stages):
    b += box(x - 80, y - 40, 160, 80, "#e0e7ff", "#6366f1") + text(x, y - 12, zh, 16, "#4338ca", 700, anchor="middle")
    b += text(x, y + 8, en, 11.5, MUTED, anchor="middle") + text(x, y + 28, d, 12.5, INK, anchor="middle")
b += text(cx, cy - 4, "復發很常見，", 13, "#e11d48", 600, anchor="middle") + text(cx, cy + 16, "可以從前面的階段重新開始", 13, "#e11d48", 600, anchor="middle")
b += text(380, 540, "動機式晤談依當事人所在的階段調整做法，例如意圖期著重處理「想改又不想改」的矛盾。", 13.5, MUTED, anchor="middle")
save("stages-of-change.svg", svg(760, 560, b))
print("ok")

# 7. 恐慌循環（Clark 1986 的認知模式）
b = DEFS + text(380, 36, "恐慌的惡性循環（Clark 的認知模式）", 19, weight=700, anchor="middle")
cyc = [("察覺到威脅", ["「怪怪的，", "是不是出事了？」"]), ("擔心、害怕", ["焦慮升高"]),
       ("身體感覺變強", ["心跳加快、喘不過氣、", "頭暈、手麻"]), ("災難化解讀", ["「我要心臟病發作了」", "「我快昏倒、要失控了」"])]
cx, cy, R = 380, 265, 150
pos = [(cx, cy - R), (cx + R * 1.55, cy), (cx, cy + R), (cx - R * 1.55, cy)]
for (x, y), (t, d) in zip(pos, cyc):
    hot = t == "災難化解讀"
    b += box(x - 105, y - 44, 210, 88, "#ffe4e6" if hot else "#fef3c7", "#e11d48" if hot else "#d97706")
    b += text(x, y - 14, t, 15.5, "#be123c" if hot else "#92400e", 700, anchor="middle") + text(x, y + 12, d, 12.5, INK, anchor="middle")
for i in range(4):
    (x1, y1), (x2, y2) = pos[i], pos[(i + 1) % 4]
    sx = 1 if x2 > x1 else -1 if x2 < x1 else 0; sy = 1 if y2 > y1 else -1
    b += arrow(x1 + sx * 40, y1 + sy * 48, x2 - sx * 110, y2 - sy * 8)
b += text(cx, 492, "觸發點可以是外在情境（擁擠的捷運），也可以是一個身體感覺（喝咖啡後心跳變快）。", 13, MUTED, anchor="middle")
b += text(cx, 514, "治療的重點是打斷「災難化解讀」：學會把身體感覺看成無害的焦慮反應，並透過內感暴露親自驗證。", 13, MUTED, anchor="middle")
save("panic-cycle.svg", svg(760, 534, b))

# 8. 失眠的 3P 模式（Spielman）
b = DEFS + text(380, 36, "失眠的 3P 模式（Spielman）", 19, weight=700, anchor="middle")
phases = ["發病前", "急性失眠", "開始變慢性", "慢性失眠"]
P, Q, S = "#c7d2fe", "#fda4af", "#fcd34d"
bars = [[(P, 90)], [(P, 90), (Q, 130)], [(P, 90), (Q, 60), (S, 90)], [(P, 90), (S, 150)]]
base, thr = 400, 400 - 150
for i, (ph, bar) in enumerate(zip(phases, bars)):
    x, y = 90 + i * 150, base
    for col, h in bar:
        y -= h; b += f'<rect x="{x}" y="{y}" width="90" height="{h}" fill="{col}" stroke="#ffffff" stroke-width="2"/>'
    b += text(x + 45, base + 24, ph, 14, INK, 600, anchor="middle")
b += f'<line x1="70" y1="{thr}" x2="680" y2="{thr}" stroke="#e11d48" stroke-width="2" stroke-dasharray="7 5"/>' + text(686, thr + 5, "失眠門檻", 13, "#e11d48", 600)
b += f'<line x1="70" y1="{base}" x2="680" y2="{base}" stroke="{LINE}" stroke-width="1.5"/>'
leg = [(P, "前置因素", "天生容易緊張、晚睡型的生理時鐘"), (Q, "誘發因素", "考試、失業、生病住院等壓力事件"), (S, "維持因素", "提早上床、白天補眠、躺床滑手機、擔心睡不著")]
for i, (col, t, d) in enumerate(leg):
    y = 456 + i * 26
    b += f'<rect x="90" y="{y - 13}" width="16" height="16" rx="3" fill="{col}"/>' + text(116, y, t, 14, INK, 700) + text(190, y, d, 13.5, MUTED)
b += text(380, 548, "壓力事件過去了，失眠卻被後來養成的習慣撐住，這就是 CBT-I 處理「維持因素」的原因。", 13, MUTED, anchor="middle")
save("insomnia-3p.svg", svg(780, 566, b))

# 9. 理情行為治療的 ABCDE
b = DEFS + text(380, 36, "理情行為治療的 ABCDE", 19, weight=700, anchor="middle")
cols3 = [("A", "引發事件", ["報告被主管退回"], "#e0e7ff", "#4338ca"),
         ("B", "信念", ["「我一定要做到完美，", "不然就是沒用的人」"], "#ffe4e6", "#be123c"),
         ("C", "後果", ["沮喪、失眠，", "不敢再交報告"], "#f1f5f9", "#475569")]
for i, (k, t, d, fill, st) in enumerate(cols3):
    x = 30 + i * 245
    b += box(x, 64, 220, 120, fill, st) + text(x + 18, 98, f"{k}  {t}", 17, st, 700) + text(x + 18, 130, d, 13.5, INK)
    if i < 2: b += arrow(x + 222, 124, x + 243, 124)
b += box(275, 244, 220, 120, "#dcfce7", "#15803d") + text(293, 278, "D  駁斥", 17, "#15803d", 700)
b += text(293, 310, ["「哪條規定說一定要完美？", "被退件就等於沒用嗎？」"], 13.5, INK)
b += arrow(385, 244, 385, 190)
b += box(520, 244, 220, 120, "#dcfce7", "#15803d") + text(538, 278, "E  新的效果", 17, "#15803d", 700)
b += text(538, 310, ["「我希望做好，但被退件只", "代表這份要改」→ 失望，", "但願意修改"], 13.5, INK)
b += arrow(497, 304, 518, 304)
b += text(380, 400, "困擾我們的是 B 對 A 的解讀；D 挑戰僵化的「一定要」，E 是換成有彈性的想法之後的新結果。", 13, MUTED, anchor="middle")
save("rebt-abcde.svg", svg(770, 420, b))

# 10. 溝通分析：PAC 與兩種溝通
def pac(x, name):
    s = text(x, 78, name, 15, INK, 700, anchor="middle")
    for j, (k, zh, col) in enumerate([("P", "父母", "#fde68a"), ("A", "成人", "#bfdbfe"), ("C", "兒童", "#fbcfe8")]):
        y = 124 + j * 84
        s += f'<circle cx="{x}" cy="{y}" r="36" fill="{col}" stroke="#94a3b8" stroke-width="1.5"/>' + text(x, y - 2, k, 20, INK, 700, anchor="middle") + text(x, y + 20, zh, 12, INK, anchor="middle")
    return s
b = DEFS + text(380, 36, "溝通分析：三種自我狀態與兩種溝通", 19, weight=700, anchor="middle")
b += pac(110, "甲") + pac(290, "乙") + pac(470, "甲") + pac(650, "乙")
b += f'<line x1="148" y1="204" x2="250" y2="204" stroke="#16a34a" stroke-width="2.5" marker-end="url(#a)"/><line x1="252" y1="216" x2="150" y2="216" stroke="#16a34a" stroke-width="2.5" marker-end="url(#a)"/>'
b += f'<line x1="508" y1="204" x2="610" y2="204" stroke="#e11d48" stroke-width="2.5" marker-end="url(#a)"/><line x1="612" y1="124" x2="508" y2="292" stroke="#e11d48" stroke-width="2.5" marker-end="url(#a)"/>'
b += text(200, 370, "互補溝通", 16, "#16a34a", 700, anchor="middle") + text(200, 396, ["甲（成人）：「現在幾點？」", "乙（成人）：「三點半。」", "訊息順著原來的管道回來，對話可以繼續。"], 13, INK, anchor="middle")
b += text(560, 370, "交錯溝通", 16, "#e11d48", 700, anchor="middle") + text(560, 396, ["甲（成人）：「你有看到我的鑰匙嗎？」", "乙（父母對兒童）：「你怎麼老是亂丟！」", "回應換了管道，對話容易卡住或吵起來。"], 13, INK, anchor="middle")
save("ta-pac.svg", svg(760, 480, b))

# 11. 何倫的六角形（RIASEC）
b = DEFS + text(380, 36, "何倫的六角形：六種職業興趣", 19, weight=700, anchor="middle")
types = [("R", "實用型", "動手操作", "工程師、廚師", "#f59e0b"), ("I", "研究型", "分析思考", "研究員、醫師", "#10b981"),
         ("A", "藝術型", "創作表達", "設計師、作家", "#ec4899"), ("S", "社會型", "助人互動", "諮商師、教師", "#6366f1"),
         ("E", "企業型", "說服領導", "業務、創業家", "#ef4444"), ("C", "事務型", "規則秩序", "會計、行政", "#06b6d4")]
cx, cy, R = 380, 290, 175
pts = [(cx + R * math.cos(-math.pi / 2 + i * math.pi / 3), cy + R * math.sin(-math.pi / 2 + i * math.pi / 3)) for i in range(6)]
b += '<polygon points="' + " ".join(f"{x:.0f},{y:.0f}" for x, y in pts) + f'" fill="#f8fafc" stroke="{LINE}" stroke-width="2"/>'
for (x, y), (k, zh, d, jobs, col) in zip(pts, types):
    b += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="50" fill="#ffffff" stroke="{col}" stroke-width="3"/>'
    b += text(x, y - 14, f"{k} {zh}", 14.5, col, 700, anchor="middle") + text(x, y + 6, d, 12.5, INK, anchor="middle") + text(x, y + 24, jobs, 11, MUTED, anchor="middle")
b += text(cx, cy - 6, "相鄰的類型比較相近，", 13, MUTED, anchor="middle") + text(cx, cy + 14, "對角的類型差異最大", 13, MUTED, anchor="middle")
b += text(380, 530, "測驗結果通常取分數最高的三型組成代碼，例如 SAE，再找興趣代碼相近的科系與職業。", 13, MUTED, anchor="middle")
save("riasec.svg", svg(760, 550, b))

# 12. 三級輔導
b = DEFS + text(380, 36, "學校的三級輔導（學生輔導法）", 19, weight=700, anchor="middle")
tiers = [("處遇性輔導", "介入後仍無法改善、嚴重適應困難或行為偏差的學生", "心理師、社工師等專業輔導人員，結合校外資源", "#fecdd3", "#be123c"),
         ("介入性輔導", "發展性輔導無法滿足需求、適應欠佳或遭遇重大創傷的學生", "輔導教師依個別需求進行個別或團體輔導", "#fde68a", "#a16207"),
         ("發展性輔導", "全體學生", "全校教師（特別是導師）推動生活、學習與生涯輔導", "#bbf7d0", "#15803d")]
for i, (t, who, how, fill, st) in enumerate(tiers):
    y = 64 + i * 118
    t0, t1 = 150 + i * 70, 220 + i * 70  # 上底、下底的一半，越往下越寬
    b += f'<polygon points="{380 - t0},{y} {380 + t0},{y} {380 + t1},{y + 108} {380 - t1},{y + 108}" fill="{fill}" stroke="{st}" stroke-width="1.5"/>'
    ty = y + 50
    b += text(380, ty - 4, t, 16, st, 700, anchor="middle") + text(380, ty + 18, "對象：" + who, 12, INK, anchor="middle") + text(380, ty + 36, how, 11.5, MUTED, anchor="middle")
b += text(380, 440, "越往上，需要的學生越少、介入越密集，也越需要跨專業合作。", 13, MUTED, anchor="middle")
save("three-tier.svg", svg(760, 460, b))

# 13. 薩提爾的冰山
b = DEFS + text(380, 36, "薩提爾的冰山", 19, weight=700, anchor="middle")
b += f'<rect x="0" y="117" width="760" height="483" fill="#e0f2fe"/>' + text(740, 110, "水面", 12, "#0369a1", anchor="end")
layers = [("行為", "看得到的言行：摔門、不說話"), ("應對", "討好、指責、超理智、打岔或一致"), ("感受", "生氣、受傷、害怕"), ("感受的感受", "「我不該這麼生氣」的羞愧"),
          ("觀點", "信念與想法：「他根本不在乎我」"), ("期待", "希望對方怎麼做、希望自己怎麼樣"), ("渴望", "被愛、被接納、被認可、有價值"), ("自我", "生命力、「我是誰」")]
top, h = 62, 58
for i, (t, d) in enumerate(layers):
    y = top + i * h
    w = 190 + i * 24
    fill = "#ffffff" if i == 0 else f"rgba(255,255,255,{0.92 - i * 0.07:.2f})"
    b += f'<rect x="{380 - w}" y="{y}" width="{w * 2}" height="{h - 6}" rx="10" fill="{fill}" stroke="#7dd3fc" stroke-width="1.5"/>'
    b += text(380 - w + 18, y + 33, t, 15, "#0c4a6e", 700) + text(380 + w - 18, y + 33, d, 12.5, INK, anchor="end")
b += text(380, 548, "只看得到水面上的行為；薩提爾模式從底下一層層往下問，接觸到渴望與自我。", 13, "#0c4a6e", 600, anchor="middle")
save("satir-iceberg.svg", svg(760, 570, b))
print("ok 2")
