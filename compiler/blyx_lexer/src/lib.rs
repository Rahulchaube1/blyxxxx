#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct Span {
    pub start: usize,
    pub end: usize,
    pub line: usize,
    pub column: usize,
}

impl Span {
    pub fn new(start: usize, end: usize, line: usize, column: usize) -> Self {
        Span { start, end, line, column }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct Token {
    pub kind: TokenKind,
    pub span: Span,
}

impl Token {
    pub fn new(kind: TokenKind, span: Span) -> Self {
        Token { kind, span }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum TokenKind {
    // Keywords
    Fn,
    Let,
    Const,
    Return,
    If,
    Else,
    While,
    For,
    In,
    Loop,
    Break,
    Continue,
    Struct,
    Impl,
    Trait,
    Pub,
    Use,
    Mod,
    Enum,
    Type,
    Where,
    Match,
    Actor,
    Gpu,
    Parallel,
    Tensor,
    Spawn,
    Await,
    Async,
    Move,
    Ref,
    Unsafe,
    Extern,
    As,
    Dyn,
    True,
    False,
    Null,
    SelfKw,
    Super,
    Mut,
    Generate,
    Reason,
    Orchestrate,
    Task,

    // Literals
    InvalidNumber,
    IntLit(u64),
    FloatLit(f64),
    StringLit(String),
    CharLit(char),
    BoolLit(bool),
    Ident(String),
    DocComment(String),

    // Operators
    Plus,
    Minus,
    Star,
    Slash,
    Percent,
    EqEq,
    BangEq,
    Lt,
    Gt,
    LtEq,
    GtEq,
    AmpAmp,
    PipePipe,
    Bang,
    Amp,
    Pipe,
    Caret,
    Tilde,
    LtLt,
    GtGt,
    Eq,
    PlusEq,
    MinusEq,
    StarEq,
    SlashEq,
    PercentEq,
    AmpEq,
    PipeEq,
    CaretEq,
    LtLtEq,
    GtGtEq,
    Arrow,      // ->
    FatArrow,   // =>
    ColonColon, // ::
    DotDot,     // ..
    DotDotEq,   // ..=
    DotDotDot,  // ...
    At,         // @
    Hash,       // #
    Question,   // ?
    Dollar,     // $

    // Delimiters
    LBrace,
    RBrace,
    LParen,
    RParen,
    LBrack,
    RBrack,

    // Punctuation
    Comma,
    Semi,
    Colon,
    Dot,

    Eof,
    Unknown(char),
}

pub fn keyword_from_str(s: &str) -> Option<TokenKind> {
    match s {
        "fn" => Some(TokenKind::Fn),
        "let" => Some(TokenKind::Let),
        "const" => Some(TokenKind::Const),
        "return" => Some(TokenKind::Return),
        "if" => Some(TokenKind::If),
        "else" => Some(TokenKind::Else),
        "while" => Some(TokenKind::While),
        "for" => Some(TokenKind::For),
        "in" => Some(TokenKind::In),
        "loop" => Some(TokenKind::Loop),
        "break" => Some(TokenKind::Break),
        "continue" => Some(TokenKind::Continue),
        "struct" => Some(TokenKind::Struct),
        "impl" => Some(TokenKind::Impl),
        "trait" => Some(TokenKind::Trait),
        "pub" => Some(TokenKind::Pub),
        "use" => Some(TokenKind::Use),
        "mod" => Some(TokenKind::Mod),
        "enum" => Some(TokenKind::Enum),
        "type" => Some(TokenKind::Type),
        "where" => Some(TokenKind::Where),
        "match" => Some(TokenKind::Match),
        "actor" => Some(TokenKind::Actor),
        "gpu" => Some(TokenKind::Gpu),
        "parallel" => Some(TokenKind::Parallel),
        "tensor" => Some(TokenKind::Tensor),
        "spawn" => Some(TokenKind::Spawn),
        "await" => Some(TokenKind::Await),
        "async" => Some(TokenKind::Async),
        "move" => Some(TokenKind::Move),
        "ref" => Some(TokenKind::Ref),
        "unsafe" => Some(TokenKind::Unsafe),
        "extern" => Some(TokenKind::Extern),
        "as" => Some(TokenKind::As),
        "dyn" => Some(TokenKind::Dyn),
        "true" => Some(TokenKind::True),
        "false" => Some(TokenKind::False),
        "null" => Some(TokenKind::Null),
        "self" => Some(TokenKind::SelfKw),
        "super" => Some(TokenKind::Super),
        "mut" => Some(TokenKind::Mut),
        "generate" => Some(TokenKind::Generate),
        "reason" => Some(TokenKind::Reason),
        "orchestrate" => Some(TokenKind::Orchestrate),
        "task" => Some(TokenKind::Task),
        _ => None,
    }
}

pub struct BlyxLexer<'a> {
    input: &'a str,
    pos: usize,
    line: usize,
    column: usize,
    file: Option<&'a str>,
}

impl<'a> BlyxLexer<'a> {
    pub fn new(input: &'a str) -> Self {
        Self { input, pos: 0, line: 1, column: 1, file: None }
    }

    pub fn with_file(input: &'a str, file: &'a str) -> Self {
        Self { input, pos: 0, line: 1, column: 1, file: Some(file) }
    }

    fn peek(&self) -> Option<char> {
        self.input[self.pos..].chars().next()
    }

    fn peek_next(&self) -> Option<char> {
        let mut chars = self.input[self.pos..].chars();
        chars.next();
        chars.next()
    }

    fn peek_nth(&self, n: usize) -> Option<char> {
        self.input[self.pos..].chars().nth(n)
    }

    fn advance(&mut self) -> Option<char> {
        let c = self.peek()?;
        self.pos += c.len_utf8();
        if c == '\n' {
            self.line += 1;
            self.column = 1;
        } else {
            self.column += 1;
        }
        Some(c)
    }

    fn advance_while<F>(&mut self, condition: F)
    where
        F: Fn(char) -> bool,
    {
        while let Some(c) = self.peek() {
            if condition(c) {
                self.advance();
            } else {
                break;
            }
        }
    }

    pub fn tokenize(&mut self) -> Vec<Token> {
        let mut tokens = Vec::new();
        loop {
            let token = self.next_token();
            if token.kind == TokenKind::Eof {
                tokens.push(token);
                break;
            }
            tokens.push(token);
        }
        tokens
    }

    pub fn next_token(&mut self) -> Token {
        self.skip_whitespace();
        let start_pos = self.pos;
        let start_line = self.line;
        let start_col = self.column;

        if self.pos >= self.input.len() {
            return Token::new(
                TokenKind::Eof,
                Span::new(start_pos, start_pos, start_line, start_col),
            );
        }

        if let Some(c) = self.peek() {
            if c == '/' {
                if let Some(next) = self.peek_next() {
                    if next == '/' {
                        if let Some(n3) = self.peek_nth(2) {
                            if n3 == '/' || n3 == '!' {
                                // Doc comment
                                let mut doc = String::new();
                                self.advance(); // /
                                self.advance(); // /
                                self.advance(); // / or !
                                while let Some(ch) = self.peek() {
                                    if ch == '\n' {
                                        break;
                                    }
                                    doc.push(ch);
                                    self.advance();
                                }
                                return Token::new(
                                    TokenKind::DocComment(doc),
                                    Span::new(start_pos, self.pos, start_line, start_col),
                                );
                            }
                        }
                        // Line comment
                        self.advance_while(|ch| ch != '\n');
                        return self.next_token();
                    } else if next == '*' {
                        // Block comment
                        self.advance(); // /
                        self.advance(); // *
                        let mut depth = 1;
                        while depth > 0 {
                            if let Some(ch) = self.peek() {
                                if ch == '/' && self.peek_next() == Some('*') {
                                    self.advance();
                                    self.advance();
                                    depth += 1;
                                } else if ch == '*' && self.peek_next() == Some('/') {
                                    self.advance();
                                    self.advance();
                                    depth -= 1;
                                } else {
                                    self.advance();
                                }
                            } else {
                                break; // EOF
                            }
                        }
                        return self.next_token();
                    }
                }
            }

            if c.is_alphabetic() || c == '_' {
                return self.read_ident(start_pos, start_line, start_col);
            } else if c.is_ascii_digit() {
                return self.read_number(start_pos, start_line, start_col);
            } else if c == '"' {
                return self.read_string(start_pos, start_line, start_col);
            } else if c == '\'' {
                return self.read_char(start_pos, start_line, start_col);
            } else {
                return self.read_operator_or_punct(start_pos, start_line, start_col);
            }
        }

        Token::new(TokenKind::Eof, Span::new(start_pos, start_pos, start_line, start_col))
    }

    fn skip_whitespace(&mut self) {
        self.advance_while(|c| c.is_whitespace());
    }

    fn read_ident(&mut self, start: usize, line: usize, col: usize) -> Token {
        let mut s = String::new();
        while let Some(c) = self.peek() {
            if c.is_alphanumeric() || c == '_' {
                s.push(c);
                self.advance();
            } else {
                break;
            }
        }

        let kind = match keyword_from_str(&s) {
            Some(TokenKind::True) => TokenKind::BoolLit(true),
            Some(TokenKind::False) => TokenKind::BoolLit(false),
            Some(k) => k,
            None => TokenKind::Ident(s),
        };

        Token::new(kind, Span::new(start, self.pos, line, col))
    }

    fn read_number(&mut self, start: usize, line: usize, col: usize) -> Token {
        self.advance();
        let radix = if self.input.as_bytes()[start] == b'0' {
            match self.peek() {
                Some('x' | 'X') => 16,
                Some('o' | 'O') => 8,
                Some('b' | 'B') => 2,
                _ => 10,
            }
        } else {
            10
        };
        let mut float = false;
        let digits = if radix != 10 {
            self.advance();
            let first = self.pos;
            self.advance_while(|c| c.is_digit(radix) || c == '_');
            first
        } else {
            self.advance_while(|c| c.is_ascii_digit() || c == '_');
            if self.peek() == Some('.') && self.peek_next() != Some('.') {
                float = true;
                self.advance();
                self.advance_while(|c| c.is_ascii_digit() || c == '_');
            }
            if matches!(self.peek(), Some('e' | 'E')) {
                float = true;
                self.advance();
                if matches!(self.peek(), Some('+' | '-')) {
                    self.advance();
                }
                self.advance_while(|c| c.is_ascii_digit() || c == '_');
            }
            start
        };
        let end = self.pos;
        self.advance_while(|c| c.is_ascii_alphanumeric() || c == '_');
        let suffix = &self.input[end..self.pos];
        let number = self.input[digits..end].replace('_', "");
        let valid_integer_suffix = matches!(
            suffix,
            "" | "i8"
                | "i16"
                | "i32"
                | "i64"
                | "i128"
                | "isize"
                | "u8"
                | "u16"
                | "u32"
                | "u64"
                | "u128"
                | "usize"
        );
        let float_suffix = matches!(suffix, "f16" | "f32" | "f64");
        let kind = if radix == 10 && (float || float_suffix) && (suffix.is_empty() || float_suffix)
        {
            number.parse::<f64>().ok().filter(|n| n.is_finite()).map(TokenKind::FloatLit)
        } else if !float && valid_integer_suffix {
            u64::from_str_radix(&number, radix).ok().map(TokenKind::IntLit)
        } else {
            None
        };
        Token::new(kind.unwrap_or(TokenKind::InvalidNumber), Span::new(start, self.pos, line, col))
    }

    fn read_string(&mut self, start: usize, line: usize, col: usize) -> Token {
        self.advance(); // Skip "
        let mut s = String::new();
        while let Some(c) = self.peek() {
            if c == '"' {
                self.advance();
                break;
            } else if c == '\\' {
                self.advance();
                if let Some(esc) = self.peek() {
                    let unescaped = match esc {
                        'n' => '\n',
                        't' => '\t',
                        'r' => '\r',
                        '\\' => '\\',
                        '"' => '"',
                        '0' => '\0',
                        // uXXXX skip logic simplified
                        _ => esc,
                    };
                    s.push(unescaped);
                    self.advance();
                }
            } else {
                s.push(c);
                self.advance();
            }
        }
        Token::new(TokenKind::StringLit(s), Span::new(start, self.pos, line, col))
    }

    fn read_char(&mut self, start: usize, line: usize, col: usize) -> Token {
        self.advance(); // Skip '
        let c = if let Some(ch) = self.peek() {
            if ch == '\\' {
                self.advance();
                if let Some(esc) = self.peek() {
                    let unescaped = match esc {
                        'n' => '\n',
                        't' => '\t',
                        'r' => '\r',
                        '\\' => '\\',
                        '\'' => '\'',
                        '0' => '\0',
                        _ => esc,
                    };
                    self.advance();
                    unescaped
                } else {
                    '\0'
                }
            } else {
                self.advance();
                ch
            }
        } else {
            '\0'
        };

        if self.peek() == Some('\'') {
            self.advance();
        }

        Token::new(TokenKind::CharLit(c), Span::new(start, self.pos, line, col))
    }

    fn read_operator_or_punct(&mut self, start: usize, line: usize, col: usize) -> Token {
        let c1 = self.advance().unwrap();
        let c2 = self.peek();
        let c3 = self.peek_nth(1);

        let mut kind = TokenKind::Unknown(c1);
        let mut advance_count = 0;

        match c1 {
            '+' => {
                if c2 == Some('=') {
                    kind = TokenKind::PlusEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Plus;
                }
            }
            '-' => {
                if c2 == Some('>') {
                    kind = TokenKind::Arrow;
                    advance_count = 1;
                } else if c2 == Some('=') {
                    kind = TokenKind::MinusEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Minus;
                }
            }
            '*' => {
                if c2 == Some('=') {
                    kind = TokenKind::StarEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Star;
                }
            }
            '/' => {
                if c2 == Some('=') {
                    kind = TokenKind::SlashEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Slash;
                }
            }
            '%' => {
                if c2 == Some('=') {
                    kind = TokenKind::PercentEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Percent;
                }
            }
            '=' => {
                if c2 == Some('=') {
                    kind = TokenKind::EqEq;
                    advance_count = 1;
                } else if c2 == Some('>') {
                    kind = TokenKind::FatArrow;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Eq;
                }
            }
            '!' => {
                if c2 == Some('=') {
                    kind = TokenKind::BangEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Bang;
                }
            }
            '<' => {
                if c2 == Some('<') && c3 == Some('=') {
                    kind = TokenKind::LtLtEq;
                    advance_count = 2;
                } else if c2 == Some('<') {
                    kind = TokenKind::LtLt;
                    advance_count = 1;
                } else if c2 == Some('=') {
                    kind = TokenKind::LtEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Lt;
                }
            }
            '>' => {
                if c2 == Some('>') && c3 == Some('=') {
                    kind = TokenKind::GtGtEq;
                    advance_count = 2;
                } else if c2 == Some('>') {
                    kind = TokenKind::GtGt;
                    advance_count = 1;
                } else if c2 == Some('=') {
                    kind = TokenKind::GtEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Gt;
                }
            }
            '&' => {
                if c2 == Some('&') {
                    kind = TokenKind::AmpAmp;
                    advance_count = 1;
                } else if c2 == Some('=') {
                    kind = TokenKind::AmpEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Amp;
                }
            }
            '|' => {
                if c2 == Some('|') {
                    kind = TokenKind::PipePipe;
                    advance_count = 1;
                } else if c2 == Some('=') {
                    kind = TokenKind::PipeEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Pipe;
                }
            }
            '^' => {
                if c2 == Some('=') {
                    kind = TokenKind::CaretEq;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Caret;
                }
            }
            '.' => {
                if c2 == Some('.') && c3 == Some('.') {
                    kind = TokenKind::DotDotDot;
                    advance_count = 2;
                } else if c2 == Some('.') && c3 == Some('=') {
                    kind = TokenKind::DotDotEq;
                    advance_count = 2;
                } else if c2 == Some('.') {
                    kind = TokenKind::DotDot;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Dot;
                }
            }
            ':' => {
                if c2 == Some(':') {
                    kind = TokenKind::ColonColon;
                    advance_count = 1;
                } else {
                    kind = TokenKind::Colon;
                }
            }
            '~' => kind = TokenKind::Tilde,
            '@' => kind = TokenKind::At,
            '#' => kind = TokenKind::Hash,
            '?' => kind = TokenKind::Question,
            '$' => kind = TokenKind::Dollar,
            '{' => kind = TokenKind::LBrace,
            '}' => kind = TokenKind::RBrace,
            '(' => kind = TokenKind::LParen,
            ')' => kind = TokenKind::RParen,
            '[' => kind = TokenKind::LBrack,
            ']' => kind = TokenKind::RBrack,
            ',' => kind = TokenKind::Comma,
            ';' => kind = TokenKind::Semi,
            _ => kind = TokenKind::Unknown(c1),
        }

        for _ in 0..advance_count {
            self.advance();
        }

        Token::new(kind, Span::new(start, self.pos, line, col))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_keywords() {
        let mut lexer = BlyxLexer::new("generate reason orchestrate task");
        assert_eq!(lexer.next_token().kind, TokenKind::Generate);
        assert_eq!(lexer.next_token().kind, TokenKind::Reason);
        assert_eq!(lexer.next_token().kind, TokenKind::Orchestrate);
        assert_eq!(lexer.next_token().kind, TokenKind::Task);
        assert_eq!(lexer.next_token().kind, TokenKind::Eof);
    }

    #[test]
    fn test_char_literals() {
        let mut lexer = BlyxLexer::new("'a' '\\n' '\\''");
        assert_eq!(lexer.next_token().kind, TokenKind::CharLit('a'));
        assert_eq!(lexer.next_token().kind, TokenKind::CharLit('\n'));
        assert_eq!(lexer.next_token().kind, TokenKind::CharLit('\''));
    }

    #[test]
    fn test_block_comments() {
        let mut lexer = BlyxLexer::new("/* comment */ fn");
        assert_eq!(lexer.next_token().kind, TokenKind::Fn);
    }

    #[test]
    fn test_nested_block_comments() {
        let mut lexer = BlyxLexer::new("/* /* nested */ */ let");
        assert_eq!(lexer.next_token().kind, TokenKind::Let);
    }

    #[test]
    fn test_string_escapes() {
        let mut lexer = BlyxLexer::new("\"hello\\nworld\"");
        assert_eq!(lexer.next_token().kind, TokenKind::StringLit("hello\nworld".to_string()));
    }

    #[test]
    fn test_number_formats() {
        let mut lexer = BlyxLexer::new("42 0xFF 0o77 0b1010 3.14 1_000");
        assert_eq!(lexer.next_token().kind, TokenKind::IntLit(42));
        assert_eq!(lexer.next_token().kind, TokenKind::IntLit(255));
        assert_eq!(lexer.next_token().kind, TokenKind::IntLit(63));
        assert_eq!(lexer.next_token().kind, TokenKind::IntLit(10));
        assert_eq!(lexer.next_token().kind, TokenKind::FloatLit(3.14));
        assert_eq!(lexer.next_token().kind, TokenKind::IntLit(1000));
    }

    #[test]
    fn test_question_operator() {
        let mut lexer = BlyxLexer::new("a?");
        assert_eq!(lexer.next_token().kind, TokenKind::Ident("a".to_string()));
        assert_eq!(lexer.next_token().kind, TokenKind::Question);
    }

    #[test]
    fn test_unicode_idents() {
        let mut lexer = BlyxLexer::new("こんにちは");
        assert_eq!(lexer.next_token().kind, TokenKind::Ident("こんにちは".to_string()));
    }
}
