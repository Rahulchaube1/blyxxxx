// Blyx Intermediate Representation (BIR) — SSA IR, AST lowering, LLVM IR emitter
// Created by Rahul Chaube — https://blyx-lang.space
// Open Source — MIT + Apache 2.0

use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ValueId(pub usize);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct BlockId(pub usize);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct FuncId(pub usize);

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum BirType {
    I8,
    I16,
    I32,
    I64,
    I128,
    U8,
    U16,
    U32,
    U64,
    U128,
    F16,
    F32,
    F64,
    Usize,
    Isize,
    Bool,
    Char,
    Str,
    String_,
    Ptr(Box<BirType>),
    MutPtr(Box<BirType>),
    Slice(Box<BirType>),
    Array(Box<BirType>, usize),
    Tensor(Box<BirType>, Vec<usize>),
    Struct(String, Vec<BirType>),
    Enum(String, Vec<(String, Vec<BirType>)>),
    Actor(String),
    Agent,
    Stream(Box<BirType>),
    Promise(Box<BirType>),
    Closure(Vec<BirType>, Box<BirType>),
    Unit,
    Never,
    Opaque(String),
}

#[derive(Debug, Clone, PartialEq)]
pub enum Instruction {
    Add(ValueId, ValueId, ValueId),
    Sub(ValueId, ValueId, ValueId),
    Mul(ValueId, ValueId, ValueId),
    Div(ValueId, ValueId, ValueId),
    LlmGenerate(ValueId, ValueId, ValueId),
    LlmReason(ValueId, ValueId),
    AgentOrchestrate(ValueId, Vec<ValueId>, ValueId),
    TaskDecl(ValueId, String, Vec<ValueId>),
    Await(ValueId, ValueId, BirType),
    CallDirect(Option<ValueId>, String, Vec<ValueId>, BirType),
    MacroCall(String, Vec<ValueId>),
    ReturnVal(ValueId),
    Assign(ValueId, ValueId),
    ConstInt(ValueId, i64, BirType),
    ConstFloat(ValueId, f64, BirType),
    ConstString(ValueId, String),
    ConstBool(ValueId, bool),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Terminator {
    Return,
    ReturnVal(ValueId),
    Branch(BlockId),
    CondBranch(ValueId, BlockId, BlockId),
    Unreachable,
}

#[derive(Debug, Clone, PartialEq)]
pub struct BasicBlock {
    pub id: BlockId,
    pub instructions: Vec<Instruction>,
    pub terminator: Option<Terminator>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct FunctionData {
    pub id: FuncId,
    pub name: String,
    pub blocks: Vec<BasicBlock>,
    pub args: Vec<(ValueId, BirType)>,
    pub return_type: BirType,
}

#[derive(Debug, Clone, Default, PartialEq)]
pub struct ControlFlowGraph {
    pub functions: HashMap<FuncId, FunctionData>,
}

pub struct BirBuilder {
    pub cfg: ControlFlowGraph,
    pub current_func: FuncId,
    pub current_block: BlockId,
    next_value: usize,
    next_block: usize,
    next_func: usize,
    var_map: HashMap<String, (ValueId, BirType)>,
}

impl Default for BirBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl BirBuilder {
    pub fn new() -> Self {
        Self {
            cfg: ControlFlowGraph::default(),
            current_func: FuncId(0),
            current_block: BlockId(0),
            next_value: 1,
            next_block: 1,
            next_func: 1,
            var_map: HashMap::new(),
        }
    }

    pub fn build_file(file: &blyx_ast::BlyxFile) -> ControlFlowGraph {
        let mut builder = Self::new();
        for item in &file.items {
            match item {
                blyx_ast::Item::Fn(f) | blyx_ast::Item::Function(f) => {
                    builder.build_function(f);
                }
                blyx_ast::Item::Task(t) => {
                    builder.build_task_def(t);
                }
                _ => {}
            }
        }
        builder.cfg
    }

