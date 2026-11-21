//! Lower the statically typed, synchronous subset to a standalone host executable.
use blyx_ast::{BinOp, Block, BlyxFile, BlyxType, Expr, Item, Lit, Stmt, UnOp};
use std::{
    collections::{HashMap, HashSet},
    fs,
    io::Write,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

type Lowered = Result<String, String>;

fn ty(t: &BlyxType) -> Lowered {
    Ok(match t {
        BlyxType::I64 => "i64",
        BlyxType::F64 => "f64",
        BlyxType::Bool => "bool",
        BlyxType::Str | BlyxType::String => "String",
        BlyxType::Named(n, _) if n == "arglist" => "ArgList",
        BlyxType::Named(n, _) if n == "vector" => "Vector",
        BlyxType::Unit => "()",
        other => return Err(format!("unsupported native type {other:?}")),
    }
    .into())
}

fn operator(op: BinOp) -> Lowered {
    Ok(match op {
        BinOp::Add => "+",
        BinOp::Sub => "-",
        BinOp::Mul => "*",
        BinOp::Div => "/",
        BinOp::Rem => "%",
        BinOp::Eq => "==",
        BinOp::Ne => "!=",
        BinOp::Lt => "<",
        BinOp::Le => "<=",
        BinOp::Gt => ">",
        BinOp::Ge => ">=",
        BinOp::And => "&&",
        BinOp::Or => "||",
        _ => return Err(format!("unsupported native operator {op:?}")),
    }
    .into())
}

struct Lowerer<'a> {
    functions: HashMap<String, String>,
    imports: HashSet<&'a str>,
}

impl Lowerer<'_> {
    fn block(&self, block: &Block) -> Lowered {
        let mut code = String::from("{\n");
        for (index, stmt) in block.stmts.iter().enumerate() {
            let s = match stmt {
                Stmt::Let { name, is_mut, value: Some(value), ty: annotation, .. } => {
                    let mutable = if *is_mut { "mut " } else { "" };
                    let annotation = annotation
                        .as_ref()
                        .map(ty)
                        .transpose()?
                        .map(|t| format!(": {t}"))
                        .unwrap_or_default();
                    format!("let {mutable}v_{name}{annotation} = {};", self.expr(value)?)
                }
                Stmt::Expr(e) if index + 1 == block.stmts.len() => self.expr(e)?,
                Stmt::Semi(e) | Stmt::Expr(e) => format!("{};", self.expr(e)?),
                Stmt::Return(e, _) | Stmt::Break(e, _) => {
                    let keyword = if matches!(stmt, Stmt::Return(..)) { "return" } else { "break" };
                    let value = e.as_ref().map(|x| self.expr(x)).transpose()?.unwrap_or_default();
                    format!("{keyword} {value};")
                }
                Stmt::Continue(_) => "continue;".into(),
                _ => {
                    return Err(
                        "native build requires initialized bindings and top-level functions".into(),
                    );
                }
            };
            code.push_str(&s);
            code.push('\n');
        }
        code.push('}');
        Ok(code)
    }

    fn expr(&self, e: &Expr) -> Lowered {
        Ok(match e {
            Expr::Literal(l, _) => match l {
                Lit::Int(n) => format!(
                    "{}i64",
                    i64::try_from(*n).map_err(|_| "integer literal exceeds i64 range")?
                ),
                Lit::Float(n) => format!("f64::from_bits({})", n.to_bits()),
                Lit::Bool(b) => b.to_string(),
                Lit::String(s) => format!("String::from({s:?})"),
                Lit::Char(c) => format!("String::from({:?})", c.to_string()),
            },
            Expr::Ident(name, _) => format!("v_{name}.clone()"),
            Expr::ArrayLit(items, _) => {
                let vals = items
                    .iter()
                    .map(|e| Ok(format!("number({})", self.expr(e)?)))
                    .collect::<Result<Vec<_>, String>>()?;
                format!("Vector::from(vec![{}])", vals.join(","))
            }
            Expr::Neg(x, _) if matches!(x.as_ref(), Expr::Literal(Lit::Int(n), _) if *n == 1u64 << 63) => {
                "i64::MIN".into()
            }
            Expr::Neg(x, _) | Expr::Unary(UnOp::Neg, x, _) => format!("(-({}))", self.expr(x)?),
            Expr::Unary(UnOp::Not, x, _) => format!("(!boolean({}))", self.expr(x)?),
            Expr::Binary(op, a, b, _) => {
                format!("({} {} {})", self.expr(a)?, operator(*op)?, self.expr(b)?)
            }
            Expr::Assign { target, value, .. } | Expr::AssignOp { target, value, .. } => {
                let Expr::Ident(n, _) = target.as_ref() else {
                    return Err("assignment requires a variable".into());
                };
                let value = self.expr(value)?;
                match e {
                    Expr::AssignOp { op, .. } => format!(
                        "{{let old=v_{n}.clone(); let rhs={value}; v_{n}=old {} rhs;}}",
                        operator(*op)?
                    ),
                    _ => format!("{{v_{n}={value};}}"),
                }
            }
            Expr::Block(b) => self.block(b)?,
            Expr::If { cond, then_branch, else_branch, .. } => {
                let fallback = else_branch
                    .as_ref()
                    .map(|e| self.expr(e))
                    .transpose()?
                    .map(|e| format!(" else {{ {e} }}"))
                    .unwrap_or_default();
                format!("if {} {}{fallback}", self.expr(cond)?, self.block(then_branch)?)
            }
            Expr::While { cond, body, .. } => {
                format!("while {} {{ {}; }}", self.expr(cond)?, self.block(body)?)
            }
            Expr::Loop { body, label: None, .. } => format!("loop {{ {}; }}", self.block(body)?),
            Expr::Call(callee, args, _) => {
                let Expr::Ident(name, _) = callee.as_ref() else {
                    return Err("native calls require a function name".into());
                };
                let args = args.iter().map(|e| self.expr(e)).collect::<Result<Vec<_>, _>>()?;
                if matches!(name.as_str(), "print!" | "println!") {
                    if args.len() > 1 {
                        return Err("print accepts at most one expression".into());
                    }
                    let value = args.first().map(String::as_str).unwrap_or("()");
                    format!(
                        "{{emit({value}); {}}}",
                        if name == "println!" { "println!();" } else { "" }
                    )
                } else if let Some(symbol) = self.functions.get(name.as_str()) {
                    format!("{symbol}({})", args.join(","))
                } else if matches!(name.as_str(), "len" | "sum" | "at" | "dot") {
                    format!("{name}({})", args.join(","))
                } else if let Some(module) = host_module(name) {
                    if !self.imports.contains(module) {
                        return Err(format!("'{name}' requires use {module};"));
                    }
                    format!("{name}({})", args.join(","))
                } else {
                    return Err(format!("unknown function '{name}'"));
                }
            }
            _ => return Err("expression is outside the native build subset".into()),
        })
    }
}

