# Blyx RFC Process

The RFC process is used for changes that can materially affect Blyx language semantics, compiler architecture, public APIs, or long-term ecosystem compatibility.

## When to write an RFC

Use an RFC when a proposal changes one or more of:

- language syntax or semantics;
- ownership, lifetime, concurrency, or execution models;
- tensor or heterogeneous-computing semantics;
- BIR/SSA design or major compiler boundaries;
- standard-library contracts;
- package or module semantics;
- compatibility or migration policy.

Small bug fixes, documentation corrections, and localized implementation changes normally do not need an RFC.

## Lifecycle

### 1. Problem discussion

Open an issue or discussion describing the problem, constraints, alternatives, and desired outcome.

### 2. Draft

Create an RFC under `RFC/` using the repository's current template when one exists. Give it a stable number and a descriptive title.

### 3. Review

Invite feedback from maintainers and interested contributors. Resolve substantive objections in the document rather than relying only on chat history.

### 4. Decision

Record one of the following outcomes:

- **Accepted** — implementation may proceed.
- **Accepted with changes** — implementation may proceed after specified revisions.
- **Deferred** — useful idea, but evidence or prerequisites are insufficient.
- **Rejected** — explain the technical reason and, where useful, the preferred alternative.

### 5. Implementation

Accepted RFCs should link to the implementation work, tests, and documentation. An accepted RFC is a design decision, not a claim that the feature is already implemented.

## Good RFCs

A strong RFC is concrete about:

- the problem and motivation;
- proposed syntax and semantics;
- examples and diagnostics;
- implementation impact;
- compatibility and migration;
- security and performance implications;
- alternatives considered;
- unresolved questions.

For experimental features, clearly state the maturity level and what evidence is still missing.
