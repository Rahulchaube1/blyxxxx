import React from "react";
import Link from "next/link";

export default function VSCodePage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / VS Code Extension
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
          BLYX Language VS Code Extension
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "48px" }}>
          Official language extension for Visual Studio Code published by RahulChaube. Features syntax highlighting, LSP diagnostics, and BIR SSA inspection.
        </p>

        <div style={{ padding: "32px", background: "#121118", borderRadius: "12px", border: "1px solid rgba(124, 58, 237, 0.2)", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#A78BFA", fontWeight: 700, marginBottom: "8px" }}>
            Publisher: RahulChaube
          </div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "22px", color: "#F0EDE8", marginBottom: "12px" }}>
            Marketplace Release
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "20px" }}>
            Full TextMate grammar highlighting keywords, static tensor types, actor primitives, and GPU kernels.
          </p>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=RahulChaube.blyx-language"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#7C3AED",
              color: "#ffffff",
              padding: "10px 24px",
              borderRadius: "6px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Install from Marketplace
          </a>
        </div>
      </main>
    </div>
  );
}
