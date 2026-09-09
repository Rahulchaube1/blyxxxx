use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        println!("blyxdbg — Blyx debugger prototype");
        println!("Usage: blyxdbg <binary> [args]");
        return;
    }

    println!("blyxdbg: debugger support for '{}' is not implemented yet.", args[1]);
    println!("This command currently serves as a toolchain placeholder.");
}
