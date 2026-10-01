#!/bin/sh
set -eu
if [ -f "$HOME/.cargo/env" ]; then . "$HOME/.cargo/env"; fi
rustc --version
npm run build
