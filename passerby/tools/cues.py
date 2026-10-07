"""Cue check and subtitles.
- every cut and every registration kick of events.json must sit on a beat of the song (beats.json);
- lyrics.json -> out/subs.json -> passerby.srt (all sung and spoken lines);
- prints the cue map (shot, start, bar.beat) used in TREATMENT.md."""
import json, sys, subprocess, bisect
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
LIB = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE
ev = json.load(open(HERE / 'events.json', encoding='utf-8')); beats = json.load(open(HERE / 'beats.json'))['beats']
dur = ev['dur']; bars = beats[6::8]
def near(t): i = bisect.bisect(beats, t); return min(abs(t - b) for b in beats[max(0, i - 1):i + 1])
def barbeat(t):
    i = min(range(len(beats)), key=lambda k: abs(beats[k] - t)); return '%d.%d' % ((i - 6) // 8 + 1, ((i - 6) % 8) // 2 + 1) + ('+' if (i - 6) % 2 else '')
worst, bad = 0, 0
cuts = [e for e in ev['ev'] if e['type'] == 'cut']; kicks = [e for e in ev['ev'] if e['type'] == 'kick']
for e in cuts + kicks:
    if e['t'] == 0: continue
    d = near(e['t']) * 1000; worst = max(worst, d)
    if d > 21: bad += 1; print('OFF BEAT %s %.3f  %.0f ms' % (e.get('id', 'kick'), e['t'], d))
print('cuts %d  kicks %d  worst distance to a beat %.0f ms  off-beat %d' % (len(cuts), len(kicks), worst, bad))
if '--map' in sys.argv:
    for i, e in enumerate(cuts): print('| %d | %s | %.2f | %s | %.1f s |' % (i + 1, e['id'], e['t'], barbeat(e['t']) if e['t'] else '-', (cuts[i + 1]['t'] if i + 1 < len(cuts) else dur) - e['t']))
cues = json.load(open(HERE / 'lyrics.json', encoding='utf-8'))
subs = []
for i, q in enumerate(cues):
    nx = cues[i + 1]['t0'] - .08 if i + 1 < len(cues) else dur
    t1 = min(nx, max(q['t1'] + .6, q['t0'] + 1.8))
    subs.append({'t0': round(max(0, q['t0'] - .1), 2), 't1': round(t1, 2), 'text': ('“%s”' % q['text']) if q['spoken'] and not q['text'][0].isascii() else q['text']})
(HERE / 'out').mkdir(exist_ok=True)
json.dump(subs, open(HERE / 'out/subs.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
subprocess.run([sys.executable, str(LIB / 'core/render/srt.py'), str(HERE / 'out/subs.json'), str(HERE / 'passerby.srt')], check=True)
short = [s for s in subs if s['t1'] - s['t0'] < 1.5]
print('subtitles %d  shorter than 1.5 s: %d %s' % (len(subs), len(short), [s['text'] for s in short]))
sys.exit(1 if bad else 0)
