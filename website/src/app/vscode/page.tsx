import React from "react";
import Link from "next/link";

export default function VSCodePage() {
  return (
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / VS Code Extension
        </div>

        <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
          BLYX Language VS Code Extension
        </h1>
        <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "48px" }}>
          Official language extension for Visual Studio Code published by RahulChaube. Features syntax highlighting, LSP diagnostics, and BIR SSA inspection.
        </p>

        <div style={{ padding: "32px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#38BDF8", fontWeight: 700, marginBottom: "8px" }}>
            Publisher: RahulChaube
          </div>
          <h2 style={{ fontWeight: 700, fontSize: "22px", color: "#F8FAFC", marginBottom: "12px" }}>
            Marketplace Release
          </h2>
          <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "20px" }}>
            Full TextMate grammar highlighting keywords, static tensor types, actor primitives, and GPU kernels.
          </p>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=RahulChaube.blyx-language"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#0EA5E9",
              color: "#ffffff",
              padding: "10px 24px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Install from Marketplace ↗
          </a>
        </div>
      </main>
    </div>
  );
}
