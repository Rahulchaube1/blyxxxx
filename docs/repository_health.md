# Blyx Repository Health

Blyx is an experimental alpha-stage programming language. This document summarizes current engineering maturity without treating planned architecture as implemented functionality.

## Health matrix

| Area | Status | Priority |
| --- | --- | --- |
| Compiler frontend | Active / evolving | High |
| Semantic analysis | Active / evolving | High |
| Type checking | Active / evolving | High |
| BIR / SSA | Experimental | High |
| Runtime and standard library | Experimental | High |
| Package manager | Prototype | Medium |
| Formatter | Prototype | Medium |
| Language server | Prototype | Medium |
| Documentation tooling | Prototype | Medium |
| Debugger | Placeholder | Low |
| Profiler | Placeholder | Low |
| Cross-platform releases | In progress | Medium |

## Current engineering priorities

1. Keep the workspace buildable and testable.
2. Increase end-to-end compiler coverage.
3. Stabilize diagnostics and compiler UX.
4. Define BIR invariants and test them before adding aggressive optimization.
5. Separate implemented functionality from future backend/runtime architecture.
6. Keep examples and documentation synchronized with actual compiler behavior.
7. Establish reproducible benchmarks before making performance claims.

## Definition of maturity

A feature should not be labeled stable or production-ready merely because its syntax, architecture, or public API has been designed. A meaningful maturity upgrade requires implementation, tests, documentation, and evidence appropriate to the feature.

## Repository hygiene

Unrelated upstream source trees and obsolete implementation documentation should not be reintroduced. Historical documents must clearly identify themselves as historical and must not describe deleted components as current architecture.
