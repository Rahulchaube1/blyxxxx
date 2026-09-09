use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        println!("Usage: blyxfmt <file.blyx>");
        return;
    }

    let file_path = &args[1];
    let content = match fs::read_to_string(file_path) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Error reading {}: {}", file_path, e);
            return;
        }
    };

    let formatted = format_code(&content);

    if content != formatted {
        match fs::write(file_path, &formatted) {
            Ok(_) => println!("Formatted {}", file_path),
            Err(e) => eprintln!("Error writing {}: {}", file_path, e),
        }
    } else {
        println!("{} is already formatted", file_path);
    }
}

fn format_code(code: &str) -> String {
    let lines: Vec<&str> = code.lines().collect();
    let mut use_stmts = Vec::new();
    let mut other_lines = Vec::new();

    for line in lines.iter() {
        if line.trim().starts_with("use ") {
            use_stmts.push(line.trim().to_string());
        } else {
            other_lines.push(*line);
        }
    }

    use_stmts.sort();

    let mut result = String::new();
    for u in use_stmts {
        result.push_str(&u);
        result.push('\n');
    }

    for line in other_lines {
        let mut t = line.trim_end().to_string();

        let keywords = ["if", "while", "for", "match", "return"];
        for k in keywords.iter() {
            t = t.replace(&format!("{} (", k), &format!("{} (", k));
            t = t.replace(&format!("{}(", k), &format!("{} (", k));
        }

        let spaces_count = line.chars().take_while(|c| *c == ' ').count();
        let normalized_indent = " ".repeat((spaces_count / 4) * 4);

        if !t.is_empty() {
            result.push_str(&normalized_indent);
            result.push_str(t.trim_start());
        }
        result.push('\n');
    }

    let mut res = result.trim_end().to_string();
    res.push('\n');
    res
}
