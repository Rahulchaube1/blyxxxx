# Installing and Building Blyx

Blyx is an experimental alpha-stage programming language. The simplest way to try it is through the official playground or published release artifacts.

## Try Blyx online

Use the official playground:

https://www.blyx-lang.space/play

## Install a release

### Self-hosted compiler for Windows x64 and Linux x64

Download the [Blyx Direct archive](https://github.com/Rahulchaube1/blyxxxx/releases/tag/direct-v0.1.0) for your OS and extract it into its own directory. Its version command prints `blyxc direct 0.1.0`. Follow the [build and self-compilation guide](compiler/blyxc/bootstrap/README.md).

### Blyx 0.2.1 toolchain

On Apple Silicon macOS and x86-64 Linux, Homebrew installs the official release binary:

```sh
brew install rahulchaube1/blyx/blyx
blyxc --version
```

With Rust and a host linker installed, Cargo can also build the compiler from crates.io:

```sh
cargo install --locked --version 0.2.1 blyxc
```

Published binaries and installation instructions are maintained at:

https://blyx-lang.space/download

## Build from source

### Requirements

- Git
- Rust toolchain with Cargo
- A C/C++ linker/toolchain appropriate for your platform

The 0.2.1 workspace and the initial bootstrap seed use Rust. A released Blyx Direct executable can build the Direct compiler from its Blyx source.

### Clone the repository

```bash
git clone https://github.com/Rahulchaube1/blyxxxx.git
cd blyxxxx
```

### Build the workspace

```bash
cargo build --workspace
```

For an optimized build:

```bash
cargo build --workspace --release
```

### Run tests

```bash
cargo test --workspace
```

### Check formatting

```bash
cargo fmt --all -- --check
```

### Build the compiler directly

```bash
cargo build -p blyxc
```

The resulting compiler binary is produced by Cargo under `target/` for the selected profile and platform.

## Development workflow

For compiler work, the main crates are:

```text
compiler/blyx_lexer
compiler/blyx_parser
compiler/blyx_ast
compiler/blyx_semantic
compiler/blyx_typeck
compiler/blyx_bir
compiler/blyxc
```

For tooling and libraries, see `tools/` and `library/`.

## Platform support

Blyx is alpha software. Platform support should be considered provisional until a target has corresponding CI coverage and release artifacts. Do not assume that every Rust-supported target is automatically a supported Blyx target.

## Troubleshooting

If a build fails, collect:

```bash
rustc --version
cargo --version
cargo build --workspace -vv
```

Then include the operating system, architecture, exact commit, and complete error output when opening an issue.

## Related documentation

- `README.md` — project overview and quick start
- `CONTRIBUTING.md` — contribution workflow
- `docs/compiler_architecture.md` — compiler architecture
- `docs/frontend_architecture.md` — frontend architecture
- `docs/REPRODUCIBLE_BENCHMARKS.md` — benchmark methodology
