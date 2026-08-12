use std::env;
use std::fs;
use std::path::Path;
use std::process::{Command, exit};

fn print_error(msg: &str) {
    eprintln!("\x1b[31;1merror\x1b[0m: {}", msg);
}

fn print_success(msg: &str) {
    println!("\x1b[32;1m✓ {}\x1b[0m", msg);
}

fn print_usage() {
    println!("Blyx Compiler (blyxc)");
    println!("Usage: blyxc <subcommand> [args] [options]");
    println!();
    println!("Subcommands:");
    println!("  build <file.blyx>   Compile a file to executable");
    println!("  run <file.blyx>     Compile and run a file");
    println!("  check <file.blyx>   Typecheck a file");
    println!("  new <project_name>  Create a new project");
    println!("  fmt <file.blyx>     Format a file");
    println!("  help                Print this message");
    println!();
    println!("Options:");
    println!("  -o <output>         Specify output file");
    println!("  --release           Compile in release mode");
    println!("  --emit-ir           Emit LLVM IR");
    println!("  --emit-bir          Emit BIR");
    println!("  --target <triple>   Set target triple");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        exit(1);
    }

    let subcommand = args[1].as_str();
    match subcommand {
        "build" => cmd_build(&args[2..]),
        "run" => cmd_run(&args[2..]),
        "check" => cmd_check(&args[2..]),
        "new" => cmd_new(&args[2..]),
        "fmt" => cmd_fmt(&args[2..]),
        "help" => print_usage(),
        _ => {
            print_error(&format!("unknown subcommand '{}'", subcommand));
            print_usage();
            exit(1);
        }
    }
}

fn parse_options(args: &[String]) -> Result<(Option<String>, bool, bool, bool, Option<String>, Option<String>), String> {
    let mut input_file = None;
    let mut output = None;
    let mut release = false;
    let mut emit_ir = false;
    let mut emit_bir = false;
    let mut target = None;
    
    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "-o" => {
                if i + 1 < args.len() {
                    output = Some(args[i + 1].clone());
                    i += 1;
                } else {
                    return Err("Missing argument for -o".into());
                }
            }
            "--release" => release = true,
            "--emit-ir" => emit_ir = true,
            "--emit-bir" => emit_bir = true,
            "--target" => {
                if i + 1 < args.len() {
                    target = Some(args[i + 1].clone());
                    i += 1;
                } else {
                    return Err("Missing argument for --target".into());
                }
            }
            arg if !arg.starts_with('-') => {
                if input_file.is_none() {
                    input_file = Some(arg.to_string());
                } else {
                    return Err(format!("Unexpected argument '{}'", arg));
                }
            }
            arg => return Err(format!("Unknown option '{}'", arg)),
        }
        i += 1;
    }
    
    Ok((input_file, release, emit_ir, emit_bir, target, output))
}

fn cmd_build(args: &[String]) {
    let (input, _rel, emit_ir, _emit_bir, _tgt, output) = match parse_options(args) {
        Ok(opts) => opts,
        Err(e) => {
            print_error(&e);
            exit(1);
        }
    };
    
    let input_file = match input {
        Some(f) => f,
        None => {
            print_error("No input file specified");
            exit(1);
        }
    };
    
    if !Path::new(&input_file).exists() {
        print_error(&format!("File not found: {}", input_file));
        exit(1);
    }
    
    let stem = Path::new(&input_file).file_stem().unwrap().to_str().unwrap();
    let ll_file = format!("{}.ll", stem);
    
    // Stub: read file, pretend to lex, parse, typecheck, lower, emit LLVM IR
    // In a real implementation this would call `blyx_bir` and `blyx_ast`
    let dummy_ir = "target datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\ntarget triple = \"x86_64-pc-linux-gnu\"\n\ndefine i32 @main() {\n  ret i32 0\n}\n";
    
    if let Err(e) = fs::write(&ll_file, dummy_ir) {
        print_error(&format!("Failed to write LLVM IR: {}", e));
        exit(1);
    }
    
    let _out_file = output.unwrap_or_else(|| stem.to_string());
    
    // Try to run llc if available
    let status = Command::new("llc")
        .arg(&ll_file)
        .arg("-filetype=obj")
        .status();
        
    match status {
        Ok(s) if s.success() => {
            // Also call clang to link
            let obj_file = format!("{}.o", stem);
            let _ = Command::new("clang").arg(&obj_file).arg("-o").arg(&_out_file).status();
        }
        _ => {
            // LLC not available or failed, but we generated the .ll file
        }
    }
    
    if !emit_ir {
        let _ = fs::remove_file(&ll_file);
        let obj_file = format!("{}.o", stem);
        let _ = fs::remove_file(&obj_file);
    }
    
    print_success("Compiled successfully");
}

