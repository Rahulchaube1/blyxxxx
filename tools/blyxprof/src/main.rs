use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        println!("blyxprof — Blyx profiler prototype");
        println!("Usage: blyxprof <binary> [--cpu|--mem|--actor|--gpu|--tensor]");
        return;
    }

    println!("blyxprof: profiling support for '{}' is not implemented yet.", args[1]);
    println!("No performance measurements are reported until a real profiling backend is available.");
}
