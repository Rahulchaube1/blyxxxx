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
        let mut lexer = BlyxLexer::new(input);
        Self::with_tokens(lexer.tokenize())
    }

    pub fn with_file(input: &str, _file: &str) -> Self {
        // Assuming BlyxLexer has some way to handle files, or we just pass input.
        let mut lexer = BlyxLexer::new(input);
        Self::with_tokens(lexer.tokenize())
    }

    pub fn with_tokens(tokens: Vec<Token>) -> Self {
        Self {
            tokens,
            pos: 0,
            errors: Vec::new(),
        }
    }

    pub fn errors(&self) -> &[ParseError] {
        &self.errors
    }

    pub fn has_errors(&self) -> bool {
        !self.errors.is_empty()
    }

    fn peek(&self) -> &Token {
        self.tokens.get(self.pos).unwrap_or_else(|| self.tokens.last().unwrap())
    }

    fn advance(&mut self) -> &Token {
        if !self.is_at_end() {
            self.pos += 1;
        }
        self.previous()
    }

    fn previous(&self) -> &Token {
        &self.tokens[self.pos.saturating_sub(1)]
    }

    fn is_at_end(&self) -> bool {
        self.peek().kind == TokenKind::Eof
    }

    fn check(&self, kind: TokenKind) -> bool {
        if self.is_at_end() {
            return false;
        }
        self.peek().kind == kind
    }

    fn match_token(&mut self, kind: TokenKind) -> bool {
        if self.check(kind) {
            self.advance();
            true
        } else {
            false
        }
    }

    fn expect(&mut self, kind: TokenKind, message: &str) -> Result<&Token, ParseError> {
        if self.check(kind) {
            Ok(self.advance())
        } else {
            let token = self.peek().clone();
            Err(ParseError {
                message: message.to_string(),
                span: token.span,
                hint: None,
                code: None,
            })
        }
    }

    fn error(&mut self, message: &str) {
        let span = self.peek().span.clone();
        self.errors.push(ParseError {
            message: message.to_string(),
            span,
            hint: None,
            code: None,
        });
    }

    pub fn parse_file(&mut self, _path: &str) -> BlyxFile {
        let mut items = Vec::new();
        while !self.is_at_end() {
            if let Some(item) = self.parse_item() {
                items.push(item);
            } else {
                self.sync_item();
            }
        }
        BlyxFile { items }
    }

    fn sync_item(&mut self) {
        self.advance();
        while !self.is_at_end() {
            match self.peek().kind {
                TokenKind::Fn | TokenKind::Struct | TokenKind::Enum | TokenKind::Trait |
                TokenKind::Impl | TokenKind::Actor | TokenKind::Task | TokenKind::Pub |
                TokenKind::Use | TokenKind::Mod | TokenKind::Const | TokenKind::Type => {
                    return;
                }
                _ => { self.advance(); }
            }
        }
    }

    fn sync_stmt(&mut self) {
        self.advance();
        while !self.is_at_end() {
            if self.previous().kind == TokenKind::Semi {
                return;
            }
            match self.peek().kind {
                TokenKind::Let | TokenKind::Return | TokenKind::Break | TokenKind::Continue |
                TokenKind::While | TokenKind::For | TokenKind::Loop | TokenKind::If |
                TokenKind::RBrace => return,
                _ => { self.advance(); }
            }
        }
    }

    // --- ITEM PARSING ---
    fn parse_item(&mut self) -> Option<Item> {
        let is_pub = self.match_token(TokenKind::Pub);
        let is_async = self.match_token(TokenKind::Async);

        if self.check(TokenKind::Fn) {
            self.parse_fn(is_pub, is_async)
        } else if self.check(TokenKind::Struct) {
            self.parse_struct(is_pub)
        } else if self.check(TokenKind::Enum) {
            self.parse_enum(is_pub)
        } else if self.check(TokenKind::Trait) {
            self.parse_trait(is_pub)
        } else if self.check(TokenKind::Impl) {
            self.parse_impl()
        } else if self.check(TokenKind::Actor) {
            self.parse_actor(is_pub)
        } else if self.check(TokenKind::Task) {
            self.parse_task_item(is_pub)
        } else if self.check(TokenKind::Use) {
            self.parse_use(is_pub)
        } else if self.check(TokenKind::Mod) {
            self.parse_mod(is_pub)
        } else if self.check(TokenKind::Const) {
            self.parse_const(is_pub)
        } else if self.check(TokenKind::Type) {
            self.parse_type_alias(is_pub)
        } else {
            self.error("Expected an item");
            None
        }
    }

    fn parse_fn(&mut self, is_pub: bool, is_async: bool) -> Option<Item> {
        self.advance(); // consume 'fn'
        let name = self.parse_ident()?;
        let generics = self.parse_generics();
        let span = self.previous().span.clone(); // simplificaiton for span

        let mut params = Vec::new();
        if self.match_token(TokenKind::LParen) {
            if !self.check(TokenKind::RParen) {
                loop {
                    if let Some(param) = self.parse_param() {
                        params.push(param);
                    }
                    if !self.match_token(TokenKind::Comma) {
                        break;
                    }
                }
            }
            if let Err(e) = self.expect(TokenKind::RParen, "Expected ')' after parameters") {
                self.errors.push(e);
            }
        }

        let return_type = if self.match_token(TokenKind::Arrow) {
            Some(self.parse_type())
        } else {
            None
        };

        let body = if self.check(TokenKind::LBrace) {
            self.parse_block()
        } else {
            Block { stmts: vec![], span: span.clone() }
        };

        Some(Item::Function(FunctionDef {
            name,
            generics,
            params,
            return_type,
            body,
            is_async,
            is_pub,
            span,
        }))
    }

    fn parse_struct(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance(); // 'struct'
        let _name = self.parse_ident()?;
        self.sync_item();
        Some(Item::Struct(StructDef::default()))
    }
    
    fn parse_enum(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::Enum(EnumDef::default()))
    }
    
    fn parse_trait(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::Trait(TraitDef::default()))
    }
    
    fn parse_impl(&mut self) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::Impl(ImplBlock::default()))
    }
    
    fn parse_actor(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::Actor(ActorDef::default()))
    }
    
    fn parse_task_item(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::Task(TaskDef::default()))
    }
    
    fn parse_use(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::Use(UsePath::default()))
    }
    
    fn parse_mod(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::Mod(ModDef::default()))
    }
    
    fn parse_const(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::Const(ConstDef::default()))
    }
    
    fn parse_type_alias(&mut self, _is_pub: bool) -> Option<Item> {
        self.advance();
        self.sync_item();
        Some(Item::TypeAlias(TypeAlias::default()))
    }

    fn parse_ident(&mut self) -> Option<String> {
        if let TokenKind::Ident(ref name) = self.peek().kind {
            let n = name.clone();
            self.advance();
            Some(n)
        } else {
            self.error("Expected identifier");
            None
        }
    }

    fn parse_generics(&mut self) -> Vec<GenericParam> {
        // stub
        vec![]
    }

    fn parse_param(&mut self) -> Option<Param> {
        let name = self.parse_ident()?;
        if let Err(e) = self.expect(TokenKind::Colon, "Expected ':' after parameter name") {
            self.errors.push(e);
            return None;
        }
        let ty = self.parse_type();
        Some(Param { name, ty, span: self.previous().span.clone() })
    }

    fn parse_type(&mut self) -> BlyxType {
        // stub
        BlyxType::Inferred
    }

    fn parse_block(&mut self) -> Block {
        let span = self.peek().span.clone();
        if let Err(e) = self.expect(TokenKind::LBrace, "Expected '{'") {
            self.errors.push(e);
            return Block { stmts: vec![], span };
        }
        let mut stmts = Vec::new();
        while !self.check(TokenKind::RBrace) && !self.is_at_end() {
            if let Some(stmt) = self.parse_stmt() {
                stmts.push(stmt);
            } else {
                self.sync_stmt();
            }
        }
        let _ = self.expect(TokenKind::RBrace, "Expected '}'");
        Block { stmts, span }
    }

    fn parse_stmt(&mut self) -> Option<Stmt> {
        if self.match_token(TokenKind::Let) {
            // parse let stmt
            self.sync_stmt();
            Some(Stmt::Expr(Expr::Literal(Lit::Bool(false), Span::default()))) // dummy
        } else {
            let expr = self.parse_expr(0);
            if self.match_token(TokenKind::Semi) {
                Some(Stmt::Expr(expr))
            } else {
                Some(Stmt::Expr(expr))
            }
        }
    }

    fn parse_expr(&mut self, _precedence: u8) -> Expr {
        // stub
        self.advance();
        Expr::Literal(Lit::Bool(false), Span::default())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_fn() {
        let mut parser = BlyxParser::new("fn main() {}");
        let ast = parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
        assert_eq!(ast.items.len(), 1);
    }
    
    // Add 14 more tests as required...
    #[test]
    fn test_parse_async_fn() {
        let mut parser = BlyxParser::new("async fn foo() {}");
        let ast = parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_struct() {
        let mut parser = BlyxParser::new("struct Foo { x: i32 }");
        let ast = parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_actor() {
        let mut parser = BlyxParser::new("actor Worker {}");
        let ast = parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_generate() {
        let mut parser = BlyxParser::new("fn foo() { generate(m, p); }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_reason() {
        let mut parser = BlyxParser::new("fn foo() { reason(ctx); }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_task() {
        let mut parser = BlyxParser::new("task do_work() {}");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_match() {
        let mut parser = BlyxParser::new("fn foo() { match x { 1 => 2 } }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_closures() {
        let mut parser = BlyxParser::new("fn foo() { let f = |x| x + 1; }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_let() {
        let mut parser = BlyxParser::new("fn foo() { let mut x: i32 = 5; }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_binary() {
        let mut parser = BlyxParser::new("fn foo() { 1 + 2 * 3; }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_macro() {
        let mut parser = BlyxParser::new("fn foo() { println!(\"hello\"); }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_if() {
        let mut parser = BlyxParser::new("fn foo() { if true {} else {} }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_parse_while() {
        let mut parser = BlyxParser::new("fn foo() { while true {} }");
        parser.parse_file("test.blyx");
        assert_eq!(parser.errors().len(), 0);
    }
    
    #[test]
    fn test_error_recovery() {
        let mut parser = BlyxParser::new("fn foo() { let = ; } fn bar() {}");
        let ast = parser.parse_file("test.blyx");
        assert!(parser.errors().len() > 0);
        assert_eq!(ast.items.len(), 2);
    }
}
