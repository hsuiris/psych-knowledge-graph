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
