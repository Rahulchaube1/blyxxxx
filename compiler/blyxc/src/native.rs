//! Lower the statically typed, synchronous subset to a standalone host executable.
use blyx_ast::{BinOp, Block, BlyxFile, BlyxType, Expr, Item, Lit, Stmt, UnOp};
use std::{
    fs,
    io::Write,
    path::Path,
    process::{Command, Stdio},
};

type Lowered = Result<String, String>;

fn ty(t: &BlyxType) -> Lowered {
    Ok(match t {
        BlyxType::I64 => "i64",
        BlyxType::F64 => "f64",
        BlyxType::Bool => "bool",
        BlyxType::Str | BlyxType::String => "&'static str",
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
    functions: std::collections::HashSet<&'a str>,
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
                Lit::String(s) => format!("{s:?}"),
                Lit::Char(c) => format!("{:?}", c.to_string()),
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
                } else if self.functions.contains(name.as_str()) {
                    format!("f_{name}({})", args.join(","))
                } else if matches!(name.as_str(), "len" | "sum" | "at" | "dot") {
                    format!("{name}({})", args.join(","))
                } else {
                    return Err(format!("unknown function '{name}'"));
                }
            }
            _ => return Err("expression is outside the native build subset".into()),
        })
    }
}

fn lower(file: &BlyxFile) -> Lowered {
    let mut functions = Vec::new();
    for item in &file.items {
        match item {
            Item::Fn(f) | Item::Function(f) if !f.is_async && f.generics.is_empty() => {
                functions.push(f)
            }
            _ => return Err("native build supports synchronous, non-generic functions".into()),
        }
    }
    let lowerer = Lowerer { functions: functions.iter().map(|f| f.name.as_str()).collect() };
    if !functions.iter().any(|f| f.name == "main" && f.params.is_empty()) {
        return Err("native build requires fn main()".into());
    }
    let mut code = String::from(include_str!("native_prelude.txt"));
    for f in functions {
        let params = f
            .params
            .iter()
            .map(|p| Ok(format!("v_{}: {}", p.name, ty(&p.ty)?)))
            .collect::<Result<Vec<_>, String>>()?;
        let result = f.return_type.as_ref().map(ty).transpose()?.unwrap_or_else(|| "()".into());
        code.push_str(&format!(
            "\nfn f_{}({}) -> {result} {}\n",
            f.name,
            params.join(","),
            lowerer.block(&f.body)?
        ));
    }
    code.push_str("fn main() { let _ = f_main(); }\n");
    Ok(code)
}

pub fn build(file: &BlyxFile, input: &Path, output: &Path) -> Result<(), String> {
    let code = lower(file)?;
    if input.canonicalize().ok() == output.canonicalize().ok() {
        return Err("output path would replace the source file".into());
    }
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
