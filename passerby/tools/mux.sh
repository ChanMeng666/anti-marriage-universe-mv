#!/bin/sh
# mux.sh video.mp4 song.mp3 out.mp4 [fps] [crf]: the picture with the untouched song, normalised to -14 LUFS / -1.2 dBTP.
# Like the library's core/render/mux.sh (two-pass loudnorm), but with no grain filter (the grain is in the print)
# and one encode from the lossless yuv444 intermediate (crf 24 keeps the dots clean at 100 %; -tune grain doubles the file for no visible gain).
set -e
V="$1"; A="$2"; O="$3"; FPS="${4:-24}"; CRF="${5:-24}"
J=$(ffmpeg -hide_banner -nostats -i "$A" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
LN="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
VD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
ffmpeg -y -loglevel error -i "$V" -i "$A" \
  -filter_complex "[0:v]fps=$FPS,format=yuv420p[v];[1:a]$LN,aresample=48000,apad=whole_dur=$VD[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf "$CRF" -r "$FPS" \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 256k -movflags +faststart -t "$VD" "$O"
echo "$O"
ffmpeg -hide_banner -nostats -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|LRA|Peak):" | head -3
