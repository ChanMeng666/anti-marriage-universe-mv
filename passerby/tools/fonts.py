"""Subset Noto Sans SC (OFL) to the characters this film uses, through the Google Fonts CSS API.
usage: python tools/fonts.py   (scans *.js, engine/*.js and lyrics.json / the official lyric sheet)"""
import re, sys, glob, urllib.request, urllib.parse
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
src = ''
for f in glob.glob(str(HERE / '*.js')) + glob.glob(str(HERE / 'engine/*.js')) + glob.glob(str(HERE / '*.json')) + [str(HERE / '../shared/lyrics/passerby.txt')]:
    try: src += open(f, encoding='utf-8').read()
    except FileNotFoundError: pass
src = src.encode().decode('unicode_escape', errors='ignore') if False else src
chars = sorted(set(c for c in src if ord(c) > 0x2000 and not c.isspace()))
text = ''.join(chars)
print(len(chars), 'chars')
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
css_out = ["@font-face { font-family: 'Jost'; src: url(Jost.ttf) format('truetype'); font-weight: 100 900; font-display: block; }"]
for wght in (700, 900):
    url = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@%d&text=%s' % (wght, urllib.parse.quote(text))
    css = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA})).read().decode()
    m = re.search(r'url\((https://[^)]+)\)', css)
    data = urllib.request.urlopen(urllib.request.Request(m.group(1), headers={'User-Agent': UA})).read()
    name = 'NotoSansSC-%d.woff2' % wght
    (HERE / 'fonts' / name).write_bytes(data)
    css_out.append("@font-face { font-family: 'NotoSC'; src: url(%s) format('woff2'); font-weight: %d; font-display: block; }" % (name, wght))
    print(name, len(data))
(HERE / 'fonts' / 'fonts.css').write_text('\n'.join(css_out) + '\n', encoding='utf-8')
(HERE / 'fonts' / 'chars.txt').write_text(text, encoding='utf-8')
