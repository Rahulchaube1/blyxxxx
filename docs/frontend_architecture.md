# Blyx Frontend Architecture

This document describes the Blyx compiler frontend without coupling the project to another language compiler's internal implementation.

> **Status:** Blyx is alpha software. The repository contains the Blyx frontend crates listed below; planned behavior is not presented as completed functionality.

## 1. Frontend flow

```text
Source text
    ↓
`blyx_lexer`
    ↓
`blyx_parser`
    ↓
`blyx_ast`
    ↓
`blyx_semantic`
    ↓
`blyx_typeck`
    ↓
`blyx_bir`
```

## 2. Responsibilities

### Lexer — `compiler/blyx_lexer`

Responsible for converting source text into tokens. It should handle identifiers, literals, punctuation, operators, comments, and language keywords while preserving enough source-location information for diagnostics.

### Parser — `compiler/blyx_parser`

Responsible for converting tokens into syntactically valid AST structures. Grammar changes belong here rather than being hidden inside later semantic passes.

### AST — `compiler/blyx_ast`

Defines the syntax-level data model consumed by the semantic and type-checking stages. The AST should represent the language directly rather than mirroring an unrelated compiler's internal types.

### Semantic analysis — `compiler/blyx_semantic`

Validates relationships that cannot be established by parsing alone, such as declarations, name resolution, and language-specific semantic constraints.

### Type checking — `compiler/blyx_typeck`

Checks and infers types. This stage is also the natural boundary for compile-time tensor-shape validation and other static invariants that depend on typed expressions.

### BIR lowering — `compiler/blyx_bir`

Lowers the checked program into Blyx Intermediate Representation (BIR), an SSA-oriented representation intended to provide a stable boundary for optimization and backend work.

## 3. Diagnostics

Diagnostics should be treated as a first-class frontend API. Every stage should preserve source spans where practical and return errors that explain:

1. what went wrong,
2. where it happened,
3. why the construct is invalid, and
4. what the developer can do next when a useful correction is known.

## 4. Adding a language feature

A typical feature should be implemented in this order:

1. Define the syntax and semantics in an RFC when the change affects the language design.
2. Add lexer tokens only when required.
3. Extend the parser and AST.
4. Add semantic validation.
5. Add type rules and static validation.
6. Define the corresponding BIR representation or lowering behavior.
7. Add unit, negative, and end-to-end tests.
8. Update examples and user documentation.

This keeps the frontend modular and makes language evolution reviewable by contributors.
