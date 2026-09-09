<div align="center">
  <img src="blyxlogo.png" alt="Blyx logo" width="140" />
  <h1>Blyx</h1>
  <p><strong>An open-source AI-native systems programming language.</strong></p>
  <p>Exploring a programming model where AI, systems programming, concurrency, tensors, heterogeneous computing, and native compilation are designed together.</p>

  <p>
    <a href="https://www.blyx-lang.space/"><img src="https://img.shields.io/badge/Website-Blyx-111827?style=for-the-badge" alt="Blyx website" /></a>
    <a href="https://www.blyx-lang.space/docs"><img src="https://img.shields.io/badge/Docs-Read-2563eb?style=for-the-badge" alt="Documentation" /></a>
    <a href="https://play.blyx-lang.space"><img src="https://img.shields.io/badge/Playground-Try%20Blyx-0891b2?style=for-the-badge" alt="Playground" /></a>
    <img src="https://img.shields.io/badge/Status-v0.1.0--alpha-f59e0b?style=for-the-badge" alt="Alpha status" />
    <img src="https://img.shields.io/badge/License-MIT%20%2F%20Apache--2.0-16a34a?style=for-the-badge" alt="License" />
  </p>
</div>

---

## What is Blyx?

**Blyx is an experimental open-source programming language for AI-oriented systems software.** It investigates how language and compiler design can make AI workloads, numerical computation, concurrency, heterogeneous execution, and native systems programming work together instead of being separate layers.

Blyx is currently **alpha software**. The project is intended for experimentation, compiler research, systems programming exploration, and community feedback. APIs, syntax, tooling, and implementation details may change.

### Design goals

- **AI-native primitives** — language constructs such as `generate`, `reason`, `orchestrate`, and `task` explore how AI operations could become programmable language concepts.
- **Static tensor types** — tensor rank and dimensions can be represented in the type system for experiments in compile-time validation.
- **Systems-level control** — ownership, lifetimes, deterministic resource management, and native compilation are core design directions.
- **Parallel and actor-oriented execution** — concurrency primitives explore safe, scalable parallel workloads.
- **Heterogeneous computing** — the compiler architecture explores CPU, GPU, and accelerator-oriented execution.
- **Native compilation** — Blyx uses an intermediate representation and LLVM-oriented compilation pipeline rather than requiring a managed runtime.

> **Important:** Blyx is an evolving research/engineering project. Please verify feature availability against the current compiler and documentation rather than assuming every design goal is production-ready.

---

## Compiler Architecture

The current architecture is organized around a compiler pipeline designed for experimentation with optimization and heterogeneous targets:

```text
Blyx source
    │
    ▼
Lexer / Parser
    │
    ▼
AST + Type Checking
    │
    ├── Tensor shape/type analysis
    │
    ▼
BIR / SSA
    │
    ▼
LLVM-oriented code generation
    │
    ├── Native CPU targets
    ├── GPU / accelerator targets (where implemented)
    └── Other experimental targets
```

The repository contains the language implementation, compiler components, tooling, and supporting project infrastructure.

---

## Language Examples

### Hello World

```blyx
fn main() {
    println!("Hello, World from Blyx!");
}
```

### Functions

```blyx
fn compute_sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = compute_sum(20, 22);
    println!("Result: {}", result);
}
```

### Tensor-oriented syntax

```blyx
#![feature(blyx_experimental)]

fn main() {
    let weights: tensor<f32, 128, 64>;
}
```

Additional experimental examples are available in the documentation and playground.

---

## Toolchain

The Blyx ecosystem is designed around a small set of focused developer tools. Availability and maturity vary by release.

| Tool | Purpose |
| --- | --- |
| `blyxc` | Blyx compiler driver |
| `blyxpkg` | Package and project management |
| `blyxfmt` | Source formatting |
| `blyxdoc` | Documentation generation |
| `blyx-analyzer` | Language tooling / LSP |
| `blyxdbg` | Debugging tooling |
| `blyxprof` | Profiling tooling |
| `blyxup` | Toolchain management |

See the official documentation for the current implementation status of each component.

---

## Installation

Official installation instructions and platform-specific binaries are maintained on the Blyx website:

**https://www.blyx-lang.space/download**

For a quick introduction, start with the official learning resources:

**https://www.blyx-lang.space/learn**

---

## Try Blyx

You can explore the language through the online playground:

**https://play.blyx-lang.space**

The playground is the fastest way to experiment without setting up the complete local toolchain.

---

## Documentation

- **Website:** https://www.blyx-lang.space/
- **Documentation:** https://www.blyx-lang.space/docs
- **Learn Blyx:** https://www.blyx-lang.space/learn
- **Compiler architecture:** https://www.blyx-lang.space/compiler
- **Playground:** https://play.blyx-lang.space
- **Community & RFCs:** https://www.blyx-lang.space/community

---

## Contributing

Blyx is built in public and welcomes developers interested in programming languages, compilers, AI systems, numerical computing, GPU programming, runtimes, tooling, and developer infrastructure.

Good places to start:

1. Read the documentation and run an example.
2. Explore open issues and current compiler limitations.
3. Propose language or compiler changes through the project's RFC process.
4. Submit focused pull requests with tests and documentation where appropriate.
5. Share reproducible benchmarks, bugs, and implementation feedback.

Before contributing, please read the repository contribution and security guidelines.

---

## Project Status

**Current release: `v0.1.0-alpha`**

Blyx is early-stage. The roadmap includes continued work across the compiler, type system, runtime, standard library, tooling, package ecosystem, documentation, and heterogeneous execution.

If you are evaluating Blyx seriously, treat the repository and official documentation as the source of truth for what is currently implemented.

---

## Benchmarks

Performance measurements are useful only when they are reproducible. Benchmark results for Blyx should therefore be accompanied by the benchmark source, compiler version, target hardware, compiler flags, and methodology.

See the project's benchmark documentation for current results and methodology:

**https://www.blyx-lang.space/benchmarks**

---

## Community

Blyx is looking for people who want to challenge its design—not just agree with it.

We especially welcome feedback on:

- AI-native language primitives
- type-system design for tensor workloads
- ownership and resource management
- compiler architecture and IR design
- concurrency models
- GPU / heterogeneous execution
- package management and tooling
- language ergonomics

Open an issue or discussion with a concrete example, proposal, benchmark, or critique.

---

## Maintainers

- **Rahul Chaube** — Lead Compiler Architect
- **Ujjwal Chaudhary** — Core Contributor / Systems Engineering
- **Gautam Yadav** — Core Contributor

The project is developed within the broader Neuroblyx ecosystem.

---

## License

Blyx is dual-licensed under:

- [MIT License](LICENSE-MIT)
- [Apache License 2.0](LICENSE-APACHE)

Copyright © 2026 The Blyx Project Contributors.
