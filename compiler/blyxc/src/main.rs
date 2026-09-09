use std::env;
use std::fs;
use std::path::Path;
use std::process::exit;

use blyx_parser::BlyxParser;

fn print_error(message: &str) {
    eprintln!("error: {message}");
}

fn print_success(message: &str) {
    println!("✓ {message}");
}

fn print_usage() {
    println!("Blyx Compiler (blyxc) — v0.1.0-alpha");
    println!("Usage: blyxc <subcommand> [args]");
    println!();
    println!("Subcommands:");
    println!("  check <file.blyx>   Parse and validate a Blyx source file");
    println!("  build <file.blyx>   Build (backend not yet implemented)");
    println!("  run <file.blyx>     Run (backend not yet implemented)");
    println!("  new <project>       Create a minimal Blyx project");
    println!("  fmt <file.blyx>     Normalize source line endings");
    println!("  help                Print this message");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        exit(1);
    }

    match args[1].as_str() {
        "check" => cmd_check(&args[2..]),
        "build" => cmd_build(&args[2..]),
        "run" => cmd_run(&args[2..]),
        "new" => cmd_new(&args[2..]),
        "fmt" => cmd_fmt(&args[2..]),
        "help" | "--help" | "-h" => print_usage(),
        command => {
            print_error(&format!("unknown subcommand '{command}'"));
            print_usage();
            exit(2);
        }
    }
}

fn input_file(args: &[String]) -> String {
    match args.first() {
        Some(path) if !path.starts_with('-') => path.clone(),
        _ => {
            print_error("no input file specified");
            exit(2);
        }
    }
}

fn read_source(path: &str) -> String {
    match fs::read_to_string(path) {
        Ok(source) => source,
        Err(error) => {
            print_error(&format!("cannot read '{path}': {error}"));
            exit(1);
        }
    }
}

fn cmd_check(args: &[String]) {
    let path = input_file(args);
    if !Path::new(&path).is_file() {
        print_error(&format!("file not found: {path}"));
        exit(1);
    }

    let source = read_source(&path);
    let mut parser = BlyxParser::with_file(&source, &path);
    let _file = parser.parse_file(&path);

    if parser.has_errors() {
        for error in parser.errors() {
            eprintln!("error[{}:{}]: {}", error.span.line, error.span.column, error.message);
            if let Some(hint) = &error.hint {
                eprintln!("  help: {hint}");
            }
        }
        exit(1);
    }

    print_success(&format!("parsed {path} successfully"));
}

fn cmd_build(args: &[String]) {
    let path = input_file(args);
    cmd_check(std::slice::from_ref(&path));
    print_error("native code generation is not implemented in v0.1.0-alpha");
    print_error("the build command currently validates the source only");
    exit(3);
}

fn cmd_run(args: &[String]) {
    let path = input_file(args);
    cmd_check(std::slice::from_ref(&path));
    print_error(
        "execution is not implemented in v0.1.0-alpha because the native backend is not ready",
    );
    exit(3);
}

fn cmd_new(args: &[String]) {
    let name = match args.first() {
        Some(name) if !name.is_empty() && !name.starts_with('-') => name,
        _ => {
            print_error("project name required");
            exit(2);
        }
    };

    let dir = Path::new(name);
    if dir.exists() {
        print_error(&format!("directory '{name}' already exists"));
        exit(1);
    }

    if let Err(error) = fs::create_dir_all(dir.join("src")) {
        print_error(&format!("cannot create project directory: {error}"));
        exit(1);
    }

    let manifest = format!(
        "[package]\nname = \"{name}\"\nversion = \"0.1.0\"\nedition = \"2024\"\n\n[dependencies]\n"
    );
    let main_source = format!("// {name} — Blyx project\n\nfn main() {{\n}}\n");

    if let Err(error) = fs::write(dir.join("Blyx.toml"), manifest) {
        print_error(&format!("cannot write Blyx.toml: {error}"));
        exit(1);
    }
    if let Err(error) = fs::write(dir.join("src/main.blyx"), main_source) {
        print_error(&format!("cannot write src/main.blyx: {error}"));
        exit(1);
    }

    print_success(&format!("created Blyx project '{name}'"));
}

fn cmd_fmt(args: &[String]) {
    let path = input_file(args);
    let source = read_source(&path);
    let normalized = source.replace("\r\n", "\n").replace('\r', "\n");

    if let Err(error) = fs::write(&path, normalized) {
        print_error(&format!("cannot write '{path}': {error}"));
        exit(1);
    }

    print_success(&format!("normalized {path}"));
}
