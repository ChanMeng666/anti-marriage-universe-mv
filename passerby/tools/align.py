"""Align the official lyric sheet to whisper's timings -> lyrics.json [{t0,t1,text,section,singer}].
Whisper is used for timing only. Source: shared/timing/passerby.words.json (word level) or, while that
is missing, the segment lines of passerby.log (coarser). Manual corrections live in FIX below."""
import json, re, sys, difflib
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
SH = HERE.parent / 'shared'
# ---- official lyric sheet -> lines
lines, sec, singer, nsec = [], None, None, {}
for raw in open(SH / 'lyrics/passerby.txt', encoding='utf-8').read().splitlines()[3:]:
    s = raw.strip()
    if not s: continue
    m = re.fullmatch(r'\[(.+)\]', s)
    if m:
        k = m.group(1)
        if k.split()[0] in ('Male', 'Female', 'Both'):
            singer = {'Male': 'M', 'Female': 'F', 'Both': 'B'}[k.split()[0]]; spoken = 'Spoken' in k
        else:
            nsec[k] = nsec.get(k, 0) + 1; sec = k if nsec[k] == 1 and k not in ('Verse 1', 'Verse 2') else (k if k.startswith('Verse') else f'{k} {nsec[k]}'); spoken = False
        continue
    if s.startswith('('):
        m = re.fullmatch(r'\((Male|Female): (.+)\)', s)
        if m: lines.append({'text': m.group(2), 'section': sec, 'singer': m.group(1)[0], 'spoken': True, 'en': True})
        continue
    lines.append({'text': s.strip('"'), 'section': sec, 'singer': singer, 'spoken': spoken, 'en': bool(re.match(r'[A-Za-z]', s))})
# ---- whisper characters with times
chars = []   # (char, t0, t1)
wj = SH / 'timing/passerby.words.json'
if wj.exists():
    for seg in json.load(open(wj, encoding='utf-8')):
        for w in seg['words']:
            cs = [c for c in w['w'] if re.match(r'[一-鿿A-Za-z]', c)]
            for i, c in enumerate(cs):
                chars.append((c, w['t0'] + (w['t1'] - w['t0']) * i / len(cs), w['t0'] + (w['t1'] - w['t0']) * (i + 1) / len(cs)))
    src = 'words.json'
else:
    for l in open(HERE / 'tools/firstpass.log', encoding='utf-8'):   # dev fallback only: the first pass seen in the shared log
        m = re.match(r'\s*([\d.]+)\s+([\d.]+)\s+(.*)', l)
        if not m: continue
        a, b = float(m.group(1)), float(m.group(2)); cs = [c for c in m.group(3) if re.match(r'[一-鿿A-Za-z]', c)]
        for i, c in enumerate(cs): chars.append((c, a + (b - a) * i / len(cs), a + (b - a) * (i + 1) / len(cs)))
    src = 'log'
try:
    from pypinyin import lazy_pinyin
    key = lambda c: lazy_pinyin(c)[0] if '一' <= c <= '鿿' else c.lower()
except ImportError:
    key = lambda c: c.lower()
A = [key(c[0]) for c in chars]
off, B, owner = [], [], []
for i, l in enumerate(lines):
    for c in l['text']:
        if re.match(r'[一-鿿A-Za-z]', c): B.append(key(c)); owner.append(i)
sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
hit = {}   # official char index -> whisper char index
for a, b, n in sm.get_matching_blocks():
    for k in range(n): hit[b + k] = a + k
