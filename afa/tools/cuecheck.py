"""Every cut and key action against the song's beat grid: python tools/cuecheck.py  (needs events.json from core/render/events.mjs)"""
import json, bisect
from pathlib import Path
H = Path(__file__).resolve().parent.parent
ev = json.load(open(H / 'events.json', encoding='utf-8'))['ev']; beats = json.load(open(H / 'beats.json'))['beats']
ALLOW = {'kick': 'cut 2 frames before the hit, on purpose', 'blue': 'cut at the last audio sample', 'stop': 'tape stop, tied to the end of the audio', 'ff': ''}
worst = 0; off = 0
for e in ev:
    i = bisect.bisect_left(beats, e['t']); d = min(abs(e['t'] - beats[j]) for j in (max(0, i - 1), min(len(beats) - 1, i)))
    if e['t'] == 0: d = 0
    note = ALLOW.get(e['name'], None)
    if d > 0.021 and note is None: off += 1
    if note is None: worst = max(worst, d)
    if d > 0.021: print(f"{e['t']:8.3f} {e['type']:4s} {e['name']:12s} {d * 1000:6.0f} ms off the beat  {note or 'OFF'}")
print(f"{len(ev)} cues, {off} off the grid without a reason, worst on-grid error {worst * 1000:.0f} ms")
