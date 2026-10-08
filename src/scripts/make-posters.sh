#!/bin/sh
# Generate upscaled WebP posters for a portfolio video.
#
#   src/scripts/make-posters.sh <id> <youtubeVideoId> [--banner]
#
# Fetches the best YouTube thumbnail, crops letterbox/pillarbox bars to 16:9,
# upscales 4x with Real-ESRGAN (`upscale`, installed in ~/Tools/realesrgan),
# then writes web-optimised WebP into public/images/portfolio/:
#   thumbs/<id>-{640,1280}.webp          card + mosaic poster
#   stills/<id>-{1280,1920,2560}.webp    page banner (with --banner)
# Requires: curl, ImageMagick (magick), cwebp, upscale.
set -eu

ID=$1
VID=$2
BANNER=${3:-}
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
OUT=$ROOT/public/images/portfolio
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

for q in maxresdefault sddefault hqdefault; do
  curl -sf -o "$TMP/src.jpg" "https://i.ytimg.com/vi/$VID/$q.jpg" && break
done

W=$(magick identify -format '%w' "$TMP/src.jpg")
H=$(magick identify -format '%h' "$TMP/src.jpg")
if [ $((W * 3)) -eq $((H * 4)) ]; then
  # 4:3 thumbnail of a 16:9 video: strip the letterbox bars.
  magick "$TMP/src.jpg" -gravity center -crop "${W}x$((W * 9 / 16))+0+0" +repage "$TMP/in.png"
else
  # Trim any pillarbox/letterbox bars, then centre-crop to 16:9.
  magick "$TMP/src.jpg" -bordercolor black -border 1 -fuzz 4% -trim +repage "$TMP/in.png"
fi

upscale "$TMP/in.png" "$TMP/up.png"

webp() { # <src> <width> <quality> <dest>
  magick "$1" -filter Lanczos -resize "${2}x" -strip "$TMP/r.png"
  cwebp -quiet -q "$3" -m 6 -sharp_yuv -metadata none "$TMP/r.png" -o "$4"
}

UW=$(magick identify -format '%w' "$TMP/up.png")
UH=$(magick identify -format '%h' "$TMP/up.png")
CW=$UW; CH=$((UW * 9 / 16))
if [ "$CH" -gt "$UH" ]; then CH=$UH; CW=$((UH * 16 / 9)); fi
magick "$TMP/up.png" -gravity center -crop "${CW}x${CH}+0+0" +repage "$TMP/169.png"
mkdir -p "$OUT/thumbs"
for w in 640 1280; do webp "$TMP/169.png" $w 74 "$OUT/thumbs/$ID-$w.webp"; done

if [ "$BANNER" = "--banner" ]; then
  mkdir -p "$OUT/stills"
  for w in 1280 1920 2560; do webp "$TMP/up.png" $w 72 "$OUT/stills/$ID-$w.webp"; done
fi

echo "Done: $ID (add it to LOCAL_POSTERS in src/lib/portfolio.ts)"