fn host_module(name: &str) -> Option<&'static str> {
    Some(match name {
        "cli_args" | "args_new" | "args_len" | "args_at" | "args_item" | "args_tail"
        | "args_push" | "args_concat" | "args_join" | "env_get" | "exe_dir" | "stdout_terminal"
        | "stderr_line" | "process_run" | "process_exec" | "process_exit" => "std::cli",
        "text_starts" | "text_ends" | "text_concat" | "text_before" | "text_after"
        | "text_lines" | "text_split" | "text_trim" | "text_is_number" | "text_number"
        | "int_text" => "std::text",
        "path_join" | "is_file" | "read_text" => "std::fs",
        _ => return None,
    })
}

#[derive(Default)]
struct ModuleGraph {
    exports: HashMap<PathBuf, HashMap<String, String>>,
    visiting: HashSet<PathBuf>,
    code: String,
    next_id: usize,
    uses_host: bool,
}

impl ModuleGraph {
    fn compile(&mut self, file: &BlyxFile, path: &Path, root: bool) -> Result<(), String> {
        if self.exports.contains_key(path) {
            return Ok(());
        }
        if !self.visiting.insert(path.to_owned()) {
            return Err(format!("cyclic native import at {}", path.display()));
        }
        if self.visiting.len() > 64 {
            return Err("native import depth exceeds 64".into());
        }
        let id = self.next_id;
        self.next_id += 1;
        let mut symbols = HashMap::new();
        let mut public = HashMap::new();
        let mut imports = HashSet::new();
        let mut functions = Vec::new();
        let mut has_main = false;
        for item in &file.items {
            match item {
                Item::Fn(f) | Item::Function(f) if !f.is_async && f.generics.is_empty() => {
                    let symbol = format!("f_{id}_{}", f.name);
                    if symbols.insert(f.name.clone(), symbol.clone()).is_some() {
                        return Err(format!("duplicate function '{}'", f.name));
                    }
                    if f.is_pub {
                        public.insert(f.name.clone(), symbol);
                    }
                    if f.name == "main" && f.params.is_empty() {
                        has_main = true;
                    }
                    functions.push(f);
                }
                Item::Use(u) if matches!(u.path.as_str(), "std::cli" | "std::fs" | "std::text") => {
                    self.uses_host = true;
                    imports.insert(u.path.as_str());
                }
                Item::Use(u) => {
                    if u.path.is_empty() || u.path.starts_with("std::") {
                        return Err(format!("unknown native import '{}'", u.path));
                    }
                    let mut dependency = path.parent().unwrap().to_owned();
                    dependency.extend(u.path.split("::"));
                    dependency.set_extension("blyx");
                    let dependency = dependency
                        .canonicalize()
                        .map_err(|e| format!("cannot import {}: {e}", dependency.display()))?;
                    if !self.exports.contains_key(&dependency) {
                        let source = fs::read_to_string(&dependency).map_err(|e| e.to_string())?;
                        let display = dependency.to_string_lossy();
                        let mut parser = blyx_parser::BlyxParser::with_file(&source, &display);
                        let parsed = parser.parse_file(&display);
                        if let Some(err) = parser.errors().first() {
                            return Err(format!(
                                "{display}:{}:{}: {}",
                                err.span.line, err.span.column, err.message
                            ));
                        }
                        self.compile(&parsed, &dependency, false)?;
                    }
                    for (name, symbol) in &self.exports[&dependency] {
                        if symbols.insert(name.clone(), symbol.clone()).is_some() {
                            return Err(format!("duplicate imported or local function '{name}'"));
                        }
                    }
                }
                _ => {
                    return Err(
                        "native build supports imports and synchronous, non-generic functions"
                            .into(),
                    );
                }
            }
        }
        if root && !has_main {
            return Err("native build requires fn main()".into());
        }
        let lowerer = Lowerer { functions: symbols, imports };
        for f in functions {
            let params = f
                .params
                .iter()
                .map(|p| Ok(format!("v_{}: {}", p.name, ty(&p.ty)?)))
                .collect::<Result<Vec<_>, String>>()?;
            let result = f.return_type.as_ref().map(ty).transpose()?.unwrap_or_else(|| "()".into());
            self.code.push_str(&format!(
                "\nfn {}({}) -> {result} {}\n",
                lowerer.functions[&f.name],
                params.join(","),
                lowerer.block(&f.body)?
            ));
        }
        self.visiting.remove(path);
        self.exports.insert(path.to_owned(), public);
        Ok(())
    }
}

