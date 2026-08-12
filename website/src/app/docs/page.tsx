import React from "react";
import Link from "next/link";

export default function DocsPage() {
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
          <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / Documentation
        </div>

        <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
          Blyx Documentation
        </h1>
        <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "48px" }}>
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
              className="blyx-card"
              style={{
                padding: "32px",
              }}
            >
              <h2 style={{ fontWeight: 700, fontSize: "22px", color: "#F8FAFC", marginBottom: "8px" }}>
                {sec.title}
              </h2>
              <p style={{ fontSize: "15px", color: "#94A3B8", marginBottom: "20px", lineHeight: 1.6 }}>
                {sec.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {sec.links.map(([label, href], lIdx) => (
                  <Link
                    key={lIdx}
                    href={href}
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#38BDF8",
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
