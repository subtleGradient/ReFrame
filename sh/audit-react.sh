#!/usr/bin/env bash
cd "$(dirname "$0")"
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# find . -name "package.json" | grep -vE 'node_modules|\.next'
# find . -name "package.json" | grep node_modules/react/package.json

for pkg in $(find . -name "package.json" | grep node_modules/react/package.json); do
  echo "$pkg `jq .version "$pkg"`"
done