pub fn build(file: &BlyxFile, input: &Path, output: &Path) -> Result<(), String> {
    let mut graph = ModuleGraph::default();
    graph.compile(file, &input.canonicalize().map_err(|e| e.to_string())?, true)?;
    if output.canonicalize().is_ok_and(|p| graph.exports.contains_key(&p)) {
        return Err("output path would replace the source file".into());
    }
    let mut code = String::from(include_str!("native_prelude.txt"));
    if graph.uses_host {
        code.push_str(include_str!("native_host.rs.inc"));
    }
    code.push_str(&graph.code);
    code.push_str("fn main() { let _ = f_0_main(); }\n");
    let parent = output.parent().filter(|p| !p.as_os_str().is_empty()).unwrap_or(Path::new("."));
    let temp = tempfile::tempdir_in(parent).map_err(|e| e.to_string())?;
    let executable = temp.path().join(format!("program{}", std::env::consts::EXE_SUFFIX));
    let mut child = Command::new("rustc")
        .args([
            "--edition=2024",
            "--crate-name",
            "blyx_program",
            "-C",
            "opt-level=3",
            "-C",
            "overflow-checks=on",
            "-C",
            "strip=symbols",
            "-A",
            "warnings",
            "-o",
        ])
        .arg(&executable)
        .arg("-")
        .stdin(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("native build requires rustc and a host linker: {e}"))?;
    let write_result = child.stdin.take().unwrap().write_all(code.as_bytes());
    let result = child.wait_with_output().map_err(|e| e.to_string())?;
    if !result.status.success() {
        return Err(format!(
            "native compilation failed (value-returning functions need an explicit -> type):\n{}",
            String::from_utf8_lossy(&result.stderr)
        ));
    }
    write_result.map_err(|e| e.to_string())?;
    fs::rename(executable, output).map_err(|e| format!("cannot install executable: {e}"))
}
