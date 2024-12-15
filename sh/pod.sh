#!/usr/bin/env nix-shell
#!nix-shell -i bash -p podman

cd "$(dirname "$0")" || exit
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT" || exit

# podman machine config
POD_NAME="podman-machine"
POD_IMAGE="fedora:latest"
POD_CPUS=2
POD_MEMORY=2048
POD_DISK_G=20

if ! podman machine list | grep -q "Currently running"; then
  podman machine init --name "$POD_NAME" --image "$POD_IMAGE" --cpus "$POD_CPUS" --memory "$POD_MEMORY" --disk "$POD_DISK_G"
  podman machine start
fi

podman ps
podman machine list
podman machine inspect