CH = r'[一-鿿A-Za-z]'
for i, l in enumerate(lines):
    idx = [j for j in range(len(B)) if owner[j] == i]
    known = [(k, chars[hit[j]][1], chars[hit[j]][2]) for k, j in enumerate(idx) if j in hit]
    # drop matches that jump backwards or sit far from the line's main cluster
    if known:
        med = sorted(k[1] for k in known)[len(known) // 2]
        known = [k for k in known if abs(k[1] - med) < 12]
    l['match'] = round(len(known) / max(1, len(idx)), 2)
    if not known: continue
    n = len(idx); ks = [k[0] for k in known]
    span = known[-1][2] - known[0][1]; pace = min(.45, max(.12, span / max(1, ks[-1] - ks[0] + 1)))
    ct = []
    for k in range(n):
        if k < ks[0]: ct.append(known[0][1] - (ks[0] - k) * pace)
        elif k > ks[-1]: ct.append(known[-1][2] + (k - ks[-1] - 1) * pace)
        else:
            j = max(q for q in range(len(ks)) if ks[q] <= k)
            if ks[j] == k: ct.append(known[j][1])
            else: a0, a1 = known[j], known[j + 1]; ct.append(a0[2] + (a1[1] - a0[2]) * (k - a0[0]) / (a1[0] - a0[0]))
    l['ct'] = [round(v, 2) for v in ct]
    l['t0'] = l['ct'][0]; l['t1'] = round(max(known[-1][2] + (n - 1 - ks[-1]) * pace, l['ct'][-1] + .2), 2)
FIX = json.load(open(HERE / 'tools/align_fix.json', encoding='utf-8')) if (HERE / 'tools/align_fix.json').exists() else {}
for k, v in FIX.items():
    l = lines[int(k)]; n = len(re.findall(CH, l['text']))
    if 'ct' in l and 't0' in v and 't1' in v and not 'ct' in v:      # rescale the char times into the corrected span
        a, b = l['ct'][0], l['t1']; l['ct'] = [round(v['t0'] + (c - a) / max(.01, b - a) * (v['t1'] - v['t0']), 2) for c in l['ct']]
    l.update(v)
    if 'ct' not in l: l['ct'] = [round(l['t0'] + (l['t1'] - l['t0']) * k / n * .92, 2) for k in range(n)]
# provisional guesses for lines whisper has not reached yet (flagged; must be zero in the final run)
last, guesses = 0, 0
for i, l in enumerate(lines):
    if 't0' not in l:
        nxt = next((m['t0'] for m in lines[i + 1:] if 't0' in m), None)
        t0 = last + 1.0 if nxt is None else min(last + 1.0, nxt - 5)
        n = len(re.findall(CH, l['text'])); l['t0'] = round(t0, 2); l['t1'] = round(t0 + 4.5, 2); l['guess'] = True; guesses += 1
        l['ct'] = [round(l['t0'] + 4.3 * k / n, 2) for k in range(n)]
    last = l['t1']
# ---- cues: one per line, long lines split at the space nearest the middle
def char_index(text, pos): return len(re.findall(CH, text[:pos]))
cues = []
for i, l in enumerate(lines):
    text, n = l['text'], len(l['ct'])
    parts = [(0, len(text))]
    sp = [m.start() for m in re.finditer(' ', text)] if not l.get('en') else []
    if sp and (n > 13 or l['t1'] - l['t0'] > 7.5):
        cut = min(sp, key=lambda p: abs(char_index(text, p) - n / 2)); parts = [(0, cut), (cut + 1, len(text))]
    for a, b in parts:
        k0, k1 = char_index(text, a), char_index(text, b)
        t0 = l['ct'][k0]; t1 = l['ct'][k1] - .05 if k1 < n else l['t1']
        cues.append({'t0': round(t0, 2), 't1': round(t1, 2), 'text': text[a:b], 'section': l['section'], 'singer': l['singer'], 'line': i, 'spoken': l['spoken'], 'ct': l['ct'][k0:k1], **({'guess': True} if l.get('guess') else {})})
for l in lines: l['i'] = lines.index(l)
for i, l in enumerate(lines):
    print('%2d %7.2f %7.2f %.2f %s%s %-12s %s' % (i, l['t0'], l['t1'], l['match'], l['singer'], '?' if l.get('guess') else ' ', l['section'], l['text']))
json.dump(cues, open(HERE / 'lyrics.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump([{k: l[k] for k in ('t0', 't1', 'text', 'section', 'singer', 'spoken', 'ct')} for l in lines], open(HERE / 'lines.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('source:', src, ' whisper chars:', len(chars), ' matched:', len(hit), '/', len(B), ' cues:', len(cues), ' GUESSED LINES:', guesses)
