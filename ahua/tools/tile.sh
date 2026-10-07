#!/bin/sh
# tile an existing pass folder: sh tools/tile.sh <name> <offset>
HERE=$(cd "$(dirname "$0")/.." && pwd); LIB=${LIB:-/d/github_repository/lemo-opuscar}; name=$1; off=${2:-1}
for k in 0 1 2 3 4 5; do files=""; i=0; while [ $i -lt 20 ]; do t=$(awk "BEGIN{printf \"%.2f\", $off+($k*20+$i)*2}"); f="$HERE/stills/$name/t_$t.jpg"; [ -f "$f" ] && files="$files $f"; i=$((i+1)); done
  [ -n "$files" ] && "$LIB/.venv/Scripts/python.exe" "$LIB/core/render/sheet.py" "$HERE/stills/${name}_$k.jpg" $files --cols 5 --w 760; done
