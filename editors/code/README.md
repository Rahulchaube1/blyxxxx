# Blyx Language

Run a Blyx program directly in VS Code. Open a `.blyx` file and choose **Blyx: Run File** from the Command Palette or the editor title bar. Output appears in the **Blyx** channel. The extension runs the current buffer, including unsaved edits.

The bundled WebAssembly interpreter also checks syntax as you edit. Syntax highlighting and snippets are included. Desktop VS Code runs the interpreter locally.

```blyx
fn main() {
    println!(dot([1.0, 2.0], [3.0, 4.0]));
}
```

This prints `11`. The runtime supports functions, checked integers, floating-point arithmetic, numeric vectors, conditionals and loops. Programs in the editor run with a one-million-step budget.

[Playground](https://www.blyx-lang.space/play) · [Blyx source and CLI](https://github.com/Rahulchaube1/blyxxxx)
