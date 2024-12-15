#!/usr/bin/env nix-shell
#!nix-shell -i bash -p podman

cd "$(dirname "$0")" || exit
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT" || exit

if ! podman machine list | grep -q "Currently running"; then
  podman machine init
  podman machine start
fi

podman machine list
