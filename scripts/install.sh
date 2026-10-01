#!/bin/sh
set -eu
if [ -f "$HOME/.cargo/env" ]; then . "$HOME/.cargo/env"; fi
if ! command -v rustup >/dev/null 2>&1; then
  installer=$(mktemp)
  trap 'rm -f "$installer"' EXIT HUP INT TERM
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o "$installer"
  sh "$installer" -y --profile minimal --default-toolchain 1.92.0 --no-modify-path
  . "$HOME/.cargo/env"
else
  rustup toolchain install 1.92.0 --profile minimal
fi
rustc --version
npm ci --no-audit --no-fund
