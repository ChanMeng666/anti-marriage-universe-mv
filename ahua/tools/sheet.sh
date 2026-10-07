#!/bin/sh
# usage: sh tools/sheet.sh <name> <cols> <t...>   → stills/<name>/ and stills/sheet_<name>.jpg
HERE=$(cd "$(dirname "$0")/.." && pwd); LIB=${LIB:-/d/github_repository/lemo-opuscar}
name=$1; cols=$2; shift 2
rm -rf "$HERE/stills/$name"; cd "$LIB"
node core/render/still.mjs "$HERE" "$@" --out "$HERE/stills/$name" 2>&1 | grep -v "ms$"
files=""; for t in "$@"; do case $t in --*) break;; esac; f="$HERE/stills/$name/t_$t.jpg"; [ -f "$f" ] && files="$files $f"; done
[ -z "$files" ] && files=$(ls "$HERE/stills/$name"/*.jpg | sort -t_ -k2 -n)
"$LIB/.venv/Scripts/python.exe" core/render/sheet.py "$HERE/stills/sheet_$name.jpg" $files --cols $cols --w 640
