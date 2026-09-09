use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        println!("blyxdoc — Blyx documentation generator prototype");
        println!("Usage: blyxdoc <input_dir> [-o <out_dir>]");
        return;
    }

    println!("Documentation generation is not implemented yet for: {}", args[1]);
    println!("See the Blyx documentation for the current toolchain status.");
}