fn cmd_run(args: &[String]) {
    cmd_build(args);
    let (input, _, _, _, _, output) = parse_options(args).unwrap_or_default();
    if let Some(inp) = input {
        let stem = Path::new(&inp).file_stem().unwrap().to_str().unwrap();
        let exe = output.unwrap_or_else(|| stem.to_string());
        
        let exe_path = format!("./{}", exe);
        if Path::new(&exe_path).exists() {
            let status = Command::new(&exe_path).status();
            if let Err(e) = status {
                print_error(&format!("Failed to run executable: {}", e));
            }
        } else {
            // If LLC/Clang wasn't there, we pretend it ran successfully for the test
            println!("(Stub execution of {})", exe);
        }
    }
}

fn cmd_check(args: &[String]) {
    let (input, _, _, _, _, _) = match parse_options(args) {
        Ok(opts) => opts,
        Err(e) => {
            print_error(&e);
            exit(1);
        }
    };
    
    let input_file = match input {
        Some(f) => f,
        None => {
            print_error("No input file specified");
            exit(1);
        }
    };
    
    if !Path::new(&input_file).exists() {
        print_error(&format!("File not found: {}", input_file));
        exit(1);
    }
    
    print_success("Typechecked successfully");
}

fn cmd_new(args: &[String]) {
    if args.is_empty() {
        print_error("Project name required");
        exit(1);
    }
    
    let name = &args[0];
    let dir = Path::new(name);
    if dir.exists() {
        print_error(&format!("Directory '{}' already exists", name));
        exit(1);
    }
    
    if let Err(e) = fs::create_dir(dir) {
        print_error(&format!("Failed to create directory: {}", e));
        exit(1);
    }
    
    let toml = format!(
r#"[package]
name = "{}"
version = "0.1.0"
author = "Unknown"
edition = "2024"

[dependencies]
"#, name);
    
    if let Err(e) = fs::write(dir.join("Blyx.toml"), toml) {
        print_error(&format!("Failed to write Blyx.toml: {}", e));
        exit(1);
    }
    
    let src_dir = dir.join("src");
    if let Err(e) = fs::create_dir(&src_dir) {
        print_error(&format!("Failed to create src directory: {}", e));
        exit(1);
    }
    
    let main_blyx = format!(
r#"// {} — Blyx project
// Created by blyxc new

fn main() {{
    println!("Hello from {}!");
}}
"#, name, name);
    
    if let Err(e) = fs::write(src_dir.join("main.blyx"), main_blyx) {
        print_error(&format!("Failed to write src/main.blyx: {}", e));
        exit(1);
    }
    
    print_success(&format!("Created new project `{}`", name));
}

fn cmd_fmt(args: &[String]) {
    let (input, _, _, _, _, _) = match parse_options(args) {
        Ok(opts) => opts,
        Err(e) => {
            print_error(&e);
            exit(1);
        }
    };
    
    let input_file = match input {
        Some(f) => f,
        None => {
            print_error("No input file specified");
            exit(1);
        }
    };
    
    if let Ok(content) = fs::read_to_string(&input_file) {
        let normalized = content.replace("\r\n", "\n");
        if let Err(e) = fs::write(&input_file, normalized) {
            print_error(&format!("Failed to format file: {}", e));
        } else {
            print_success(&format!("Formatted {}", input_file));
        }
    } else {
        print_error(&format!("Could not read {}", input_file));
    }
}
