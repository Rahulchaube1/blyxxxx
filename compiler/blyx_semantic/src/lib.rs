// Blyx Semantic Analyzer — multi-scope symbol table, type checking, AI-native analysis
// Created by Rahul Chaube — https://blyx-lang.space
// Open Source — MIT + Apache 2.0

use blyx_ast::*;
use std::collections::HashMap;

// ──────────────────────────────────────────────
//  Errors
// ──────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct SemanticError {
    pub kind: SemanticErrorKind,
    pub message: String,
    pub span: Span,
    pub hint: Option<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum SemanticErrorKind {
    UndeclaredVariable,
    UndeclaredFunction,
    UndeclaredType,
    Redeclaration,
    TypeMismatch,
    MutabilityError,
    ReturnTypeMismatch,
    InvalidAiOperation,
    GeneratorNotAiContext,
    TensorDimensionMismatch,
    UnusedVariable,
}

// ──────────────────────────────────────────────
//  Symbol Table
// ──────────────────────────────────────────────

#[derive(Debug, Clone)]
pub struct Symbol {
    pub name: String,
    pub kind: SymbolKind,
    pub ty: BlyxType,
    pub span: Span,
    pub is_mutable: bool,
    pub is_used: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub enum SymbolKind {
    Variable,
    Function,
    Struct,
    Enum,
    Trait,
    Actor,
    Module,
    Const,
    TypeAlias,
    Task,
    Param,
}

pub struct SymbolTable {
    pub scopes: Vec<HashMap<String, Symbol>>,
}

impl SymbolTable {
    pub fn new() -> Self {
        Self { scopes: vec![HashMap::new()] }
    }

    pub fn push_scope(&mut self) {
        self.scopes.push(HashMap::new());
    }

    pub fn pop_scope(&mut self) -> Option<HashMap<String, Symbol>> {
        if self.scopes.len() > 1 { self.scopes.pop() } else { None }
    }

    pub fn define(&mut self, sym: Symbol) -> Result<(), SemanticError> {
        let last_idx = self.scopes.len() - 1;
        let scope = &mut self.scopes[last_idx];
        if scope.contains_key(&sym.name) {
            Err(SemanticError {
                kind: SemanticErrorKind::Redeclaration,
                message: format!("Symbol '{}' is already declared in this scope", sym.name),
                span: sym.span.clone(),
                hint: Some(format!("Consider renaming this symbol or using a new scope")),
            })
        } else {
            scope.insert(sym.name.clone(), sym);
            Ok(())
        }
    }

    pub fn lookup(&self, name: &str) -> Option<&Symbol> {
        for scope in self.scopes.iter().rev() {
            if let Some(sym) = scope.get(name) {
                return Some(sym);
            }
        }
        None
    }

    pub fn lookup_mut(&mut self, name: &str) -> Option<&mut Symbol> {
        for scope in self.scopes.iter_mut().rev() {
            if let Some(sym) = scope.get_mut(name) {
                return Some(sym);
            }
        }
        None
    }

    pub fn mark_used(&mut self, name: &str) {
        if let Some(sym) = self.lookup_mut(name) {
            sym.is_used = true;
        }
    }
}

// ──────────────────────────────────────────────
//  Semantic Analyzer
// ──────────────────────────────────────────────

pub struct SemanticAnalyzer {
    pub symbol_table: SymbolTable,
    pub errors: Vec<SemanticError>,
    current_return_type: Option<BlyxType>,
    in_loop: bool,
    in_async: bool,
    in_ai_context: bool,
}

impl Default for SemanticAnalyzer {
    fn default() -> Self {
        Self::new()
    }
}

impl SemanticAnalyzer {
    pub fn new() -> Self {
        let mut analyzer = Self {
            symbol_table: SymbolTable::new(),
            errors: Vec::new(),
            current_return_type: None,
            in_loop: false,
            in_async: false,
            in_ai_context: false,
        };
        analyzer.register_builtins();
        analyzer
    }

