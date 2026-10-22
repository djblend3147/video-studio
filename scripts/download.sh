#!/usr/bin/env bash
# Usage: npm run download -- <url> [name]   -> public/<name>.mp4
set -euo pipefail
URL="${1:?Usage: npm run download -- <url> [name]}"
NAME="${2:-input}"
"$(dirname "$0")/../.venv/bin/yt-dlp" -f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b" \
  --merge-output-format mp4 -o "public/${NAME}.%(ext)s" "$URL"
