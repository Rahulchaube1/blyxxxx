<div align="center">
  <img src="blyxlogo.png" alt="Blyx logo" width="140" />

  # Blyx

  **An open-source AI-native systems programming language.**

  Explore a programming model where AI-oriented computation, systems programming, concurrency, tensors, heterogeneous computing, and native compilation are designed together.

  [![Website](https://img.shields.io/badge/Website-blyx--lang.space-0f172a?style=flat-square)](https://blyx-lang.space)
  [![Status](https://img.shields.io/badge/status-v0.1.0--alpha-orange?style=flat-square)](https://blyx-lang.space)
  [![License](https://img.shields.io/badge/license-MIT%20%2F%20Apache--2.0-blue?style=flat-square)](LICENSE-MIT)
  [![Rust](https://img.shields.io/badge/compiler%20implementation-Rust-black?style=flat-square&logo=rust)](https://www.rust-lang.org/)
  [![Playground](https://img.shields.io/badge/Playground-Try%20Blyx-2563eb?style=flat-square)](https://play.blyx-lang.space)
</div>

---

## ⚠️ Project status

**Blyx is experimental alpha software.** Syntax, compiler behavior, APIs, and tooling can change without notice.

The repository is the engineering source of truth. A feature should be considered implemented only when the corresponding source code and tests or reproducible examples support it.

> **Current compiler reality:** the frontend can tokenize and parse Blyx source, while native code generation and program execution are still under development. `blyxc build` and `blyxc run` therefore report that the backend is not ready rather than producing simulated binaries or results.

## Why Blyx?

AI workloads increasingly combine native systems code, parallel execution, tensor computation, accelerators, and model-oriented operations. Blyx explores whether those concerns can be represented as language-level concepts rather than assembled entirely through separate libraries and runtimes.

The goal is not to replace Rust, C++, Python, or CUDA overnight. The goal is to investigate a different programming model and make the implementation open to scrutiny and contribution.

## Design pillars

- **Native compilation** — a Rust-based compiler implementation with a path toward native machine-code generation.
- **AI-oriented primitives** — language constructs such as `generate`, `reason`, `orchestrate`, and `task` are explored as first-class concepts.
- **Static tensor concepts** — tensor shape and type information can participate in compile-time validation where implemented.
- **Concurrency** — actor and asynchronous programming models are part of the language design.
- **Heterogeneous computing** — GPU-oriented syntax and backend work are being explored.
- **Explicit resource management** — ownership, borrowing, and lifetime-oriented safety are part of the design direction.
- **Intermediate representation** — Blyx uses a BIR/SSA-oriented architecture to separate language semantics from lower-level code generation.

## Example

The syntax is evolving. Examples below illustrate design direction and may not represent the complete supported surface of the current alpha compiler.

```blyx
fn main() {
    let result = generate("Summarize this document");
    print(result);
}
```

Tensor-oriented design:

```blyx
tensor<f32, 128, 64> weights;
tensor<f32, 64, 32> inputs;

gpu {
    let output = weights * inputs;
}
```

For currently supported syntax, use compiler tests and examples together with the official documentation.

## Compiler architecture

```text
Source
  │
  ▼
Lexer
  │
  ▼
Parser / AST
  │
  ▼
Semantic Analysis
  │
  ▼
Type Checking / Tensor Validation
  │
  ▼
BIR / SSA
  │
  ▼
Optimization
  │
  ▼
Backend / Code Generation   ← in development
  │
  ▼
Native / Heterogeneous Targets
```

The compiler is organized into dedicated crates for lexing, parsing, AST representation, semantic analysis, type checking, BIR, and the compiler driver.

## Repository layout

```text
compiler/       Compiler frontend, type system, BIR and compiler driver
library/        Runtime and standard-library components
tools/          Package, formatting, analysis and developer-tooling prototypes
examples/       Language examples
docs/           Architecture, specifications and project documentation
RFC/            Language and ecosystem design proposals
website/        Official web portal and playground
.github/        CI, issue templates, PR workflow and project automation
```

## Toolchain maturity

| Tool | Current role | Alpha status |
|---|---|---|
| `blyxc` | Compiler driver | Frontend validation available; native backend in development |
| `blyxpkg` | Package management | Prototype |
| `blyxfmt` | Source formatting | Prototype |
| `blyx-analyzer` | Editor/LSP tooling | Prototype |
| `blyxdoc` | Documentation generation | Prototype |
| `blyxup` | Toolchain management | Prototype |
| `blyxdbg` | Debugging | Prototype; backend not complete |
| `blyxprof` | Performance profiling | No measurements until a real backend exists |

## Quick start

### Try without installing

Use the online playground:

**https://play.blyx-lang.space**

### Install

Official installation instructions and release artifacts:

**https://blyx-lang.space/download**

### Build from source

```bash
git clone https://github.com/Rahulchaube1/blyxxxx.git
cd blyxxxx
cargo build --workspace
cargo test --workspace
```

### Validate a Blyx source file

After building `blyxc`, use its current supported frontend command:

```bash
cargo run -p blyxc -- check examples/hello.blyx
```

Native compilation and execution are tracked separately and are not advertised as complete yet.

## Documentation & canonical references

- **Website:** https://blyx-lang.space
- **Learn:** https://blyx-lang.space/learn
- **Compiler architecture:** https://blyx-lang.space/compiler
- **Download:** https://blyx-lang.space/download
- **Playground:** https://play.blyx-lang.space
- **Language specification:** [`docs/specification.md`](docs/specification.md)
- **Repository health:** [`docs/repository_health.md`](docs/repository_health.md)
- **Reproducible benchmarks:** [`docs/REPRODUCIBLE_BENCHMARKS.md`](docs/REPRODUCIBLE_BENCHMARKS.md)
- **RFC process:** [`docs/RFC_PROCESS.md`](docs/RFC_PROCESS.md)
- **AI-readable project index:** [`llms.txt`](llms.txt)
- **Detailed AI-readable reference:** [`llms-full.txt`](llms-full.txt)
- **Citation metadata:** [`CITATION.cff`](CITATION.cff)

These files provide stable project context for documentation tools, search systems, AI agents, researchers, and contributors. They improve discoverability and machine-readable context; they do not guarantee indexing, ranking, or model training.

## Supporting Blyx

Blyx is open source and community-supported. If you find the project useful or want to help fund compiler, tooling, documentation, infrastructure, and ecosystem development, you can support it here:

**☕ Buy Me a Coffee:** https://buymeacoffee.com/rahulchaube

Sponsorship is optional and does not grant special influence over technical decisions or project governance.

## Testing and reproducibility

Blyx should earn performance and compatibility claims through reproducible evidence. When adding or changing a benchmark:

1. Keep the benchmark source in the repository where practical.
2. Document compiler version, commit, target, operating system, hardware, and build flags.
3. Report methodology and variance rather than a single unexplained number.
4. Make the benchmark runnable by another contributor.

Performance numbers should therefore be treated as project measurements, not universal guarantees, until the complete methodology and harness are independently reproducible.

## Contributing

Blyx is intentionally open to criticism and experimentation. Useful contributions include compiler implementation, parser and diagnostics improvements, type-system design, BIR/SSA work, runtime and concurrency work, tensor and accelerator support, tooling, examples, documentation, tests, fuzzing, reproducible benchmarks, and language-design RFCs.

For substantial language or compiler changes, start with an issue, discussion, or RFC before investing in a large implementation. See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`RFC/`](RFC/).

## Community

Questions, design discussions, feature proposals, and implementation feedback are welcome through GitHub Discussions and Issues.

Please report security-sensitive vulnerabilities through [`SECURITY.md`](SECURITY.md), not a public issue.

## Roadmap

The alpha roadmap focuses on making the compiler and ecosystem increasingly useful and reproducible:

- [ ] stabilize the core language surface
- [ ] expand semantic and type-system coverage
- [ ] strengthen diagnostics and compiler UX
- [ ] define stable BIR/SSA invariants and optimization passes
- [ ] implement a real native backend
- [ ] improve runtime and concurrency primitives
- [ ] mature tensor and heterogeneous-computing support
- [ ] replace tooling prototypes with tested implementations
- [ ] expand cross-platform release coverage
- [ ] publish reproducible benchmark harnesses
- [ ] grow documentation, examples, and RFC coverage

The roadmap is intentionally subject to change as implementation and community feedback evolve.

## Governance and project philosophy

Blyx is developed as an open-source project backed by Neuroblyx. The public repository is intended to make language design, implementation, testing, and discussion visible to contributors.

Technical claims should be measurable. Experimental features should be labeled. Breaking changes should be discussed openly. Contributions should be reviewed on technical merit.

## License

Blyx is dual-licensed under your choice of:

- [MIT License](LICENSE-MIT)
- [Apache License 2.0](LICENSE-APACHE)