    pub fn build_function(&mut self, f: &blyx_ast::FnDef) {
        let func_id = self.new_func();
        self.current_func = func_id;
        let entry_block = self.new_block();
        self.current_block = entry_block;

        let ret_ty = Self::lower_type(&f.return_type);
        let mut args = Vec::new();
        for arg in &f.params {
            let val = self.new_value();
            let ty = Self::lower_type(&Some(arg.ty.clone()));
            self.var_map.insert(arg.name.clone(), (val, ty.clone()));
            args.push((val, ty));
        }

        self.cfg.functions.insert(
            func_id,
            FunctionData {
                id: func_id,
                name: f.name.clone(),
                blocks: vec![BasicBlock {
                    id: entry_block,
                    instructions: Vec::new(),
                    terminator: None,
                }],
                args,
                return_type: ret_ty,
            },
        );

        self.build_block(&f.body);
        if let Some(func_data) = self.cfg.functions.get_mut(&func_id) {
            if let Some(last_block) = func_data.blocks.last_mut() {
                if last_block.terminator.is_none() {
                    last_block.terminator = Some(Terminator::Return);
                }
            }
        }
    }

    pub fn build_task_def(&mut self, t: &blyx_ast::TaskDef) {
        let func_id = self.new_func();
        self.current_func = func_id;
        let entry_block = self.new_block();
        self.current_block = entry_block;

        let ret_ty = Self::lower_type(&t.return_type);
        let mut args = Vec::new();
        for arg in &t.params {
            let val = self.new_value();
            let ty = Self::lower_type(&Some(arg.ty.clone()));
            self.var_map.insert(arg.name.clone(), (val, ty.clone()));
            args.push((val, ty));
        }

        self.cfg.functions.insert(
            func_id,
            FunctionData {
                id: func_id,
                name: t.name.clone(),
                blocks: vec![BasicBlock {
                    id: entry_block,
                    instructions: Vec::new(),
                    terminator: None,
                }],
                args,
                return_type: ret_ty,
            },
        );

        self.build_block(&t.body);
    }

    pub fn build_block(&mut self, block: &blyx_ast::Block) -> ValueId {
        for stmt in &block.stmts {
            self.build_stmt(stmt);
        }
        self.new_value()
    }

    pub fn build_stmt(&mut self, stmt: &blyx_ast::Stmt) {
        match stmt {
            blyx_ast::Stmt::Let { name, value, .. } => {
                if let Some(expr) = value {
                    let (val, ty) = self.build_expr(expr);
                    self.var_map.insert(name.clone(), (val, ty));
                }
            }
            blyx_ast::Stmt::Expr(expr) => {
                self.build_expr(expr);
            }
            blyx_ast::Stmt::Return(opt_expr, _) => {
                if let Some(expr) = opt_expr {
                    let (val, _) = self.build_expr(expr);
                    self.set_terminator(Terminator::ReturnVal(val));
                } else {
                    self.set_terminator(Terminator::Return);
                }
            }
            blyx_ast::Stmt::Break(..) | blyx_ast::Stmt::Continue(..) => {}
            blyx_ast::Stmt::Item(item) => {
                if let blyx_ast::Item::Fn(f) | blyx_ast::Item::Function(f) = item {
                    self.build_function(f);
                }
            }
        }
    }

    pub fn build_expr(&mut self, expr: &blyx_ast::Expr) -> (ValueId, BirType) {
        match expr {
            blyx_ast::Expr::Literal(lit, _) => match lit {
                blyx_ast::Lit::Int(i) => {
                    let val = self.new_value();
                    self.emit(Instruction::ConstInt(val, *i as i64, BirType::I64));
                    (val, BirType::I64)
                }
                blyx_ast::Lit::Float(f) => {
                    let val = self.new_value();
                    self.emit(Instruction::ConstFloat(val, *f, BirType::F64));
                    (val, BirType::F64)
                }
                blyx_ast::Lit::String(s) => {
                    let val = self.new_value();
                    self.emit(Instruction::ConstString(val, s.clone()));
                    (val, BirType::String_)
                }
                blyx_ast::Lit::Bool(b) => {
                    let val = self.new_value();
                    self.emit(Instruction::ConstBool(val, *b));
                    (val, BirType::Bool)
                }
                blyx_ast::Lit::Char(c) => {
                    let val = self.new_value();
                    self.emit(Instruction::ConstInt(val, *c as i64, BirType::Char));
                    (val, BirType::Char)
                }
            },
            blyx_ast::Expr::Ident(name, _) => {
                self.var_map.get(name).cloned().unwrap_or_else(|| (self.new_value(), BirType::Unit))
            }
            blyx_ast::Expr::Generate { model, prompt, .. } => self.build_generate(model, prompt),
            blyx_ast::Expr::Reason { context, .. } => self.build_reason(context),
            blyx_ast::Expr::Orchestrate { agents, task, .. } => {
                self.build_orchestrate(agents, task)
            }
            blyx_ast::Expr::Call(callee, args, _) => {
                let val = self.new_value();
                let mut arg_vals = Vec::new();
                for a in args {
                    arg_vals.push(self.build_expr(a).0);
                }
                let name = match &**callee {
                    blyx_ast::Expr::Ident(n, _) => n.clone(),
                    _ => "anonymous".to_string(),
                };
                self.emit(Instruction::CallDirect(Some(val), name, arg_vals, BirType::Unit));
                (val, BirType::Unit)
            }
            blyx_ast::Expr::MacroCall { name, args: _, .. } => {
                let val = self.new_value();
                self.emit(Instruction::MacroCall(name.clone(), vec![]));
                (val, BirType::Unit)
            }
            _ => (self.new_value(), BirType::Unit),
        }
    }

