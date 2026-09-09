# Blyx Repository Audit

**Status:** Current alpha architecture review

This document describes the repository as it exists today. It is intentionally separate from historical migration notes: current implementation status must be determined from the active source tree, tests, examples, and release artifacts.

## Current workspace

Blyx is organized as a native Cargo workspace with dedicated compiler, library, and tooling crates.

| Area | Current location | Role |
| --- | --- | --- |
| Lexer | `compiler/blyx_lexer` | Tokenization and source spans |
| Parser / AST | `compiler/blyx_parser`, `compiler/blyx_ast` | Syntax parsing and language representation |
| Semantic analysis | `compiler/blyx_semantic` | Name and semantic analysis |
| Type checking | `compiler/blyx_typeck` | Type-system validation |
| BIR | `compiler/blyx_bir` | Blyx intermediate representation / SSA direction |
| Compiler driver | `compiler/blyxc` | User-facing compiler command |
| Runtime / library | `library/blyx`, `library/blyx-std` | Runtime and standard-library foundations |
| Tooling | `tools/` | Package, formatting, analysis, docs, debug and profiling prototypes |

## Repository cleanup completed

The active compiler and library trees no longer depend on the large inherited Rust compiler/source layout that previously existed in this repository. The current workspace contains only the dedicated Blyx compiler crates listed above.

The cleanup also removed obsolete Rust-specific repository infrastructure such as the upstream submodule configuration, inherited contributor mailmap, copied Rust CI tooling, and legacy Rust issue templates.

## Current compiler maturity

The architecture is intentionally staged:

```text
Source
  → Lexer
  → Parser / AST
  → Semantic Analysis
  → Type Checking
  → BIR / SSA
  → Optimization
  → Backend / Code Generation
  → Native / Heterogeneous Targets
```

The frontend and intermediate-representation crates are active areas of development. Native backend/code-generation work is not yet equivalent to a production compiler backend. The `blyxc` driver therefore reports unsupported build/run operations instead of fabricating binaries or execution results.

## Tooling maturity

Several tools exist as alpha prototypes. Their command-line surfaces should be treated as experimental until implementation and integration tests demonstrate the advertised behavior.

In particular:

- `blyx-analyzer` is an evolving language-server prototype.
- `blyxdoc` is a documentation-generation prototype.
- `blyxup` is a toolchain-management prototype.
- `blyxdbg` is a debugger prototype without a complete debugging backend.
- `blyxprof` does not publish measurements until a real profiling backend exists.
- `blyxpkg` is an evolving package-management prototype; registry publishing and dependency resolution must not be represented as complete until implemented.

## Verification standard

A feature is considered implemented only when there is corresponding source code and, where practical, automated tests or reproducible examples.

A benchmark is considered publishable only when its methodology and environment are documented according to [`REPRODUCIBLE_BENCHMARKS.md`](REPRODUCIBLE_BENCHMARKS.md).

Architecture documents describe intended or in-progress design unless they explicitly identify an implementation and its verification.

## Remaining engineering priorities

1. Expand lexer/parser/AST test coverage.
2. Strengthen semantic analysis and type checking.
3. Define and test stable BIR invariants.
4. Build a real backend/code-generation pipeline.
5. Replace tooling prototypes with tested implementations incrementally.
6. Establish reproducible examples and benchmark harnesses.
7. Keep documentation synchronized with the implementation.

## Historical note

Earlier repository states contained substantial upstream Rust compiler material. That history remains visible in Git history, but it is not the architecture of the current Blyx workspace and should not be used to infer current implementation status.
