"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

const PIPELINE_STAGES = [
  {
    id: "lexer",
    name: "01. Lexer",
    desc: "Zero-copy UTF-8 character stream tokenization.",
    input: "fn main() { let x = 42; }",
    output: "[Token::Fn, Token::Ident(\"main\"), Token::LParen, Token::RParen, Token::LBrace, Token::Let, Token::Ident(\"x\"), Token::Equal, Token::Int(42), Token::Semicolon, Token::RBrace]",
  },
  {
    id: "parser",
    name: "02. Parser & AST",
    desc: "Recursive descent parser producing strongly-typed Abstract Syntax Trees.",
    input: "[Tokens]",
    output: "FnDef {\n  name: \"main\",\n  body: Block [\n    LetStmt { name: \"x\", value: Literal(42) }\n  ]\n}",
  },
  {
    id: "typecheck",
    name: "03. Type Checker & Tensor Shapes",
    desc: "Verifies memory lifetimes, linear ownership, and multidimensional matrix dimensions.",
    input: "LetStmt { name: \"x\", value: Literal(42) }",
    output: "CheckedType: LetStmt { name: \"x\", inferred_type: i32, shape: [] }",
  },
  {
    id: "bir",
    name: "04. BIR SSA Intermediate IR",
    desc: "Blyx Intermediate Representation: strongly-typed SSA instructions.",
    input: "Checked AST",
    output: "%0 = alloc i32\nstore i32 42, %0\nret void",
  },
  {
    id: "llvm",
    name: "05. LLVM Code Generation",
    desc: "Lowers BIR SSA into target-native machine code (x86_64, ARM64, PTX, SPIR-V).",
    input: "BIR SSA",
    output: "define i32 @main() #0 {\n  ret i32 0\n}",
  },
];

export default function CompilerPage() {
  const [selectedIdx, setSelectedIdx] = useState(3);
  const stage = PIPELINE_STAGES[selectedIdx];

  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <Container size="xl" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
            <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / Compiler Architecture
          </div>

          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
            Interactive Compiler Architecture &amp; BIR Pipeline
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "40px" }}>
            Click through the stages below to inspect how Blyx source code transforms into optimized machine code and GPU assembly.
          </p>

          {/* Pipeline Interactive Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "36px" }}>
            {PIPELINE_STAGES.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  border: selectedIdx === idx ? "2px solid #7C3AED" : "1px solid rgba(124, 58, 237, 0.2)",
                  background: selectedIdx === idx ? "rgba(124, 58, 237, 0.2)" : "#121118",
                  color: selectedIdx === idx ? "#A78BFA" : "#F0EDE8",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "15px" }}>
                  {st.name}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                  {st.desc.slice(0, 45)}...
                </div>
              </button>
            ))}
          </div>

          {/* Active Stage Inspection Box */}
          <div style={{ padding: "32px", background: "#121118", borderRadius: "12px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "24px", color: "#F0EDE8", marginBottom: "8px" }}>
              {stage.name}
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#9CA3AF", marginBottom: "24px", lineHeight: 1.6 }}>
              {stage.desc}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "14px", color: "#F0EDE8", marginBottom: "8px" }}>
                  Stage Input
                </div>
                <div style={{ background: "#0A0908", padding: "16px", borderRadius: "6px", color: "#F0EDE8", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
                  {stage.input}
                </div>
              </div>

              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "14px", color: "#F0EDE8", marginBottom: "8px" }}>
                  Stage Output Transformation
                </div>
                <div style={{ background: "#0A0908", padding: "16px", borderRadius: "6px", color: "#A78BFA", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
                  <pre style={{ margin: 0 }}><code>{stage.output}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
