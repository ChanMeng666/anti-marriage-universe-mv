#!/bin/sh
# 把 stills/<dir> 里的静帧按 18 张一组拼成联络表：sh tools/sheets.sh <dir> [cols=6] [w=420]
HERE=$(cd "$(dirname "$0")/.." && pwd); LIB=${LIB:-/d/github_repository/lemo-opuscar}
D="$1"; COLS=${2:-6}; WD=${3:-420}; N=$((COLS * ${4:-3}))
rm -f "$D"/sheet_*.jpg
ls "$D"/*.jpg | grep -v sheet_ > "$D/list.txt"
split -l $N -d "$D/list.txt" "$D/part_"
for p in "$D"/part_*; do "$LIB/.venv/Scripts/python.exe" "$LIB/core/render/sheet.py" "$D/sheet_$(basename $p | sed 's/part_//').jpg" $(cat $p) --cols $COLS --w $WD >/dev/null; done
rm -f "$D"/part_* "$D/list.txt"; ls "$D"/sheet_*.jpg
