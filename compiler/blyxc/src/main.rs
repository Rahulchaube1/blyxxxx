use std::collections::HashMap;
use std::cell::Cell;
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
    println!("  run <file.blyx> [--max-steps N]  Interpret with a bounded execution budget");
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

// Preserve non-local control flow through expression evaluation.
macro_rules! value_or_return {
    ($flow:expr) => {
        match $flow? {
            Flow::Value(value) => value,
            flow => return Ok(flow),
        }
    };
}

#[derive(Debug)]
struct Binding {
    value: Value,
    is_mut: bool,
}

#[derive(Default)]
struct Env {
    scopes: Vec<HashMap<String, Binding>>,
    loop_depth: usize,
}

impl Env {
    fn new() -> Self { Self { scopes: vec![HashMap::new()], loop_depth: 0 } }

    fn define(&mut self, name: String, value: Value, is_mut: bool) {
        self.scopes.last_mut().expect("function scope exists").insert(name, Binding { value, is_mut });
    }

    fn binding(&self, name: &str) -> Result<&Binding, String> {
        self.scopes.iter().rev().find_map(|scope| scope.get(name))
            .ok_or_else(|| format!("unknown variable '{name}'"))
    }

    fn get(&self, name: &str) -> Option<&Value> {
        self.binding(name).ok().map(|binding| &binding.value)
    }

    fn assign(&mut self, name: &str, value: Value) -> Result<(), String> {
        let binding = self.scopes.iter_mut().rev().find_map(|scope| scope.get_mut(name))
            .ok_or_else(|| format!("unknown variable '{name}'"))?;
        if !binding.is_mut {
            return Err(format!("cannot assign to immutable variable '{name}'; use let mut"));
        }
        if std::mem::discriminant(&binding.value) != std::mem::discriminant(&value) {
            return Err(format!("assignment to '{name}' cannot change its value type"));
        }
        binding.value = value;
        Ok(())
    }
}

const DEFAULT_MAX_STEPS: u64 = 1_000_000;
const MAX_CALL_DEPTH: usize = 64;

struct Interpreter<'a> {
    functions: HashMap<String, &'a FnDef>,
    steps_left: Cell<u64>,
    call_depth: Cell<usize>,
}