    pub fn build_generate(
        &mut self,
        model: &blyx_ast::Expr,
        prompt: &blyx_ast::Expr,
    ) -> (ValueId, BirType) {
        let (model_val, _) = self.build_expr(model);
        let (prompt_val, _) = self.build_expr(prompt);
        let dest = self.new_value();
        self.emit(Instruction::LlmGenerate(dest, model_val, prompt_val));
        (dest, BirType::String_)
    }

    pub fn build_reason(&mut self, context: &blyx_ast::Expr) -> (ValueId, BirType) {
        let (ctx_val, _) = self.build_expr(context);
        let dest = self.new_value();
        self.emit(Instruction::LlmReason(dest, ctx_val));
        (dest, BirType::String_)
    }

    pub fn build_orchestrate(
        &mut self,
        agents: &[blyx_ast::Expr],
        task: &blyx_ast::Expr,
    ) -> (ValueId, BirType) {
        let mut agent_vals = Vec::new();
        for a in agents {
            agent_vals.push(self.build_expr(a).0);
        }
        let (task_val, _) = self.build_expr(task);
        let dest = self.new_value();
        self.emit(Instruction::AgentOrchestrate(dest, agent_vals, task_val));
        (dest, BirType::String_)
    }

    pub fn lower_type(ty: &Option<blyx_ast::BlyxType>) -> BirType {
        match ty {
            Some(blyx_ast::BlyxType::I32) => BirType::I32,
            Some(blyx_ast::BlyxType::I64) => BirType::I64,
            Some(blyx_ast::BlyxType::F32) => BirType::F32,
            Some(blyx_ast::BlyxType::F64) => BirType::F64,
            Some(blyx_ast::BlyxType::Bool) => BirType::Bool,
            Some(blyx_ast::BlyxType::Str) => BirType::Str,
            Some(blyx_ast::BlyxType::Agent) => BirType::Agent,
            _ => BirType::Unit,
        }
    }

    pub fn new_value(&mut self) -> ValueId {
        let id = self.next_value;
        self.next_value += 1;
        ValueId(id)
    }

    pub fn new_block(&mut self) -> BlockId {
        let id = self.next_block;
        self.next_block += 1;
        BlockId(id)
    }

    pub fn new_func(&mut self) -> FuncId {
        let id = self.next_func;
        self.next_func += 1;
        FuncId(id)
    }

    fn emit(&mut self, instr: Instruction) {
        if let Some(func) = self.cfg.functions.get_mut(&self.current_func) {
            if let Some(block) = func.blocks.iter_mut().find(|b| b.id == self.current_block) {
                block.instructions.push(instr);
            }
        }
    }

    fn set_terminator(&mut self, term: Terminator) {
        if let Some(func) = self.cfg.functions.get_mut(&self.current_func) {
            if let Some(block) = func.blocks.iter_mut().find(|b| b.id == self.current_block) {
                block.terminator = Some(term);
            }
        }
    }
}

pub struct LlvmIrEmitter {
    cfg: ControlFlowGraph,
    output: String,
}

impl LlvmIrEmitter {
    pub fn new(cfg: ControlFlowGraph) -> Self {
        Self { cfg, output: String::new() }
    }

