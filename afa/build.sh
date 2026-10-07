#!/bin/sh
# 《浪子阿发》MV：一条命令出片。 sh build.sh  [LIB=/path/to/lemo-opuscar] [WORKERS=3]
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/d/github_repository/lemo-opuscar}
SONG=${SONG:-$HERE/../shared/audio/afa.mp3}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the lemo-opuscar library folder"; exit 1; }
[ -f "$SONG" ] || { echo "song not found: $SONG (set SONG=...)"; exit 1; }
mkdir -p "$HERE/out"
PY="$LIB/.venv/Scripts/python.exe"; [ -x "$PY" ] || PY="$LIB/.venv/bin/python"
"$PY" "$HERE/tools/align.py" > /dev/null                 # lyrics.json, beats.json, afa.srt  (needs ../shared/timing)
[ -f "$HERE/fonts/chars.txt" ] || "$PY" "$HERE/tools/fonts.py"   # CJK subsets (network), only when missing
cd "$LIB"
node core/render/events.mjs "$HERE"
"$PY" "$HERE/tools/cuecheck.py"
node core/render/video.mjs "$HERE" --fps 24 --workers "${WORKERS:-3}" --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$SONG" "$HERE/afa.mp4" 24 2      # the song, untouched except loudness (-14 LUFS)
ffmpeg -y -loglevel error -ss 12.5 -i "$HERE/afa.mp4" -frames:v 1 -q:v 3 "$HERE/poster.jpg"     # the title card
echo "done: $HERE/afa.mp4"
