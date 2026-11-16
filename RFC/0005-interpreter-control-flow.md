# Interpreter control flow and lexical mutation

Status: implemented proposal for the experimental interpreter.

The parser previously discarded mutability and semicolons, and the interpreter cloned a flat environment for each block. This prevented outer-variable updates and made parsed loop syntax unusable.

## Semantics

- Preserve `is_mut` on let nodes and add `Stmt::Semi` for discarded expressions.
- Each function owns a stack of lexical scopes. Assignment updates the nearest binding; exiting a block removes its locals. Parameters are immutable.
- Support variable `=`, `+=`, `-=`, `*=`, `/=`, `%=`. Assignment is lowest-precedence, right-associative and returns unit. Compound assignment reads its LHS before evaluating its RHS. Mutation preserves the runtime value kind.
- Boolean `while` returns unit. `loop` may return a break value. Continue/break target the nearest loop. Return escapes the function; loop control cannot cross a function boundary.
- Unwind scopes and counters on all control-flow paths and errors.
- Default execution budget: one million expression/block/iteration steps, configurable with `--max-steps N`. Call depth is limited to 64. These limits are not a sandbox or hard real-time guarantee.
- Require runtime initializers, reject positive integers beyond i64, and accept the unary spelling of i64::MIN.

## Compatibility

`{ 42; }` now evaluates to unit; `{ 42 }` evaluates to 42. Use a tail expression or explicit return for function results. AST visitors, semantic analysis and BIR statement consumers are updated, but loop BIR lowering and full static typing remain incomplete.

## Validation and deferred work

Parser AST tests, interpreter semantics tests, CLI output/exit-code tests, and debug/release CI cover shadowing, nested loops, early return, arithmetic failures, invalid mutation, integer boundaries and execution limits. For/range iteration, labels, collection lvalues, definite assignment, native compilation and full static type checking are deferred.