    pub fn emit_all(&mut self) -> String {
        self.output.push_str("target datalayout = \"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128\"\n");
        self.output.push_str("target triple = \"x86_64-pc-linux-gnu\"\n\n");
        self.output.push_str("declare ptr @blyx_rt_llm_generate(ptr, ptr)\n");
        self.output.push_str("declare ptr @blyx_rt_llm_reason(ptr)\n");
        self.output.push_str("declare ptr @blyx_rt_agent_orchestrate(ptr, i64, ptr)\n");
        self.output.push_str("declare i32 @printf(ptr, ...)\n\n");

        let mut func_ids: Vec<FuncId> = self.cfg.functions.keys().copied().collect();
        func_ids.sort_by_key(|id| id.0);

        for fid in func_ids {
            if let Some(func) = self.cfg.functions.get(&fid).cloned() {
                self.emit_function(&func);
            }
        }

        self.output.clone()
    }

    fn type_to_llvm(ty: &BirType) -> String {
        match ty {
            BirType::Unit => "void".to_string(),
            BirType::I8 | BirType::U8 | BirType::Bool => "i8".to_string(),
            BirType::I32 | BirType::U32 => "i32".to_string(),
            BirType::I64 | BirType::U64 | BirType::Usize | BirType::Isize => "i64".to_string(),
            BirType::String_ | BirType::Str => "ptr".to_string(),
            _ => "ptr".to_string(),
        }
    }

    fn emit_function(&mut self, func: &FunctionData) {
        let ret_ty = Self::type_to_llvm(&func.return_type);
        let mut args_str = Vec::new();
        for (vid, ty) in &func.args {
            args_str.push(format!("{} %v{}", Self::type_to_llvm(ty), vid.0));
        }

        self.output.push_str(&format!(
            "define {} @{}({}) {{\n",
            ret_ty,
            func.name,
            args_str.join(", ")
        ));

        for block in &func.blocks {
            self.output.push_str(&format!("b{}:\n", block.id.0));
            for instr in &block.instructions {
                match instr {
                    Instruction::LlmGenerate(dest, model, prompt) => {
                        self.output.push_str(&format!(
                            "  %v{} = call ptr @blyx_rt_llm_generate(ptr %v{}, ptr %v{})\n",
                            dest.0, model.0, prompt.0
                        ));
                    }
                    Instruction::LlmReason(dest, ctx) => {
                        self.output.push_str(&format!(
                            "  %v{} = call ptr @blyx_rt_llm_reason(ptr %v{})\n",
                            dest.0, ctx.0
                        ));
                    }
                    Instruction::AgentOrchestrate(dest, agents, task) => {
                        self.output.push_str(&format!("  %v{} = call ptr @blyx_rt_agent_orchestrate(ptr null, i64 {}, ptr %v{})\n", dest.0, agents.len(), task.0));
                    }
                    Instruction::CallDirect(dest, name, args, _) => {
                        let arg_list: Vec<String> =
                            args.iter().map(|a| format!("ptr %v{}", a.0)).collect();
                        if let Some(d) = dest {
                            self.output.push_str(&format!(
                                "  %v{} = call void @{}({})\n",
                                d.0,
                                name,
                                arg_list.join(", ")
                            ));
                        } else {
                            self.output.push_str(&format!(
                                "  call void @{}({})\n",
                                name,
                                arg_list.join(", ")
                            ));
                        }
                    }
                    Instruction::MacroCall(name, _) => {
                        if name == "println" || name == "print" {
                            self.output.push_str("  call i32 (ptr, ...) @printf(ptr null)\n");
                        }
                    }
                    Instruction::ConstInt(dest, val, _) => {
                        self.output.push_str(&format!("  %v{} = add i64 0, {}\n", dest.0, val));
                    }
                    Instruction::ConstBool(dest, val) => {
                        self.output.push_str(&format!(
                            "  %v{} = add i8 0, {}\n",
                            dest.0,
                            if *val { 1 } else { 0 }
                        ));
                    }
                    _ => {}
                }
            }

            match &block.terminator {
                Some(Terminator::Return) => self.output.push_str("  ret void\n"),
                Some(Terminator::ReturnVal(v)) => {
                    self.output.push_str(&format!("  ret {} %v{}\n", ret_ty, v.0))
                }
                _ => self.output.push_str("  ret void\n"),
            }
        }

        self.output.push_str("}\n\n");
    }
}
