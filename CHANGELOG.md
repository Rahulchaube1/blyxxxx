# Blyx Changelog

## 0.2.3

- Added squared_distance for numerical vectors in the interpreter and native backend. Common vector built-ins avoid allocating an argument list.
- Reduced the browser and editor WebAssembly payload by stripping debugging symbols from the release build.
- Added a runnable nearest-centroid example and a benchmark that checks the output of each implementation.

## 0.2.0

- Build standalone executables for the typed subset through rustc.
- Run f64 arithmetic, immutable vectors, dot products, indexing and reductions.
- Execute programs in the browser playground and VS Code using the shared interpreter.
- Ship a reproducible CLI latency benchmark and a least-squares example.


All notable Blyx releases and changes are documented here.

The project is currently in alpha. Entries describe repository changes and intended capabilities only where implementation evidence exists.

## [0.1.0-alpha] - 2026-07-31

### Initial project release

- Established the Blyx project identity and open-source repository.
- Added the initial dedicated Blyx compiler frontend crates: lexer, parser, AST, semantic analysis, type checking, and BIR.
- Added the `blyxc` compiler driver.
- Added experimental runtime and standard-library crates under `library/`.
- Added early tooling prototypes for package management, formatting, language-server support, documentation, toolchain management, debugging, and profiling.
- Published the official Blyx website and interactive playground.

### Experimental language direction

The project explores AI-oriented computation, tensor types, concurrency, actors, and heterogeneous execution. These areas remain experimental and should not be interpreted as universally implemented or production-ready.

### Documentation and engineering

- Added reproducible benchmark guidance.
- Added an RFC process for language and compiler design changes.
- Added contribution, governance, security, and repository-quality documentation.

## Unreleased

Changes on `blyx-main` are development work toward future releases. Release notes should distinguish implemented behavior from planned architecture and experiments.
