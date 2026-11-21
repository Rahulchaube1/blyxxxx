<p align="center"><img src="website/public/blyx.png" alt="Blyx" width="168"></p>

# Blyx programming language

Blyx is an experimental, open-source language for writing small numerical programs. A dot product, a recursive function, or a loop over readings fits in a single `.blyx` file. Run that file in the browser, in VS Code, or with the `blyxc` command. For the supported typed subset, build a standalone native executable from the same source.

[Try the playground](https://www.blyx-lang.space/play) · [Read the language guide](https://doc.blyx-lang.space/) · [Download Blyx](https://www.blyx-lang.space/download) · [Project website](https://www.blyx-lang.space/)

## Learn Blyx

Start with a greeting you can run in your browser. The handbook takes you through decisions, functions, vectors, numerical models, tests, and a sensor-report project. Each chapter includes practice and a worked answer. [Begin the course](https://www.blyx-lang.space/learn) · [Build the sensor report](https://doc.blyx-lang.space/guide/sensor-report) · [Language reference](https://doc.blyx-lang.space/guide/language-reference) · [Plain-text handbook](https://doc.blyx-lang.space/llms-full.txt)

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

On Windows x64 with Scoop, install the compiler from the project bucket.

```powershell
scoop bucket add blyx https://github.com/Rahulchaube1/scoop-blyx
scoop install blyx/blyx
```

The same bucket distributes BlyxTorch, LinearFit, ResidualWatch and ModelGate. [Windows commands and example](https://github.com/Rahulchaube1/scoop-blyx)

On Apple Silicon macOS and x86-64 Linux, install the compiler with Homebrew.

```sh
brew install rahulchaube1/blyx/blyx
```

With Rust and a host linker installed, build the released compiler from crates.io:

```sh
cargo install --locked --version 0.2.1 blyxc
```

Download the **Blyx 0.2.1** archive for Windows x86-64, Linux x86-64, or macOS on Apple Silicon. Verify it against the release’s `SHA256SUMS`, extract the archive, and put the directory containing `blyxc` on your `PATH`. [Release archives and checksums](https://github.com/Rahulchaube1/blyxxxx/releases/tag/v0.2.1)

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

## Build with Blyx frameworks

[Browse the framework directory](https://www.blyx-lang.space/frameworks) for the project walkthroughs, versioned downloads and input contracts.

The [workflow collection 0.1.0](https://github.com/Rahulchaube1/blyxxxx/releases/tag/ecosystem-v0.1.0) adds **51 frameworks and 102 reusable libraries**. Each framework combines two libraries to solve a specific problem. [Avocet](https://www.blyx-lang.space/packages/avocet) calculates how much stock to buy after reservations. [Fulmar](https://www.blyx-lang.space/packages/fulmar) finds the offset a consumer can commit when deliveries finish out of order. [Blackbird](https://doc.blyx-lang.space/guide/blackbird) selects the intended occurrence of a repeated local time.

To try [Warbler](https://www.blyx-lang.space/packages/warbler), extract the native ZIP for your platform and pass four audio samples, a clipping threshold of one and an allowance of one consecutive clipped sample.

```powershell
.\bin\warbler.exe "1,-1,0,0" 1 1
```

On Linux and Apple Silicon macOS, run `./bin/warbler "1,-1,0,0" 1 1`. The four output lines are `1`, `0.5`, `2` and `1`. They give the peak amplitude, mean-square energy, longest clipped run and alert flag. Change the final argument to `2` to clear the alert. [Edit the example in the playground](https://www.blyx-lang.space/play?example=package-warbler) · [Import a library in your own project](docs/ecosystem-packages.md#use-the-workflow-collection) · [Reproduce the benchmarks](https://www.blyx-lang.space/benchmarks#workflows)

Other Blyx frameworks offer these project walkthroughs.

| Framework | Example project |
| --- | --- |
| <img src="website/public/packages/swiftlet.png" width="32" alt=""> [Swiftlet](https://github.com/Rahulchaube1/blyx-swiftlet) | Route a book catalog request. [Run the example](https://www.blyx-lang.space/play?example=package-swiftlet) |
| <img src="website/public/packages/shrike.png" width="32" alt=""> [Shrike](https://github.com/Rahulchaube1/blyx-shrike) | Merge two help-center searches. [Run the example](https://www.blyx-lang.space/play?example=package-shrike) |
| <img src="website/public/packages/bunting.png" width="32" alt=""> [Bunting](https://github.com/Rahulchaube1/blyx-bunting) | Publish a support-queue report. [Run the example](https://www.blyx-lang.space/play?example=package-bunting) |
| <img src="website/public/packages/wren.png" width="32" alt=""> [Wren](https://github.com/Rahulchaube1/blyx-wren) | Test an invoice and packing calculation. [Run the example](https://www.blyx-lang.space/play?example=package-wren) |
| <img src="website/public/packages/weaver.png" width="32" alt=""> [Weaver](https://github.com/Rahulchaube1/blyx-weaver) | Render a file chooser as SVG. [Run the example](https://www.blyx-lang.space/play?example=package-weaver) |
| <img src="website/public/packages/dipper.png" width="32" alt=""> [Dipper](https://github.com/Rahulchaube1/blyx-dipper) | Import a two-column notes file. [Run the example](https://www.blyx-lang.space/play?example=package-dipper) |
| <img src="website/public/packages/kestrel.png" width="32" alt=""> [Kestrel](https://github.com/Rahulchaube1/blyx-kestrel) | Replay a bouncing ball across a stalled frame. [Run the example](https://www.blyx-lang.space/play?example=package-kestrel) |
| <img src="website/public/packages/heron.png" width="32" alt=""> [Heron](https://github.com/Rahulchaube1/blyx-heron) | Audit a sensor heartbeat trace. [Run the example](https://www.blyx-lang.space/play?example=package-heron) |

## Train and evaluate models with Blyx packages

Fit a regression model from a CSV, estimate prediction intervals on held-out examples, and detect persistent errors after deployment. Each package has a tagged source release, executable tests and a browser example. BlyxTorch, LinearFit, ResidualWatch and ModelGate also ship native commands for Windows x64, Linux x64 and Apple Silicon macOS.

| Package | What it does |
| --- | --- |
| <img src="website/public/packages/blyxtorch.png" width="32" alt=""> [BlyxTorch 0.2.0](https://github.com/Rahulchaube1/blyxtorch/releases/tag/v0.2.0) | Train dense CPU networks with automatic differentiation, mini-batch SGD and Adam, then deploy a standalone native model. [Editor and projects](https://www.blyx-lang.space/packages/blyxtorch#editor) · [Tutorial](https://doc.blyx-lang.space/guide/blyxtorch) |
| <img src="website/public/packages/linearfit.png" width="32" height="32" alt=""> [LinearFit 0.1.1](https://github.com/Rahulchaube1/blyx-linearfit/releases/tag/v0.1.1) | Train, merge and deploy a single-feature least-squares or ridge regression with an unpenalized intercept. |
| <img src="website/public/packages/conformal.png" width="32" height="32" alt=""> [Conformal 0.1.0](https://github.com/Rahulchaube1/blyx-conformal/releases/tag/v0.1.0) | Calibrate a regression interval from held-out errors and measure coverage on a separate test set. |
| <img src="website/public/packages/moments.png" width="32" height="32" alt=""> [Moments 0.1.0](https://github.com/Rahulchaube1/blyx-moments/releases/tag/v0.1.0) | Summarize paired observations as they arrive and merge statistics from independent batches. |
| <img src="website/public/packages/residualwatch.png" width="32" height="32" alt=""> [ResidualWatch 0.1.0](https://github.com/Rahulchaube1/blyx-residualwatch/releases/tag/v0.1.0) | Freeze a reference distribution and monitor later prediction errors for sustained upward or downward shifts. |
| <img src="website/public/packages/cusum.png" width="32" height="32" alt=""> [CUSUM 0.1.0](https://github.com/Rahulchaube1/blyx-cusum/releases/tag/v0.1.0) | Detect persistent shifts in a sequence of standardized observations with a two-sided cumulative sum. |
| <img src="website/public/packages/modelgate.png" width="32" height="32" alt=""> [ModelGate 0.1.2](https://github.com/Rahulchaube1/blyx-modelgate/releases/tag/v0.1.2) | Compare two binary classifiers on the same observations and stop a release when mistake costs or Brier score regress. |
| <img src="website/public/packages/classification.png" width="32" height="32" alt=""> [Classification 0.1.1](https://github.com/Rahulchaube1/blyx-classification/releases/tag/v0.1.1) | Measure threshold decisions, false alarms, missed positives and their costs. |
| <img src="website/public/packages/calibration.png" width="32" height="32" alt=""> [Calibration 0.1.1](https://github.com/Rahulchaube1/blyx-calibration/releases/tag/v0.1.1) | Check agreement between predicted probabilities and observed outcomes. |
| <img src="website/public/packages/retrieval.png" width="32" height="32" alt=""> [Retrieval 0.1.1](https://github.com/Rahulchaube1/blyx-retrieval/releases/tag/v0.1.1) | Score ranked search or RAG results without giving repeated document IDs extra credit. |
| <img src="website/public/packages/backtest.png" width="32" height="32" alt=""> [Backtest 0.1.1](https://github.com/Rahulchaube1/blyx-backtest/releases/tag/v0.1.1) | Evaluate forecasts in time order with a gap for delayed observations and disjoint test windows. |

The LinearFit fixture learns a slope of 2 and predicts 11 at x = 5. In the ResidualWatch shift fixture the first alert is data row 5. Download the archives, extract each one and run its command in that directory. In PowerShell use `.\linearfit.exe` or `.\residualwatch.exe`.

```sh
./linearfit fixtures/line.csv --predict 5
./residualwatch fixtures/shift.csv --reference 3 --limit 3
```

The [forecast monitoring example](examples/ml/forecast-monitor) imports LinearFit, Conformal and ResidualWatch in one Blyx application. It trains a model, reports a prediction interval and detects two consecutive forecasts that fall below the actual values.

[Package catalog](https://www.blyx-lang.space/packages) · [Training and monitoring tutorial](https://doc.blyx-lang.space/guide/training-and-monitoring) · [Evaluation tutorial](https://doc.blyx-lang.space/guide/ai-packages) · [Machine-readable catalog](https://www.blyx-lang.space/packages.json) · [Contribute a package](docs/ecosystem-packages.md)

## What ships in 0.2.1

| Component | What you can use today |
| --- | --- |
| Language | Functions and recursion, block scope, mutable bindings, conditionals, loops, checked `i64` arithmetic, `f64`, and numeric vectors with `len`, `at`, `sum`, and `dot`. |
| CLI | Create a project with `blyxc new hello`, check syntax, run source, and compile supported typed programs. The native backend lowers Blyx to Rust and invokes `rustc`. |
| Browser and editor | The playground and desktop extension run the Blyx interpreter compiled to WebAssembly. The editor can run an unsaved buffer and show parser errors while you type. |

Blyx has its own lexer, parser, and interpreter. GPU execution, a general-purpose tensor runtime, actor scheduling, and a public dependency registry remain development work. The executable subset is the reference for supported behavior. [Executable subset](docs/executable-subset.md) · [Release capabilities](https://doc.blyx-lang.space/guide/compatibility) · [Roadmap](ROADMAP_PUBLIC.md)

## Reproduce the results

With Rust, Cargo, a host linker, and Node.js installed, run these commands from the repository root.

```sh
cargo test --locked --workspace
cargo run --locked -p blyxc -- run examples/ml/linear_fit.blyx
node editors/code/scripts/prepare.cjs
node tools/test-editor-runtime.mjs
```

The editor test checks the browser examples against their source files and expected output, then exercises the editor worker. CI also runs compiler tests on Linux, macOS, and Windows. [Test harness](tools/test-editor-runtime.mjs) · [CI runs](https://github.com/Rahulchaube1/blyxxxx/actions/workflows/ci.yml)

**Model evaluation.** The ModelGate benchmark reads 100,000 paired predictions, checks all JSON metrics and the exit decision against a Python CSV implementation, and times new processes in rotating order. Reproduce it with the release binary and `python tools/bench_modelgate.py --modelgate ./modelgate`. [Benchmark harness](tools/bench_modelgate.py) · [Raw samples and hashes](website/public/data/modelgate-benchmark.json) · [Measured timings](https://www.blyx-lang.space/benchmarks#modelgate)

**Regression training.** The LinearFit benchmark fits one ridge model on 100,000 rows and checks every result against exact rational arithmetic. It times two Blyx releases, standard-library Python, NumPy reading a CSV, and NumPy with arrays already loaded. [Benchmark harness](tools/bench_linearfit.py) · [Raw samples and executable hashes](website/public/data/linearfit-benchmark.json) · [Timing boundaries and results](https://www.blyx-lang.space/benchmarks#linearfit)

**Performance evidence.** The published benchmark measures recursive Fibonacci(22) on one Windows host. Across nine runs after two warm-ups, the median was **7.777 ms** for a native Blyx executable and **27.522 ms** for the Blyx interpreter. Each timing includes process startup. The raw report includes the Rust and CPython baselines, toolchain versions, individual samples, and executable sizes. [Benchmark harness](tools/bench_fibonacci.py) · [Raw results](website/public/data/benchmarks.json) · [Benchmark report](https://www.blyx-lang.space/benchmarks)

## Community projects and GitHub language recognition

Building an independent Blyx project? Share a public repository with reproducible build/run instructions in [community showcase issue #18](https://github.com/Rahulchaube1/blyxxxx/issues/18). We welcome real projects and useful bug reports, not artificially generated files or mirrored examples. [Read the public adoption evidence](docs/linguist-adoption-evidence-2026-11-20.md) and [the official registration requirements](docs/linguist-readiness.md). GitHub Linguist language registration is **not yet complete**.

## Project and people

Rahul Chaube created Blyx and leads compiler development. Ujjwal Chaudhury is a core contributor. The project is maintained by Neuroblyx and community contributors. [Rahul on GitHub](https://github.com/Rahulchaube1) · [Rahul on LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Blyx community](https://www.blyx-lang.space/community)

| Working on | Start here |
| --- | --- |
| Language and toolchain | [Compiler source](compiler/), [examples](examples/), [design proposals](RFC/) |
| Editor and documentation | [VS Code extension](editors/code/README.md), [website contributor guide](website/README.md) |
| Contributing or reporting an issue | [Contribution guide](CONTRIBUTING.md), [issue tracker](https://github.com/Rahulchaube1/blyxxxx/issues), [private security reporting](SECURITY.md) |
| Project stewardship | [Governance](GOVERNANCE.md), [maintainers](MAINTAINERS.md), [support development](https://buymeacoffee.com/rahulchaube) |

The language project is dual-licensed under your choice of the [MIT License](LICENSE-MIT) or [Apache License 2.0](LICENSE-APACHE). The editor extension has its own [MIT license](editors/code/LICENSE).

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).
