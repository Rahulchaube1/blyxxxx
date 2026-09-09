# Blyx Open-Source Repository Review

This document records repository-quality work and the standards used to keep Blyx understandable, reproducible, and contributor-friendly.

## Current baseline

| Area | Standard |
|---|---|
| Positioning | Blyx is described as an experimental, open-source AI-native systems programming language. |
| README | Explains project status, architecture, toolchain, quick start, contribution paths, and evidence standards. |
| CI | Uses Blyx-native Cargo workspace checks rather than inherited Rust project infrastructure. |
| Releases | Tagged releases build cross-platform artifacts and checksums. |
| Governance | Major language and architecture changes use documented review/RFC practices. |
| Security | Security-sensitive reports are routed through the repository security policy. |
| Contributions | Pull requests are expected to explain design, validation, compatibility, and performance impact where relevant. |
| Benchmarks | Published performance claims are expected to include reproducible methodology and environment details. |
| Community | Issues and discussions are used for bugs, questions, design feedback, and proposals. |

## Cleanup principle

Blyx should not present copied or unrelated upstream infrastructure as if it were Blyx engineering. Rust may be used as an implementation language, but Rust-specific compiler sources, CI systems, submodules, contributor metadata, and documentation should not remain in the public repository unless they are intentionally part of the Blyx project and clearly attributed.

## Quality bar

Before a release or major public launch, review:

- build and test commands from a clean checkout;
- links in README and documentation;
- examples against the actual compiler implementation;
- release artifact contents and checksums;
- GitHub Actions results;
- issue and pull-request templates;
- license and attribution requirements;
- benchmark reproducibility;
- security and dependency configuration.

This review is a living engineering checklist, not a claim that every roadmap item is complete.
