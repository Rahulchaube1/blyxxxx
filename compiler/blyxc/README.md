# Blyx compiler

`blyxc` checks, interprets, and compiles programs written in Blyx. Save this program as `main.blyx`.

```blyx
fn main() {
    println!(dot([2.0, 3.0], [4.0, 5.0]));
}
```

Run `blyxc check main.blyx` to check the syntax, then `blyxc run main.blyx` to print `23`. To build a native executable, install Rust and a host linker and run `blyxc build main.blyx`.

[Installation](https://www.blyx-lang.space/download) · [Language guide](https://doc.blyx-lang.space/) · [Playground](https://www.blyx-lang.space/play)

## Native numeric buffers

Compiled programs can import `std::buffer` to construct vectors at runtime.
`buffer_fill(n, value)` creates an `n`-element f64 vector. `buffer_set(v, i, value)`
returns a vector with the indexed element replaced. Vector copies keep their
original contents. When a program writes back into the same unshared vector,
the native backend reuses its allocation. Negative lengths and out-of-range
indices produce a runtime error.

```blyx
use std::buffer;
fn main() {
    let mut weights = buffer_fill(2048, 0.0);
    weights = buffer_set(weights, 2047, 1.5);
    println!(at(weights, 2047));
}
```

## Connect with Rahul Chaube

[Portfolio](https://www.rahulchaube1.com/) · [GitHub](https://github.com/Rahulchaube1) · [LinkedIn](https://www.linkedin.com/in/rahulchaube1) · [Hugging Face](https://huggingface.co/oncody) · [X](https://x.com/RahulChaube_) · [EverestQ](https://www.everestqai.com/) · [Contact](https://www.rahulchaube1.com/contact)

[Blyx website](https://www.blyx-lang.space/) · [BlyxTorch](https://www.blyx-lang.space/packages/blyxtorch) · [Handbook](https://doc.blyx-lang.space/) · [Community](https://www.blyx-lang.space/community)

Support Rahul’s open-source work through [GitHub Sponsors](https://github.com/sponsors/Rahulchaube1) or [Buy Me a Coffee](https://buymeacoffee.com/rahulchaube).
