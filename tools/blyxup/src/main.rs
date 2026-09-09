use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        println!("blyxup — Blyx toolchain manager prototype");
        println!("Usage: blyxup <install|update|uninstall> [channel]");
        return;
    }

    eprintln!("blyxup: '{}' is not implemented yet.", args[1]);
    eprintln!(
        "Published installation artifacts are currently distributed through the official Blyx release/download flow."
    );
}
