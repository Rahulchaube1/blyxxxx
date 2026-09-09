<div align="center">
  <img src="blyxlogo.png" alt="Blyx Logo" width="160" />
  <h1>Blyx Programming Language</h1>
  <p><b>AI-Native Systems Programming Language for High-Performance, Memory-Safe Heterogeneous Computing.</b></p>
  <p><i>A flagship open-source technology engineered and backed by <strong>Neuroblyx</strong>.</i></p>

  <p>
    <a href="https://blyx-lang.space"><img src="https://img.shields.io/badge/Website-blyx--lang.space-00f2fe?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Website" /></a>
    <a href="https://github.com/Rahulchaube1/blyxxxx"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
    <a href="https://buymeacoffee.com/rahulchaube"><img src="https://img.shields.io/badge/Sponsor-Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" /></a>
    <a href="https://blyx-lang.space/docs"><img src="https://img.shields.io/badge/Docs-Reference-4facfe?style=for-the-badge&logo=book&logoColor=white" alt="Documentation" /></a>
    <a href="https://play.blyx-lang.space"><img src="https://img.shields.io/badge/Playground-Try_Online-38bdf8?style=for-the-badge&logo=codeforces&logoColor=white" alt="Playground" /></a>
    <img src="https://img.shields.io/badge/License-MIT%20%2F%20Apache--2.0-22c55e?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Company-Neuroblyx-7f00ff?style=for-the-badge&logo=shield&logoColor=white" alt="Neuroblyx" />
  </p>
</div>

---

## Executive Overview

**Blyx** is an open-source, AI-native systems programming language built from the ground up to combine the high-level expressiveness of modern machine learning frameworks with the raw speed, deterministic memory control, and safety of low-level systems languages.

Blyx is developed, stewarded, and maintained by **Neuroblyx**, an organization dedicated to pioneering next-generation intelligent systems software, compiler engineering, and high-performance computing infrastructure.

Whether you are authoring high-throughput microservices, running multi-agent distributed actor topologies, training deep learning models with statically dimensioned tensors, or writing heterogeneous accelerator kernels, Blyx provides compile-time guarantees with zero runtime garbage collection overhead.

---

## Why Blyx?

- 🔒 **Memory Safety Without GC**: Strict affine ownership and lifetime semantics eliminate memory leaks, use-after-free errors, and data races at compile time without a runtime garbage collector.
- ⚡ **Zero-Cost Abstractions**: Modern ergonomic constructs compile down directly to highly optimized LLVM machine code.
- 𝚯 **Native Tensor Primitives**: First-class `tensor<T, D1, D2>` types with rank and shape verification verified statically by the compiler.
- 🖥️ **Inline Heterogeneous GPU Execution**: Native `gpu { ... }` blocks compile seamlessly to SPIR-V and NVPTX target kernels without foreign function call penalties.
- 🎭 **Lock-Free Actor Concurrency**: Work-stealing thread pools and lock-free message channels provide massive parallelism with zero deadlock hazards.
- 🤖 **AI-Native Language Architecture**: Syntactic primitives designed for AI workloads, numerical computing, and autonomous multi-agent systems.
- 🚀 **SSA-Driven Intermediate Representation (`blyx_bir`)**: An optimizing Static Single Assignment (SSA) pipeline coupled with the `IncrementalCacheEngine` for sub-second rebuilds.
- 🌐 **Ubiquitous Cross-Platform Deployment**: Target Linux (x86_64, aarch64), Windows, macOS (Apple Silicon & Intel), and WebAssembly (WASM).

---

## Language Syntax & Features

### 1. Hello World
```blyx
fn main() {
    println!("Hello, World from Blyx & Neuroblyx!");
}
```

### 2. Statically Typed Functions & Value Returning
```blyx
fn compute_sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = compute_sum(20, 22);
    println!("Result: {}", result);
}
```

### 3. Native Tensor Types with Compile-Time Shapes
```blyx
#![feature(blyx_experimental)]

fn main() {
    // Statically dimensioned 128x64 matrix tensor
    let weights: tensor<f32, 128, 64>;
    println!("Weights tensor initialized with static shape [128, 64].");
}
```

### 4. Heterogeneous GPU Execution Blocks
```blyx
#![feature(blyx_experimental)]

fn main() {
    gpu {
        // Heterogeneous compute kernel targeting GPU hardware
        println!("Kernel executing on accelerator unit.");
    };
}
```

### 5. Actor Concurrency & Work-Stealing
```blyx
#![feature(blyx_experimental)]

actor NetworkWorker {
    worker_id: u64,
}

fn main() {
    let _worker = NetworkWorker { worker_id: 1 };
    println!("Actor instantiated with zero lock overhead.");
}
```

