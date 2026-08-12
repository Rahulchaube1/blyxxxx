<div align="center">
  <img src="blyxlogo.png" alt="Blyx Logo" width="160" />
  <h1>Blyx Programming Language</h1>
  <p><b>AI-native systems programming language for high-performance, memory-safe, parallel computing.</b></p>

  <p>
    <a href="https://blyx-lang.space"><img src="https://img.shields.io/badge/Website-blyx--lang.space-00f2fe?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Website" /></a>
    <a href="https://blyx-lang.space"><img src="https://img.shields.io/badge/Docs-Reference-4facfe?style=for-the-badge&logo=book&logoColor=white" alt="Documentation" /></a>
    <a href="https://play.blyx-lang.space"><img src="https://img.shields.io/badge/Playground-Try_Online-38bdf8?style=for-the-badge&logo=codeforces&logoColor=white" alt="Playground" /></a>
    <a href="https://github.com/Blyx-lang-space/blyx"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  </p>
</div>

---

## Why Blyx?

- 🔒 **Memory Safety Without GC**: Static ownership and lifetime verification prevent data races and buffer overflows without garbage collection overhead.
- ⚡ **Zero-Cost Abstractions**: High-level abstractions compile directly to optimized native machine code.
- 🎭 **Actor Concurrency**: Dedicated lock-free `actor` primitives backed by work-stealing thread pools in `blyx`.
- 𝚯 **Native Tensor Types**: Statically dimensioned `tensor<T, D1, D2>` primitives with compile-time rank verification.
- 🖥️ **GPU Programming**: Inline `gpu { ... }` blocks targeting SPIR-V and NVPTX accelerator kernels.
- 🤖 **AI-Native Language Design**: Built for machine learning workloads, numerical linear algebra, and heterogeneous compute.
- 🚀 **Fast Compilation**: Incremental caching engine (`IncrementalCacheEngine`) and SSA-based intermediate representation (`blyx_bir`).
- 🌐 **Cross-Platform**: Executable targets supported across Linux, Windows, macOS, and WebAssembly.

---

## Language Syntax & Features

### 1. Hello World
```blyx
fn main() {
    println!("Hello, World from Blyx!");
}
```

### 2. Functions & Value Returning
```blyx
fn compute_sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = compute_sum(20, 22);
    println!("Result: {}", result);
}
```

### 3. Actor Declarations & Concurrency
```blyx
#![feature(blyx_experimental)]

actor NetworkWorker {
    worker_id: u64,
}

fn main() {
    let _worker = NetworkWorker { worker_id: 1 };
}
```

### 4. Native Tensor Types
```blyx
#![feature(blyx_experimental)]

fn main() {
    // Statically dimensioned 128x64 matrix tensor
    let _weights: tensor<f32, 128, 64>;
}
```

### 5. Heterogeneous GPU Execution Blocks
```blyx
#![feature(blyx_experimental)]

fn main() {
    gpu {
        // Heterogeneous GPU compute kernel block
    };
}
```

### 6. Parallel Execution Blocks
```blyx
#![feature(blyx_experimental)]

fn main() {
    parallel {
        // Work-stealing parallel loop block
    };
}
```

---

## Installation & Usage

### Installing Blyx via `blyxup`
Install the official compiler (`blyxc`), package manager (`blyxpkg`), and ecosystem tools using `blyxup`:

```bash
# Install stable toolchain channel
blyxup install stable

# Verify installation
blyxc --version
blyxpkg --version
```

### Building & Running Programs

1. **Direct Compiler Execution (`blyxc`)**:
   ```bash
   blyxc hello.blyx -o hello
   ./hello
   ```

2. **Package Manager Execution (`blyxpkg`)**:
   ```bash
   # Create a new Blyx project
   blyxpkg new my_app
   cd my_app

   # Build and execute project
   blyxpkg run
   ```

---

## Ecosystem Toolchain

| Binary | Description |
| :--- | :--- |
| **`blyxc`** | Official Blyx compiler driver targeting LLVM IR and native binaries. |
| **`blyxpkg`** | Official package manager managing `Blyx.toml` dependencies and builds. |
| **`blyxfmt`** | Code formatter providing automated 4-space code indentation. |
| **`blyxdoc`** | HTML documentation generator. |
| **`blyx-analyzer`** | Language Server Protocol (LSP) implementation for VS Code and IDEs. |
| **`blyxdbg`** | Interactive debugger with breakpoint and process inspection support. |
| **`blyxprof`** | Performance profiler analyzing CPU, memory allocations, and GPU kernels. |
| **`blyxup`** | Toolchain version installer managing `stable`, `beta`, and `nightly` releases. |

---

## Documentation & Playground

- **Official Web Portal**: [https://blyx-lang.space](https://blyx-lang.space)
- **Interactive Playground**: [play.blyx-lang.space](https://play.blyx-lang.space)
- **API Reference**: [docs/api_reference.md](docs/api_reference.md)
- **Language Book**: [docs/book/01_introduction.md](docs/book/01_introduction.md)

---

## Code Examples

Explore complete runnable examples in the [`examples/`](examples/) directory:
- [hello.blyx](examples/hello.blyx): Hello World program
- [http_server.blyx](examples/http_server.blyx): Async HTTP server
- [rest_api.blyx](examples/rest_api.blyx): REST API service
- [cli_tool.blyx](examples/cli_tool.blyx): Command line utility
- [actor_system.blyx](examples/actor_system.blyx): Actor concurrency system
- [tensor_math.blyx](examples/tensor_math.blyx): Tensor matrix computations
- [gpu_kernel.blyx](examples/gpu_kernel.blyx): GPU accelerator block
- [file_io.blyx](examples/file_io.blyx): File I/O operations
- [json_parsing.blyx](examples/json_parsing.blyx): JSON serialization
- [database.blyx](examples/database.blyx): Database connection layer
- [websocket.blyx](examples/websocket.blyx): Real-time WebSockets

---

## Contributing & Governance

Contributions to Blyx are welcome!
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for pull request guidelines.
- Adhere to the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Learn about language proposals in the [RFC Process](docs/rfc_process.md).
- Report security concerns per [SECURITY.md](SECURITY.md).

---

## License

Blyx is distributed under the terms of both the MIT License and the Apache License (Version 2.0). See [LICENSE-MIT](LICENSE-MIT) and [LICENSE-APACHE](LICENSE-APACHE) for details.

---

## Acknowledgements

The Blyx Programming Language compiler infrastructure originated from research and compiler engineering experimentation inspired by modern static analysis and SSA intermediate representation architectures.
