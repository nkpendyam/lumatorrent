#!/usr/bin/env bash
set -euo pipefail

OUT="tests/network/generated/legal-fixture"
mkdir -p "$OUT/docs" "$OUT/unicode" "$OUT/many-files"

echo "LumaTorrent legal local swarm fixture" > "$OUT/README.txt"
base64 /dev/urandom | head -c 1048576 > "$OUT/docs/one-megabyte.txt"
printf "unicode test\n" > "$OUT/unicode/नमस्ते-こんにちは.txt"
for i in $(seq 1 100); do echo "file $i" > "$OUT/many-files/file-$i.txt"; done

echo "Generated legal fixtures at $OUT"