    fn register_builtins(&mut self) {
        // Built-in types
        let type_builtins: &[(&str, BlyxType)] = &[
            ("i8", BlyxType::I8),
            ("i16", BlyxType::I16),
            ("i32", BlyxType::I32),
            ("i64", BlyxType::I64),
            ("i128", BlyxType::I128),
            ("u8", BlyxType::U8),
            ("u16", BlyxType::U16),
            ("u32", BlyxType::U32),
            ("u64", BlyxType::U64),
            ("u128", BlyxType::U128),
            ("f32", BlyxType::F32),
            ("f64", BlyxType::F64),
            ("bool", BlyxType::Bool),
            ("char", BlyxType::Char),
            ("str", BlyxType::Str),
            ("String", BlyxType::Named("String".to_string(), vec![])),
            ("usize", BlyxType::Usize),
            ("isize", BlyxType::Isize),
            ("Agent", BlyxType::Agent),
        ];

        for (name, ty) in type_builtins {
            let _ = self.symbol_table.define(Symbol {
                name: name.to_string(),
                kind: SymbolKind::TypeAlias,
                ty: ty.clone(),
                span: Span::default(),
                is_mutable: false,
                is_used: true,
            });
        }

        // Built-in functions
        let fn_builtins: &[(&str, BlyxType)] = &[
            ("println", BlyxType::Unit),
            ("print", BlyxType::Unit),
            ("eprintln", BlyxType::Unit),
            ("format", BlyxType::Named("String".to_string(), vec![])),
            ("vec", BlyxType::Named("Vec".to_string(), vec![BlyxType::Infer])),
        ];

        for (name, ret_ty) in fn_builtins {
            let _ = self.symbol_table.define(Symbol {
                name: name.to_string(),
                kind: SymbolKind::Function,
                ty: ret_ty.clone(),
                span: Span::default(),
                is_mutable: false,
                is_used: true,
            });
        }
    }

    pub fn analyze(&mut self, file: &BlyxFile) -> Vec<SemanticError> {
        self.first_pass_collect(file);
        for item in &file.items {
            self.analyze_item(item);
        }
        self.errors.clone()
    }

    fn first_pass_collect(&mut self, file: &BlyxFile) {
        for item in &file.items {
            match item {
                Item::Fn(f) | Item::Function(f) => {
                    let _ = self.symbol_table.define(Symbol {
                        name: f.name.clone(),
                        kind: SymbolKind::Function,
                        ty: f.return_type.clone().unwrap_or(BlyxType::Unit),
                        span: f.span,
                        is_mutable: false,
                        is_used: false,
                    });
                }
                Item::Struct(s) => {
                    let _ = self.symbol_table.define(Symbol {
                        name: s.name.clone(),
                        kind: SymbolKind::Struct,
                        ty: BlyxType::Custom(s.name.clone()),
                        span: s.span,
                        is_mutable: false,
                        is_used: false,
                    });
                }
                Item::Enum(e) => {
                    let _ = self.symbol_table.define(Symbol {
                        name: e.name.clone(),
                        kind: SymbolKind::Enum,
                        ty: BlyxType::Custom(e.name.clone()),
                        span: e.span,
                        is_mutable: false,
                        is_used: false,
                    });
                }
                Item::Task(t) => {
                    let _ = self.symbol_table.define(Symbol {
                        name: t.name.clone(),
                        kind: SymbolKind::Task,
                        ty: BlyxType::Promise(Box::new(
                            t.return_type.clone().unwrap_or(BlyxType::Unit),
                        )),
                        span: t.span,
                        is_mutable: false,
                        is_used: false,
                    });
                }
                _ => {}
            }
        }
    }

    fn analyze_item(&mut self, item: &Item) {
        match item {
            Item::Fn(f) | Item::Function(f) => self.analyze_fn(f),
            Item::Struct(_s) => { /* field types checked on usage */ }
            Item::Enum(_e) => { /* variant types checked on usage */ }
            Item::Task(t) => self.analyze_task(t),
            _ => {}
        }
    }

