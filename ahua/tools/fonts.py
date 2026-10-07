"""Subset Noto Serif SC (OFL) to the characters this film uses, via the Google Fonts CSS API (&text=)."""
import re, sys, urllib.parse, urllib.request
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
txt = (HERE.parent / 'shared/lyrics/ahua.txt').read_text(encoding='utf-8')
extra = '传统剧本爹昨今天廉价一生一世家囍喜元¥战士阿花保姆年月日六十八二贤妻良母饼旧爱新欢壹贰叁岁'
chars = ''.join(sorted(set(c for c in txt + extra if ord(c) > 0x2000))) + ''.join(chr(i) for i in range(32, 127)) + '…—·'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
css_out = []
for wt in (600, 900):
    url = f'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@{wt}&text=' + urllib.parse.quote(chars)
    css = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA})).read().decode()
    srcs = re.findall(r'url\((https://[^)]+)\)', css)
    assert len(srcs) == 1, css
    data = urllib.request.urlopen(urllib.request.Request(srcs[0], headers={'User-Agent': UA})).read()
    name = f'NotoSerifSC-{wt}.woff2'
    (HERE / 'fonts' / name).write_bytes(data)
    css_out.append("@font-face{font-family:'Noto Serif SC';font-weight:%d;font-style:normal;font-display:block;src:url(%s) format('woff2')}" % (wt, name))
    print(name, len(data))
(HERE / 'fonts/fonts.css').write_text('\n'.join(css_out) + '\n', encoding='utf-8')
