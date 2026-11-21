# Contribute a Blyx package

The [package catalog](https://www.blyx-lang.space/packages) lists versioned native Blyx libraries, frameworks and command-line tools. The [JSON catalog](https://www.blyx-lang.space/packages.json) provides the release, commit, importable module, logo and runnable example for each entry.

## Improve an existing package

Use the package’s own issue tracker or submit a pull request to its repository. Include your operating system, the output of `blyxc --version`, the smallest failing input, the observed output and your expected result. A test for the reported case helps maintainers reproduce it.

From a tagged library checkout, run `blyxc native-run tests.blyx` and `blyxc native-run example.blyx` with Rust and a host linker available. Applications have release-specific commands and input fixtures in their README. Keep public functions, invalid-input conventions and existing imports compatible when preparing a patch release.

## Propose a catalog entry

1. Publish the package source with a license, a versioned tag, a small example with expected output, and its input and error contracts. Give developers a command that works from a new project.
2. Open a pull request in the language repository. Add the package to `website/src/lib/packages.json` and place its logo in `website/public/packages/`. Record the exact release version and commit. The catalog, individual package page, JSON feed and sitemap use this entry.
3. Provide a single-file portable example in `examples/ecosystem/` and its matching entry in `website/src/lib/samples.json`. The browser interpreter runs a complete buffer. Native examples can import local modules. Keep upstream source attribution in a portable example that includes a library implementation.
4. Run the native example from a clean tagged checkout. From the language repository run `node editors/code/scripts/prepare.cjs`, `node tools/test-editor-runtime.mjs`, and `node tools/export-handbook.mjs --check`. If the package adds a chapter, regenerate the plain-text handbook with `node tools/export-handbook.mjs`.

Include the test command and result in your pull request. Use a held-out dataset and publish the inputs, versions and timing boundaries for any performance claim. [Language contribution guide](../CONTRIBUTING.md) · [Community discussion](https://www.blyx-lang.space/community)
