#!/bin/sh
# contact sheet: sh tools/sheet.sh <from> <to> <step> <name> [cols]
HERE=$(cd "$(dirname "$0")/.." && pwd); LIB=${LIB:-/d/github_repository/lemo-opuscar}
rm -rf "$HERE/stills/$4"; mkdir -p "$HERE/stills/$4"
(cd "$LIB" && node core/render/still.mjs "$HERE" --range $1:$2:$3 --out "$HERE/stills/$4" --prefix f 2>&1 | grep -v "ms$")
"$LIB/.venv/Scripts/python.exe" - "$HERE/stills/$4" "$HERE/stills/$4.jpg" "${5:-5}" <<'PY'
import sys,glob,os,re,subprocess
d,out,cols=sys.argv[1],sys.argv[2],sys.argv[3]
fs=sorted(glob.glob(d+'/f*.jpg'),key=lambda p: float(re.search(r'f([\d.]+)\.jpg',p).group(1)))
lib=os.environ.get('LIB','D:/github_repository/lemo-opuscar')
subprocess.run([sys.executable,lib+'/core/render/sheet.py',out,*fs,'--cols',cols,'--w','384'],check=True)
PY
