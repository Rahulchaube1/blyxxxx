import React from "react";
import Link from "next/link";

export default function LearnHubPage() {
  return (
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "60px 24px" }}>
      <style>{`
        .blyx-card {
          background: #101827;
          border: 1px solid #1E293B;
          border-radius: 8px;
          padding: 28px;
          height: 100%;
          text-decoration: none;
          display: block;
          transition: border-color 0.2s ease, transform 0.2s ease;
          color: inherit;
        }
        .blyx-card:hover {
          border-color: #334155;
          transform: translateY(-1px);
        }
      `}</style>
      <main style={{ maxWidth: "1000px", width: "100%", margin: "0 auto" }}>
        <div style={{ fontSize: "12px", color: "#38BDF8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
          Learning Resources
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
          Learn Blyx
        </h1>
        <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "56px", maxWidth: "680px" }}>
          Master Blyx through comprehensive documentation, interactive browser code examples, official book chapters, and compiler architectural guides.
        </p>

        {/* Section 1 — Get Started */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#F8FAFC", marginBottom: "20px" }}>
            1. Get Started
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <Link href="/learn/book" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                The Blyx Book →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                The definitive guide to Blyx. Read from chapter 1 or jump directly to any ownership, actor, tensor, or GPU topic.
              </p>
            </Link>

            <Link href="/download" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                Quick Start →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Install the Blyx toolchain via terminal script and run your first compiled program in under 5 minutes.
              </p>
            </Link>

            <Link href="/examples" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                Blyx by Example →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Learn through annotated, runnable code examples across AI, actors, CLI binaries, and networking.
              </p>
            </Link>
          </div>
        </div>

        {/* Section 2 — Grow with Blyx */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#F8FAFC", marginBottom: "20px" }}>
            2. Grow with Blyx
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <Link href="/play" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                Interactive Playground →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Write and run Blyx in your browser. Inspect AST graphs, BIR SSA IR intermediate representations, and LLVM IR code.
              </p>
            </Link>

            <Link href="/docs" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                API Reference →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Complete API documentation for the Blyx standard library (std::tensor, std::actor, std::cuda, std::net).
              </p>
            </Link>

            <Link href="/blog" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                Engineering Blog →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Deep dives into compiler optimization passes, BIR IR lowering, language design notes, and benchmarks.
              </p>
            </Link>
          </div>
        </div>

        {/* Section 3 — Master Blyx */}
        <div>
          <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#F8FAFC", marginBottom: "20px" }}>
            3. Master Blyx
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <Link href="/community" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                RFC Documents →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Language design proposals — understand the rationale behind every keyword, lifetime rule, and static tensor primitive.
              </p>
            </Link>

            <Link href="/compiler" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                Compiler Architecture →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Explore how blyxc works under the hood — from lexing and parsing to SSA optimization passes and LLVM codegen.
              </p>
            </Link>

            <Link href="/community" className="blyx-card" style={{ textDecoration: "none" }}>
              <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                Contributing Guide →
              </h3>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Join Rahul Chaube and the compiler team in building the Blyx language, tools, and package ecosystem.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
