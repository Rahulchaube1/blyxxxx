<p align="center"><img src="website/public/blyx.png" alt="Blyx" width="168"></p>

# Blyx programming language

Blyx is an experimental, open-source language for writing small numerical programs. A dot product, a recursive function, or a loop over readings fits in a single `.blyx` file. Run that file in the browser, in VS Code, or with the `blyxc` command. For the supported typed subset, build a standalone native executable from the same source.

[Try the playground](https://www.blyx-lang.space/play) · [Read the language guide](https://doc.blyx-lang.space/) · [Download Blyx](https://www.blyx-lang.space/download) · [Project website](https://www.blyx-lang.space/)

## Your first program

Save this as `readings.blyx`. The last reading has twice the weight of either of the first two. `dot` computes the weighted total and `sum` computes the total weight.

```blyx
fn main() {
    let readings = [5.0, 7.0, 9.0];
    let weights = [1.0, 1.0, 2.0];
    println!(dot(readings, weights) / sum(weights));
}
```

The program prints **`7.5`**. You can change a weight in the browser and see the new result, or run the same example locally. [Run this example](https://www.blyx-lang.space/play?example=weighted-mean) · [Source file](examples/numerics/weighted_mean.blyx)

### Run it locally

Download the **Blyx 0.2.0** archive for Windows x86-64, Linux x86-64, or macOS on Apple Silicon. Verify it against the release’s `SHA256SUMS`, extract the archive, and put the directory containing `blyxc` on your `PATH`. [Release archives and checksums](https://github.com/Rahulchaube1/blyxxxx/releases/tag/v0.2.0)

```sh
blyxc --version
blyxc check readings.blyx
blyxc run readings.blyx
```

`check` checks syntax. `run` executes the program with the interpreter. To build a native executable, install `rustc` and a host linker, then run `blyxc build readings.blyx`. Start the result with `./readings` on Linux or macOS, or `.\readings.exe` in PowerShell. The resulting executable runs independently of the compiler. [Native build guide](https://doc.blyx-lang.space/guide/native-builds)

## A small machine-learning example

Fit a line of the form `y = slope × x` to observations. For a fit through the origin, the least-squares coefficient is `dot(x, y) / dot(x, x)`. The inputs below have equal lengths and a nonzero denominator.

```blyx
fn fit(x: vector, y: vector) -> f64 {
    dot(x, y) / dot(x, x)
}

fn main() {
    let x = [1.0, 2.0, 3.0, 4.0];
    let y = [2.0, 4.0, 6.0, 8.0];
    let slope = fit(x, y);
    println!(slope);
    println!(slope * 5.0);
}
```

The first line of output is `2`, the fitted slope. The second is `10`, the prediction at `x = 5`. [Run the fit](https://www.blyx-lang.space/play?example=linear-fit) · [Walk through the model](https://doc.blyx-lang.space/guide/numerical-models)

| Explore next | Language features | Expected output |
| --- | --- | --- |
| [Greatest common divisor](https://www.blyx-lang.space/play?example=gcd) | Mutable bindings, remainder, and a `while` loop | `6` for 48 and 18 |
| [Threshold classifier](https://www.blyx-lang.space/play?example=threshold) | Vector dot product, bias, and a conditional | `positive` |
| [Smoothed readings](https://www.blyx-lang.space/play?example=smoothing) | Indexed reads and a rolling calculation | `10`, `12`, `15` |

## What ships in 0.2.0

| Component | What you can use today |
| --- | --- |
| Language | Functions and recursion, block scope, mutable bindings, conditionals, loops, checked `i64` arithmetic, `f64`, and numeric vectors with `len`, `at`, `sum`, and `dot`. |
| CLI | Create a project with `blyxc new hello`, check syntax, run source, and compile supported typed programs. The native backend lowers Blyx to Rust and invokes `rustc`. |
| Browser and editor | The playground and desktop extension run the Blyx interpreter compiled to WebAssembly. The editor can run an unsaved buffer and show parser errors while you type. |

Blyx has its own lexer, parser, and interpreter. GPU execution, a general-purpose tensor runtime, actor scheduling, and external package installation remain development work. The executable subset is the reference for supported behavior. [Executable subset](docs/executable-subset.md) · [Release capabilities](https://doc.blyx-lang.space/guide/compatibility) · [Roadmap](ROADMAP_PUBLIC.md)

## Reproduce the results

With Rust, Cargo, a host linker, and Node.js installed, run these commands from the repository root.

```sh
cargo test --locked --workspace
cargo run --locked -p blyxc -- run examples/ml/linear_fit.blyx
node editors/code/scripts/prepare.cjs
node tools/test-editor-runtime.mjs
```

The editor test checks the browser examples against their source files and expected output, then exercises the editor worker. CI also runs compiler tests on Linux, macOS, and Windows. [Test harness](tools/test-editor-runtime.mjs) · [CI runs](https://github.com/Rahulchaube1/blyxxxx/actions/workflows/ci.yml)

**Performance evidence.** The published benchmark measures recursive Fibonacci(22) on one Windows host. Across nine runs after two warm-ups, the median was **7.777 ms** for a native Blyx executable and **27.522 ms** for the Blyx interpreter. Each timing includes process startup. The raw report includes the Rust and CPython baselines, toolchain versions, individual samples, and executable sizes. [Benchmark harness](tools/bench_fibonacci.py) · [Raw results](website/public/data/benchmarks.json) · [Benchmark report](https://www.blyx-lang.space/benchmarks)

## Project and people

Rahul Chaube created Blyx and leads compiler development. Ujjwal Chaudhury is a core contributor. The project is maintained by Neuroblyx and community contributors. [Rahul on GitHub](https://github.com/Rahulchaube1) · [Rahul on LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Blyx community](https://www.blyx-lang.space/community)

| Working on | Start here |
| --- | --- |
| Language and toolchain | [Compiler source](compiler/), [examples](examples/), [design proposals](RFC/) |
| Editor and documentation | [VS Code extension](editors/code/README.md), [website contributor guide](website/README.md) |
| Contributing or reporting an issue | [Contribution guide](CONTRIBUTING.md), [issue tracker](https://github.com/Rahulchaube1/blyxxxx/issues), [private security reporting](SECURITY.md) |
| Project stewardship | [Governance](GOVERNANCE.md), [maintainers](MAINTAINERS.md), [support development](https://buymeacoffee.com/rahulchaube) |

The language project is dual-licensed under your choice of the [MIT License](LICENSE-MIT) or [Apache License 2.0](LICENSE-APACHE). The editor extension has its own [MIT license](editors/code/LICENSE).
