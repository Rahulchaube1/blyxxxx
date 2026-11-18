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
    desc: "Recursive descent parser producing the Blyx abstract syntax tree.",
    input: "[Tokens]",
    output: "FnDef {\n  name: \"main\",\n  body: Block [\n    LetStmt { name: \"x\", value: Literal(42) }\n  ]\n}",
  },
  {
    id: "run", name: "03. Interpret", desc: "Walk the AST with lexical scopes, checked integer arithmetic and an execution budget.",
    input: "fn main() { println!(6 * 7); }", output: "42",
  },
  {
    id: "build", name: "04. Build a native program", desc: "Lower the typed subset to Rust and invoke rustc and the host linker.",
    input: "blyxc build examples/ml/linear_fit.blyx", output: "Standalone executable for the build host",
  },
];

export default function CompilerPage() {
  const [selectedIdx, setSelectedIdx] = useState(3);
  const stage = PIPELINE_STAGES[selectedIdx];

  return (
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "60px 24px" }}>
      <style>{`
        .blyx-card {
          background: #101827;
          border: 1px solid #1E293B;
          border-radius: 8px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .blyx-card:hover {
          border-color: #334155;
          transform: translateY(-1px);
        }
      `}</style>
      <Container size="xl" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div>
          <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
            <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / Compiler Architecture
          </div>

          <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
            Interactive Compiler Architecture &amp; BIR Pipeline
          </h1>
          <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "40px" }}>
            Explore how the frontend parses a program and how the interpreter and native compiler execute it.
          </p>

          {/* Pipeline Interactive Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "36px" }}>
            {PIPELINE_STAGES.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  padding: "16px",
                  borderRadius: "6px",
                  border: selectedIdx === idx ? "2px solid #0EA5E9" : "1px solid #1E293B",
                  background: selectedIdx === idx ? "#0F172A" : "#020617",
                  color: selectedIdx === idx ? "#38BDF8" : "#94A3B8",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "15px" }}>
                  {st.name}
                </div>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                  {st.desc.slice(0, 45)}...
                </div>
              </button>
            ))}
          </div>

          {/* Active Stage Inspection Box */}
          <div className="blyx-card" style={{ padding: "32px" }}>
            <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#F8FAFC", marginBottom: "8px" }}>
              {stage.name}
            </h2>
            <p style={{ fontSize: "15px", color: "#94A3B8", marginBottom: "24px", lineHeight: 1.6 }}>
              {stage.desc}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#F8FAFC", marginBottom: "8px" }}>
                  Stage Input
                </div>
                <div style={{ background: "#020617", padding: "16px", borderRadius: "6px", color: "#F8FAFC", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", border: "1px solid #1E293B" }}>
                  {stage.input}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#F8FAFC", marginBottom: "8px" }}>
                  Stage Output Transformation
                </div>
                <div style={{ background: "#020617", padding: "16px", borderRadius: "6px", color: "#38BDF8", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", border: "1px solid #1E293B" }}>
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
