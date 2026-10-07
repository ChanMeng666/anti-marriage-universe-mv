#!/bin/sh
# 战士阿花 — rebuild the film from source:  sh build.sh   (Git Bash on Windows, or any POSIX sh)
# Needs the Lemo-Opuscar library (render tools): set LIB to its folder if it is not at the default below.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/d/github_repository/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
if [ -x "$LIB/.venv/Scripts/python.exe" ]; then PY="$LIB/.venv/Scripts/python.exe"; else PY="$LIB/.venv/bin/python"; fi
SONG=${SONG:-"$HERE/../shared/audio/ahua.mp3"}
[ -f "$SONG" ] || { echo "song not found: $SONG (set SONG=…)"; exit 1; }

mkdir -p "$HERE/out"
[ -f "$HERE/fonts/NotoSerifSC-600.woff2" ] || "$PY" "$HERE/tools/fonts.py"      # subset fonts (network, first time only)
"$PY" "$HERE/tools/align.py" > "$HERE/out/align.log"                            # lyrics.json, beats.json, ahua.srt
cd "$LIB"
node core/render/events.mjs "$HERE"                                             # cuts + hits → events.json
"$PY" "$HERE/tools/cuecheck.py"                                                 # every cut / hit on the song's grid
node core/render/video.mjs "$HERE" --fps 24 --workers "${WORKERS:-3}" --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$SONG" "$HERE/ahua.mp4" 24 0       # the song is the whole soundtrack; −14 LUFS; no grain
node core/render/still.mjs "$HERE" 92.6 --q 'nosub=1' --prefix poster_ --out "$HERE/out"
cp "$HERE/out/poster_92.6.jpg" "$HERE/poster.jpg"
echo "done: $HERE/ahua.mp4"
