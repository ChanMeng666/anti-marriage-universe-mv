#!/bin/sh
# checks on the finished file: duration against the song, black frames, loudness
HERE=$(cd "$(dirname "$0")/.." && pwd); F="$HERE/ahua.mp4"; SONG=${SONG:-"$HERE/../shared/audio/ahua.mp3"}
echo "film  $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F") s   song $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SONG") s"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames -of csv=p=0 "$F"
echo "blackdetect (pic_th .98, pix_th .10, d>=0.1):"; ffmpeg -hide_banner -nostats -i "$F" -vf blackdetect=d=0.1:pic_th=0.98:pix_th=0.10 -an -f null - 2>&1 | grep blackdetect || echo "  none"
echo "loudness:"; ffmpeg -hide_banner -nostats -i "$F" -af ebur128=peak=true -vn -f null - 2>&1 | grep -A12 "Summary:" | grep -E "I:|LRA:|Peak:"
