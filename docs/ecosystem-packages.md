# Contribute a Blyx package

The [package catalog](https://www.blyx-lang.space/packages) lists versioned native Blyx libraries, frameworks and command-line tools. The [JSON catalog](https://www.blyx-lang.space/packages.json) provides the release, commit, importable module, logo and runnable example for each entry.

## Use the workflow collection

The [collection release](https://github.com/Rahulchaube1/blyxxxx/releases/tag/ecosystem-v0.1.0) includes 51 ready-to-run commands for Windows x64, Linux x64 and Apple Silicon macOS. Download the ZIP for your operating system, verify it against the release’s `SHA256SUMS` and extract it. In PowerShell, run `.\bin\warbler.exe --help`. On Linux or macOS, run `./bin/warbler --help`. Running any command without arguments prints its example result.

For a Blyx application, extract the [source ZIP](https://www.blyx-lang.space/downloads/blyx-ecosystem-0.1.0-source.zip) in your project directory. Each of the 153 packages lives in `vendor/<module>/`. The top-level `manifest.json` records the version and SHA-256 of every public module. The package directories include the source, licenses, regression tests and worked examples. Framework directories also contain their two library dependencies and CLI.

For example, save this as `main.blyx` next to the extracted `vendor` directory. The second field returned by FrameSignal is the mean-square energy.

```blyx
use vendor::framesignal::framesignal;

fn main() {
    let level = framesignal_level([1, -1, 0, 0]);
    println!(at(level, 1));
}
```

With Blyx 0.2.1, Rust and a host linker installed, run `blyxc native-run main.blyx`. It prints `0.5`. To try the full audio workflow from source, run `blyxc native-run vendor/warbler/project.blyx -- "1,-1,0,0" 1 1`. For each command, its package page documents the order and units of its outputs. The standalone CLIs accept up to 16 entries per vector argument. Import the module to pass longer vectors.

From a checkout of the language repository, run the following to test every package and build the collection for your machine.

```sh
python tools/build-ecosystem.py website/public/downloads/blyx-ecosystem-0.1.0-source.zip --out dist
```

The [framework directory](https://www.blyx-lang.space/frameworks) links each framework to its two modules and editable handbook exercise. Individual package repositories also publish their own versioned source releases.

## What the workflows address

The 51 recipes span 19 catalog topics. Each isolates a decision an application can test with a small input, then documents what the result means and which assumptions the caller supplies.

| Developer problem | Blyx example | Background |
| --- | --- | --- |
| A stock count can include units already held for orders. Ordering a fixed lot also changes the amount left after replenishment. | [Avocet](https://doc.blyx-lang.space/guide/avocet) reports available units, shortage, order quantity and projected stock. | [Odoo reordering rules](https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp/inventory/warehouses_storage/replenishment/reordering_rules.html) |
| A high peak on an audio meter may come from a single sample or several consecutive clipped samples. | [Warbler](https://doc.blyx-lang.space/guide/warbler) measures the longest run alongside mean-square energy. | [librosa frame RMS](https://librosa.org/doc/0.11.0/generated/librosa.feature.rms.html) |
| Workers can finish deliveries out of order. Advancing to the highest completed offset can skip unfinished work. | [Fulmar](https://doc.blyx-lang.space/guide/fulmar) finds the contiguous acknowledged prefix and the next offset to commit. | [RabbitMQ consumer acknowledgements](https://www.rabbitmq.com/docs/confirms) |
| An applied migration can have an unexpected fingerprint even when its version appears in the expected sequence. | [Bittern](https://doc.blyx-lang.space/guide/bittern) checks version order and fingerprints before identifying the next migration. | [Flyway schema history](https://documentation.red-gate.com/flyway/flyway-concepts/migrations/flyway-schema-history-table) |
| During a clock change, a local time can map to two instants or none. | [Blackbird](https://doc.blyx-lang.space/guide/blackbird) takes a known offset transition and reports its candidate count and selected UTC instant. | [PEP 495 on local time disambiguation](https://peps.python.org/pep-0495/) |
| Aggregated histogram counts can locate a percentile's bucket while leaving its exact value unknown. | [Nightingale](https://doc.blyx-lang.space/guide/nightingale) returns bounds and preserves uncertainty when a threshold falls inside the bucket. | [Prometheus histogram practice](https://prometheus.io/docs/practices/histograms/) |

For performance measurements, the [benchmark report](https://www.blyx-lang.space/benchmarks#workflows) records the native Blyx and CPython code paths, machine, launch order, output checksums, all measured runs and medians. A comparison for another workload needs its own reference implementation and inputs.

## Improve an existing package

Use the package’s own issue tracker or submit a pull request to its repository. Include your operating system, the output of `blyxc --version`, the smallest failing input, the observed output and your expected result. A test for the reported case helps maintainers reproduce it.

From a tagged library checkout, run `blyxc native-run tests.blyx` and `blyxc native-run example.blyx` with Rust and a host linker available. Applications have release-specific commands and input fixtures in their README. Keep public functions, invalid-input conventions and existing imports compatible when preparing a patch release.

## Propose a catalog entry

1. Publish the package source with a license, a versioned tag, a small example with expected output, and its input and error contracts. Give developers a command that works from a new project.
2. Open a pull request in the language repository. Add the package to `website/src/lib/packages.json` and place its logo in `website/public/packages/`. Record the exact release version and commit. The catalog, individual package page, JSON feed and sitemap use this entry.
3. Provide a single-file portable example in `examples/ecosystem/` and its matching entry in `website/src/lib/samples.json`. The browser interpreter runs a complete buffer. Native examples can import local modules. Keep upstream source attribution in a portable example that includes a library implementation.
4. Run the native example from a clean tagged checkout. From the language repository run `node editors/code/scripts/prepare.cjs`, `node tools/test-editor-runtime.mjs`, and `node tools/export-handbook.mjs --check`. If the package adds a chapter, regenerate the plain-text handbook with `node tools/export-handbook.mjs`.

Include the test command and result in your pull request. Use a held-out dataset and publish the inputs, versions and timing boundaries for any performance claim. [Language contribution guide](../CONTRIBUTING.md) · [Community discussion](https://www.blyx-lang.space/community)
