# Blyx Repository Audit

**Status:** Current alpha architecture review

This document describes the repository as it exists today. Current implementation status must be determined from the active source tree, tests, examples, and release artifacts.

## Current workspace

Blyx is organized as a Cargo workspace with dedicated compiler, library, and tooling crates.

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

## Repository cleanup

The active compiler and library trees no longer depend on the large inherited Rust compiler/source layout that previously existed in this repository. Obsolete upstream submodule configuration, inherited contributor mailmap, copied Rust CI tooling, and legacy Rust issue templates have also been removed.

## Current compiler maturity

The intended architecture is staged:

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

The frontend and intermediate-representation crates are active development areas. Native backend/code-generation work is not yet equivalent to a production compiler backend. The `blyxc` driver reports unsupported build/run operations rather than fabricating binaries or execution results.

## Tooling maturity

Several tools are alpha prototypes and should be treated as experimental until implementation and integration tests demonstrate the advertised behavior.

- `blyx-analyzer` — evolving language-server prototype.
- `blyxdoc` — documentation-generation prototype.
- `blyxup` — toolchain-management prototype.
- `blyxdbg` — debugger prototype without a complete debugging backend.
- `blyxprof` — no performance measurements until a real profiling backend exists.
- `blyxpkg` — evolving package-management prototype; registry publishing and dependency resolution are not complete.

## Verification standard

A feature is implemented only when corresponding source code and, where practical, automated tests or reproducible examples support it.

A benchmark is publishable only when its methodology and environment are documented according to [`REPRODUCIBLE_BENCHMARKS.md`](REPRODUCIBLE_BENCHMARKS.md).

Architecture documents describe intended or in-progress design unless they explicitly identify an implementation and its verification.

## Remaining engineering priorities

1. Expand lexer/parser/AST test coverage.
2. Strengthen semantic analysis and type checking.
3. Define and test stable BIR invariants.
4. Build a real backend/code-generation pipeline.
5. Replace tooling prototypes with tested implementations.
6. Establish reproducible examples and benchmark harnesses.
7. Keep documentation synchronized with implementation.

## Historical note

Earlier repository states contained substantial upstream Rust compiler material. That history remains visible in Git history, but it is not the architecture of the current Blyx workspace and should not be used to infer current implementation status.
