# Executable alpha subset

The interpreter executes the parsed AST. It is not a native backend, a sandbox, or a hard real-time runtime. No timing or memory-safety guarantees are claimed.

## Try it

Install Rust 1.85 or newer (edition 2024), then run:

```sh
cargo test --locked --workspace
cargo run -p blyxc -- run examples/basic/fibonacci.blyx
cargo install --path compiler/blyxc
blyxc new hello
blyxc run hello/src/main.blyx
```

`run` requires a parameterless `main`. Functions support positional arguments and recursion. Local `let` bindings are scoped to their block; inner bindings can shadow outer bindings. Returns propagate out of nested expressions to the enclosing function. `&&` and `||` short-circuit and require booleans. Integer arithmetic uses checked signed 64-bit operations; overflow and division/remainder by zero report a runtime error (exit 4).

`println!(expression)` prints one evaluated value plus a newline. `print!(expression)` omits the newline. Both permit no arguments. Format strings and multiple arguments are not implemented; braces in strings are literal. Unicode strings and lexer-supported escapes are preserved.

## Limits

Type annotations are parsed but not enforced by this interpreter. `check` is syntax validation, not a complete static type checker. Floating-point execution, mutation, loops, collections, imports, structs, ownership checking, async, GPU and AI operations are not implemented in this execution path. Recursion is limited by the host stack and execution has no instruction budget. Non-function declarations are not executed. The parser does not distinguish tail expressions from semicolon-terminated expressions; use explicit `return` for function results. Signed literal edge cases and the full type system need further work.

## Next release gates

1. Preserve mutability and semicolon information in the AST; define and test assignment and loop semantics.
2. Integrate name resolution and type checking so unsupported programs fail before execution.
3. Add source-located runtime errors, stack/instruction limits and module loading.
4. Stabilize collections, file/console I/O, package manifests and cross-platform installation tests.
5. Implement and compare a native backend against interpreter conformance tests.

Performance comparisons with Rust, Python or C require reproducible programs and measurements. This patch adds foundational interpreter regression coverage, not language parity.
