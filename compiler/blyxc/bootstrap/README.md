# Blyx Direct 0.1.0

Blyx Direct is a self-hosted compiler for a subset of Blyx. The lexer, parser, type checks, x86-64 instruction emitter, branch resolution, runtime routines and executable writer are in [compiler.blyx](compiler.blyx). The released executable builds its own source and other supported programs on Windows x64 and Linux x64. It invokes no external compiler, assembler or linker.

## Build a program

```text
source.blyx → Blyx lexer and parser → checked x86-64 instructions
                                  → PE32+ (Windows) or ELF64 (Linux)
```

Extract the [archive for your OS](https://github.com/Rahulchaube1/blyxxxx/releases/tag/direct-v0.1.0) into a new directory. The executable in this archive is named `blyxc`. Calling it by its path makes it easy to use alongside the 0.2.1 numerical toolchain. Save the following as `sum.blyx` in that directory.

```blyx
fn triangular(n: i64) -> i64 {
    let mut total = 0;
    let mut i = 1;
    while i <= n {
        total += i;
        i += 1;
    }
    total
}

fn main() {
    println!(triangular(10));
}
```

On Linux x64:

```sh
./blyxc --version
./blyxc build sum.blyx -o sum
./sum
```

On Windows x64, in PowerShell:

```powershell
.\blyxc.exe --version
.\blyxc.exe build sum.blyx -o sum.exe
.\sum.exe
```

Expect `blyxc direct 0.1.0` and `55`. Choose a fresh output filename for each build. The compiler refuses to overwrite an existing file, including the input. With no arguments it reads source from standard input and writes the executable bytes to standard output. Use file arguments in PowerShell.

## Rebuild the compiler with Blyx

The archive includes the compiler source. On Linux:

```sh
./blyxc build compiler.blyx -o generation2
./generation2 build compiler.blyx -o generation3
cmp generation2 generation3
```

On Windows:

```powershell
.\blyxc.exe build compiler.blyx -o generation2.exe
.\generation2.exe build compiler.blyx -o generation3.exe
Get-FileHash .\generation2.exe, .\generation3.exe
```

On the same target the binaries match byte for byte. During release preparation the older Rust-based Blyx driver builds a one-time seed from source. That seed compiles the first machine-code generation, which builds the second. CI clears `PATH` while checking the fixed point, running examples and testing compiler errors. Only the verified second generation is packaged. To reproduce the seed from a repository checkout, run `cargo build --locked --release -p blyxc`, build `compiler/blyxc/bootstrap/compiler.blyx` with that driver and pass the resulting seed path to `python tools/test-self-host.py`.

## Language coverage

| Feature | Blyx Direct 0.1.0 |
| --- | --- |
| Procedures | Top-level functions, forward calls, recursion, up to eight positional parameters, explicit returns and tail expressions |
| Values | Checked signed 64-bit integers, booleans and UTF-8 string literals, including output through `print!` and `println!` |
| Control flow | Block-scoped bindings, mutation, integer arithmetic and comparisons, short-circuit logic, conditions, `while`, `loop`, `break` and `continue` |
| Runtime services | The compiler uses the bounded `std::bootstrap` workspace, byte streams and OS file arguments. Program input and output use the operating system directly. |
| Targets | PE32+ on Windows x64 and ELF64 on Linux x64 |
| Wider programs | Use the 0.2.1 toolchain for floating-point and vector workloads, general imports and the existing framework ecosystem. The playground uses the separate WebAssembly interpreter. |

The source limit is 256 KiB per compilation. Diagnostics report a source byte offset. Arithmetic overflow, division by zero and invalid bootstrap memory accesses terminate a generated program with status 4. A successful fixed-point build tests self-hosting on that target. The [test suite](../../../tools/test-self-host.py) also executes generated programs to check observable behavior.