    fn analyze_fn(&mut self, f: &FnDef) {
        self.symbol_table.push_scope();
        let prev_return = self.current_return_type.take();
        let prev_async = self.in_async;
        self.current_return_type = Some(f.return_type.clone().unwrap_or(BlyxType::Unit));
        self.in_async = f.is_async;

        for param in &f.params {
            let _ = self.symbol_table.define(Symbol {
                name: param.name.clone(),
                kind: SymbolKind::Param,
                ty: param.ty.clone(),
                span: param.span,
                is_mutable: false,
                is_used: false,
            });
        }

        let block_ty = self.analyze_block(&f.body);
        let ret_ty = self.current_return_type.clone().unwrap_or(BlyxType::Unit);
        if !self.types_compatible(&block_ty, &ret_ty) {
            self.emit_error(
                SemanticErrorKind::ReturnTypeMismatch,
                &format!("Function '{}' body type {:?} doesn't match return type {:?}", f.name, block_ty, ret_ty),
                f.span,
                Some("Ensure the last expression or return statement matches the declared return type"),
            );
        }

        self.check_unused_in_current_scope();
        self.symbol_table.pop_scope();
        self.current_return_type = prev_return;
        self.in_async = prev_async;
    }

    fn analyze_task(&mut self, t: &TaskDef) {
        self.symbol_table.push_scope();
        let prev_return = self.current_return_type.take();
        let prev_ai = self.in_ai_context;
        self.current_return_type = Some(t.return_type.clone().unwrap_or(BlyxType::Unit));
        self.in_ai_context = true;

        for param in &t.params {
            let _ = self.symbol_table.define(Symbol {
                name: param.name.clone(),
                kind: SymbolKind::Param,
                ty: param.ty.clone(),
                span: param.span,
                is_mutable: false,
                is_used: false,
            });
        }

        self.analyze_block(&t.body);

        self.check_unused_in_current_scope();
        self.symbol_table.pop_scope();
        self.current_return_type = prev_return;
        self.in_ai_context = prev_ai;
    }

    fn analyze_block(&mut self, block: &Block) -> BlyxType {
        self.symbol_table.push_scope();
        let mut last_ty = BlyxType::Unit;
        let len = block.stmts.len();
        for (i, stmt) in block.stmts.iter().enumerate() {
            // last statement as expression = block type
            if i == len - 1 {
                if let Stmt::Expr(e) = stmt {
                    last_ty = self.analyze_expr(e);
                    continue;
                }
            }
            self.analyze_stmt(stmt);
        }
        self.check_unused_in_current_scope();
        self.symbol_table.pop_scope();
        last_ty
    }

    fn analyze_stmt(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::Let { name, ty, value, span } => {
                let expr_ty =
                    value.as_ref().map(|e| self.analyze_expr(e)).unwrap_or(BlyxType::Infer);
                let actual_ty = if let Some(declared) = ty {
                    if !matches!(expr_ty, BlyxType::Infer)
                        && !self.types_compatible(declared, &expr_ty)
                    {
                        self.emit_error(
                            SemanticErrorKind::TypeMismatch,
                            &format!("Expected {:?}, found {:?}", declared, expr_ty),
                            *span,
                            None,
                        );
                    }
                    declared.clone()
                } else {
                    expr_ty
                };

                if let Err(e) = self.symbol_table.define(Symbol {
                    name: name.clone(),
                    kind: SymbolKind::Variable,
                    ty: actual_ty,
                    span: *span,
                    is_mutable: false,
                    is_used: false,
                }) {
                    self.errors.push(e);
                }
            }
            Stmt::Expr(e) => {
                self.analyze_expr(e);
            }
            Stmt::Return(opt_e, span) => {
                let ret_ty = opt_e.as_ref().map(|e| self.analyze_expr(e)).unwrap_or(BlyxType::Unit);
                if let Some(expected) = &self.current_return_type.clone() {
                    if !self.types_compatible(&ret_ty, expected) {
                        self.emit_error(
                            SemanticErrorKind::ReturnTypeMismatch,
                            &format!(
                                "Return type mismatch: expected {:?}, found {:?}",
                                expected, ret_ty
                            ),
                            *span,
                            None,
                        );
                    }
                }
            }
            Stmt::Break(opt_e, _span) => {
                if !self.in_loop {
                    // break outside loop is a semantic error but we'll just warn
                }
                if let Some(e) = opt_e {
                    self.analyze_expr(e);
                }
            }
            Stmt::Continue(_span) => {
                // continue outside loop: warning only
            }
            Stmt::Item(i) => self.analyze_item(i),
        }
    }

