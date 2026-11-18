#!/bin/sh
set -eu
command -v cargo >/dev/null 2>&1 || { echo "Install Rust and Cargo to build Blyx, or download a binary from https://www.blyx-lang.space/download" >&2; exit 1; }
exec cargo install --locked --git https://github.com/Rahulchaube1/blyxxxx --tag v0.2.0 blyxc
