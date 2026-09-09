# Blyx Distribution & Launch Kit

This document is an internal guide for maintainers and contributors promoting Blyx publicly.

## Canonical positioning

**Blyx — An open-source AI-native systems programming language.**

Supporting description:

> Blyx explores a programming model where AI-oriented computation, systems programming, concurrency, tensors, heterogeneous computing, and native compilation are designed together.

Always describe Blyx as **experimental alpha software** unless a future release explicitly changes that status.

## What to emphasize

- open-source compiler and toolchain
- language and compiler architecture
- AI-oriented language primitives
- static typing and tensor-oriented concepts
- concurrency and systems programming
- BIR/SSA intermediate representation
- native and heterogeneous compilation research
- reproducible implementation work
- public RFCs and community contribution

## What not to claim

Do not describe Blyx as:

- a finished replacement for Rust, C++, Python, or CUDA
- universally faster than other languages
- production-ready unless a specific component has been demonstrated and documented as such
- fully implemented when a feature is only conceptual or partially implemented
- “the first” or “the best” without independently verifiable evidence

## Launch post structure

A strong technical launch should answer:

1. What problem are we exploring?
2. Why does a language-level approach help?
3. What is implemented today?
4. Show a short, real example.
5. Explain the compiler architecture.
6. State alpha limitations clearly.
7. Link to the repository and playground.
8. Ask for specific feedback.

## Preferred call to action

> Try the playground, inspect the compiler, open an issue with what you would change, and contribute if the direction interests you.

## Community growth loop

```text
Technical content
      ↓
GitHub / playground
      ↓
Runnable example
      ↓
Issue / Discussion
      ↓
Contribution / RFC
      ↓
Fork / Star
      ↓
Community write-up
      ↓
New contributors
```

The objective is genuine developer adoption, not artificial engagement.

## Recommended content themes

### Compiler series

- Building the Blyx lexer and parser
- Designing Blyx semantic analysis
- Type checking and tensor shapes
- Lowering Blyx into BIR/SSA
- Native code generation
- Diagnostics and compiler UX

### Language-design series

- What “AI-native” means at the language level
- Designing `generate`, `reason`, `orchestrate`, and `task`
- Ownership and AI runtime state
- Tensor types as language concepts
- Actor-based concurrency
- GPU and heterogeneous computing

### Open-source series

- Building Blyx in public
- What failed and what changed
- RFC decisions
- Benchmark methodology
- How contributors can add a compiler feature

## Platform guidance

### Hacker News

Lead with compiler/language design. Avoid hype. Invite technical criticism.

### Reddit

Customize each post for the community. Programming-language communities should receive language-design and compiler content; systems communities should receive compiler/runtime content; AI communities should receive concrete AI-language experiments.

Never cross-post identical promotional text everywhere.

### LinkedIn

Use concise technical progress updates, screenshots, benchmark methodology, compiler architecture, and contributor milestones.

### X

Use short technical threads around one idea: BIR, type checking, tensor syntax, compiler implementation, or a concrete experiment.

### Developer blogs

Prefer detailed engineering articles with code, diagrams, methodology, and links back to the corresponding source directories.

## SEO vocabulary

Use the exact project name consistently:

- Blyx programming language
- Blyx compiler
- Blyx AI-native systems programming language
- Blyx language
- Blyx BIR SSA
- Blyx tensor programming
- Blyx compiler Rust

Avoid inconsistent primary branding such as “Blyx full-stack language” unless that terminology is intentionally adopted by the project again.

## Evidence standard

Every public benchmark should identify:

- repository commit
- Blyx/compiler version
- target architecture
- operating system
- hardware
- build mode and flags
- benchmark source
- measurement procedure
- competing implementation and version
- number of runs or statistical treatment where relevant

If these details are unavailable, describe the result as an informal project measurement rather than a general performance claim.

## Contributor conversion

Every public launch should make at least one concrete contribution path visible:

- report a bug
- improve documentation
- add an example
- write a test
- propose an RFC
- work on a `good first issue`
- benchmark a feature
- improve compiler diagnostics

## Release checklist

Before a major public launch:

- [ ] README accurately reflects current implementation
- [ ] Playground examples are verified
- [ ] Installation instructions work
- [ ] CI passes on supported platforms
- [ ] Release artifacts are reproducible
- [ ] Benchmark methodology is public
- [ ] Issue templates are useful
- [ ] CONTRIBUTING.md is current
- [ ] Security policy is reachable
- [ ] Changelog is updated
- [ ] No inherited or unrelated project infrastructure remains
- [ ] Public claims match implementation evidence

## Success metric

The strongest signal is not raw social reach. Track whether visitors:

1. try Blyx,
2. return to the repository,
3. open useful issues/discussions,
4. submit pull requests,
5. build projects with Blyx,
6. become recurring contributors.
