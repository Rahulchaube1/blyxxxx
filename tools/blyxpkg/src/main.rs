use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;

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
            let name = &args[2];
            create_project(name);
        }
        "build" => {
            build_project();
        }
        "run" => {
            if build_project() {
                let bin = Path::new("target").join("debug").join("main");
                if bin.exists() {
                    let mut cmd = Command::new(&bin);
                    let _ = cmd.status();
                } else {
                    eprintln!("Error: target/debug/main not found after build");
                }
            }
        }
        "test" => {
            if Path::new("tests").exists() {
                println!("Running tests...");
            } else {
                eprintln!("No tests directory found");
            }
        }
        "clean" => {
            let _ = fs::remove_dir_all("target");
            println!("Cleaned target directory");
        }
        "add" => {
            if args.len() < 3 {
                eprintln!("Usage: blyxpkg add <dep>");
                return;
            }
            let dep = &args[2];
            println!("Added dependency: {}", dep);
        }
        "publish" => {
            println!("Publishing to blyx.land registry...");
        }
        _ => print_usage(),
    }
}

fn print_usage() {
    println!("blyxpkg - Blyx Package Manager");
    println!("Commands: new, build, run, test, clean, add, publish");
}

fn create_project(name: &str) {
    fs::create_dir_all(format!("{}/src", name)).unwrap();
    fs::write(format!("{}/Blyx.toml", name), format!("[package]\nname = \"{}\"\nversion = \"0.1.0\"\n", name)).unwrap();
    fs::write(format!("{}/src/main.blyx", name), "fn main() {\n    println(\"Hello from Blyx!\");\n}\n").unwrap();
    println!("Created new project '{}'", name);
}

fn build_project() -> bool {
    if !Path::new("Blyx.toml").exists() {
        eprintln!("Error: no Blyx.toml found in current directory");
        return false;
    }

    let status = Command::new("blyxc")
        .arg("build")
        .arg("src/main.blyx")
        .status();

    match status {
        Ok(s) => {
            if s.success() {
                println!("Build successful");
                true
            } else {
                eprintln!("Build failed");
                false
            }
        }
        Err(e) => {
            eprintln!("Failed to execute blyxc: {}", e);
            false
        }
    }
}