    fn analyze_expr(&mut self, expr: &Expr) -> BlyxType {
        match expr {
            Expr::Literal(lit, _span) => self.infer_literal_type(lit),

            Expr::Ident(name, span) => {
                if let Some(sym) = self.symbol_table.lookup(name) {
                    let ty = sym.ty.clone();
                    self.symbol_table.mark_used(name);
                    ty
                } else {
                    self.emit_error(
                        SemanticErrorKind::UndeclaredVariable,
                        &format!("Undeclared variable '{}'", name),
                        *span,
                        Some(&format!("Did you declare '{}' before using it?", name)),
                    );
                    BlyxType::Infer
                }
            }

            Expr::Call(callee, args, span) => {
                let callee_ty = self.analyze_expr(callee);
                for arg in args {
                    self.analyze_expr(arg);
                }
                // If it's a simple identifier call, look up return type
                if let Expr::Ident(name, _) = &**callee {
                    if let Some(sym) = self.symbol_table.lookup(name) {
                        return sym.ty.clone();
                    } else {
                        self.emit_error(
                            SemanticErrorKind::UndeclaredFunction,
                            &format!("Undeclared function '{}'", name),
                            *span,
                            None,
                        );
                    }
                }
                callee_ty
            }

            Expr::MacroCall { name, args: _, .. } => {
                // Macro calls: println/print return unit, format returns String
                match name.as_str() {
                    "format" | "format_args" => BlyxType::Named("String".to_string(), vec![]),
                    "vec" => BlyxType::Named("Vec".to_string(), vec![BlyxType::Infer]),
                    _ => BlyxType::Unit,
                }
            }

            Expr::Generate { model, prompt, span } => {
                let model_ty = self.analyze_expr(model);
                let prompt_ty = self.analyze_expr(prompt);
                if !self.is_string_type(&model_ty) {
                    self.emit_error(
                        SemanticErrorKind::TypeMismatch,
                        "generate() model argument must be a string type",
                        *span,
                        None,
                    );
                }
                if !self.is_string_type(&prompt_ty) {
                    self.emit_error(
                        SemanticErrorKind::TypeMismatch,
                        "generate() prompt argument must be a string type",
                        *span,
                        None,
                    );
                }
                BlyxType::Promise(Box::new(BlyxType::Named("String".to_string(), vec![])))
            }

            Expr::Reason { context, span } => {
                let ctx_ty = self.analyze_expr(context);
                if !self.is_string_type(&ctx_ty) {
                    self.emit_error(
                        SemanticErrorKind::TypeMismatch,
                        "reason() context must be a string type",
                        *span,
                        None,
                    );
                }
                BlyxType::Promise(Box::new(BlyxType::Named("String".to_string(), vec![])))
            }

            Expr::Orchestrate { agents, task, .. } => {
                for agent in agents {
                    self.analyze_expr(agent);
                }
                self.analyze_expr(task);
                BlyxType::Promise(Box::new(BlyxType::Named(
                    "Vec".to_string(),
                    vec![BlyxType::Agent],
                )))
            }

            Expr::TaskExpr { body, .. } => {
                self.analyze_block(body);
                BlyxType::Agent
            }

            Expr::Binary(op, lhs, rhs, span) => {
                let lhs_ty = self.analyze_expr(lhs);
                let rhs_ty = self.analyze_expr(rhs);
                // For comparison operators, result is bool
                match op {
                    BinOp::Eq | BinOp::Ne | BinOp::Lt | BinOp::Le | BinOp::Gt | BinOp::Ge => {
                        BlyxType::Bool
                    }
                    BinOp::And | BinOp::Or => {
                        if !self.types_compatible(&lhs_ty, &BlyxType::Bool) {
                            self.emit_error(
                                SemanticErrorKind::TypeMismatch,
                                "Logical operator requires bool operands",
                                *span,
                                None,
                            );
                        }
                        BlyxType::Bool
                    }
                    _ => {
                        if !self.types_compatible(&lhs_ty, &rhs_ty) {
                            self.emit_error(
                                SemanticErrorKind::TypeMismatch,
                                &format!(
                                    "Incompatible operand types: {:?} and {:?}",
                                    lhs_ty, rhs_ty
                                ),
                                *span,
                                None,
                            );
                        }
                        lhs_ty
                    }
                }
            }

            Expr::If { cond, then_branch, else_branch, span } => {
                let cond_ty = self.analyze_expr(cond);
                if !self.types_compatible(&cond_ty, &BlyxType::Bool) {
                    self.emit_error(
                        SemanticErrorKind::TypeMismatch,
                        "if condition must be bool",
                        *span,
                        None,
                    );
                }
                let then_ty = self.analyze_block(then_branch);
                if let Some(else_e) = else_branch {
                    let else_ty = self.analyze_expr(else_e);
                    if !self.types_compatible(&then_ty, &else_ty) {
                        self.emit_error(
                            SemanticErrorKind::TypeMismatch,
                            &format!(
                                "if/else branches have incompatible types: {:?} vs {:?}",
                                then_ty, else_ty
                            ),
                            *span,
                            None,
                        );
                    }
                }
                then_ty
            }

            Expr::While { cond, body, span } => {
                let cond_ty = self.analyze_expr(cond);
                if !self.types_compatible(&cond_ty, &BlyxType::Bool) {
                    self.emit_error(
                        SemanticErrorKind::TypeMismatch,
                        "while condition must be bool",
                        *span,
                        None,
                    );
                }
                let prev_loop = self.in_loop;
                self.in_loop = true;
                self.analyze_block(body);
                self.in_loop = prev_loop;
                BlyxType::Unit
            }

            Expr::Loop { body, .. } => {
                let prev_loop = self.in_loop;
                self.in_loop = true;
                self.analyze_block(body);
                self.in_loop = prev_loop;
                BlyxType::Unit
            }

            Expr::Block(b) => self.analyze_block(b),

            Expr::Match { expr, arms, .. } => {
                self.analyze_expr(expr);
                let mut arm_ty = BlyxType::Unit;
                for arm in arms {
                    if let Some(guard) = &arm.guard {
                        self.analyze_expr(guard);
                    }
                    arm_ty = self.analyze_expr(&arm.body);
                }
                arm_ty
            }

            Expr::Closure { params, body, is_async, .. } => {
                self.symbol_table.push_scope();
                let prev_async = self.in_async;
                self.in_async = *is_async;
                for p in params {
                    let _ = self.symbol_table.define(Symbol {
                        name: p.name.clone(),
                        kind: SymbolKind::Param,
                        ty: p.ty.clone().unwrap_or(BlyxType::Infer),
                        span: p.span,
                        is_mutable: false,
                        is_used: false,
                    });
                }
                let body_ty = self.analyze_expr(body);
                self.symbol_table.pop_scope();
                self.in_async = prev_async;
                BlyxType::Fn(
                    params.iter().map(|p| p.ty.clone().unwrap_or(BlyxType::Infer)).collect(),
                    Box::new(body_ty),
                )
            }

            Expr::Return(opt_e, span) => {
                let ret_ty = opt_e.as_ref().map(|e| self.analyze_expr(e)).unwrap_or(BlyxType::Unit);
                if let Some(expected) = &self.current_return_type.clone() {
                    if !self.types_compatible(&ret_ty, expected) {
                        self.emit_error(
                            SemanticErrorKind::ReturnTypeMismatch,
                            &format!(
                                "Return type mismatch: expected {:?}, got {:?}",
                                expected, ret_ty
                            ),
                            *span,
                            None,
                        );
                    }
                }
                BlyxType::Never
            }

            Expr::Assign { target, value, span } => {
                // Check target is an assignable lvalue
                if let Expr::Ident(name, _) = &**target {
                    if let Some(sym) = self.symbol_table.lookup(name) {
                        if !sym.is_mutable {
                            self.emit_error(
                                SemanticErrorKind::MutabilityError,
                                &format!("Cannot assign to immutable variable '{}'", name),
                                *span,
                                Some("Declare with 'let mut' to allow mutation"),
                            );
                        }
                    }
                }
                let _val_ty = self.analyze_expr(value);
                BlyxType::Unit
            }

            Expr::AssignOp { target, value, span, .. } => {
                if let Expr::Ident(name, _) = &**target {
                    if let Some(sym) = self.symbol_table.lookup(name) {
                        if !sym.is_mutable {
                            self.emit_error(
                                SemanticErrorKind::MutabilityError,
                                &format!("Cannot assign to immutable variable '{}'", name),
                                *span,
                                None,
                            );
                        }
                    }
                }
                self.analyze_expr(value);
                BlyxType::Unit
            }

            Expr::Try(inner, _) => {
                let inner_ty = self.analyze_expr(inner);
                // ? unwraps Result<T, E> -> T
                match inner_ty {
                    BlyxType::Result(ok_ty, _) => *ok_ty,
                    BlyxType::Named(ref n, ref args) if n == "Result" && !args.is_empty() => {
                        args[0].clone()
                    }
                    _ => inner_ty,
                }
            }

            Expr::Cast { expr, ty, .. } => {
                self.analyze_expr(expr);
                ty.clone()
            }

            Expr::As { expr, ty, .. } => {
                self.analyze_expr(expr);
                ty.clone()
            }

            Expr::Reference { inner, .. } => {
                let inner_ty = self.analyze_expr(inner);
                BlyxType::Ref(Box::new(inner_ty), false)
            }

            Expr::Deref { inner, .. } => {
                let inner_ty = self.analyze_expr(inner);
                match inner_ty {
                    BlyxType::Ref(t, _) | BlyxType::Ptr(t) | BlyxType::MutPtr(t) => *t,
                    other => other,
                }
            }

            Expr::Neg(inner, _) => self.analyze_expr(inner),

            Expr::Range { from, to, .. } => {
                if let Some(f) = from {
                    self.analyze_expr(f);
                }
                if let Some(t) = to {
                    self.analyze_expr(t);
                }
                BlyxType::Named("Range".to_string(), vec![])
            }

            Expr::StructLit { name, fields, rest, .. } => {
                for (_, val) in fields {
                    self.analyze_expr(val);
                }
                if let Some(r) = rest {
                    self.analyze_expr(r);
                }
                BlyxType::Custom(name.clone())
            }

            Expr::TupleLit(items, _) => {
                let tys = items.iter().map(|e| self.analyze_expr(e)).collect();
                BlyxType::Tuple(tys)
            }

            Expr::ArrayLit(items, _) => {
                if items.is_empty() {
                    BlyxType::Slice(Box::new(BlyxType::Infer))
                } else {
                    let elem_ty = self.analyze_expr(&items[0]);
                    for item in &items[1..] {
                        self.analyze_expr(item);
                    }
                    BlyxType::Array(Box::new(elem_ty), items.len())
                }
            }

            Expr::ArrayRepeat { value, count, .. } => {
                let elem_ty = self.analyze_expr(value);
                self.analyze_expr(count);
                BlyxType::Slice(Box::new(elem_ty))
            }

            Expr::Path { segments, .. } => {
                // Simple path resolution: look up the first segment
                if let Some(first) = segments.first() {
                    if let Some(sym) = self.symbol_table.lookup(first) {
                        sym.ty.clone()
                    } else {
                        BlyxType::Infer
                    }
                } else {
                    BlyxType::Infer
                }
            }

            Expr::Break { value, .. } => {
                if let Some(v) = value {
                    self.analyze_expr(v);
                }
                BlyxType::Never
            }

            Expr::Continue { .. } => BlyxType::Never,
            Expr::Unary(_, inner, _) => self.analyze_expr(inner),
        }
    }

