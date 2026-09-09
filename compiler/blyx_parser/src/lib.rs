use blyx_ast::*;
use blyx_lexer::{BlyxLexer, Span, Token, TokenKind};

#[derive(Debug, Clone)]
pub struct ParseError {
    pub message: String,
    pub span: Span,
    pub hint: Option<String>,
    pub code: Option<&'static str>,
}

pub type ParseResult<T> = Result<T, Vec<ParseError>>;

pub struct BlyxParser {
    tokens: Vec<Token>,
    pos: usize,
    errors: Vec<ParseError>,
}

impl BlyxParser {
    pub fn new(input: &str) -> Self {
        let lexer = BlyxLexer::new(input);
        Self::with_tokens(lexer.tokenize())
    }

    pub fn with_file(input: &str, file: &str) -> Self {
        let lexer = BlyxLexer::with_file(input, file);
        Self::with_tokens(lexer.tokenize())
    }

    pub fn with_tokens(tokens: Vec<Token>) -> Self {
        Self { tokens, pos: 0, errors: Vec::new() }
    }

    pub fn errors(&self) -> &[ParseError] { &self.errors }
    pub fn has_errors(&self) -> bool { !self.errors.is_empty() }

    fn peek(&self) -> &Token {
        self.tokens.get(self.pos).or_else(|| self.tokens.last()).expect("parser requires at least EOF token")
    }

    fn advance(&mut self) -> Token {
        let token = self.peek().clone();
        if !self.is_at_end() { self.pos += 1; }
        token
    }

    fn is_at_end(&self) -> bool { self.peek().kind == TokenKind::Eof }

    fn check(&self, kind: &TokenKind) -> bool {
        if self.is_at_end() { return *kind == TokenKind::Eof; }
        self.peek().kind == *kind
    }

    fn match_token(&mut self, kind: &TokenKind) -> bool {
        if self.check(kind) { self.advance(); true } else { false }
    }

    fn error_at(&mut self, span: Span, message: impl Into<String>) {
        self.errors.push(ParseError { message: message.into(), span, hint: None, code: None });
    }

    fn error(&mut self, message: impl Into<String>) {
        let span = self.peek().span;
        self.error_at(span, message);
    }

    fn expect(&mut self, kind: &TokenKind, message: &str) -> Option<Token> {
        if self.check(kind) { Some(self.advance()) } else { self.error(message); None }
    }

    pub fn parse_file(&mut self, _path: &str) -> BlyxFile {
        let mut items = Vec::new();
        while !self.is_at_end() {
            if let Some(item) = self.parse_item() { items.push(item); }
            else { self.sync_item(); }
        }
        BlyxFile { items }
    }

    fn sync_item(&mut self) {
        if !self.is_at_end() { self.advance(); }
        while !self.is_at_end() {
            match self.peek().kind {
                TokenKind::Fn | TokenKind::Struct | TokenKind::Enum | TokenKind::Trait |
                TokenKind::Impl | TokenKind::Actor | TokenKind::Task | TokenKind::Pub |
                TokenKind::Use | TokenKind::Mod | TokenKind::Const | TokenKind::Type => return,
                _ => { self.advance(); }
            }
        }
    }

    fn sync_stmt(&mut self) {
        while !self.is_at_end() {
            if self.match_token(&TokenKind::Semi) { return; }
            match self.peek().kind {
                TokenKind::RBrace | TokenKind::Let | TokenKind::Return | TokenKind::Break |
                TokenKind::Continue | TokenKind::If | TokenKind::While | TokenKind::For |
                TokenKind::Loop => return,
                _ => { self.advance(); }
            }
        }
    }

