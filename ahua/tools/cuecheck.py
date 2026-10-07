"""Every cut and every picture hit against the song: distance to the fitted grid (69 BPM; cuts on eighth notes, hits on eighths or sixteenths) and to the nearest
beat librosa actually heard. Cuts and hits are defined as grid indices in the scene files, so the grid column must be 0 ms;
the librosa column shows how far the fitted grid sits from the detected beats (frame-quantised, about ±25 ms).
Also checks subtitles: no overlap, minimum time on screen.  usage: python tools/cuecheck.py"""
import json, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
ev = json.load(open(HERE / 'events.json', encoding='utf-8'))
grid = json.load(open(HERE / 'beats.json'))
beats = json.load(open(HERE.parent / 'shared/timing/ahua.beats.json'))['beats']
per, g0 = grid['period'], grid['g0']
worst_g = worst_b = 0; n = 0; free = 0
for e in ev['ev']:
    t = e['t']
    if t < 17: free += 1; continue          # intro: free time, hits follow the piano
    h = per / 2                         # hits may sit on sixteenths
    dg = abs((t - g0) / h - round((t - g0) / h)) * h
    db = min(abs(t - b) for b in beats)
    n += 1; worst_g = max(worst_g, dg); worst_b = max(worst_b, db)
    if dg > 0.012 and e['type'] == 'cut': print(f"off-grid cut {e['id']} at {t:.3f} ({dg * 1000:.0f} ms)")
print(f"{n} cuts and hits after the intro ({free} in the free-time intro): worst distance to grid {worst_g * 1000:.0f} ms, to a detected beat {worst_b * 1000:.0f} ms")
lines = sorted((l for l in json.load(open(HERE / 'lyrics.json', encoding='utf-8')) if not l.get('adlib')), key=lambda l: l['t0'])
bad = 0
for a, b in zip(lines, lines[1:]):
    if a['s1'] > b['t0'] + 1e-6: print('overlap', a['id'], b['id']); bad += 1
short = [(l['id'], round(l['s1'] - l['t0'], 2)) for l in lines if l['s1'] - l['t0'] < 1.8]
print(f"{len(lines)} subtitle lines, overlaps {bad}, shorter than 1.8 s on screen: {short}")
sys.exit(1 if bad or worst_g > 0.012 else 0)
