# Blyx Language for VS Code

Write and run Blyx programs in desktop VS Code. The extension highlights `.blyx` files, checks syntax as you type, and runs the current editor buffer with a bundled WebAssembly build of the Blyx interpreter. You can try the language before installing the command-line compiler.

[Language guide](https://doc.blyx-lang.space/) · [Browser playground](https://www.blyx-lang.space/play) · [Extension source](https://github.com/Rahulchaube1/blyxxxx/tree/blyx-main/editors/code)

## Install and run your first file

1. In the Extensions view, search for the exact ID `RahulChaube.blyx-language` and install **Blyx Language**. The extension supports desktop VS Code 1.80 and later. [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=RahulChaube.blyx-language) · [Open VSX](https://open-vsx.org/extension/RahulChaube/blyx-language)
2. Create `readings.blyx` and paste the program below.
3. Click the play button in the editor title bar or choose **Blyx: Run File** from the Command Palette. The **Blyx** output channel displays `7.5`.

```blyx
fn main() {
    let readings = [5.0, 7.0, 9.0];
    let weights = [1.0, 1.0, 2.0];
    println!(dot(readings, weights) / sum(weights));
}
```

Change the last weight from `2.0` to `1.0` and run again before saving. The result becomes `7`, the ordinary mean of the three readings. [Run the example online](https://www.blyx-lang.space/play?example=weighted-mean)

## Editing and diagnostics

| In the editor | What happens |
| --- | --- |
| Open or edit a Blyx file | The parser checks the current text and reports syntax errors in the editor and Problems panel. |
| Type a snippet prefix such as `fn` | Select the Blyx completion to insert a function template. |
| Choose **Blyx: Run File** | A local worker interprets the current buffer. Output and execution errors appear in the **Blyx** channel. |

For a quick diagnostic check, remove the closing brace from `readings.blyx`. Restore it to clear the parser error. If the run command is unavailable, check that the active editor’s language mode is **Blyx**. [Editor walkthrough](https://doc.blyx-lang.space/guide/editor) · [Diagnostics guide](https://doc.blyx-lang.space/guide/diagnostics)

## Interpreter and native builds

The extension supports the Blyx 0.2.0 interpreter, including functions, conditionals, loops, checked integers, floating-point arithmetic, and numeric vectors. Editor runs have a one-million-step budget and an eight-second worker timeout. The numerical 0.2.1 toolchain builds this vector example in a terminal with Rust and a host linker. [Compiler downloads](https://www.blyx-lang.space/download) · [Native build guide](https://doc.blyx-lang.space/guide/native-builds)

### Build a standalone program with Blyx Direct

On Windows x64 or Linux x64, extract the Direct compiler and open the batch-counting example in a trusted local workspace. Choose **Blyx: Build Native Executable**, select the extracted compiler, then choose a fresh output filename. The Blyx output channel shows the resulting path or the compiler diagnostic. Run the binary from a terminal. Its first three lines are `0`, `1` and `2`. To reuse a compiler across builds, set **Blyx › Direct Compiler Path** in User Settings. Direct 0.1.0 supports integer and Boolean programs, functions and loops. [Download Direct](https://www.blyx-lang.space/download#direct) · [Example and expected output](https://www.blyx-lang.space/articles/blyx-direct)

For manual installation, download the editor VSIX from the project’s editor page and choose **Extensions: Install from VSIX…** in desktop VS Code. The repository includes the worker, the WebAssembly runtime tests, and the license for this extension. [Editor downloads](https://www.blyx-lang.space/vscode) · [Runtime tests](https://github.com/Rahulchaube1/blyxxxx/blob/blyx-main/tools/test-editor-runtime.mjs) · [MIT license](https://github.com/Rahulchaube1/blyxxxx/blob/blyx-main/editors/code/LICENSE)

## Project and support

Blyx was created by Rahul Chaube. To report an editor issue, include your editor and extension versions, a small `.blyx` file, and the output you expected. [Issue tracker](https://github.com/Rahulchaube1/blyxxxx/issues) · [Blyx website](https://www.blyx-lang.space/) · [Rahul on GitHub](https://github.com/Rahulchaube1) · [Rahul on LinkedIn](https://www.linkedin.com/in/rahulchaube1)

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).