    fn parse_item(&mut self) -> Option<Item> {
        let is_pub = self.match_token(&TokenKind::Pub);
        let is_async = self.match_token(&TokenKind::Async);
        match self.peek().kind {
            TokenKind::Fn => self.parse_fn(is_pub, is_async).map(Item::Fn),
            TokenKind::Struct => self.parse_struct(is_pub).map(Item::Struct),
            TokenKind::Enum => self.parse_enum(is_pub).map(Item::Enum),
            TokenKind::Trait => self.parse_trait(is_pub).map(Item::Trait),
            TokenKind::Impl => self.parse_impl().map(Item::Impl),
            TokenKind::Actor => self.parse_actor(is_pub).map(Item::Actor),
            TokenKind::Task => self.parse_task_item(is_pub).map(Item::Task),
            TokenKind::Use => self.parse_use(is_pub).map(Item::Use),
            TokenKind::Mod => self.parse_mod(is_pub).map(Item::Mod),
            TokenKind::Const => self.parse_const(is_pub).map(Item::Const),
            TokenKind::Type => self.parse_type_alias(is_pub).map(Item::TypeAlias),
            _ => { self.error("Expected an item"); None }
        }
    }

    fn parse_fn(&mut self, is_pub: bool, is_async: bool) -> Option<FnDef> {
        let start = self.advance().span;
        let name = self.parse_ident()?;
        let generics = self.parse_generics();
        self.expect(&TokenKind::LParen, "Expected '(' after function name")?;
        let params = self.parse_params();
        self.expect(&TokenKind::RParen, "Expected ')' after parameters")?;
        let return_type = if self.match_token(&TokenKind::Arrow) { Some(self.parse_type()) } else { None };
        let body = self.parse_block()?;
        Some(FnDef { name, generics, params, return_type, body, is_pub, is_async, span: start })
    }

    fn parse_params(&mut self) -> Vec<Param> {
        let mut params = Vec::new();
        while !self.check(&TokenKind::RParen) && !self.is_at_end() {
            if let Some(p) = self.parse_param() { params.push(p); }
            if !self.match_token(&TokenKind::Comma) { break; }
        }
        params
    }

    fn parse_param(&mut self) -> Option<Param> {
        let start = self.peek().span;
        let name = self.parse_ident()?;
        self.expect(&TokenKind::Colon, "Expected ':' after parameter name")?;
        let ty = self.parse_type();
        Some(Param { name, ty, span: start })
    }

    fn parse_generics(&mut self) -> Vec<GenericParam> {
        let mut out = Vec::new();
        if !self.match_token(&TokenKind::Lt) { return out; }
        while !self.check(&TokenKind::Gt) && !self.is_at_end() {
            let span = self.peek().span;
            if let Some(name) = self.parse_ident() {
                let mut bounds = Vec::new();
                if self.match_token(&TokenKind::Colon) {
                    if let Some(bound) = self.parse_ident() { bounds.push(bound); }
                }
                out.push(GenericParam { name, bounds, span });
            } else { self.sync_stmt(); break; }
            if !self.match_token(&TokenKind::Comma) { break; }
        }
        self.expect(&TokenKind::Gt, "Expected '>' after generic parameters");
        out
    }

    fn parse_type(&mut self) -> BlyxType {
        let name = match self.peek().kind.clone() {
            TokenKind::Ident(n) => { self.advance(); n }
            TokenKind::SelfKw => { self.advance(); return BlyxType::SelfType; }
            _ => { self.error("Expected a type"); return BlyxType::Inferred; }
        };
        match name.as_str() {
            "u8" => BlyxType::U8, "u16" => BlyxType::U16, "u32" => BlyxType::U32,
            "u64" => BlyxType::U64, "u128" => BlyxType::U128, "i8" => BlyxType::I8,
            "i16" => BlyxType::I16, "i32" => BlyxType::I32, "i64" => BlyxType::I64,
            "i128" => BlyxType::I128, "f16" => BlyxType::F16, "f32" => BlyxType::F32,
            "f64" => BlyxType::F64, "bool" => BlyxType::Bool, "char" => BlyxType::Char,
            "str" => BlyxType::Str, "String" => BlyxType::String, "usize" => BlyxType::Usize,
            "isize" => BlyxType::Isize, "unit" => BlyxType::Unit,
            _ => BlyxType::Named(name, Vec::new()),
        }
    }

    fn parse_struct(&mut self, is_pub: bool) -> Option<StructDef> {
        let span = self.advance().span;
        let name = self.parse_ident()?;
        let mut fields = Vec::new();
        if self.match_token(&TokenKind::LBrace) {
            while !self.check(&TokenKind::RBrace) && !self.is_at_end() {
                if let Some(field) = self.parse_param() { fields.push(field); }
                if !self.match_token(&TokenKind::Comma) { break; }
            }
            self.expect(&TokenKind::RBrace, "Expected '}' after struct fields");
        }
        Some(StructDef { name, fields, is_pub, span })
    }

