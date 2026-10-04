#!/usr/bin/env bash
# Build the static site and sync it into the GitHub Pages repo checkout.
# Usage: bash scripts/publish-github-pages.sh [target-dir]   (default: ../vatsalsaglani.github.io)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-$ROOT/../vatsalsaglani.github.io}"

if [ ! -d "$TARGET" ]; then
  echo "Target directory not found: $TARGET" >&2
  echo "Clone the github.io repo there, or pass its path as the first argument." >&2
  exit 1
fi
TARGET="$(cd "$TARGET" && pwd)"

cd "$ROOT"
npm run build

if [ ! -f out/index.html ]; then
  echo "Build did not produce out/index.html" >&2
  exit 1
fi

# Clear the target, keeping git metadata and files that belong to the repo itself.
find "$TARGET" -mindepth 1 -maxdepth 1 \
  ! -name .git ! -name README.md ! -name CNAME \
  -exec rm -rf {} +

# Copy everything from out/, including dotfiles.
cp -R out/. "$TARGET"/
touch "$TARGET/.nojekyll"

echo
echo "Synced out/ to $TARGET"
echo "Next steps:"
echo "  cd \"$TARGET\""
echo "  git add -A"
echo "  git commit -m \"Publish site\""
echo "  git push"
