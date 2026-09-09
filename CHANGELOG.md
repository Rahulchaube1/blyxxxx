# Blyx Changelog

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