    fn parse_enum(&mut self, is_pub: bool) -> Option<EnumDef> {
        let span = self.advance().span;
        let name = self.parse_ident()?;
        let mut variants = Vec::new();
        if self.match_token(&TokenKind::LBrace) {
            while !self.check(&TokenKind::RBrace) && !self.is_at_end() {
                if let Some(v) = self.parse_ident() { variants.push(v); } else { break; }
                if !self.match_token(&TokenKind::Comma) { break; }
            }
            self.expect(&TokenKind::RBrace, "Expected '}' after enum variants");
        }
        Some(EnumDef { name, variants, is_pub, span })
    }

    fn parse_trait(&mut self, is_pub: bool) -> Option<TraitDef> {
        let span = self.advance().span;
        let name = self.parse_ident()?;
        let mut methods = Vec::new();
        if self.match_token(&TokenKind::LBrace) {
            while !self.check(&TokenKind::RBrace) && !self.is_at_end() {
                if self.check(&TokenKind::Fn) {
                    if let Some(m) = self.parse_fn(false, false) { methods.push(m); }
                } else { self.error("Expected trait method"); self.sync_stmt(); }
            }
            self.expect(&TokenKind::RBrace, "Expected '}' after trait");
        }
        Some(TraitDef { name, methods, is_pub, span })
    }

    fn parse_impl(&mut self) -> Option<ImplBlock> {
        let span = self.advance().span;
        let first = self.parse_ident()?;
        let (trait_name, target_type) = if self.match_token(&TokenKind::For) {
            (Some(first), self.parse_ident()?)
        } else { (None, first) };
        let mut methods = Vec::new();
        if self.match_token(&TokenKind::LBrace) {
            while !self.check(&TokenKind::RBrace) && !self.is_at_end() {
                if self.check(&TokenKind::Fn) {
                    if let Some(m) = self.parse_fn(false, false) { methods.push(m); }
                } else { self.error("Expected method in impl"); self.sync_stmt(); }
            }
            self.expect(&TokenKind::RBrace, "Expected '}' after impl");
        }
        Some(ImplBlock { target_type, trait_name, methods, span })
    }

    fn parse_actor(&mut self, is_pub: bool) -> Option<ActorDef> {
        let span = self.advance().span;
        let name = self.parse_ident()?;
        let mut fields = Vec::new();
        if self.match_token(&TokenKind::LBrace) {
            while !self.check(&TokenKind::RBrace) && !self.is_at_end() {
                if self.check(&TokenKind::Fn) { break; }
                if let Some(field) = self.parse_param() { fields.push(field); } else { break; }
                if !self.match_token(&TokenKind::Comma) { break; }
            }
            self.expect(&TokenKind::RBrace, "Expected '}' after actor");
        }
        Some(ActorDef { name, fields, methods: Vec::new(), is_pub, span })
    }

    fn parse_task_item(&mut self, is_pub: bool) -> Option<TaskDef> {
        let span = self.advance().span;
        let name = self.parse_ident()?;
        self.expect(&TokenKind::LParen, "Expected '(' after task name")?;
        let params = self.parse_params();
        self.expect(&TokenKind::RParen, "Expected ')' after task parameters")?;
        let return_type = if self.match_token(&TokenKind::Arrow) { Some(self.parse_type()) } else { None };
        let body = self.parse_block()?;
        Some(TaskDef { name, params, return_type, body, is_pub, span })
    }

    fn parse_use(&mut self, _is_pub: bool) -> Option<UsePath> {
        let span = self.advance().span;
        let mut path = String::new();
        loop {
            match self.peek().kind.clone() {
                TokenKind::Ident(s) => { if !path.is_empty() { path.push_str("::"); } path.push_str(&s); self.advance(); }
                _ => break,
            }
            if !self.match_token(&TokenKind::ColonColon) { break; }
        }
        self.match_token(&TokenKind::Semi);
        Some(UsePath { path, span })
    }

