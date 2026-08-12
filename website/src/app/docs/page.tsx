import React from "react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / Documentation
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
          Blyx Documentation
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "48px" }}>
          Comprehensive guides, language specs, standard library references, and compiler tutorials.
        </p>

        <div style={{ display: "grid", gap: "24px" }}>
          {[
            {
              title: "Getting Started",
              desc: "Install the Blyx compiler, set up your editor, and build your first standalone binary.",
              links: [
                ["Installation & Setup", "/download"],
                ["Your First Program", "/play"],
                ["Package Manager (blyxpkg)", "/packages"],
              ],
            },
            {
              title: "Language Reference",
              desc: "Learn the core syntax, memory ownership rules, static tensor types, and actor model.",
              links: [
                ["Syntax & Control Flow", "#syntax"],
                ["Static Tensor Types", "#tensors"],
                ["Actor Model Concurrency", "#actors"],
                ["GPU Compute Blocks", "#gpu"],
              ],
            },
            {
              title: "Compiler & Tools",
              desc: "Understand the BIR SSA intermediate format and LLVM code generation pipeline.",
              links: [
                ["BIR SSA Architecture", "/compiler"],
                ["VS Code Extension", "/vscode"],
                ["Language Server (LSP)", "/compiler"],
              ],
            },
          ].map((sec, idx) => (
            <div
              key={idx}
              style={{
                padding: "32px",
                background: "#121118",
                borderRadius: "12px",
                border: "1px solid rgba(124, 58, 237, 0.2)",
              }}
            >
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "22px", color: "#F0EDE8", marginBottom: "8px" }}>
                {sec.title}
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#9CA3AF", marginBottom: "20px", lineHeight: 1.6 }}>
                {sec.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {sec.links.map(([label, href], lIdx) => (
                  <Link
                    key={lIdx}
                    href={href}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#A78BFA",
                      textDecoration: "none",
                    }}
                  >
                    {label} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
