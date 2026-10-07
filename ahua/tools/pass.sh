#!/bin/sh
# full contact-sheet pass: a frame every 2 s (offset $1), six sheets of 20
HERE=$(cd "$(dirname "$0")/.." && pwd); LIB=${LIB:-/d/github_repository/lemo-opuscar}; off=${1:-1}; name=${2:-pass}
rm -rf "$HERE/stills/$name"; cd "$LIB"
node core/render/still.mjs "$HERE" --range $off:239.4:2 --out "$HERE/stills/$name" 2>&1 | grep -v "ms$"
for k in 0 1 2 3 4 5; do files=""; i=0; while [ $i -lt 20 ]; do t=$(awk "BEGIN{printf \"%.2f\", $off+($k*20+$i)*2}"); f="$HERE/stills/$name/t_$t.jpg"; [ -f "$f" ] && files="$files $f"; i=$((i+1)); done
  [ -n "$files" ] && "$LIB/.venv/Scripts/python.exe" core/render/sheet.py "$HERE/stills/${name}_$k.jpg" $files --cols 5 --w 760; done