    fn parse_mod(&mut self, _is_pub: bool) -> Option<ModDef> {
        let span = self.advance().span;
        let name = self.parse_ident()?;
        self.match_token(&TokenKind::Semi);
        Some(ModDef { name, body: None, span })
    }

    fn parse_const(&mut self, _is_pub: bool) -> Option<ConstDef> {
        let span = self.advance().span;
        let name = self.parse_ident()?;
        self.expect(&TokenKind::Colon, "Expected ':' after const name")?;
        let ty = self.parse_type();
        self.expect(&TokenKind::Eq, "Expected '=' in const declaration")?;
        let value = self.parse_expr(0);
        self.match_token(&TokenKind::Semi);
        Some(ConstDef { name, ty, value, span })
    }

    fn parse_type_alias(&mut self, _is_pub: bool) -> Option<TypeAlias> {
        let span = self.advance().span;
        let name = self.parse_ident()?;
        self.expect(&TokenKind::Eq, "Expected '=' in type alias")?;
        let ty = self.parse_type();
        self.match_token(&TokenKind::Semi);
        Some(TypeAlias { name, ty, span })
    }

    fn parse_ident(&mut self) -> Option<String> {
        match self.peek().kind.clone() {
            TokenKind::Ident(name) => { self.advance(); Some(name) }
            _ => { self.error("Expected identifier"); None }
        }
    }

    fn parse_block(&mut self) -> Option<Block> {
        let span = self.peek().span;
        self.expect(&TokenKind::LBrace, "Expected '{'")?;
        let mut stmts = Vec::new();
        while !self.check(&TokenKind::RBrace) && !self.is_at_end() {
            if let Some(stmt) = self.parse_stmt() { stmts.push(stmt); } else { self.sync_stmt(); }
        }
        self.expect(&TokenKind::RBrace, "Expected '}'")?;
        Some(Block { stmts, span })
    }

    fn parse_stmt(&mut self) -> Option<Stmt> {
        if self.match_token(&TokenKind::Let) {
            let span = self.peek().span;
            let name = match self.parse_ident() {
                Some(n) => n,
                None => { self.error("Expected identifier after 'let'"); return None; }
            };
            let ty = if self.match_token(&TokenKind::Colon) { Some(self.parse_type()) } else { None };
            let value = if self.match_token(&TokenKind::Eq) { Some(self.parse_expr(0)) } else { None };
            if value.is_none() && ty.is_none() { self.error_at(span, "Expected a type or initializer in let declaration"); }
            self.match_token(&TokenKind::Semi);
            return Some(Stmt::Let { name, ty, value, span });
        }
        if self.match_token(&TokenKind::Return) {
            let span = self.previous_span();
            let value = if self.check(&TokenKind::Semi) || self.check(&TokenKind::RBrace) { None } else { Some(self.parse_expr(0)) };
            self.match_token(&TokenKind::Semi);
            return Some(Stmt::Return(value, span));
        }
        if self.match_token(&TokenKind::Break) {
            let span = self.previous_span();
            let value = if self.check(&TokenKind::Semi) || self.check(&TokenKind::RBrace) { None } else { Some(self.parse_expr(0)) };
            self.match_token(&TokenKind::Semi);
            return Some(Stmt::Break(value, span));
        }
        if self.match_token(&TokenKind::Continue) {
            let span = self.previous_span();
            self.match_token(&TokenKind::Semi);
            return Some(Stmt::Continue(span));
        }
        let expr = self.parse_expr(0);
        self.match_token(&TokenKind::Semi);
        Some(Stmt::Expr(expr))
    }

    fn previous_span(&self) -> Span {
        self.tokens.get(self.pos.saturating_sub(1)).map(|t| t.span).unwrap_or_default()
    }

    fn parse_expr(&mut self, min_prec: u8) -> Expr {
        let mut left = self.parse_prefix();
        loop {
            let (op, prec) = match self.binary_operator() { Some(x) => x, None => break };
            if prec < min_prec { break; }
            self.advance();
            let right = self.parse_expr(prec + 1);
            let span = match &left { Expr::Literal(_, s) | Expr::Ident(_, s) => *s, _ => self.previous_span() };
            left = Expr::Binary(op, Box::new(left), Box::new(right), span);
        }
        left
    }

