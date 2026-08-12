import React from "react";
import Link from "next/link";

export default function RoadmapPage() {
  return (
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / Roadmap
        </div>

        <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
          Development Roadmap
        </h1>
        <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "48px" }}>
          Milestones tracking compiler stabilization, language specs, and standard library releases.
        </p>

        <div style={{ display: "grid", gap: "24px" }}>
          {[
            {
              phase: "v0.1.0-alpha",
              status: "Completed",
              title: "Language Foundation & BIR SSA",
              desc: "Recursive descent parser, AST lowering, BIR SSA format, static type checking, and LLVM IR codegen.",
            },
            {
              phase: "v0.1.0-beta",
              status: "Active",
              title: "Native Tensors & GPU Compilation",
              desc: "Static multidimensional tensor inference, lock-free actor model, direct PTX/SPIR-V GPU lowering, and VS Code extension.",
            },
            {
              phase: "v1.0.0-stable",
              status: "Upcoming",
              title: "Production Release",
              desc: "Standard library stabilization (std::tensor, std::actor), package registry launch, and production support.",
            },
          ].map((m, idx) => (
            <div key={idx} style={{ padding: "32px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "16px", color: "#38BDF8" }}>
                  {m.phase}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "12px", background: m.status === "Active" ? "#1E293B" : "#020617", color: m.status === "Active" ? "#38BDF8" : "#94A3B8", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                  {m.status}
                </span>
              </div>
              <h2 style={{ fontWeight: 700, fontSize: "20px", color: "#F8FAFC", marginBottom: "8px" }}>
                {m.title}
              </h2>
              <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
