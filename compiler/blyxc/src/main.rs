use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::Path;
use std::process::exit;

use blyx_ast::{BinOp, Block, Expr, FnDef, Item, Lit, Stmt};
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
    println!("  build <file.blyx>   Validate a Blyx source file");
    println!("  run <file.blyx>     Interpret a Blyx source file");
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

fn parse_source(path: &str) -> blyx_ast::BlyxFile {
    let source = read_source(path);
    let mut parser = BlyxParser::with_file(&source, path);
    let file = parser.parse_file(path);

    if parser.has_errors() {
        for error in parser.errors() {
            eprintln!("error[{}:{}]: {}", error.span.line, error.span.column, error.message);
            if let Some(hint) = &error.hint {
                eprintln!("  help: {hint}");
            }
        }
        exit(1);
    }

    file
}

fn cmd_check(args: &[String]) {
    let path = input_file(args);
    if !Path::new(&path).is_file() {
        print_error(&format!("file not found: {path}"));
        exit(1);
    }

    let _file = parse_source(&path);
    print_success(&format!("parsed {path} successfully"));
}

fn cmd_build(args: &[String]) {
    let path = input_file(args);
    if !Path::new(&path).is_file() {
        print_error(&format!("file not found: {path}"));
        exit(1);
    }
    let _file = parse_source(&path);
    print_success(&format!("validated {path}; native code generation is not enabled yet"));
}

#[derive(Debug, Clone, PartialEq)]
enum Value {
    Int(i64),
    Bool(bool),
    Str(String),
    Unit,
}

impl Value {
    fn as_int(&self) -> Result<i64, String> {
        match self {
            Self::Int(value) => Ok(*value),
            other => Err(format!("expected integer, got {other:?}")),
        }
    }

    fn as_bool(&self) -> Result<bool, String> {
        match self {
            Self::Bool(value) => Ok(*value),
            other => Err(format!("expected boolean, got {other:?}")),
        }
    }

    fn display(&self) -> String {
        match self {
            Self::Int(value) => value.to_string(),
            Self::Bool(value) => value.to_string(),
            Self::Str(value) => value.clone(),
            Self::Unit => String::new(),
        }
    }
}

type Env = HashMap<String, Value>;

struct Interpreter<'a> {
    functions: HashMap<String, &'a FnDef>,
}

#[derive(Debug)]
enum Flow {
    Value(Value),
    Return(Value),
}

impl<'a> Interpreter<'a> {
    fn new(file: &'a blyx_ast::BlyxFile) -> Self {
        let mut functions = HashMap::new();
        for item in &file.items {
            match item {
                Item::Fn(function) | Item::Function(function) => {
                    functions.insert(function.name.clone(), function);
                }
                _ => {}
            }
        }
        Self { functions }
    }

    fn run_main(&self) -> Result<Value, String> {
        let main = self
            .functions
            .get("main")
            .ok_or_else(|| "entry function 'main' was not found".to_string())?;
        if !main.params.is_empty() {
            return Err("main() must not require parameters".to_string());
        }
        self.call_function(main, Vec::new())
    }

    fn call_function(&self, function: &FnDef, args: Vec<Value>) -> Result<Value, String> {
        if function.params.len() != args.len() {
            return Err(format!(
                "function '{}' expected {} argument(s), got {}",
                function.name,
                function.params.len(),
                args.len()
            ));
        }

        let mut env = Env::new();
        for (param, value) in function.params.iter().zip(args) {
            env.insert(param.name.clone(), value);
        }

        match self.eval_block(&function.body, &mut env)? {
            Flow::Value(value) | Flow::Return(value) => Ok(value),
        }
    }

    fn eval_block(&self, block: &Block, env: &mut Env) -> Result<Flow, String> {
        let mut last = Value::Unit;
        for stmt in &block.stmts {
            match self.eval_stmt(stmt, env)? {
                Flow::Value(value) => last = value,
                Flow::Return(value) => return Ok(Flow::Return(value)),
            }
        }
        Ok(Flow::Value(last))
    }

    fn eval_stmt(&self, stmt: &Stmt, env: &mut Env) -> Result<Flow, String> {
        match stmt {
            Stmt::Let { name, value, .. } => {
                let value = match value {
                    Some(expr) => self.eval_expr(expr, env)?,
                    None => Value::Unit,
                };
                env.insert(name.clone(), value);
                Ok(Flow::Value(Value::Unit))
            }
            Stmt::Expr(expr) => self.eval_expr(expr, env),
            Stmt::Return(expr, _) => {
                let value = match expr {
                    Some(expr) => self.eval_expr(expr, env)?,
                    None => Value::Unit,
                };
                Ok(Flow::Return(value))
            }
            Stmt::Break(_, _) | Stmt::Continue(_) => {
                Err("break/continue are not supported by the alpha interpreter yet".to_string())
            }
            Stmt::Item(_) => Err("nested item execution is not supported by the alpha interpreter yet".to_string()),
        }
    }

