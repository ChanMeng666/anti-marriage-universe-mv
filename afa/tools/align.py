"""Align the official lyric sheet to the whisper word timings.
Whisper mishears sung Chinese, so it is used for timing only: every official line gets a hand-checked span
(section by section, against the whisper segments and the bar grid), and its characters are spread over the
whisper characters inside that span. Writes lyrics.json (single source for subtitles, .srt and the timeline),
beats.json (the beat grid the cuts snap to) and afa.srt.
usage: python tools/align.py"""
import json, re
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
SH = HERE.parent / 'shared'
words = json.load(open(SH / 'timing' / 'afa.words.json', encoding='utf-8'))
beats = json.load(open(SH / 'timing' / 'afa.beats.json', encoding='utf-8'))

# (section, text, t0, t1, kind)   kind: None = sung, 'spoken', 'adlib'
L = [
 ('verse1', '阿发今年三十加', 18.48, 20.90),
 ('verse1', '早已看透了那把戏啊', 20.98, 23.78),
 ('verse1', '家人催他立业成家', 23.92, 25.60),
 ('verse1', '其实是想找头 能拉磨的驴把套下', 27.42, 33.60),
 ('verse1', '阿发冷眼看喧哗', 37.16, 39.28),
 ('verse1', '媒婆嘴里那天花乱坠的话', 39.28, 42.44),
 ('verse1', '什么温柔贤惠宜室宜家', 42.44, 44.90),
 ('verse1', '不过是看上我也能算个 长期饭票吧', 45.96, 52.60),
 ('pre', '后来故事发展很爆炸', 54.76, 59.08),
 ('pre', '阿发一脚踢翻了名为责任的塔', 59.58, 63.60),
 ('pre', '我的工资只需供我自己花', 64.74, 69.30),
 ('pre', '想去哪里流浪', 69.44, 72.34),
 ('pre', '就去哪里啊', 72.34, 75.28),
 ('chorus1', '清醒吧 清醒吧', 78.36, 82.26),
 ('chorus1', '我也不是那想要公主的傻瓜', 83.22, 87.22),
 ('chorus1', '更不想做那个赚钱养家的牛马', 87.22, 92.42),
 ('chorus1', '我的自由灵魂无需那个她', 92.42, 97.08),
 ('chorus1', '清醒吧 浪子阿发', 97.08, 100.84),
 ('chorus1', '少年的歌不用憋进酒盅啦', 102.04, 105.72),
 ('chorus1', '现在的我活得像个神话', 106.52, 110.22),
 ('chorus1', '切断了软肋 哪怕无后又哪怕孤寡', 111.00, 116.14),
 ('verse2', '阿发不需要那个“家”', 118.92, 120.84),
 ('verse2', '那是资本精心设计的关卡', 120.84, 123.70),
 ('verse2', '一旦背上房贷有了那个娃', 123.70, 126.10),
 ('verse2', '这辈子只能低头做谁的犬牙', 127.72, 133.64),
 ('verse2', '后来故事发展更潇洒', 136.48, 140.60),
 ('verse2', '阿发买了摩托这周末就出发', 141.56, 145.14),
 ('verse2', '没有人碎碎念也没有那低气压', 146.36, 150.94),
 ('verse2', '打一通宵游戏也没人敢把他骂', 150.94, 157.20),
 ('verse2', 'Game over, baby', 159.20, 160.30, 'adlib'),
 ('chorus2', '清醒吧 清醒吧', 160.30, 163.84),
 ('chorus2', '我也不是那想要公主的傻瓜', 164.84, 168.76),
 ('chorus2', '更不想做那个赚钱养家的牛马', 168.76, 173.96),
 ('chorus2', '我的自由灵魂无需那个她', 173.96, 178.70),
 ('chorus2', '清醒吧 浪子阿发', 178.70, 182.52),
 ('chorus2', '少年的歌不用憋进酒盅啦', 183.60, 187.18),
 ('chorus2', '现在的我活得像个神话', 188.16, 191.78),
 ('chorus2', '切断了软肋 哪怕无后又哪怕孤寡', 191.78, 197.60),
 ('bridge', '有人说孤单？', 218.38, 219.80, 'spoken'),
 ('bridge', '呵，那是自由的味道。', 221.20, 223.40, 'spoken'),
 ('bridge', '阿发今年七十加', 226.20, 228.20, 'spoken'),      # whisper stretched "阿发" back to 223.28; the rest sits at 226.8-228.0
 ('bridge', '阳光晒得那个老脸...笑开花', 230.04, 234.50, 'spoken'),
 # whisper printed four short "清醒吧" here (235.14-239.44); the true line is placed from the other two choruses:
 # line 2 of each chorus starts 4.5-4.9 s after line 1, and chorus 3 line 2 is at 239.44
 ('chorus3', '清醒吧 清醒吧', 234.70, 238.60),
 ('chorus3', '我也不是那想要公主的傻瓜', 239.44, 243.30),
 ('chorus3', '更不想做那个赚钱养家的牛马', 243.32, 248.50),
 ('chorus3', '我的自由灵魂无需那个她', 248.50, 253.18),
 ('chorus3', '清醒吧 浪子阿发', 253.18, 256.96),
 ('chorus3', '少年的歌不用憋进酒盅啦', 258.16, 261.76),
 ('chorus3', '现在的我活得像个神话', 262.64, 266.32),
 ('chorus3', '切断了软肋 哪怕无后又哪怕孤寡', 266.32, 272.14),
 ('outro', '切断了软肋...', 274.78, 276.82),
 ('outro', '活成神话...', 276.82, 279.42),
 ('outro', 'Just me, myself and I...', 279.42, 282.62),
]

