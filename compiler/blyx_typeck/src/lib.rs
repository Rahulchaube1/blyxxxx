// Blyx Type Checker — wraps SemanticAnalyzer, drives the two-pass type analysis
// Created by Rahul Chaube — https://blyx-lang.space
// Open Source — MIT + Apache 2.0

use blyx_ast::BlyxFile;
use blyx_semantic::{SemanticAnalyzer, SemanticError};

pub struct BlyxTypeChecker {
    analyzer: SemanticAnalyzer,
}

impl Default for BlyxTypeChecker {
    fn default() -> Self { Self::new() }
}

impl BlyxTypeChecker {
    pub fn new() -> Self {
        Self { analyzer: SemanticAnalyzer::new() }
    }

    /// Run full semantic + type analysis on a file.
    /// Returns Ok(()) on success, Err(errors) if any errors were found.
    pub fn check_file(&mut self, file: &BlyxFile) -> Result<(), Vec<SemanticError>> {
        let errors = self.analyzer.analyze(file);
        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }

    /// Access accumulated errors (may include warnings).
    pub fn errors(&self) -> &[SemanticError] {
        &self.analyzer.errors
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use blyx_ast::*;

    fn dummy_span() -> Span { Span::default() }

    fn empty_file() -> BlyxFile {
        BlyxFile { items: vec![] }
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
    fn test_empty_file_ok() {
        let mut tc = BlyxTypeChecker::new();
        assert!(tc.check_file(&empty_file()).is_ok());
    }

    #[test]
    fn test_valid_main_fn() {
        let mut tc = BlyxTypeChecker::new();
        let file = BlyxFile {
            items: vec![make_fn("main", vec![
                Stmt::Expr(Expr::MacroCall {
                    name: "println".into(),
                    bang: true,
                    args: "\"Hello, Blyx!\"".into(),
                    span: dummy_span(),
                }),
            ], None)],
        };
        // No undeclared variable errors expected
        let result = tc.check_file(&file);
        // println is a builtin macro, no errors
        assert!(result.is_ok() || tc.errors().iter().all(|e| {
            e.kind != blyx_semantic::SemanticErrorKind::UndeclaredVariable
        }));
    }

    #[test]
    fn test_undeclared_variable_fails() {
        let mut tc = BlyxTypeChecker::new();
        let file = BlyxFile {
            items: vec![make_fn("test", vec![
                Stmt::Expr(Expr::Ident("does_not_exist".into(), dummy_span())),
            ], None)],
        };
        let result = tc.check_file(&file);
        assert!(result.is_err());
    }

    #[test]
    fn test_generate_expr_valid() {
        let mut tc = BlyxTypeChecker::new();
        let file = BlyxFile {
            items: vec![make_fn("test", vec![
                Stmt::Let {
                    name: "result".into(),
                    ty: None,
                    value: Some(Expr::Generate {
                        model: Box::new(Expr::Literal(Lit::String("gpt-4".into()), dummy_span())),
                        prompt: Box::new(Expr::Literal(Lit::String("hello".into()), dummy_span())),
                        span: dummy_span(),
                    }),
                    span: dummy_span(),
                },
                Stmt::Expr(Expr::Ident("result".into(), dummy_span())),
            ], None)],
        };
        let result = tc.check_file(&file);
        // Should have no TypeMismatch errors for generate
        let has_mismatch = tc.errors().iter().any(|e| {
            e.kind == blyx_semantic::SemanticErrorKind::TypeMismatch
        });
        assert!(!has_mismatch);
    }

    #[test]
    fn test_reason_expr_valid() {
        let mut tc = BlyxTypeChecker::new();
        let file = BlyxFile {
            items: vec![make_fn("test", vec![
                Stmt::Let {
                    name: "r".into(),
                    ty: None,
                    value: Some(Expr::Reason {
                        context: Box::new(Expr::Literal(Lit::String("think about this".into()), dummy_span())),
                        span: dummy_span(),
                    }),
                    span: dummy_span(),
                },
                Stmt::Expr(Expr::Ident("r".into(), dummy_span())),
            ], None)],
        };
        let _ = tc.check_file(&file);
        let has_type_error = tc.errors().iter().any(|e| {
            e.kind == blyx_semantic::SemanticErrorKind::TypeMismatch
        });
        assert!(!has_type_error);
    }

    #[test]
    fn test_task_item_ok() {
        let mut tc = BlyxTypeChecker::new();
        let file = BlyxFile {
            items: vec![Item::Task(TaskDef {
                name: "my_task".into(),
                params: vec![],
                return_type: None,
                body: Block { stmts: vec![], span: dummy_span() },
                is_pub: false,
                span: dummy_span(),
            })],
        };
        assert!(tc.check_file(&file).is_ok());
    }
}
