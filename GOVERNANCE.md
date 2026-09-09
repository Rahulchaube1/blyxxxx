# Blyx Governance

Blyx is an experimental open-source programming-language project backed by Neuroblyx. The repository is intended to keep language design, compiler implementation, tests, tooling, and project decisions visible to contributors.

## Principles

1. **Technical merit** — proposals are evaluated on correctness, maintainability, user impact, and evidence.
2. **Transparency** — significant language and compiler changes should be discussed openly through issues, discussions, or RFCs.
3. **Reproducibility** — performance and compatibility claims should be backed by reproducible tests or benchmarks.
4. **Contributor accessibility** — contributors should be able to understand how decisions are made and how to participate.
5. **Alpha-stage honesty** — experimental or incomplete functionality must not be presented as production-ready.

## Maintainer responsibilities

Maintainers are responsible for:

- reviewing contributions and keeping the codebase coherent;
- protecting the project from security, supply-chain, and licensing risks;
- maintaining CI, releases, documentation, and contribution workflows;
- making implementation status and breaking changes clear;
- helping contributors navigate design and implementation questions.

The current repository owner and lead project architect is Rahul Chaube. Additional maintainers may be added as the contributor community develops.

## Decision making

Routine implementation decisions can be made by maintainers through code review. Significant changes to language semantics, public APIs, compiler architecture, or project policy should receive broader review.

When consensus is unclear, maintainers should document the trade-offs and make a decision based on technical evidence, project direction, and contributor feedback.

## RFC process

Use an RFC when a change is likely to affect language semantics, major compiler architecture, public APIs, or long-term ecosystem compatibility.

1. Open an issue or discussion describing the problem.
2. Draft an RFC in `RFC/` when a formal proposal is warranted.
3. Gather community and maintainer feedback.
4. Revise the proposal and record the decision.
5. Implement the accepted design with tests and documentation.

RFC acceptance does not imply that the feature is already implemented or production-ready.

## Commercial relationship

Neuroblyx provides project backing and resources. Commercial backing does not change the technical review expectations for contributions or the requirement to label experimental functionality accurately.

## Changes to this policy

Governance changes should be proposed publicly and reviewed before adoption. This document is intentionally simple while the project is in alpha and can evolve with the contributor community.
