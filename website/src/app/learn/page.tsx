import React from "react";
import Link from "next/link";

export default function LearnHubPage() {
  return (
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "60px 24px" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <Link href="/learn/book" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #0EA5E9", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  The Blyx Book &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  The definitive guide to Blyx. Read from chapter 1 or jump directly to any ownership, actor, tensor, or GPU topic.
                </p>
              </div>
            </Link>

            <Link href="/download" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #0EA5E9", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  Quick Start &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  Install the Blyx toolchain via terminal script and run your first compiled program in under 5 minutes.
                </p>
              </div>
            </Link>

            <Link href="/examples" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #0EA5E9", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  Blyx by Example &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  Learn through annotated, runnable code examples across AI, actors, CLI binaries, and networking.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 2 — Grow with Blyx */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#F8FAFC", marginBottom: "20px" }}>
            2. Grow with Blyx
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <Link href="/play" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #38BDF8", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  Interactive Playground &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  Write and run Blyx in your browser. Inspect AST graphs, BIR SSA IR intermediate representations, and LLVM IR code.
                </p>
              </div>
            </Link>

            <Link href="/docs" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #38BDF8", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  API Reference &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  Complete API documentation for the Blyx standard library (std::tensor, std::actor, std::cuda, std::net).
                </p>
              </div>
            </Link>

            <Link href="/blog" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #38BDF8", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  Engineering Blog &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  Deep dives into compiler optimization passes, BIR IR lowering, language design notes, and benchmarks.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 3 — Master Blyx */}
        <div>
          <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#F8FAFC", marginBottom: "20px" }}>
            3. Master Blyx
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <Link href="/community" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #10B981", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  RFC Documents &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  Language design proposals — understand the rationale behind every keyword, lifetime rule, and static tensor primitive.
                </p>
              </div>
            </Link>

            <Link href="/compiler" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #10B981", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  Compiler Architecture &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  Explore how blyxc works under the hood — from lexing and parsing to SSA optimization passes and LLVM codegen.
                </p>
              </div>
            </Link>

            <Link href="/community" style={{ textDecoration: "none" }}>
              <div style={{ padding: "28px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", borderLeft: "4px solid #10B981", height: "100%" }}>
                <h3 style={{ fontWeight: 600, fontSize: "20px", color: "#F8FAFC", marginBottom: "10px" }}>
                  Contributing Guide &rarr;
                </h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6 }}>
                  Join Rahul Chaube and the compiler team in building the Blyx language, tools, and package ecosystem.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
