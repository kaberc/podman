#!/usr/bin/env bash
# Builds Podman from a source checkout and serves it on a fresh, isolated
# rootless store for integration tests.
#
# Usage: scripts/setup_podman_ci.sh <podman-source-dir> <work-dir>
# Appends PODMAN_SOCK to $GITHUB_ENV when running in GitHub Actions.
set -euo pipefail

source_dir=$(realpath "${1:?podman source directory}")
work_dir=$(realpath -m "${2:?work directory}")

sudo apt-get update
sudo apt-get install -y --no-install-recommends \
  build-essential pkg-config libseccomp-dev podman crun conmon uidmap apparmor

commit=$(git -C "$source_dir" rev-parse HEAD)
mkdir -p "$work_dir"
(
  cd "$source_dir"
  CGO_ENABLED=1 go build -mod=vendor \
    -tags 'seccomp containers_image_openpgp exclude_graphdriver_btrfs exclude_graphdriver_devicemapper' \
    -ldflags "-s -w -X go.podman.io/podman/v6/libpod/define.gitCommit=$commit" \
    -o "$work_dir/podman6" ./cmd/podman
)

bin_dir="$work_dir/bin"
mkdir -p "$bin_dir"
fetch_helper() {
  local name=$1 version=$2 sha256=$3
  curl --fail --silent --location \
    "https://github.com/containers/$name/releases/download/$version/$name.gz" \
    -o "$work_dir/$name.gz"
  echo "$sha256  $work_dir/$name.gz" | sha256sum --check --status
  gunzip --force "$work_dir/$name.gz"
  install -m 0755 "$work_dir/$name" "$bin_dir/$name"
}
fetch_helper netavark v2.0.0 d8bc342c38382029e7e12256120ac0f7676dcc063aa1e7259189bb69cc869563
fetch_helper aardvark-dns v2.0.0 fdaa3665ce58337fe597e0822e24de97528529d1a39fa6b655aa656c8ad33086
curl --fail --silent --location \
  https://github.com/containers/crun/releases/download/1.21/crun-1.21-linux-amd64 \
  -o "$work_dir/crun"
echo "322c6c94b33a749ccd9f6f5ad48b0dd976eef559bbcfe15afd507a289dcdbe91  $work_dir/crun" \
  | sha256sum --check --status
install -m 0755 "$work_dir/crun" "$bin_dir/crun"
"$bin_dir/crun" --version | grep -F 'crun version 1.21'

curl --fail --silent --location \
  https://passt.top/passt/snapshot/passt-2026_01_20.386b5f5.tar.gz \
  -o "$work_dir/passt.tar.gz"
echo "b378b36cc6d17988fd8efdc9e432495afc96787c3ee231aee55bc7e50c4edf6d  $work_dir/passt.tar.gz" \
  | sha256sum --check --status
mkdir -p "$work_dir/passt"
tar -xzf "$work_dir/passt.tar.gz" --strip-components=1 -C "$work_dir/passt"
make -C "$work_dir/passt" pasta
install -m 0755 "$work_dir/passt/pasta" "$bin_dir/pasta"

home=$(mktemp -d "$work_dir/home.XXXXXX")
runtime=$(mktemp -d "$work_dir/runtime.XXXXXX")

cat >"$work_dir/containers.conf" <<CONF
[containers]
netns = "bridge"

[engine]
runtime = "$bin_dir/crun"
helper_binaries_dir = ["$bin_dir", "/usr/lib/podman", "/usr/libexec/podman"]
CONF

export HOME="$home"
export XDG_RUNTIME_DIR="$runtime"
export XDG_CONFIG_HOME="$home/.config"
export XDG_DATA_HOME="$home/.local/share"
export CONTAINERS_CONF="$work_dir/containers.conf"

socket="$runtime/podman.sock"
RUNNER_TRACKING_ID="" setsid aa-exec -p podman -- "$work_dir/podman6" system service --time=0 \
  "unix://$socket" >"$work_dir/service.log" 2>&1 &
echo $! >"$work_dir/service.pid"

for _ in $(seq 1 50); do
  [ -S "$socket" ] && break
  sleep 0.2
done
[ -S "$socket" ] || { cat "$work_dir/service.log"; exit 1; }

curl --fail --silent --unix-socket "$socket" http://d/v6.0.0/libpod/_ping >/dev/null
"$work_dir/podman6" --version

if [ -n "${GITHUB_ENV:-}" ]; then
  echo "PODMAN_SOCK=$socket" >>"$GITHUB_ENV"
fi
echo "$socket"
