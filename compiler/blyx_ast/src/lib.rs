pub use blyx_lexer::Span;

#[derive(Debug, Clone, PartialEq)]
pub struct BlyxFile {
    pub items: Vec<Item>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Item {
    Fn(FnDef),
    Function(FnDef), // alias for parser compat
    Struct(StructDef),
    Enum(EnumDef),
    Task(TaskDef),
    Actor(ActorDef),
    Trait(TraitDef),
    Impl(ImplBlock),
    Use(UsePath),
    Mod(ModDef),
    Const(ConstDef),
    TypeAlias(TypeAlias),
}

#[derive(Debug, Clone, PartialEq)]
pub struct GenericParam {
    pub name: String,
    pub bounds: Vec<String>,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq)]
pub struct FnDef {
    pub name: String,
    pub generics: Vec<GenericParam>,
    pub params: Vec<Param>,
    pub return_type: Option<BlyxType>,
    pub body: Block,
    pub is_pub: bool,
    pub is_async: bool,
    pub span: Span,
}

pub type FunctionDef = FnDef;

#[derive(Debug, Clone, PartialEq, Default)]
pub struct StructDef {
    pub name: String,
    pub fields: Vec<Param>,
    pub is_pub: bool,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct EnumDef {
    pub name: String,
    pub variants: Vec<String>,
    pub is_pub: bool,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct TaskDef {
    pub name: String,
    pub params: Vec<Param>,
    pub return_type: Option<BlyxType>,
    pub body: Block,
    pub is_pub: bool,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct ActorDef {
    pub name: String,
    pub fields: Vec<Param>,
    pub methods: Vec<FnDef>,
    pub is_pub: bool,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct TraitDef {
    pub name: String,
    pub methods: Vec<FnDef>,
    pub is_pub: bool,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct ImplBlock {
    pub target_type: String,
    pub trait_name: Option<String>,
    pub methods: Vec<FnDef>,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct UsePath {
    pub path: String,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct ModDef {
    pub name: String,
    pub body: Option<Vec<Item>>,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct ConstDef {
    pub name: String,
    pub ty: BlyxType,
    pub value: Expr,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct TypeAlias {
    pub name: String,
    pub ty: BlyxType,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq, Default)]
pub struct Param {
    pub name: String,
    pub ty: BlyxType,
    pub span: Span,
}

pub type Field = Param;

#[derive(Debug, Clone, PartialEq, Default)]
pub struct Block {
    pub stmts: Vec<Stmt>,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Stmt {
    Let { name: String, ty: Option<BlyxType>, value: Option<Expr>, span: Span },
    Expr(Expr),
    Return(Option<Expr>, Span),
    Break(Option<Expr>, Span),
    Continue(Span),
    Item(Item),
}

#[derive(Debug, Clone, PartialEq)]
pub enum BlyxType {
    U8,
    U16,
    U32,
    U64,
    U128,
    I8,
    I16,
    I32,
    I64,
    I128,
    F32,
    F64,
    F16,
    Bool,
    Char,
    Str,
    String,
    Usize,
    Isize,
    Named(String, Vec<BlyxType>),
    Tensor(Box<BlyxType>, Vec<usize>),
    Ref(Box<BlyxType>, bool),
    Ptr(Box<BlyxType>),
    MutPtr(Box<BlyxType>),
    Slice(Box<BlyxType>),
    Array(Box<BlyxType>, usize),
    Tuple(Vec<BlyxType>),
    Fn(Vec<BlyxType>, Box<BlyxType>),
    Unit,
    Infer,
    Inferred,
    Never,
    Actor(String),
    Agent,
    Stream(Box<BlyxType>),
    Promise(Box<BlyxType>),
    Option(Box<BlyxType>),
    Result(Box<BlyxType>, Box<BlyxType>),
    Custom(String),
    SelfType,
    DynTrait(String),
    ImplTrait(String),
}

impl Default for BlyxType {
    fn default() -> Self {
        BlyxType::Unit
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Lit {
    Int(u64),
    Float(f64),
    String(String),
    Char(char),
    Bool(bool),
}

#[derive(Debug, Clone, PartialEq)]
pub enum Expr {
    Literal(Lit, Span),
    Ident(String, Span),
    Binary(BinOp, Box<Expr>, Box<Expr>, Span),
    Call(Box<Expr>, Vec<Expr>, Span),
    Block(Block),
    If {
        cond: Box<Expr>,
        then_branch: Block,
        else_branch: Option<Box<Expr>>,
        span: Span,
    },
    While {
        cond: Box<Expr>,
        body: Block,
        span: Span,
    },
    Generate {
        model: Box<Expr>,
        prompt: Box<Expr>,
        span: Span,
    },
    Reason {
        context: Box<Expr>,
        span: Span,
    },
    Orchestrate {
        agents: Vec<Expr>,
        task: Box<Expr>,
        span: Span,
    },
    TaskExpr {
        name: String,
        body: Block,
        span: Span,
    },
    Match {
        expr: Box<Expr>,
        arms: Vec<MatchArm>,
        span: Span,
    },
    Loop {
        body: Block,
        label: Option<String>,
        span: Span,
    },
    Break {
        label: Option<String>,
        value: Option<Box<Expr>>,
        span: Span,
    },
    Continue {
        label: Option<String>,
        span: Span,
    },
    Closure {
        params: Vec<ClosureParam>,
        body: Box<Expr>,
        is_async: bool,
        is_move: bool,
        span: Span,
    },
    Try(Box<Expr>, Span),
    Range {
        from: Option<Box<Expr>>,
        to: Option<Box<Expr>>,
        inclusive: bool,
        span: Span,
    },
    Assign {
        target: Box<Expr>,
        value: Box<Expr>,
        span: Span,
    },
    AssignOp {
        target: Box<Expr>,
        op: BinOp,
        value: Box<Expr>,
        span: Span,
    },
    Cast {
        expr: Box<Expr>,
        ty: BlyxType,
        span: Span,
    },
    StructLit {
        name: String,
        fields: Vec<(String, Expr)>,
        rest: Option<Box<Expr>>,
        span: Span,
    },
    TupleLit(Vec<Expr>, Span),
    ArrayLit(Vec<Expr>, Span),
    ArrayRepeat {
        value: Box<Expr>,
        count: Box<Expr>,
        span: Span,
    },
    MacroCall {
        name: String,
        bang: bool,
        args: String,
        span: Span,
    },
    Reference {
        inner: Box<Expr>,
        is_mut: bool,
        span: Span,
    },
    Deref {
        inner: Box<Expr>,
        span: Span,
    },
    Neg(Box<Expr>, Span),
    Path {
        segments: Vec<String>,
        span: Span,
    },
    As {
        expr: Box<Expr>,
        ty: BlyxType,
        span: Span,
    },
    Return(Option<Box<Expr>>, Span),
    Unary(UnOp, Box<Expr>, Span),
}

impl Default for Expr {
    fn default() -> Self {
        Expr::Literal(Lit::Bool(false), Span::default())
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct MatchArm {
    pub pat: Pattern,
    pub guard: Option<Expr>,
    pub body: Expr,
    pub span: Span,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Pattern {
    Wildcard(Span),
    Ident(String, Span),
    Literal(Lit, Span),
    Tuple(Vec<Pattern>, Span),
    Struct { name: String, fields: Vec<(String, Pattern)>, span: Span },
    EnumVariant { name: String, variant: String, inner: Option<Box<Pattern>>, span: Span },
    Range { from: Option<Box<Pattern>>, to: Option<Box<Pattern>>, inclusive: bool, span: Span },
    Or(Vec<Pattern>, Span),
    Ref { inner: Box<Pattern>, is_mut: bool, span: Span },
}

#[derive(Debug, Clone, PartialEq)]
pub struct ClosureParam {
    pub name: String,
    pub ty: Option<BlyxType>,
    pub span: Span,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BinOp {
    Add,
    Sub,
    Mul,
    Div,
    Rem,
    Eq,
    Ne,
    Lt,
    Gt,
    Le,
    Ge,
    And,
    Or,
    Shl,
    Shr,
    BitAnd,
    BitOr,
    BitXor,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UnOp {
    Neg,
    Not,
    Deref,
    Ref,
    RefMut,
}

pub trait AstVisitor {
    fn visit_file(&mut self, file: &BlyxFile) {
        for item in &file.items {
            self.visit_item(item);
        }
    }

    fn visit_item(&mut self, item: &Item) {
        match item {
            Item::Fn(f) | Item::Function(f) => self.visit_fn(f),
            Item::Struct(s) => self.visit_struct(s),
            Item::Enum(e) => self.visit_enum(e),
            Item::Task(t) => self.visit_task_def(t),
            Item::Actor(a) => self.visit_actor_def(a),
            Item::Trait(t) => self.visit_trait_def(t),
            Item::Impl(i) => self.visit_impl_block(i),
            _ => {}
        }
    }

    fn visit_fn(&mut self, f: &FnDef) {
        self.visit_block(&f.body);
    }

    fn visit_struct(&mut self, _s: &StructDef) {}
    fn visit_enum(&mut self, _e: &EnumDef) {}
    fn visit_task_def(&mut self, t: &TaskDef) {
        self.visit_block(&t.body);
    }
    fn visit_actor_def(&mut self, _a: &ActorDef) {}
    fn visit_trait_def(&mut self, _t: &TraitDef) {}
    fn visit_impl_block(&mut self, _i: &ImplBlock) {}

    fn visit_block(&mut self, b: &Block) {
        for stmt in &b.stmts {
            self.visit_stmt(stmt);
        }
    }

    fn visit_stmt(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::Let { value, .. } => {
                if let Some(v) = value {
                    self.visit_expr(v);
                }
            }
            Stmt::Expr(e) => self.visit_expr(e),
            Stmt::Return(e, _) => {
                if let Some(v) = e {
                    self.visit_expr(v);
                }
            }
            Stmt::Break(e, _) => {
                if let Some(v) = e {
                    self.visit_expr(v);
                }
            }
            Stmt::Continue(_) => {}
            Stmt::Item(i) => self.visit_item(i),
        }
    }

    fn visit_expr(&mut self, expr: &Expr) {
        match expr {
            Expr::Binary(_, l, r, _) => {
                self.visit_expr(l);
                self.visit_expr(r);
            }
            Expr::Call(c, args, _) => {
                self.visit_expr(c);
                for arg in args {
                    self.visit_expr(arg);
                }
            }
            Expr::Block(b) => self.visit_block(b),
            Expr::If { cond, then_branch, else_branch, .. } => {
                self.visit_expr(cond);
                self.visit_block(then_branch);
                if let Some(e) = else_branch {
                    self.visit_expr(e);
                }
            }
            Expr::While { cond, body, .. } => {
                self.visit_expr(cond);
                self.visit_block(body);
            }
            Expr::Generate { model, prompt, .. } => {
                self.visit_expr(model);
                self.visit_expr(prompt);
            }
            Expr::Reason { context, .. } => self.visit_expr(context),
            Expr::Orchestrate { agents, task, .. } => {
                for a in agents {
                    self.visit_expr(a);
                }
                self.visit_expr(task);
            }
            Expr::TaskExpr { body, .. } => self.visit_block(body),
            Expr::Match { expr, arms, .. } => {
                self.visit_expr(expr);
                for arm in arms {
                    self.visit_match_arm(arm);
                }
            }
            Expr::Loop { body, .. } => self.visit_block(body),
            Expr::Break { value, .. } => {
                if let Some(v) = value {
                    self.visit_expr(v);
                }
            }
            Expr::Continue { .. } => {}
            Expr::Closure { body, .. } => self.visit_expr(body),
            Expr::Try(e, _) => self.visit_expr(e),
            Expr::Range { from, to, .. } => {
                if let Some(f) = from {
                    self.visit_expr(f);
                }
                if let Some(t) = to {
                    self.visit_expr(t);
                }
            }
            Expr::Assign { target, value, .. } => {
                self.visit_expr(target);
                self.visit_expr(value);
            }
            Expr::AssignOp { target, value, .. } => {
                self.visit_expr(target);
                self.visit_expr(value);
            }
            Expr::Cast { expr, .. } => self.visit_expr(expr),
            Expr::StructLit { fields, rest, .. } => {
                for (_, e) in fields {
                    self.visit_expr(e);
                }
                if let Some(r) = rest {
                    self.visit_expr(r);
                }
            }
            Expr::TupleLit(v, _) => {
                for e in v {
                    self.visit_expr(e);
                }
            }
            Expr::ArrayLit(v, _) => {
                for e in v {
                    self.visit_expr(e);
                }
            }
            Expr::ArrayRepeat { value, count, .. } => {
                self.visit_expr(value);
                self.visit_expr(count);
            }
            Expr::MacroCall { .. } => {}
            Expr::Reference { inner, .. } => self.visit_expr(inner),
            Expr::Deref { inner, .. } => self.visit_expr(inner),
            Expr::Neg(inner, _) => self.visit_expr(inner),
            Expr::Path { .. } => {}
            Expr::As { expr, .. } => self.visit_expr(expr),
            Expr::Return(opt_e, _) => {
                if let Some(e) = opt_e {
                    self.visit_expr(e);
                }
            }
            Expr::Unary(_, inner, _) => self.visit_expr(inner),
            Expr::Literal(_, _) | Expr::Ident(_, _) => {}
        }
    }

    fn visit_match_arm(&mut self, arm: &MatchArm) {
        if let Some(g) = &arm.guard {
            self.visit_expr(g);
        }
        self.visit_expr(&arm.body);
    }
}