    fn eval_expr(&self, expr: &Expr, env: &mut Env) -> Result<Flow, String> {
        match expr {
            Expr::Literal(lit, _) => Ok(Flow::Value(match lit {
                Lit::Int(value) => Value::Int(*value as i64),
                Lit::Float(value) => return Err(format!("floating-point execution is not implemented yet: {value}")),
                Lit::String(value) => Value::Str(value.clone()),
                Lit::Char(value) => Value::Str(value.to_string()),
                Lit::Bool(value) => Value::Bool(*value),
            })),
            Expr::Ident(name, _) => env
                .get(name)
                .cloned()
                .map(Flow::Value)
                .ok_or_else(|| format!("unknown variable '{name}'")),
            Expr::Binary(op, left, right, _) => {
                let left = self.expect_value(self.eval_expr(left, env)?)?;
                let right = self.expect_value(self.eval_expr(right, env)?)?;
                Ok(Flow::Value(self.binary(*op, left, right)?))
            }
            Expr::Call(callee, args, _) => {
                let name = match callee.as_ref() {
                    Expr::Ident(name, _) => name,
                    Expr::Path { segments, .. } if segments.len() == 1 => &segments[0],
                    _ => return Err("only direct function calls are supported by the alpha interpreter".to_string()),
                };
                let function = self
                    .functions
                    .get(name)
                    .ok_or_else(|| format!("unknown function '{name}'"))?;
                let mut values = Vec::with_capacity(args.len());
                for arg in args {
                    values.push(self.expect_value(self.eval_expr(arg, env)?)?);
                }
                Ok(Flow::Value(self.call_function(function, values)?))
            }
            Expr::If { cond, then_branch, else_branch, .. } => {
                let condition = self.expect_value(self.eval_expr(cond, env)?)?.as_bool()?;
                if condition {
                    self.eval_block(then_branch, env)
                } else if let Some(else_expr) = else_branch {
                    self.eval_expr(else_expr, env)
                } else {
                    Ok(Flow::Value(Value::Unit))
                }
            }
            Expr::Block(block) => self.eval_block(block, env),
            Expr::MacroCall { name, args, .. } => {
                if name != "println" && name != "print" {
                    return Err(format!("macro '{name}!' is not supported by the alpha interpreter"));
                }
                let output = self.eval_macro_args(args, env)?;
                if name == "println" {
                    println!("{output}");
                } else {
                    print!("{output}");
                }
                Ok(Flow::Value(Value::Unit))
            }
            Expr::Neg(inner, _) => {
                let value = self.expect_value(self.eval_expr(inner, env)?)?.as_int()?;
                Ok(Flow::Value(Value::Int(-value)))
            }
            Expr::Unary(op, inner, _) => {
                let value = self.expect_value(self.eval_expr(inner, env)?)?;
                match op {
                    blyx_ast::UnOp::Neg => Ok(Flow::Value(Value::Int(-value.as_int()?))),
                    blyx_ast::UnOp::Not => Ok(Flow::Value(Value::Bool(!value.as_bool()?))),
                    _ => Err("references/dereferences are not supported by the alpha interpreter".to_string()),
                }
            }
            _ => Err(format!("expression kind {expr:?} is not supported by the alpha interpreter")),
        }
    }

    fn expect_value(&self, flow: Flow) -> Result<Value, String> {
        match flow {
            Flow::Value(value) => Ok(value),
            Flow::Return(value) => Ok(value),
        }
    }

    fn binary(&self, op: BinOp, left: Value, right: Value) -> Result<Value, String> {
        match op {
            BinOp::Add => Ok(Value::Int(left.as_int()? + right.as_int()?)),
            BinOp::Sub => Ok(Value::Int(left.as_int()? - right.as_int()?)),
            BinOp::Mul => Ok(Value::Int(left.as_int()? * right.as_int()?)),
            BinOp::Div => Ok(Value::Int(left.as_int()? / right.as_int()?)),
            BinOp::Rem => Ok(Value::Int(left.as_int()? % right.as_int()?)),
            BinOp::Eq => Ok(Value::Bool(left == right)),
            BinOp::Ne => Ok(Value::Bool(left != right)),
            BinOp::Lt => Ok(Value::Bool(left.as_int()? < right.as_int()?)),
            BinOp::Gt => Ok(Value::Bool(left.as_int()? > right.as_int()?)),
            BinOp::Le => Ok(Value::Bool(left.as_int()? <= right.as_int()?)),
            BinOp::Ge => Ok(Value::Bool(left.as_int()? >= right.as_int()?)),
            BinOp::And => Ok(Value::Bool(left.as_bool()? && right.as_bool()?)),
            BinOp::Or => Ok(Value::Bool(left.as_bool()? || right.as_bool()?)),
            _ => Err(format!("binary operator {op:?} is not supported by the alpha interpreter")),
        }
    }

    fn eval_macro_args(&self, raw: &str, env: &mut Env) -> Result<String, String> {
        let raw = raw.trim();
        if raw.is_empty() {
            return Ok(String::new());
        }
        if raw.starts_with('"') && raw.ends_with('"') && raw.len() >= 2 {
            return Ok(raw[1..raw.len() - 1].replace("\\\"", "\""));
        }
        let expr = raw.trim_end_matches(';').trim();
        match self.eval_simple_text_expr(expr, env)? {
            Value::Str(value) => Ok(value),
            value => Ok(value.display()),
        }
    }

    fn eval_simple_text_expr(&self, text: &str, env: &mut Env) -> Result<Value, String> {
        if text.starts_with('"') && text.ends_with('"') && text.len() >= 2 {
            return Ok(Value::Str(text[1..text.len() - 1].replace("\\\"", "\"")));
        }
        if let Ok(value) = text.parse::<i64>() {
            return Ok(Value::Int(value));
        }
        if text == "true" {
            return Ok(Value::Bool(true));
        }
        if text == "false" {
            return Ok(Value::Bool(false));
        }
        env.get(text)
            .cloned()
            .ok_or_else(|| format!("unknown value '{text}' in print macro"))
    }
}

fn cmd_run(args: &[String]) {
    let path = input_file(args);
    if !Path::new(&path).is_file() {
        print_error(&format!("file not found: {path}"));
        exit(1);
    }

    let file = parse_source(&path);
    let interpreter = Interpreter::new(&file);
    match interpreter.run_main() {
        Ok(_) => {}
        Err(error) => {
            print_error(&format!("runtime error: {error}"));
            exit(4);
        }
    }
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