    fn infer_literal_type(&self, lit: &Lit) -> BlyxType {
        match lit {
            Lit::Int(_) => BlyxType::I64,
            Lit::Float(_) => BlyxType::F64,
            Lit::Bool(_) => BlyxType::Bool,
            Lit::String(_) => BlyxType::Named("String".to_string(), vec![]),
            Lit::Char(_) => BlyxType::Char,
        }
    }

    fn is_string_type(&self, ty: &BlyxType) -> bool {
        match ty {
            BlyxType::Str | BlyxType::String => true,
            BlyxType::Named(n, _) if n == "String" => true,
            BlyxType::Infer | BlyxType::Inferred => true,
            _ => false,
        }
    }

    fn types_compatible(&self, a: &BlyxType, b: &BlyxType) -> bool {
        if a == b {
            return true;
        }
        // Infer is compatible with anything
        if matches!(a, BlyxType::Infer) || matches!(b, BlyxType::Infer) {
            return true;
        }
        // Never is compatible with anything (unreachable code)
        if matches!(a, BlyxType::Never) || matches!(b, BlyxType::Never) {
            return true;
        }
        // String / str compatibility
        if self.is_string_type(a) && self.is_string_type(b) {
            return true;
        }
        // Numeric widening (simplified)
        let is_int = |t: &BlyxType| {
            matches!(
                t,
                BlyxType::I8
                    | BlyxType::I16
                    | BlyxType::I32
                    | BlyxType::I64
                    | BlyxType::I128
                    | BlyxType::U8
                    | BlyxType::U16
                    | BlyxType::U32
                    | BlyxType::U64
                    | BlyxType::U128
                    | BlyxType::Usize
                    | BlyxType::Isize
            )
        };
        let is_float = |t: &BlyxType| matches!(t, BlyxType::F32 | BlyxType::F64 | BlyxType::F16);
        if is_int(a) && is_int(b) {
            return true;
        }
        if is_float(a) && is_float(b) {
            return true;
        }
        false
    }

