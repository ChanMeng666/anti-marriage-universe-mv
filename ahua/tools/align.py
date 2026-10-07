"""Align the official lyric lines (shared/lyrics/ahua.txt, authoritative text) to the whisper word timings
(shared/timing/ahua.words.json, timing only) and write lyrics.json, the single source for subtitles, .srt and timeline.

Whisper mishears sung Chinese, so lines are matched by position. Each line below names the anchor read from words.json:
t0 = start of the line's first syllable, t1 = end of its last one. Where whisper glued a held first word to the end of the
previous segment, t0 is taken from the following syllables (noted 'late'). The three choruses are the same take shifted by
whole bars: chorus 2 = chorus 1 + 19 bars, chorus 3 = chorus 1 + 34 bars; the script checks that against the
words whisper did place in each chorus.
"""
import json
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
SH = HERE.parent / 'shared'
words = json.load(open(SH / 'timing/ahua.words.json', encoding='utf-8'))
beats = json.load(open(SH / 'timing/ahua.beats.json', encoding='utf-8'))
B = beats['beats']
DUR = 239.52

V1 = [(17.76, 20.7, '阿花今年二十八'), (21.2, 23.9, '早已看透父权虚假'), (24.82, 27.0, '相亲对象那个阿发'),
      (27.3, 31.1, '张口闭口不仅是爹味 甚至还有点大'), (32.32, 34.5, '阿花冷眼看阿发'), (36.0, 38.3, '收起你那如意算盘吧'),
      (38.74, 42.2, '想要保姆请你自己花钱雇佣她'), (42.7, 45.1, '别想白嫖我的年华')]
P1 = [(45.74, 48.5, '后来故事发展很火辣'), (48.64, 52.2, '阿花当场掀翻了名为传统的塔'), (52.78, 54.4, '什么旧爱新欢'),
      (54.45, 56.0, '都不care啊'), (56.08, 58.0, '什么贤妻良母的剧本'), (58.06, 59.7, '去死吧')]
CH = [(63.8, 67.6, '觉醒吧 觉醒吧'), (68.14, 71.0, '就算王子真的骑着白马'), (71.0, 74.6, '也直接让他滚回城堡吧'),
      (75.2, 78.6, '我的广阔天地无需那个他'), (78.7, 81.8, '觉醒吧 战士阿花'), (81.84, 84.9, '少女的梦早已经死在昨天啦'),
      (85.0, 88.4, '那带血的束身衣扎成捧花'), (88.4, 94.0, '扔进火里烧了个稀里哗啦')]
V2 = [(98.0, 100.9, '阿发吓坏了看阿花'), (101.2, 104.5, '她剪掉长发洗去了妆容啊'), (104.56, 107.7, '一生一世这画饼太廉价'),
      (108.8, 111.0, '独行出发吧')]
P2 = [(114.82, 118.0, '后来故事发展更潇洒'), (118.4, 121.4, '再也没有谁能等着阿花回家'), (121.5, 124.9, '一个人读书健身闯荡天下'),
      (124.88, 128.2, '搞搞事业也会研究研究代码')]
BR = [(166.24, 168.6, '阿花今年六十八'), (169.1, 171.8, '她早已不再需要家'), (173.62, 176.3, '那是父权编织的篱笆'),
      (176.5, 180.6, '她和姐妹在此刻 拥有了天下')]
OUT = [(213.4, 215.6, '扔进火里…'), (217.5, 219.8, '烧了吧…'), (223.0, 226.4, '新娘阿花 is dead…'), (226.8, 232.4, 'Long live Warrior Ah Hua…')]
ADLIB = [(61.14, 62.5, 'Let it burn', 'P1'), (128.8, 130.0, 'Coding my life', 'P2')]   # the only bracketed ad-libs whisper placed

# The grid: librosa's beat times are frame-quantised (0.418 / 0.441 s alternating); a straight line through beats 40+ is the
# real pulse (about 137.9 grid beats per minute = 69 BPM felt, 8 grid beats to the bar). Beats before 40 are the free-time intro.
import numpy as np
idx = np.arange(40, len(B)); PER, G0 = np.polyfit(idx, np.array(B)[40:], 1)
print('grid: period %.5f s (%.2f BPM felt), beat0 %.3f s, max residual %.3f s' % (PER, 30 / PER, G0, np.abs(np.array(B)[40:] - (G0 + PER * idx)).max()))
sh2, sh3 = 152 * PER, 272 * PER          # chorus 2 = chorus 1 + 19 bars, chorus 3 = chorus 1 + 34 bars
lines = []
def add(sec, rows, shift=0.0):
    for k, (a, b, text) in enumerate(rows):
        lines.append({'id': f'{sec}.{k}', 'section': sec, 't0': round(a + shift, 2), 't1': round(b + shift, 2), 'text': text})
add('V1', V1); add('P1', P1); add('C1', CH); add('V2', V2); add('P2', P2); add('C2', CH, sh2); add('BR', BR); add('C3', CH, sh3); add('OUT', OUT)
# display time: at least 1.8 s and the sung line + 0.7 s, never into the next line
for k, l in enumerate(lines):
    nxt = lines[k + 1]['t0'] if k + 1 < len(lines) else DUR - 2.5
    l['s1'] = round(min(max(l['t1'] + 0.7, l['t0'] + 1.8), nxt - 0.1), 2)
for a, b, text, sec in ADLIB:
    lines.append({'id': 'AD.' + text.split()[0], 'section': sec, 't0': a, 't1': b, 's1': b + 0.6, 'text': text, 'adlib': True})

# check: every line start against the nearest whisper word start
ws = sorted(w['t0'] for s in words for w in s['words'])
print('chorus shifts', round(sh2, 3), round(sh3, 3))
bad = 0
for l in lines:
    d = min(abs(w - l['t0']) for w in ws)
    flag = '' if d <= 0.35 else '  <-- no whisper word within 0.35 s (held first syllable or guess)'
    bad += d > 0.35
    print(f"{l['id']:7} {l['t0']:7.2f} {l['t1']:7.2f} show→{l['s1']:7.2f}  Δ{d:.2f} {l['text']}{flag}")
print('lines', len(lines), 'far from a whisper word:', bad)
json.dump(lines, open(HERE / 'lyrics.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'dur': DUR, 'period': round(float(PER), 6), 'g0': round(float(G0), 4), 'intro': [0.6, 1.8, 4.8, 6.6, 9.3, 11.8, 15.4]}, open(HERE / 'beats.json', 'w', encoding='utf-8'))
def ts(t):
    ms = round(t * 1000); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
with open(HERE / 'ahua.srt', 'w', encoding='utf-8') as f:
    for n, l in enumerate(sorted(lines, key=lambda l: l['t0']), 1):
        txt = f"({l['text']})" if l.get('adlib') else l['text']
        f.write(f"{n}\n{ts(l['t0'])} --> {ts(l['s1'])}\n{txt}\n\n")
