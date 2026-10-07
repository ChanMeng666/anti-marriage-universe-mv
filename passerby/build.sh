#!/bin/sh
# 《最佳路人》 from scratch: sh build.sh   (LIB = the lemo-opuscar library, SONG = the song)
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/d/github_repository/lemo-opuscar}; export LIB
SONG=${SONG:-$HERE/../shared/audio/passerby.mp3}
TIMING=${TIMING:-$HERE/../shared/timing}
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/Scripts/python.exe"; [ -x "$PY" ] || PY="$LIB/.venv/bin/python"
cd "$HERE"; mkdir -p out
cp "$TIMING/passerby.beats.json" beats.json                       # the song's beat grid
"$PY" tools/align.py > out/align.log                              # official lyrics x whisper timings -> lyrics.json, lines.json
"$PY" tools/fonts.py || [ -f fonts/NotoSansSC-700.woff2 ]         # subset the Chinese font to the characters in use (needs a connection)
cd "$LIB"
node core/render/events.mjs "$HERE"                               # cuts and kicks -> events.json
"$PY" "$HERE/tools/cues.py" "$LIB"                                # every cue on a beat; passerby.srt
node core/render/readcheck.mjs "$HERE" --step 0.125               # in-picture type stays long enough
node "$HERE/tools/video_png.mjs" "$HERE" --fps 24 --workers ${WORKERS:-3} --chunk 10 --out "$HERE/out/video.mp4"   # PNG frames -> lossless yuv444
sh "$HERE/tools/mux.sh" "$HERE/out/video.mp4" "$SONG" "$HERE/passerby.mp4" 24 ${CRF:-24}
node core/render/still.mjs "$HERE" 105.2 --q 'poster=1' --out "$HERE/out" --prefix poster_ && cp "$HERE/out/poster_105.2.jpg" "$HERE/poster.jpg"
mkdir -p "$HERE/stills"; rm -f "$HERE"/stills/contact_*.jpg
ffmpeg -y -loglevel error -i "$HERE/passerby.mp4" -vf "fps=2/3,scale=384:-1,tile=8x10" -q:v 3 "$HERE/stills/contact_%d.jpg" 2>/dev/null   # review sheets, a frame every 1.5 s
[ -n "$KEEP" ] || rm -rf "$HERE/out/video.mp4" "$HERE/out/video_segs" "$HERE"/out/poster_*.jpg "$HERE/out/subs.json"   # the 3 GB lossless intermediate (KEEP=1 keeps it)
