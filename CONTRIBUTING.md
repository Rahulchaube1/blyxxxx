# Contributing to Blyx

Thank you for contributing to Blyx. The project is early-stage, so careful design discussion and reproducible engineering work are especially valuable.

## Before you start

- Read the README and current documentation.
- Check existing issues and discussions before opening a duplicate.
- For substantial language, type-system, compiler, or runtime changes, start a design discussion or RFC first.
- Keep claims about performance and feature support tied to reproducible evidence.

## Contribution areas

### Compiler

Lexer, parser, AST, type checking, diagnostics, BIR/SSA, optimization, and code generation.

### Language design

Syntax, semantics, ownership, lifetimes, tensors, AI-oriented primitives, and interoperability.

### Runtime

Concurrency, actors, resource management, execution infrastructure, and platform support.

### Tooling

Formatter, analyzer/LSP, debugger, profiler, package management, examples, and developer experience.

### Documentation and benchmarks

Improve tutorials, reference material, examples, benchmark harnesses, and reproducibility.

## Pull requests

Keep pull requests focused. Explain the problem, design, implementation, validation, and compatibility impact. Include tests for behavior changes where practical.

For performance-sensitive changes, include before/after measurements and enough information for another contributor to reproduce them.

## Language and compiler changes

Avoid silently changing semantics. Document user-visible behavior, diagnostics, compatibility considerations, and migration requirements. Experimental features should be clearly marked as such.

## Reporting bugs

Use the bug-report template and provide a minimal reproduction whenever possible. Include `blyxc --version --verbose`, operating system, architecture, installation method, and complete diagnostics.

## Security

Please do not disclose security-sensitive issues in public issues. Follow the repository security policy for responsible disclosure.

## Code of conduct

Participation is governed by `CODE_OF_CONDUCT.md`. Keep technical disagreements constructive and treat contributors with respect.
