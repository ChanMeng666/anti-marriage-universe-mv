"""Subset the CJK fonts to the characters this film uses (Google Fonts CSS API, &text=) and write fonts/fonts.css.
usage: python tools/fonts.py   (scans *.js without comments, lyrics.json and the official lyric sheet)"""
import re, glob, urllib.request, urllib.parse
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
chars = set()
srcs = glob.glob(str(HERE / '*.js')) + [str(HERE / 'lyrics.json'), str(HERE.parent / 'shared' / 'lyrics' / 'afa.txt')]
for f in srcs:
    try:
        s = open(f, encoding='utf-8').read()
    except FileNotFoundError:
        continue
    if f.endswith('.js'):
        s = re.sub(r'//[^\n]*', '', s)      # comments are not drawn
    chars |= {c for c in s if ord(c) > 0x2000}
chars |= set('…？。，、！《》“”「」·♪♫▶■×→←↑↓●○★')
txt = ''.join(sorted(chars))
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()


css = ["@font-face { font-family: 'Barlow SC'; font-weight: 600; src: url(BarlowSC-600.ttf) format('truetype'); font-display: block; }",
       "@font-face { font-family: 'Barlow SC'; font-weight: 700; src: url(BarlowSC-700.ttf) format('truetype'); font-display: block; }",
       "@font-face { font-family: 'Kanit'; font-style: italic; font-weight: 800; src: url(Kanit-800i.ttf) format('truetype'); font-display: block; }",
       "@font-face { font-family: 'Kanit'; font-style: italic; font-weight: 900; src: url(Kanit-900i.ttf) format('truetype'); font-display: block; }"]
FAMS = [('Noto SC', 'NotoSansSC-700-subset', 'Noto+Sans+SC:wght@700', 700),
        ('HuangYou', 'ZCOOLQingKeHuangYou-subset', 'ZCOOL+QingKe+HuangYou', 400)]
for fam, name, q, wt in FAMS:
    for old in (HERE / 'fonts').glob(name + '*.woff2'):
        old.unlink()
    for n, i in enumerate(range(0, len(txt), 120)):       # a long &text= makes the API fall back to its full slices
        part = txt[i:i + 120]
        c = get('https://fonts.googleapis.com/css2?family=' + q + '&text=' + urllib.parse.quote(part)).decode()
        urls = re.findall(r'url\((https://[^)]+)\)', c)
        assert len(urls) == 1, c[:400]
        data = get(urls[0])
        fn = name + '-' + str(n) + '.woff2'
        (HERE / 'fonts' / fn).write_bytes(data)
        ur = ', '.join('U+%x' % ord(ch) for ch in part)
        css.append("@font-face { font-family: '%s'; font-weight: %d; src: url(%s) format('woff2'); font-display: block; unicode-range: %s; }" % (fam, wt, fn, ur))
        print(fn, len(data), 'bytes')
(HERE / 'fonts' / 'fonts.css').write_text('\n'.join(css) + '\n', encoding='utf-8')
(HERE / 'fonts' / 'chars.txt').write_text(txt, encoding='utf-8')
print(len(txt), 'characters')