#[derive(Debug)]
enum Flow {
    Value(Value),
    Return(Value),
    Break(Option<Value>),
    Continue,
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
        Self { functions, steps_left: Cell::new(DEFAULT_MAX_STEPS), call_depth: Cell::new(0) }
    }

    fn tick(&self) -> Result<(), String> {
        let remaining = self.steps_left.get().checked_sub(1)
            .ok_or("execution step limit exceeded; use --max-steps <positive integer> for a larger budget")?;
        self.steps_left.set(remaining);
        Ok(())
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

        if self.call_depth.get() >= MAX_CALL_DEPTH {
            return Err(format!("function call depth limit ({MAX_CALL_DEPTH}) exceeded"));
        }
        let mut env = Env::new();
        for (param, value) in function.params.iter().zip(args) {
            env.define(param.name.clone(), value, false);
        }

        self.call_depth.set(self.call_depth.get() + 1);
        let result = self.eval_block(&function.body, &mut env);
        self.call_depth.set(self.call_depth.get() - 1);
        match result? {
            Flow::Value(value) | Flow::Return(value) => Ok(value),
            Flow::Break(_) | Flow::Continue => Err("loop control cannot cross a function boundary".into()),
        }
    }

    fn eval_block(&self, block: &Block, env: &mut Env) -> Result<Flow, String> {
        self.tick()?;
        env.scopes.push(HashMap::new());
        let result = (|| {
            let mut last = Value::Unit;
            for stmt in &block.stmts {
                match self.eval_stmt(stmt, env)? {
                    Flow::Value(value) => last = value,
                    flow => return Ok(flow),
                }
            }
            Ok(Flow::Value(last))
        })();
        // Pop on success, return, break, continue and runtime errors alike.
        env.scopes.pop();
        result
    }

    fn eval_loop(&self, condition: Option<&Expr>, body: &Block, env: &mut Env) -> Result<Flow, String> {
        env.loop_depth += 1;
        let result = (|| {
            loop {
                self.tick()?;
                if let Some(condition) = condition {
                    match self.eval_expr(condition, env)? {
                        Flow::Value(value) => if !value.as_bool()? { return Ok(Flow::Value(Value::Unit)); },
                        Flow::Return(value) => return Ok(Flow::Return(value)),
                        Flow::Break(None) => return Ok(Flow::Value(Value::Unit)),
                        Flow::Break(Some(_)) => return Err("break with a value is only supported in loop, not while".into()),
                        Flow::Continue => continue,
                    }
                }
                match self.eval_block(body, env)? {
                    Flow::Value(_) | Flow::Continue => {},
                    Flow::Return(value) => return Ok(Flow::Return(value)),
                    Flow::Break(value) => {
                        if condition.is_some() && value.is_some() {
                            return Err("break with a value is only supported in loop, not while".into());
                        }
                        return Ok(Flow::Value(value.unwrap_or(Value::Unit)));
                    }
                }
            }
        })();
        env.loop_depth -= 1;
        result
    }

    fn eval_stmt(&self, stmt: &Stmt, env: &mut Env) -> Result<Flow, String> {
        match stmt {
            Stmt::Let { name, is_mut, value, .. } => {
                let value = match value {
                    Some(expr) => value_or_return!(self.eval_expr(expr, env)),
                    None => return Err(format!("variable '{name}' requires an initializer")),
                };
                env.define(name.clone(), value, *is_mut);
                Ok(Flow::Value(Value::Unit))
            }
            Stmt::Expr(expr) => self.eval_expr(expr, env),
            Stmt::Semi(expr) => {
                value_or_return!(self.eval_expr(expr, env));
                Ok(Flow::Value(Value::Unit))
            }
            Stmt::Return(expr, _) => {
                let value = match expr {
                    Some(expr) => value_or_return!(self.eval_expr(expr, env)),
                    None => Value::Unit,
                };
                Ok(Flow::Return(value))
            }
            Stmt::Break(value, _) => {
                if env.loop_depth == 0 { return Err("break outside a loop".into()); }
                let value = match value {
                    Some(expr) => Some(value_or_return!(self.eval_expr(expr, env))),
                    None => None,
                };
                Ok(Flow::Break(value))
            }
            Stmt::Continue(_) => {
                if env.loop_depth == 0 { return Err("continue outside a loop".into()); }
                Ok(Flow::Continue)
            }
            Stmt::Item(_) => {
                Err("nested item execution is not supported by the alpha interpreter yet"
                    .to_string())
            }
        }
    }

    fn eval_expr(&self, expr: &Expr, env: &mut Env) -> Result<Flow, String> {
        self.tick()?;
        match expr {
            Expr::While { cond, body, .. } => self.eval_loop(Some(cond), body, env),
            Expr::Loop { body, label: None, .. } => self.eval_loop(None, body, env),
            Expr::Assign { target, value, .. } | Expr::AssignOp { target, value, .. } => {
                let Expr::Ident(name, _) = target.as_ref() else {
                    return Err("assignment target must be a variable".into());
                };
                if !env.binding(name)?.is_mut {
                    return Err(format!("cannot assign to immutable variable '{name}'; use let mut"));
                }
                // Read compound-assignment LHS before evaluating its RHS (left-to-right).
                let previous = env.binding(name)?.value.clone();
                let mut value = value_or_return!(self.eval_expr(value, env));
                if let Expr::AssignOp { op, .. } = expr {
                    value = self.binary(*op, previous, value)?;
                }
                env.assign(name, value)?;
                Ok(Flow::Value(Value::Unit))
            }
            Expr::Literal(lit, _) => Ok(Flow::Value(match lit {
                Lit::Int(value) => Value::Int(i64::try_from(*value).map_err(|_| "integer literal exceeds i64 range")?),
                Lit::Float(value) => {
                    return Err(format!(
                        "floating-point execution is not implemented yet: {value}"
                    ));
                }
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
                let left = value_or_return!(self.eval_expr(left, env));
                if matches!(op, BinOp::And) && !left.as_bool()? {
                    return Ok(Flow::Value(Value::Bool(false)));
                }
                if matches!(op, BinOp::Or) && left.as_bool()? {
                    return Ok(Flow::Value(Value::Bool(true)));
                }
                let right = value_or_return!(self.eval_expr(right, env));
                Ok(Flow::Value(self.binary(*op, left, right)?))
            }
            Expr::Call(callee, args, _) => {
                let name = match callee.as_ref() {
                    Expr::Ident(name, _) => name,
                    Expr::Path { segments, .. } if segments.len() == 1 => &segments[0],
                    _ => {
                        return Err(
                            "only direct function calls are supported by the alpha interpreter"
                                .to_string(),
                        );
                    }
                };
                if name == "print!" || name == "println!" {
                    if args.len() > 1 {
                        return Err("print macros currently accept zero or one expression".into());
                    }
                    let output = match args.first() {
                        Some(arg) => value_or_return!(self.eval_expr(arg, env)).display(),
                        None => String::new(),
                    };
                    if name == "println!" {
                        println!("{output}");
                    } else {
                        print!("{output}");
                    }
                    return Ok(Flow::Value(Value::Unit));
                }
                let function =
                    self.functions.get(name).ok_or_else(|| format!("unknown function '{name}'"))?;
                let mut values = Vec::with_capacity(args.len());
                for arg in args {
                    values.push(value_or_return!(self.eval_expr(arg, env)));
                }
                Ok(Flow::Value(self.call_function(function, values)?))
            }
            Expr::If { cond, then_branch, else_branch, .. } => {
                let condition = value_or_return!(self.eval_expr(cond, env)).as_bool()?;
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
                    return Err(format!(
                        "macro '{name}!' is not supported by the alpha interpreter"
                    ));
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
                if matches!(inner.as_ref(), Expr::Literal(Lit::Int(value), _) if *value == (1u64 << 63)) {
                    return Ok(Flow::Value(Value::Int(i64::MIN)));
                }
                let value = value_or_return!(self.eval_expr(inner, env)).as_int()?;
                Ok(Flow::Value(Value::Int(value.checked_neg().ok_or("integer overflow")?)))
            }
            Expr::Unary(op, inner, _) => {
                let value = value_or_return!(self.eval_expr(inner, env));
                match op {
                    blyx_ast::UnOp::Neg => Ok(Flow::Value(Value::Int(
                        value.as_int()?.checked_neg().ok_or("integer overflow")?,
                    ))),
                    blyx_ast::UnOp::Not => Ok(Flow::Value(Value::Bool(!value.as_bool()?))),
                    _ => Err("references/dereferences are not supported by the alpha interpreter"
                        .to_string()),
                }
            }
            _ => Err(format!("expression kind {expr:?} is not supported by the alpha interpreter")),
        }
    }

    fn binary(&self, op: BinOp, left: Value, right: Value) -> Result<Value, String> {
        match op {
            BinOp::Add => Ok(Value::Int(
                left.as_int()?
                    .checked_add(right.as_int()?)
                    .ok_or("integer overflow or division by zero")?,
            )),
            BinOp::Sub => Ok(Value::Int(
                left.as_int()?
                    .checked_sub(right.as_int()?)
                    .ok_or("integer overflow or division by zero")?,
            )),
            BinOp::Mul => Ok(Value::Int(
                left.as_int()?
                    .checked_mul(right.as_int()?)
                    .ok_or("integer overflow or division by zero")?,
            )),
            BinOp::Div => Ok(Value::Int(
                left.as_int()?
                    .checked_div(right.as_int()?)
                    .ok_or("integer overflow or division by zero")?,
            )),
            BinOp::Rem => Ok(Value::Int(
                left.as_int()?
                    .checked_rem(right.as_int()?)
                    .ok_or("integer overflow or division by zero")?,
            )),
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
        env.get(text).cloned().ok_or_else(|| format!("unknown value '{text}' in print macro"))
    }
}

fn cmd_run(args: &[String]) {
    let path = input_file(args);
    if !Path::new(&path).is_file() {
        print_error(&format!("file not found: {path}"));
        exit(1);
    }

    let max_steps = match &args[1..] {
        [] => DEFAULT_MAX_STEPS,
        [flag, value] if flag == "--max-steps" => match value.parse::<u64>() {
            Ok(value) if value > 0 => value,
            _ => { print_error("--max-steps requires a positive integer"); exit(2); }
        },
        _ => { print_error("usage: blyxc run <file.blyx> [--max-steps <positive integer>]"); exit(2); }
    };
    let file = parse_source(&path);
    let interpreter = Interpreter::new(&file);
    interpreter.steps_left.set(max_steps);
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

#[cfg(test)]
mod tests {
    use super::*;

    fn run(source: &str) -> Result<Value, String> {
        let mut parser = BlyxParser::new(source);
        let file = parser.parse_file("test.blyx");
        assert!(!parser.has_errors(), "{:?}", parser.errors());
        Interpreter::new(&file).run_main()
    }

    #[test]
    fn executes_bindings_and_recursive_functions() {
        assert_eq!(run("fn fib(n: i64) { if n < 2 { return n; } return fib(n - 1) + fib(n - 2); } fn main() { let answer = fib(10); return answer; }").unwrap(), Value::Int(55));
    }

    #[test]
    fn short_circuits_boolean_expressions() {
        assert_eq!(run("fn main() { return false && (1 / 0 == 0); }").unwrap(), Value::Bool(false));
        assert_eq!(run("fn main() { return true || missing(); }").unwrap(), Value::Bool(true));
        assert!(run("fn main() { return true && 1; }").is_err());
    }

    #[test]
    fn arithmetic_errors_do_not_panic() {
        for expression in [
            "1 / 0",
            "1 % 0",
            "9223372036854775807 + 1",
            "9223372036854775807 * 2",
            "(-9223372036854775807 - 1) / -1",
            "-(-9223372036854775807 - 1)",
        ] {
            assert!(run(&format!("fn main() {{ return {expression}; }}")).is_err(), "{expression}");
        }
    }

    #[test]
    fn block_bindings_do_not_leak() {
        assert_eq!(
            run("fn main() { let x = 7; if true { let x = 9; } return x; }").unwrap(),
            Value::Int(7)
        );
        assert!(run("fn main() { if true { let hidden = 9; } return hidden; }").is_err());
    }

    #[test]
    fn nested_returns_escape_expressions() {
        for source in [
            "fn main() { let x = { return 42; }; return 0; }",
            "fn main() { return 1 + { return 42; }; }",
            "fn identity(x: i64) { return x; } fn main() { identity({ return 42; }); return 0; }",
        ] {
            assert_eq!(run(source).unwrap(), Value::Int(42));
        }
    }

    #[test]
    fn print_macros_evaluate_expressions() {
        assert_eq!(run("fn main() { println!(\"Hello, Blyx!\"); println!(1 + 2); print!(true); println!(); }").unwrap(), Value::Unit);
        assert!(run("fn main() { println!(missing); }").is_err());
        assert!(run("fn main() { println!(1, 2); }").is_err());
    }
}


#[cfg(test)]
mod control_flow_tests {
    use super::*;

    fn execute(source: &str, budget: u64) -> Result<Value, String> {
        let mut parser = BlyxParser::new(source);
        let file = parser.parse_file("control-flow.blyx");
        assert!(!parser.has_errors(), "{:?}", parser.errors());
        let interpreter = Interpreter::new(&file);
        interpreter.steps_left.set(budget);
        interpreter.run_main()
    }

    fn run(source: &str) -> Result<Value, String> { execute(source, DEFAULT_MAX_STEPS) }

    #[test]
    fn while_updates_outer_bindings() {
        assert_eq!(run("fn main() { let mut n = 0; let mut sum = 0; while n < 10 { n += 1; sum += n; } sum }").unwrap(), Value::Int(55));
    }

    #[test]
    fn assignment_precedence_and_compound_operations() {
        assert_eq!(run("fn main() { let mut n = 0; n = 2 + 3 * 4; n -= 2; n *= 3; n /= 4; n %= 5; n }").unwrap(), Value::Int(4));
        assert_eq!(run("fn main() { let mut n = 2; n += { n = 10; 3 }; n }").unwrap(), Value::Int(5));
    }

    #[test]
    fn mutation_respects_shadowing_and_block_lifetime() {
        assert_eq!(run("fn main() { let mut x = 1; { x = 2; let mut x = 8; x += 1; } x }").unwrap(), Value::Int(2));
        assert!(run("fn main() { let mut x = 1; { let x = 2; x = 3; } }").unwrap_err().contains("immutable"));
        assert!(run("fn main() { loop { let local = 1; break; } local }").unwrap_err().contains("unknown variable"));
    }

    #[test]
    fn invalid_assignments_are_errors() {
        for (source, message) in [
            ("fn main() { let x = 1; x = 2; }", "immutable"),
            ("fn main() { x = 2; }", "unknown variable"),
            ("fn main() { let mut x = 1; x = true; }", "value type"),
            ("fn main() { let mut x: i64; x = 1; }", "initializer"),
            ("fn main() { let mut x = 1; x /= 0; }", "division by zero"),
            ("fn main() { let mut x = 9223372036854775807; x += 1; }", "overflow"),
        ] { assert!(run(source).unwrap_err().contains(message), "{source}"); }
    }

    #[test]
    fn continue_and_break_target_innermost_loop() {
        assert_eq!(run("fn main() { let mut i = 0; let mut sum = 0; while i < 10 { i += 1; if i % 2 == 0 { continue; } if i > 7 { break; } sum += i; } sum }").unwrap(), Value::Int(16));
        assert_eq!(run("fn main() { let mut i = 0; let mut count = 0; while i < 3 { i += 1; loop { count += 1; break; } } count }").unwrap(), Value::Int(3));
    }

    #[test]
    fn loop_returns_break_value_and_while_returns_unit() {
        assert_eq!(run("fn main() { let answer = loop { break 42; }; answer }").unwrap(), Value::Int(42));
        assert_eq!(run("fn main() { while false { missing(); } }").unwrap(), Value::Unit);
        assert!(run("fn main() { while true { break 1; } }").unwrap_err().contains("only supported in loop"));
        assert!(run("fn main() { while 1 {} }").unwrap_err().contains("boolean"));
    }

    #[test]
    fn control_flow_propagates_through_nested_expressions() {
        assert_eq!(run("fn main() { loop { let x = { break 42; }; } }").unwrap(), Value::Int(42));
        assert_eq!(run("fn main() { loop { while true { return 7; } } }").unwrap(), Value::Int(7));
        assert_eq!(run("fn main() { let mut i = 0; loop { i += 1; if i < 3 { let x = { continue; }; } break i; } }").unwrap(), Value::Int(3));
    }

    #[test]
    fn loop_control_cannot_escape_a_function() {
        for source in [
            "fn main() { break; }",
            "fn main() { continue; }",
            "fn helper() { break; } fn main() { loop { helper(); } }",
            "fn helper() { continue; } fn main() { loop { helper(); } }",
        ] { assert!(run(source).unwrap_err().contains("outside a loop")); }
    }

    #[test]
    fn semicolons_discard_values_but_not_control_flow() {
        assert_eq!(run("fn main() { 42 }").unwrap(), Value::Int(42));
        assert_eq!(run("fn main() { 42; }").unwrap(), Value::Unit);
        assert_eq!(run("fn main() { { return 42; }; }").unwrap(), Value::Int(42));
        assert_eq!(run("fn main() { let mut x = 0; x = 42 }").unwrap(), Value::Unit);
    }

    #[test]
    fn execution_budget_stops_empty_and_nonempty_infinite_loops() {
        for source in ["fn main() { loop {} }", "fn main() { while true { continue; } }", "fn main() { while { continue; } {} }"] {
            assert!(execute(source, 50).unwrap_err().contains("step limit"));
        }
    }

    #[test]
    fn recursion_is_bounded_and_counters_are_restored() {
        assert!(run("fn recurse() { recurse() } fn main() { recurse() }").unwrap_err().contains("call depth"));
        let mut parser = BlyxParser::new("fn main() { loop { let local = 1; missing(); } }");
        let file = parser.parse_file("test.blyx");
        let interpreter = Interpreter::new(&file);
        let main = interpreter.functions["main"];
        let mut env = Env::new();
        assert!(interpreter.eval_block(&main.body, &mut env).is_err());
        assert_eq!(env.scopes.len(), 1);
        assert_eq!(env.loop_depth, 0);
        assert!(interpreter.run_main().is_err());
        assert_eq!(interpreter.call_depth.get(), 0);
    }

    #[test]
    fn signed_integer_boundaries_are_checked() {
        assert_eq!(run("fn main() { -9223372036854775808 }").unwrap(), Value::Int(i64::MIN));
        assert!(run("fn main() { 9223372036854775808 }").unwrap_err().contains("i64 range"));
        assert!(run("fn main() { -9223372036854775808 / -1 }").unwrap_err().contains("overflow"));
    }
}
