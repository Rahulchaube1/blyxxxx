use std::env;
use std::fs;
use std::path::Path;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        print_usage();
        return;
    }

    match args[1].as_str() {
        "new" => {
            if args.len() < 3 {
                eprintln!("Usage: blyxpkg new <name>");
                return;
            }
            create_project(&args[2]);
        }
        "clean" => {
            if fs::remove_dir_all("target").is_ok() {
                println!("Cleaned target directory");
            } else {
                println!("No target directory to clean");
            }
        }
        "build" | "run" | "test" | "add" | "publish" => {
            eprintln!("blyxpkg: '{}' is not implemented yet.", args[1]);
            eprintln!("The command is reserved for the evolving Blyx package-management interface.");
        }
        _ => print_usage(),
    }
}

fn print_usage() {
    println!("blyxpkg — Blyx package manager prototype");
    println!("Commands: new, build, run, test, clean, add, publish");
}

fn create_project(name: &str) {
    let root = Path::new(name);
    if let Err(error) = fs::create_dir_all(root.join("src")) {
        eprintln!("Failed to create project: {error}");
        return;
    }

    let manifest = format!("[package]\nname = \"{name}\"\nversion = \"0.1.0\"\n");
    let main = "fn main() {\n    print(\"Hello from Blyx!\");\n}\n";

    if let Err(error) = fs::write(root.join("Blyx.toml"), manifest) {
        eprintln!("Failed to write Blyx.toml: {error}");
        return;
    }
    if let Err(error) = fs::write(root.join("src/main.blyx"), main) {
        eprintln!("Failed to write src/main.blyx: {error}");
        return;
    }

    println!("Created Blyx project '{name}'");
}
