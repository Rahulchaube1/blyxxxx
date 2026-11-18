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

## Mutation and control flow

```blyx
fn main() {
    let mut n = 0;
    let mut sum = 0;
    while n < 10 {
        n += 1;
        if n % 2 == 0 { continue; }
        sum += n;
    }
    println!(sum);
    let answer = loop { break 42; };
    println!(answer);
}
```

This prints `25` and `42`. Run `examples/basic/loops.blyx` for factorial and loop-result examples (outputs `Factorial(6):`, `720`, `10`).

`let` bindings are immutable; use `let mut` for assignment. Supported assignment operators are `=`, `+=`, `-=`, `*=`, `/=`, `%=` and return unit. They require a variable target and preserve its runtime value kind. Compound assignment reads the old LHS before evaluating the RHS. Inner bindings shadow outer ones; updating an outer mutable binding survives block exit. Parameters are immutable. Initializers are required during execution.

`while` requires a boolean condition and evaluates to unit. `loop` repeats until `break` or `return`. `break value` is supported only in `loop`; `continue` starts the next iteration of the nearest loop. A called function cannot break or continue its caller's loop.

A block/function's last expression supplies its value only without a semicolon: `{ 42 }` yields 42, while `{ 42; }` yields unit. Explicit return works with either style.

## Execution limits

Execution defaults to 1,000,000 evaluation steps and at most 64 simultaneous function calls. Steps count expression evaluation, block entry and loop iterations, including empty loops. Exceeding either limit reports a runtime error (exit 4). These are deterministic operation limits, not wall-clock or memory limits. Source parsing is not covered by this budget.

```sh
blyxc run examples/basic/loops.blyx --max-steps 2000000
```

The budget must be a positive u64 integer; malformed/unknown run arguments return exit 2. Signed integer literals must fit i64, including `-9223372036854775808`.

## Limits

Type annotations are parsed but not enforced by this interpreter. Runtime value-kind checks are not a static type system. `check` performs syntax validation. For/range loops, labels, general collections, imports, structs, ownership checking, async, GPU and AI operations remain unsupported in this execution path. Non-function declarations are not executed. BIR/native lowering of the new control flow remains separate work.

## Next release gates

1. Integrate name resolution and type checking so unsupported programs fail before execution.
2. Add source-located runtime errors, parser-depth limits and module loading.
3. Stabilize collections, file/console I/O, package manifests and installation tests.
4. Expand native build coverage and differential tests.

Performance comparisons with Rust, Python or C require reproducible measurements. This is an experimental interpreter, not language parity.

## Numeric programs and native builds (0.2.0)

Decimal literals use f64. Vector literals store contiguous f64 values and share immutable storage across function calls. Integers in vectors convert to f64. The interpreter promotes mixed integer/float arithmetic to f64. Floating-point division follows IEEE 754. Use `len(v)`, `at(v, index)`, `sum(v)` and `dot(left, right)`. Dot requires equal lengths. Indices start at zero. Interpreter reductions spend one step per element.

`blyxc build path.blyx [-o executable]` lowers supported AST nodes to Rust and invokes rustc with optimization and integer overflow checks. Install rustc and a linker on the build machine. The resulting program runs without Blyx or Rust installed. Build accepts synchronous functions, scalar and vector locals, calls, print macros, conditionals and loops. Use explicit return types on value-returning functions and matching scalar operand types in native code. Supported types are i64, f64, bool, str, String, vector and unit. The native executable has no interpreter step or recursion budget. The BIR backend, GPU programs, model serving and a self-hosted compiler remain development work.

The browser and desktop editor use the same interpreter compiled to WebAssembly. Their workers limit source to 256 KiB, output to 64 KiB and elapsed time to eight seconds.

### Rebuild the editor runtime

Run these commands from the repository root after changing the lexer, parser or interpreter. Commit the regenerated WebAssembly module with the source change. On Windows, use Copy-Item for the copy step.

```sh
rustup target add wasm32-unknown-unknown
cargo build --locked --release -p blyxc --lib --target wasm32-unknown-unknown
cp target/wasm32-unknown-unknown/release/blyxc.wasm website/public/runtime/blyx.wasm
node editors/code/scripts/prepare.cjs
node tools/test-editor-runtime.mjs
```
