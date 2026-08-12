import React from "react";
import Link from "next/link";

export default function RoadmapPage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / Roadmap
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
          Development Roadmap
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "48px" }}>
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
            <div key={idx} style={{ padding: "32px", background: "#121118", borderRadius: "12px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "16px", color: "#A78BFA" }}>
                  {m.phase}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "12px", background: m.status === "Active" ? "rgba(124, 58, 237, 0.3)" : "rgba(255, 255, 255, 0.05)", color: m.status === "Active" ? "#A78BFA" : "#9CA3AF", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                  {m.status}
                </span>
              </div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "20px", color: "#F0EDE8", marginBottom: "8px" }}>
                {m.title}
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#9CA3AF", lineHeight: 1.6, margin: 0 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