    fn binary_operator(&self) -> Option<(BinOp, u8)> {
        let result = match self.peek().kind {
            TokenKind::PipePipe => (BinOp::Or, 1), TokenKind::AmpAmp => (BinOp::And, 2),
            TokenKind::EqEq => (BinOp::Eq, 3), TokenKind::BangEq => (BinOp::Ne, 3),
            TokenKind::Lt => (BinOp::Lt, 4), TokenKind::Gt => (BinOp::Gt, 4),
            TokenKind::LtEq => (BinOp::Le, 4), TokenKind::GtEq => (BinOp::Ge, 4),
            TokenKind::Pipe => (BinOp::BitOr, 5), TokenKind::Caret => (BinOp::BitXor, 6),
            TokenKind::Amp => (BinOp::BitAnd, 7), TokenKind::LtLt => (BinOp::Shl, 8),
            TokenKind::GtGt => (BinOp::Shr, 8), TokenKind::Plus => (BinOp::Add, 9),
            TokenKind::Minus => (BinOp::Sub, 9), TokenKind::Star => (BinOp::Mul, 10),
            TokenKind::Slash => (BinOp::Div, 10), TokenKind::Percent => (BinOp::Rem, 10),
            _ => return None,
        };
        Some(result)
    }

    fn parse_prefix(&mut self) -> Expr {
        let token = self.peek().clone();
        match token.kind {
            TokenKind::IntLit(v) => { self.advance(); Expr::Literal(Lit::Int(v), token.span) }
            TokenKind::FloatLit(v) => { self.advance(); Expr::Literal(Lit::Float(v), token.span) }
            TokenKind::StringLit(s) => { self.advance(); Expr::Literal(Lit::String(s), token.span) }
            TokenKind::CharLit(c) => { self.advance(); Expr::Literal(Lit::Char(c), token.span) }
            TokenKind::True => { self.advance(); Expr::Literal(Lit::Bool(true), token.span) }
            TokenKind::False => { self.advance(); Expr::Literal(Lit::Bool(false), token.span) }
            TokenKind::Ident(name) => { self.advance(); self.parse_postfix(Expr::Ident(name, token.span)) }
            TokenKind::LParen => self.parse_paren_or_tuple(),
            TokenKind::LBrack => self.parse_array(),
            TokenKind::Minus => { self.advance(); Expr::Neg(Box::new(self.parse_expr(11)), token.span) }
            TokenKind::Bang => { self.advance(); Expr::Unary(UnOp::Not, Box::new(self.parse_expr(11)), token.span) }
            TokenKind::If => self.parse_if(),
            TokenKind::While => self.parse_while(),
            TokenKind::Match => self.parse_match(),
            TokenKind::Loop => self.parse_loop(),
            TokenKind::Generate => self.parse_ai_call(true),
            TokenKind::Reason => self.parse_ai_call(false),
            TokenKind::Orchestrate => self.parse_orchestrate(),
            TokenKind::Pipe => self.parse_closure(false),
            TokenKind::Async => { self.advance(); if self.check(&TokenKind::Pipe) { self.parse_closure(true) } else { self.error("Expected closure after 'async'"); Expr::default() } }
            TokenKind::LBrace => self.parse_block().map(Expr::Block).unwrap_or_default(),
            TokenKind::Return => { self.advance(); Expr::Return(None, token.span) }
            _ => { self.error("Expected expression"); self.advance(); Expr::default() }
        }
    }

    fn parse_postfix(&mut self, mut expr: Expr) -> Expr {
        loop {
            if self.match_token(&TokenKind::LParen) {
                let mut args = Vec::new();
                while !self.check(&TokenKind::RParen) && !self.is_at_end() {
                    args.push(self.parse_expr(0));
                    if !self.match_token(&TokenKind::Comma) { break; }
                }
                let span = self.peek().span;
                self.expect(&TokenKind::RParen, "Expected ')' after arguments");
                expr = Expr::Call(Box::new(expr), args, span);
            } else if self.match_token(&TokenKind::Bang) {
                let span = self.previous_span();
                let args = if self.match_token(&TokenKind::LParen) {
                    let start = self.pos;
                    let mut depth = 1usize;
                    while !self.is_at_end() && depth > 0 {
                        if self.check(&TokenKind::LParen) { depth += 1; }
                        else if self.check(&TokenKind::RParen) { depth -= 1; if depth == 0 { break; } }
                        self.advance();
                    }
                    let end = self.pos;
                    self.match_token(&TokenKind::RParen);
                    format!("{} tokens", end.saturating_sub(start))
                } else { String::new() };
                let name = match expr { Expr::Ident(n, _) => n, _ => "macro".to_string() };
                expr = Expr::MacroCall { name, bang: true, args, span };
            } else { break; }
        }
        expr
    }

