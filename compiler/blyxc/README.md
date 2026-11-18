# Blyx compiler

`blyxc` checks, interprets, and compiles programs written in Blyx. Save this program as `main.blyx`.

```blyx
fn main() {
    println!(dot([2.0, 3.0], [4.0, 5.0]));
}
```

Run `blyxc check main.blyx` to check the syntax, then `blyxc run main.blyx` to print `23`. To build a native executable, install Rust and a host linker and run `blyxc build main.blyx`.

[Installation](https://www.blyx-lang.space/download) · [Language guide](https://doc.blyx-lang.space/) · [Playground](https://www.blyx-lang.space/play)
