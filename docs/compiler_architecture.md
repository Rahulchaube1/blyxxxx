# Blyx Compiler Architecture

Blyx uses a staged compiler architecture designed around a small, explicit frontend and an intermediate representation suitable for native and heterogeneous execution.

> **Status:** This document describes the intended/current architectural model. Individual stages are at different levels of implementation maturity because Blyx is alpha software.

## 1. Compilation pipeline

```text
┌──────────────────┐
│  Blyx source     │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  `blyx_lexer`    │  Source → tokens
└────────┬─────────┘
         ↓
┌──────────────────┐
│  `blyx_parser`   │  Tokens → syntax tree
└────────┬─────────┘
         ↓
┌──────────────────┐
│  `blyx_ast`      │  Canonical AST representation
└────────┬─────────┘
         ↓
┌──────────────────┐
│ `blyx_semantic`  │  Names, declarations, semantic rules
└────────┬─────────┘
         ↓
┌──────────────────┐
│  `blyx_typeck`   │  Types, inference, tensor validation
└────────┬─────────┘
         ↓
┌──────────────────┐
│   `blyx_bir`     │  BIR / SSA representation
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Optimization     │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Backend / codegen│
└────────┬─────────┘
         ↓
┌─────────────────────────────┐
│ Native / heterogeneous     │
│ execution targets          │
└─────────────────────────────┘
```

## 2. Compiler crates

### `compiler/blyx_lexer`
Turns source text into Blyx tokens. The lexer should remain independent of semantic concerns so that tokenization can be tested in isolation.

### `compiler/blyx_parser`
Consumes lexer output and builds the syntax representation. Parser recovery and diagnostics are important because compiler errors are part of the language UX.

### `compiler/blyx_ast`
Defines the canonical syntax tree shared by frontend stages. Changes here should be deliberate because AST design affects diagnostics, tooling, and downstream compiler passes.

### `compiler/blyx_semantic`
Performs semantic analysis such as declaration/name validation and language-specific rules that are not purely syntactic.

### `compiler/blyx_typeck`
Checks and infers types and is the natural home for compile-time tensor-shape validation and related language invariants.

### `compiler/blyx_bir`
Defines Blyx's intermediate representation. BIR is intended to provide an explicit SSA-oriented boundary between frontend semantics and backend optimization/code generation.

### `compiler/blyxc`
The compiler driver. It is responsible for turning the individual compiler stages into a usable command-line tool and presenting diagnostics and compilation failures coherently.

## 3. Design principles

- **Explicit stages:** frontend, semantic analysis, type checking, IR, and backend concerns remain separable.
- **Testable boundaries:** each compiler stage should have focused unit tests plus end-to-end coverage.
- **Diagnostics first:** errors should retain source locations and actionable context.
- **IR as a contract:** BIR invariants should be documented before aggressive optimization is introduced.
- **Heterogeneous execution:** GPU/accelerator support should be represented as a deliberate backend/runtime design rather than scattered frontend special cases.
- **Honest maturity:** planned architecture is documented separately from functionality that is already implemented and tested.

## 4. Future backend direction

Blyx is designed to explore native compilation across CPUs and heterogeneous targets. Backend work should be introduced behind well-defined BIR contracts so the frontend does not become coupled to a single code-generation implementation.

Potential future targets include CPU-native code generation and accelerator-oriented backends. These are roadmap items unless a corresponding implementation and test suite exists in the repository.