    fn parse_paren_or_tuple(&mut self) -> Expr {
        let span = self.advance().span;
        if self.match_token(&TokenKind::RParen) { return Expr::TupleLit(Vec::new(), span); }
        let first = self.parse_expr(0);
        if self.match_token(&TokenKind::Comma) {
            let mut values = vec![first];
            while !self.check(&TokenKind::RParen) && !self.is_at_end() {
                values.push(self.parse_expr(0));
                if !self.match_token(&TokenKind::Comma) { break; }
            }
            self.expect(&TokenKind::RParen, "Expected ')' after tuple");
            Expr::TupleLit(values, span)
        } else {
            self.expect(&TokenKind::RParen, "Expected ')'");
            first
        }
    }

    fn parse_array(&mut self) -> Expr {
        let span = self.advance().span;
        let mut values = Vec::new();
        while !self.check(&TokenKind::RBrack) && !self.is_at_end() {
            values.push(self.parse_expr(0));
            if !self.match_token(&TokenKind::Comma) { break; }
        }
        self.expect(&TokenKind::RBrack, "Expected ']' after array");
        Expr::ArrayLit(values, span)
    }

    fn parse_if(&mut self) -> Expr {
        let span = self.advance().span;
        let cond = self.parse_expr(0);
        let then_branch = self.parse_block().unwrap_or_default();
        let else_branch = if self.match_token(&TokenKind::Else) {
            if self.check(&TokenKind::If) { Some(Box::new(self.parse_if())) }
            else { Some(Box::new(Expr::Block(self.parse_block().unwrap_or_default()))) }
        } else { None };
        Expr::If { cond: Box::new(cond), then_branch, else_branch, span }
    }

    fn parse_while(&mut self) -> Expr {
        let span = self.advance().span;
        let cond = self.parse_expr(0);
        let body = self.parse_block().unwrap_or_default();
        Expr::While { cond: Box::new(cond), body, span }
    }

    fn parse_loop(&mut self) -> Expr {
        let span = self.advance().span;
        let body = self.parse_block().unwrap_or_default();
        Expr::Loop { body, label: None, span }
    }

    fn parse_match(&mut self) -> Expr {
        let span = self.advance().span;
        let value = self.parse_expr(0);
        self.expect(&TokenKind::LBrace, "Expected '{' after match expression");
        let mut arms = Vec::new();
        while !self.check(&TokenKind::RBrace) && !self.is_at_end() {
            let arm_span = self.peek().span;
            let pat = self.parse_pattern();
            let guard = if self.match_token(&TokenKind::If) { Some(self.parse_expr(0)) } else { None };
            self.expect(&TokenKind::FatArrow, "Expected '=>' in match arm");
            let body = self.parse_expr(0);
            arms.push(MatchArm { pat, guard, body, span: arm_span });
            if !self.match_token(&TokenKind::Comma) { break; }
        }
        self.expect(&TokenKind::RBrace, "Expected '}' after match arms");
        Expr::Match { expr: Box::new(value), arms, span }
    }

