# Blyx Language Specification (Draft)

> **Status: draft / alpha.** This document describes the current language-design direction. It is not a claim that every listed feature is implemented in the compiler.

## 1. Goals

Blyx explores a programming model for systems software, AI-oriented computation, concurrency, tensors, and heterogeneous execution.

The project prioritizes:

1. explicit and inspectable language semantics;
2. native-oriented execution;
3. strong static analysis where practical;
4. compiler diagnostics that help developers understand failures;
5. language-level support for workloads that combine systems and compute concerns.

## 2. Syntax and semantics

The authoritative implementation of currently supported syntax is the compiler source and test suite. Proposed syntax belongs in RFCs before it is treated as a language guarantee.

## 3. Memory and resource model

Ownership, borrowing, lifetimes, and deterministic resource management are areas of the language design. Their exact semantics must be established through implementation and RFCs rather than inferred from similarities to another language.

## 4. Types and tensors

Blyx explores tensor-aware types and compile-time shape validation. Tensor syntax and semantics remain experimental until the corresponding lexer, parser, semantic, type-checking, BIR, and test coverage are established.

## 5. Concurrency

Actors, asynchronous execution, and parallel computation are areas under development. Their scheduling, memory-safety, cancellation, and failure semantics require explicit specification before being considered stable APIs.

## 6. AI-oriented computation

Blyx explores language-level concepts for AI-oriented operations such as generation, reasoning, orchestration, and tasks. These names represent design directions unless the current compiler and runtime implement the corresponding semantics.

## 7. Heterogeneous computing

GPU and accelerator execution are architectural goals. A backend should only be documented as supported when an implementation, target definition, and reproducible tests exist.

## 8. Intermediate representation

Blyx uses BIR as an intermediate-representation boundary. The BIR design is intended to be SSA-oriented and to separate frontend language semantics from optimization and backend concerns.

## 9. Evolution

Language changes that affect syntax, semantics, type rules, concurrency, tensors, BIR, or compatibility should follow the RFC process described in `docs/RFC_PROCESS.md`.

## 10. Implementation status

For any feature, use this order of evidence:

1. compiler implementation;
2. automated tests;
3. runnable examples;
4. release artifacts;
5. documentation.

Architecture diagrams and roadmap entries alone are not evidence of implementation.