# whisper characters with times
wc = []
for s in words:
    for w in s['words']:
        tx = w['w'].strip()
        if not tx: continue
        units = [tx] if re.match(r'^[A-Za-z\']+$', tx) else [c for c in tx if c not in '，。？！、 ,.?!']
        for i, u in enumerate(units):
            wc.append((w['t0'] + (w['t1'] - w['t0']) * i / len(units), u))

def vis_units(text):
    """units that get a wipe time: CJK characters one by one, Latin words as a whole"""
    out, i = [], 0
    while i < len(text):
        c = text[i]
        if re.match(r"[A-Za-z']", c):
            j = i
            while j < len(text) and re.match(r"[A-Za-z']", text[j]): j += 1
            out.append((i, j)); i = j
        elif c in ' ，。？！、,.?!…“”"': i += 1
        else: out.append((i, i + 1)); i += 1
    return out

res = []
for row in L:
    sec, text, t0, t1 = row[:4]; kind = row[4] if len(row) > 4 else 'sung'
    inside = [t for t, _ in wc if t0 - .05 <= t < t1 - .02]
    units = vis_units(text); n = len(units)
    if len(inside) >= 2:
        # official unit k -> whisper unit position k*(M-1)/(n-1), time interpolated
        ts = []
        for k in range(n):
            x = k * (len(inside) - 1) / max(1, n - 1); a = int(x); b = min(len(inside) - 1, a + 1)
            ts.append(inside[a] + (inside[b] - inside[a]) * (x - a))
    else:
        ts = [t0 + (t1 - t0) * .85 * k / max(1, n) for k in range(n)]
    ts[0] = t0
    for k in range(1, n): ts[k] = max(ts[k], ts[k - 1] + .04)
    ct = [[a, b, round(t, 2)] for (a, b), t in zip(units, ts)]
    res.append({'t0': t0, 't1': t1, 'text': text, 'section': sec, 'kind': kind, 'ct': ct})

json.dump(res, open(HERE / 'lyrics.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'dur': beats['dur'], 'tempo': beats['tempo'], 'phase': beats['downbeat_phase'], 'beats': beats['beats']}, open(HERE / 'beats.json', 'w'))

# .srt: a line shows from 0.25 s before it is sung until the next line, or 0.6 s after its end (at least 1.8 s)
def tc(t):
    ms = int(round(t * 1000)); return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'
out = []
for i, r in enumerate(res):
    a = max(0, r['t0'] - .25); b = max(r['t1'] + .6, a + 1.8)
    if r['kind'] == 'adlib': b = a + 1.9        # a small second line above the main one: it may overlap the next line
    else:
        nx = next((x for x in res[i + 1:] if x['kind'] != 'adlib'), None)
        if nx and nx['t0'] - .25 > a + 1.0: b = min(b, nx['t0'] - .25)
    r['a'], r['b'] = round(a, 2), round(b, 2)
    tx = f"({r['text']})" if r['kind'] == 'adlib' else r['text']
    out.append(f"{i + 1}\n{tc(a)} --> {tc(b)}\n{tx}\n")
open(HERE / 'afa.srt', 'w', encoding='utf-8').write('\n'.join(out))
json.dump(res, open(HERE / 'lyrics.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(res), 'lines')
for r in res: print(f"{r['a']:7.2f} {r['b']:7.2f}  {r['b'] - r['a']:.2f}s  {r['text']}")
