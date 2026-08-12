import React from "react";
import Link from "next/link";

export default function AboutPage() {
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
      <main style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / About
        </div>

        <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
          About Blyx &amp; Philosophy
        </h1>
        <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "48px" }}>
          Blyx was created to bridge high-level AI framework expressiveness with low-level systems performance and safety.
        </p>

        <div className="blyx-card" style={{ padding: "32px", marginBottom: "32px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "22px", color: "#F8FAFC", marginBottom: "16px" }}>
            Core Design Principles
          </h2>
          <ul style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#F8FAFC" }}>Zero-Cost Abstractions:</strong> High-level tensor operations and actor messaging compile directly to machine code without runtime overhead.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#F8FAFC" }}>Compile-Time Verification:</strong> Memory safety, array bounds, and tensor dimensions are checked before execution by the Rust-written compiler frontend.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#F8FAFC" }}>Unified Toolchain:</strong> A single binary handles building, package management, formatting, and Language Server Protocol diagnostics.
            </li>
            <li>
              <strong style={{ color: "#F8FAFC" }}>First-Class AI Primitives:</strong> LLM generation (<code style={{ color: "#38BDF8" }}>generate</code>), reasoning (<code style={{ color: "#38BDF8" }}>reason</code>), and multi-agent coordination (<code style={{ color: "#38BDF8" }}>orchestrate</code>) are top-level language keywords.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
