# Contributing to Blyx

Thank you for your interest in contributing to **Blyx**, an open-source AI-native systems programming language developed and stewarded by **Neuroblyx**!

We welcome contributions of all kinds: bug fixes, compiler optimizations, standard library improvements, documentation clarifications, RFC proposals, tooling enhancements, and developer evangelism.

---

## Code of Conduct

All contributors, maintainers, and community members are expected to follow the [Blyx Code of Conduct](CODE_OF_CONDUCT.md). Please treat others with respect and professionalism at all times.

---

## Getting Started

### Prerequisites

To build and contribute to the Blyx compiler and tooling suite, ensure you have:
- **Git** (version 2.30 or higher)
- **Rust Toolchain** (version 1.78 or higher, stable or nightly)
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- **LLVM** (optional, for low-level backend development)
- **Node.js** (v18+; only required if working on the website or web playground)

### Clone the Repository

```bash
git clone https://github.com/Rahulchaube1/blyxxxx.git
cd blyxxxx
```

### Building the Compiler & Toolchain

The Blyx monorepo is organized as a unified Cargo workspace:

```bash
# Build all compiler crates, standard libraries, and ecosystem tools
cargo build --workspace

# Run the test suite
cargo test --workspace

# Build optimized release binaries
cargo build --workspace --release
```

---

## Monorepo Architecture

The Blyx codebase is organized into structured modular components:

```
blyxxxx/
├── compiler/               # Core Blyx Compiler Frontend & IR Engine
│   ├── blyx_lexer/         # Lexical analysis & token generation
│   ├── blyx_parser/        # Recursive descent parser & syntax verification
│   ├── blyx_ast/           # Abstract Syntax Tree data structures
│   ├── blyx_semantic/      # Semantic validation & symbol tables
│   ├── blyx_typeck/        # Static type checking & tensor rank checking
│   ├── blyx_bir/           # Blyx Intermediate Representation (SSA)
│   └── blyxc/              # Compiler driver CLI executable
├── library/                # Core Runtime & Standard Libraries
│   ├── blyx/               # Low-level runtime execution primitives
│   └── blyx-std/           # High-level standard library (tensor, gpu, io, async)
├── tools/                  # Ecosystem Tooling & Developer Utilities
│   ├── blyxpkg/            # Official package and dependency manager
│   ├── blyxfmt/            # Deterministic code formatter
│   ├── blyx-analyzer/      # Language Server Protocol (LSP) for editors
│   ├── blyxdoc/            # Documentation generation tool
│   ├── blyxup/             # Toolchain installer & version manager
│   ├── blyxdbg/            # Interactive command-line debugger
│   └── blyxprof/           # Performance profiler
├── website/                # Official Next.js web portal & interactive playground
├── RFC/                    # Requests for Comments (Language Evolution)
├── docs/                   # Books, specifications, and architecture papers
└── examples/               # Comprehensive runnable example programs
```

---

## Contribution Workflow

### 1. Find or File an Issue
Before starting significant work, please check existing [GitHub Issues](https://github.com/Rahulchaube1/blyxxxx/issues) or open a new one to discuss your proposed changes with the Neuroblyx engineering team.

### 2. Branching Strategy
Create a descriptive branch for your work:
```bash
git checkout -b feature/tensor-broadcast-opt
# or
git checkout -b fix/parser-actor-syntax
```

### 3. Coding Standards & Verification
- **Formatting**: Format all Rust code using `cargo fmt`:
  ```bash
  cargo fmt --all
  ```
- **Linting**: Ensure code passes Clippy checks without warnings:
  ```bash
  cargo clippy --workspace -- -D warnings
  ```
- **Testing**: Add unit or integration tests for new functionality in `tests/` or crate-level test modules:
  ```bash
  cargo test --workspace
  ```

### 4. Commit Conventions
Write clear, conventional commit messages:
- `feat(compiler): implement static rank checking for 3D tensors`
- `fix(parser): resolve unexpected token in actor message declaration`
- `docs(readme): add Neuroblyx sponsorship and quickstart guide`
- `perf(bir): optimize SSA register allocation pass`

### 5. Submit a Pull Request
1. Push your branch to your fork or branch on `Rahulchaube1/blyxxxx`.
2. Open a Pull Request targeting the `blyx-main` branch.
3. Fill out the [Pull Request Template](.github/pull_request_template.md) completely.
4. Respond to feedback from reviewers and maintainers.

---

## Language Evolution (RFC Process)

Substantial changes to the Blyx language syntax, type system, standard library public API, or toolchain must go through the **RFC (Request for Comments)** process:
1. Review the [RFC Template](RFC/template.md).
2. Draft an RFC outlining motivation, detailed design, drawbacks, and alternatives.
3. Submit a PR to the `RFC/` directory for community and core team evaluation.

---

## Supporting & Sponsoring Neuroblyx

Blyx is developed as a community-first open source project backed by **Neuroblyx**. You can support compiler research, cloud testing runners, and developer infrastructure directly:

- **Buy Me A Coffee**: [https://buymeacoffee.com/rahulchaube](https://buymeacoffee.com/rahulchaube)
- **GitHub Sponsors**: [Rahulchaube1](https://github.com/Rahulchaube1)

---

## Questions & Getting Help

- **GitHub Discussions**: [https://github.com/Rahulchaube1/blyxxxx/discussions](https://github.com/Rahulchaube1/blyxxxx/discussions)
- **Email Inquiries**: [maintainers@blyx-lang.space](mailto:maintainers@blyx-lang.space) / [contact@neuroblyx.com](mailto:contact@neuroblyx.com)
- **Official Documentation**: [https://blyx-lang.space/docs](https://blyx-lang.space/docs)