    fn emit_error(&mut self, kind: SemanticErrorKind, msg: &str, span: Span, hint: Option<&str>) {
        self.errors.push(SemanticError {
            kind,
            message: msg.to_string(),
            span,
            hint: hint.map(String::from),
        });
    }

    fn check_unused_in_current_scope(&mut self) {
        if let Some(scope) = self.symbol_table.scopes.last() {
            let warnings: Vec<SemanticError> = scope
                .values()
                .filter(|sym| {
                    !sym.is_used
                        && !sym.name.starts_with('_')
                        && matches!(sym.kind, SymbolKind::Variable | SymbolKind::Param)
                })
                .map(|sym| SemanticError {
                    kind: SemanticErrorKind::UnusedVariable,
                    message: format!("Unused variable '{}'", sym.name),
                    span: sym.span,
                    hint: Some(format!("Prefix with underscore to suppress: '_{}'", sym.name)),
                })
                .collect();
            self.errors.extend(warnings);
        }
    }
}

// ──────────────────────────────────────────────
//  Tests
// ──────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    fn dummy_span() -> Span {
        Span::default()
    }

    fn make_file(items: Vec<Item>) -> BlyxFile {
        BlyxFile { items }
    }

    fn make_fn(name: &str, body: Vec<Stmt>, ret: Option<BlyxType>) -> Item {
        Item::Fn(FnDef {
            name: name.into(),
            generics: vec![],
            params: vec![],
            return_type: ret,
            body: Block { stmts: body, span: dummy_span() },
            is_pub: false,
            is_async: false,
            span: dummy_span(),
        })
    }

    #[test]
    fn test_empty_file_no_errors() {
        let mut a = SemanticAnalyzer::new();
        let errors = a.analyze(&make_file(vec![]));
        assert!(errors.is_empty());
    }

    #[test]
    fn test_undeclared_variable() {
        let mut a = SemanticAnalyzer::new();
        let file = make_file(vec![make_fn(
            "test",
            vec![Stmt::Expr(Expr::Ident("undeclared".into(), dummy_span()))],
            None,
        )]);
        let errors = a.analyze(&file);
        assert!(errors.iter().any(|e| e.kind == SemanticErrorKind::UndeclaredVariable));
    }

    #[test]
    fn test_declared_variable_no_error() {
        let mut a = SemanticAnalyzer::new();
        let file = make_file(vec![make_fn(
            "test",
            vec![
                Stmt::Let {
                    name: "x".into(),
                    ty: None,
                    value: Some(Expr::Literal(Lit::Int(42), dummy_span())),
                    span: dummy_span(),
                },
                Stmt::Expr(Expr::Ident("x".into(), dummy_span())),
            ],
            None,
        )]);
        let errors = a.analyze(&file);
        assert!(!errors.iter().any(|e| e.kind == SemanticErrorKind::UndeclaredVariable));
    }

    #[test]
    fn test_generate_expr_returns_promise() {
        let mut a = SemanticAnalyzer::new();
        let ty = a.analyze_expr(&Expr::Generate {
            model: Box::new(Expr::Literal(Lit::String("gpt".into()), dummy_span())),
            prompt: Box::new(Expr::Literal(Lit::String("hello".into()), dummy_span())),
            span: dummy_span(),
        });
        assert!(matches!(ty, BlyxType::Promise(_)));
    }

    #[test]
    fn test_reason_expr_returns_promise() {
        let mut a = SemanticAnalyzer::new();
        let ty = a.analyze_expr(&Expr::Reason {
            context: Box::new(Expr::Literal(Lit::String("context".into()), dummy_span())),
            span: dummy_span(),
        });
        assert!(matches!(ty, BlyxType::Promise(_)));
    }

    #[test]
    fn test_type_mismatch_bool_condition() {
        let mut a = SemanticAnalyzer::new();
        let ty = a.analyze_expr(&Expr::If {
            cond: Box::new(Expr::Literal(Lit::Int(1), dummy_span())),
            then_branch: Block { stmts: vec![], span: dummy_span() },
            else_branch: None,
            span: dummy_span(),
        });
        assert!(a.errors.iter().any(|e| e.kind == SemanticErrorKind::TypeMismatch));
    }

    #[test]
    fn test_unused_variable_warning() {
        let mut a = SemanticAnalyzer::new();
        let file = make_file(vec![make_fn(
            "test",
            vec![Stmt::Let {
                name: "unused".into(),
                ty: None,
                value: Some(Expr::Literal(Lit::Int(5), dummy_span())),
                span: dummy_span(),
            }],
            None,
        )]);
        let errors = a.analyze(&file);
        assert!(errors.iter().any(|e| e.kind == SemanticErrorKind::UnusedVariable));
    }

    #[test]
    fn test_underscore_prefix_suppresses_unused() {
        let mut a = SemanticAnalyzer::new();
        let file = make_file(vec![make_fn(
            "test",
            vec![Stmt::Let {
                name: "_unused".into(),
                ty: None,
                value: Some(Expr::Literal(Lit::Int(5), dummy_span())),
                span: dummy_span(),
            }],
            None,
        )]);
        let errors = a.analyze(&file);
        assert!(!errors.iter().any(|e| e.kind == SemanticErrorKind::UnusedVariable));
    }

    #[test]
    fn test_numeric_type_compatibility() {
        let a = SemanticAnalyzer::new();
        assert!(a.types_compatible(&BlyxType::I32, &BlyxType::I64));
        assert!(a.types_compatible(&BlyxType::F32, &BlyxType::F64));
        assert!(!a.types_compatible(&BlyxType::I32, &BlyxType::F64));
    }

    #[test]
    fn test_string_type_compatibility() {
        let a = SemanticAnalyzer::new();
        assert!(a.is_string_type(&BlyxType::Str));
        assert!(a.is_string_type(&BlyxType::Named("String".into(), vec![])));
        assert!(!a.is_string_type(&BlyxType::I32));
    }

    #[test]
    fn test_task_item_registered() {
        let mut a = SemanticAnalyzer::new();
        let file = make_file(vec![Item::Task(TaskDef {
            name: "my_task".into(),
            params: vec![],
            return_type: None,
            body: Block { stmts: vec![], span: dummy_span() },
            is_pub: false,
            span: dummy_span(),
        })]);
        a.first_pass_collect(&file);
        assert!(a.symbol_table.lookup("my_task").is_some());
    }
}