    fn parse_pattern(&mut self) -> Pattern {
        let token = self.peek().clone();
        match token.kind {
            TokenKind::IntLit(v) => { self.advance(); Pattern::Literal(Lit::Int(v), token.span) }
            TokenKind::FloatLit(v) => { self.advance(); Pattern::Literal(Lit::Float(v), token.span) }
            TokenKind::StringLit(s) => { self.advance(); Pattern::Literal(Lit::String(s), token.span) }
            TokenKind::CharLit(c) => { self.advance(); Pattern::Literal(Lit::Char(c), token.span) }
            TokenKind::True => { self.advance(); Pattern::Literal(Lit::Bool(true), token.span) }
            TokenKind::False => { self.advance(); Pattern::Literal(Lit::Bool(false), token.span) }
            TokenKind::Ident(name) => { self.advance(); if name == "_" { Pattern::Wildcard(token.span) } else { Pattern::Ident(name, token.span) } }
            TokenKind::LParen => {
                self.advance(); let mut ps = Vec::new();
                while !self.check(&TokenKind::RParen) && !self.is_at_end() { ps.push(self.parse_pattern()); if !self.match_token(&TokenKind::Comma) { break; } }
                self.expect(&TokenKind::RParen, "Expected ')' after pattern"); Pattern::Tuple(ps, token.span)
            }
            _ => { self.error("Expected match pattern"); self.advance(); Pattern::Wildcard(token.span) }
        }
    }

    fn parse_ai_call(&mut self, generate: bool) -> Expr {
        let span = self.advance().span;
        self.expect(&TokenKind::LParen, "Expected '(' after AI operation");
        let first = self.parse_expr(0);
        self.expect(&TokenKind::Comma, "Expected ',' between AI operation arguments");
        let second = self.parse_expr(0);
        self.expect(&TokenKind::RParen, "Expected ')' after AI operation");
        if generate { Expr::Generate { model: Box::new(first), prompt: Box::new(second), span } }
        else { Expr::Reason { context: Box::new(first), span } }
    }

    fn parse_orchestrate(&mut self) -> Expr {
        let span = self.advance().span;
        self.expect(&TokenKind::LParen, "Expected '(' after orchestrate");
        let mut agents = Vec::new();
        while !self.check(&TokenKind::RParen) && !self.is_at_end() { agents.push(self.parse_expr(0)); if !self.match_token(&TokenKind::Comma) { break; } }
        self.expect(&TokenKind::RParen, "Expected ')' after orchestrate");
        let task = Box::new(Expr::default());
        Expr::Orchestrate { agents, task, span }
    }

    fn parse_closure(&mut self, is_async: bool) -> Expr {
        let span = self.peek().span;
        self.expect(&TokenKind::Pipe, "Expected '|'");
        let mut params = Vec::new();
        while !self.check(&TokenKind::Pipe) && !self.is_at_end() {
            let pspan = self.peek().span;
            if let Some(name) = self.parse_ident() { params.push(ClosureParam { name, ty: None, span: pspan }); }
            if !self.match_token(&TokenKind::Comma) { break; }
        }
        self.expect(&TokenKind::Pipe, "Expected closing '|' in closure");
        let body = Box::new(self.parse_expr(0));
        Expr::Closure { params, body, is_async, is_move: false, span }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_fn() { let mut p = BlyxParser::new("fn main() {}"); let ast = p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); assert_eq!(ast.items.len(), 1); }
    #[test]
    fn test_parse_async_fn() { let mut p = BlyxParser::new("async fn foo() {}"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_struct() { let mut p = BlyxParser::new("struct Foo { x: i32 }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_actor() { let mut p = BlyxParser::new("actor Worker {}"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_generate() { let mut p = BlyxParser::new("fn foo() { generate(m, p); }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_reason() { let mut p = BlyxParser::new("fn foo() { reason(ctx); }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_task() { let mut p = BlyxParser::new("task do_work() {}"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_match() { let mut p = BlyxParser::new("fn foo() { match x { 1 => 2 } }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_closures() { let mut p = BlyxParser::new("fn foo() { let f = |x| x + 1; }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_let() { let mut p = BlyxParser::new("fn foo() { let mut x: i32 = 5; }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_binary() { let mut p = BlyxParser::new("fn foo() { 1 + 2 * 3; }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_macro() { let mut p = BlyxParser::new("fn foo() { println!(\"hello\"); }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_if() { let mut p = BlyxParser::new("fn foo() { if true {} else {} }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_parse_while() { let mut p = BlyxParser::new("fn foo() { while true {} }"); p.parse_file("test.blyx"); assert_eq!(p.errors().len(), 0); }
    #[test]
    fn test_error_recovery() { let mut p = BlyxParser::new("fn foo() { let = ; } fn bar() {}"); let ast = p.parse_file("test.blyx"); assert!(p.errors().len() > 0); assert_eq!(ast.items.len(), 2); }
}