### 6. Parallel Execution Blocks
```blyx
#![feature(blyx_experimental)]

fn main() {
    parallel {
        // High-performance work-stealing parallel loop block
    };
}
```

---

## Installation & Quick Start

### 1. Install via `blyxup` Toolchain Manager
The recommended way to install Blyx is via `blyxup`, the unified toolchain installer:

```bash
# Install the stable toolchain channel
blyxup install stable

# Verify installation
blyxc --version
blyxpkg --version
```

### 2. Building & Running Programs

#### Direct Compiler Execution (`blyxc`):
```bash
blyxc hello.blyx -o hello
./hello
```

#### Package Manager Workflow (`blyxpkg`):
```bash
# Create a new Blyx project
blyxpkg new my_ai_service
cd my_ai_service

# Build and run the project
blyxpkg run
```

---

## Ecosystem Toolchain

The Blyx ecosystem delivers an integrated suite of developer tooling engineered for enterprise productivity:

| Binary | Description |
| :--- | :--- |
| **`blyxc`** | The official compiler driver targeting LLVM IR, BIR, and native binaries. |
| **`blyxpkg`** | Official package manager managing `Blyx.toml` dependencies, workspaces, and builds. |
| **`blyxfmt`** | Deterministic code formatter enforcing consistent, idiomatic code formatting. |
| **`blyxdoc`** | Automated HTML documentation generator from source doc comments. |
| **`blyx-analyzer`** | Official Language Server Protocol (LSP) providing diagnostics, autocomplete, and go-to-definition. |
| **`blyxdbg`** | Interactive debugger with breakpoint, register, and thread inspection support. |
| **`blyxprof`** | Profiler analyzing CPU cycles, heap allocations, and GPU accelerator execution. |
| **`blyxup`** | Toolchain version manager supporting `stable`, `beta`, and `nightly` release tracks. |

---

## ☕ Support & Sponsorship

Blyx is an independent, community-driven open-source initiative powered by **Neuroblyx** and founded by **Rahul Chaube**. 

If you or your company benefit from Blyx, please consider supporting ongoing development, compiler research, test farm infrastructure, and community tooling:

<div align="center">
  <a href="https://buymeacoffee.com/rahulchaube">
    <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Blyx-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Support on Buy Me A Coffee" height="50" />
  </a>
  <p><b>👉 Sponsor directly: <a href="https://buymeacoffee.com/rahulchaube">https://buymeacoffee.com/rahulchaube</a></b></p>
</div>

Your sponsorship directly funds:
- Dedicated continuous integration runners and GPU build matrices.
- Continuous maintenance of the `blyxc` compiler, `blyx_bir` SSA optimizations, and standard library.
- Documentation, tutorials, and online interactive playground hosting.
- Bounties and grants for open-source contributors.

---

## Enterprise & Commercial Solutions

For organizations seeking dedicated enterprise support, custom compiler target backends, performance auditing, or on-premise deployments:

- **Enterprise Inquiries**: [contact@neuroblyx.com](mailto:contact@neuroblyx.com)
- **Official Web Portal**: [https://blyx-lang.space](https://blyx-lang.space)
- **Interactive Playground**: [https://play.blyx-lang.space](https://play.blyx-lang.space)

---

## Open Source Governance & Contributing

We welcome contributions from developers, researchers, and systems enthusiasts worldwide!

- 📖 Review [CONTRIBUTING.md](CONTRIBUTING.md) for pull request guidelines, developer setup, and coding conventions.
- 🤝 Follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) to maintain an inclusive and respectful environment.
- 🏛️ Read our [GOVERNANCE.md](GOVERNANCE.md) to understand the Neuroblyx project leadership model and working groups.
- 📝 Participate in language evolution via the [RFC Process](RFC/template.md).
- 🛡️ Report security vulnerabilities responsibly in accordance with [SECURITY.md](SECURITY.md).

---

## Maintainers & Leadership

- **Rahul Chaube** ([@Rahulchaube1](https://github.com/Rahulchaube1)) — Co-Founder & Lead Compiler Architect
- **Neuroblyx Core Team** — Systems, Tooling, and Runtime Engineering
- **Ujjwal Chaudhary** ([@oyyPoodles](https://github.com/oyyPoodles/)) — Co-Founder & COO
- **Neuroblyx Core Team**
- **Gautam Yadav** ([@ydvGautam](https://github.com/ydvGautam)) — Co-Founder 
- **Neuroblyx Core Team**

---

## License

Blyx is free, open-source software dual-licensed under:
- **MIT License** ([LICENSE-MIT](LICENSE-MIT))
- **Apache License, Version 2.0** ([LICENSE-APACHE](LICENSE-APACHE))

Copyright &copy; 2026 Neuroblyx and The Blyx Project Contributors.
