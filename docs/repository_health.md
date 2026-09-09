# Blyx Repository Health & Technical Debt Audit

This document is a point-in-time engineering audit of the Blyx repository. Blyx is an experimental alpha programming language; classifications below describe the current implementation maturity, not production-readiness claims.

## 1. Component health matrix

| Subsystem | Classification | Technical debt | Recommended action |
| --- | --- | --- | --- |
| `compiler/blyx_lexer` | Core | Low–Medium | Expand token coverage and diagnostics as the language evolves. |
| `compiler/blyx_parser` | Core | Medium | Grow grammar coverage and parser recovery tests. |
| `compiler/blyx_ast` | Core | Medium | Keep syntax representations stable and documented. |
| `compiler/blyx_semantic` | Core | Medium–High | Add semantic validation and negative tests as features land. |
| `compiler/blyx_typeck` | Core | Medium–High | Strengthen inference, diagnostics, and tensor-shape validation. |
| `compiler/blyx_bir` | Core | Medium–High | Define and test BIR/SSA invariants before adding aggressive optimization. |
| `compiler/blyxc` | Compiler driver | Medium | Improve CLI UX, diagnostics, and end-to-end compilation coverage. |
| `library/blyx` | Runtime | Medium | Stabilize runtime APIs and add platform/concurrency tests. |
| `library/blyx-std` | Standard library | Medium | Establish API conventions and compatibility guarantees. |
| `tools/blyxpkg` | Tooling | Prototype / evolving | Define package metadata, registry, and reproducible-resolution behavior. |
| `tools/blyxfmt` | Tooling | Prototype / evolving | Align formatting rules with the language grammar. |
| `tools/blyx-analyzer` | Tooling | Prototype / evolving | Expand language-server coverage and editor diagnostics. |
| `tools/blyxdoc` | Tooling | Prototype / evolving | Stabilize documentation generation and examples. |
| `tools/blyxup` | Tooling | Prototype / evolving | Document supported installation/update channels. |
| `tools/blyxdbg` | Tooling | Prototype | Establish debugger protocol and target support. |
| `tools/blyxprof` | Tooling | Prototype | Establish profiling data formats and useful baseline workflows. |

## 2. Architecture health

The intended compilation path is:

```text
Blyx source
   ↓
Lexer
   ↓
Parser / AST
   ↓
Semantic analysis
   ↓
Type checking + tensor validation
   ↓
BIR / SSA
   ↓
Optimization
   ↓
Backend / code generation
   ↓
Native and heterogeneous targets
```

The repository should document implemented stages separately from planned stages. A feature should not be described as production-ready until there is repeatable implementation evidence and automated coverage.

## 3. Current priorities

1. Keep the repository free of unrelated upstream compiler/source trees.
2. Make the workspace build and test cleanly on supported platforms.
3. Increase end-to-end compiler tests before expanding language surface area.
4. Define stable BIR invariants and serialization/debugging expectations.
5. Improve diagnostics and developer tooling.
6. Establish reproducible benchmark methodology before publishing performance claims.

## 4. Definition of done for maturity upgrades

A subsystem should move from prototype/evolving to stable only when its public behavior is documented, covered by automated tests, exercised by real examples, and compatible with the project's release policy.

This audit intentionally avoids claiming that Blyx is production-ready while it remains an alpha-stage project.
