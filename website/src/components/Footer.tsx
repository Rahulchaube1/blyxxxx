import React from "react";
import Link from "next/link";

function IconGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "#020617", borderTop: "1px solid #1E293B", color: "#94A3B8" }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "60px 24px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "40px",
      }}>
        {/* Column 1 — Documentation & Learn */}
        <div>
          <h4 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "16px", color: "#F8FAFC", marginBottom: "16px" }}>
            Learn &amp; Explore
          </h4>
          {[
            ["Documentation", "/docs"],
            ["Blyx Book", "/learn"],
            ["Interactive Playground", "/play"],
            ["Compiler Architecture", "/compiler"],
          ].map(([label, href]) => (
            <Link key={href} href={href} style={{ display: "block", fontSize: "14px", color: "#94A3B8", textDecoration: "none", marginBottom: "10px" }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Column 2 — Ecosystem */}
        <div>
          <h4 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "16px", color: "#F8FAFC", marginBottom: "16px" }}>
            Ecosystem
          </h4>
          {[
            ["Benchmarks & Performance", "/benchmarks"],
            ["Packages (blyxpkg)", "/packages"],
            ["VS Code Extension", "/vscode"],
            ["Community & RFCs", "/community"],
          ].map(([label, href]) => (
            <Link key={href} href={href} style={{ display: "block", fontSize: "14px", color: "#94A3B8", textDecoration: "none", marginBottom: "10px" }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Column 3 — Open Source & Neuroblyx */}
        <div>
          <h4 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "16px", color: "#F8FAFC", marginBottom: "16px" }}>
            Open Source &amp; Neuroblyx
          </h4>
          <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "12px" }}>
            Blyx is an open-source technology engineered and backed by <strong>Neuroblyx</strong> under dual MIT / Apache-2.0 licenses.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href="https://github.com/Rahulchaube1/blyxxxx"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#38BDF8", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
            >
              <IconGitHub /> GitHub Repository ↗
            </a>
            <a
              href="https://buymeacoffee.com/rahulchaube"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#FBBF24", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
            >
              ☕ Sponsor on Buy Me A Coffee ↗
            </a>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1E293B", textAlign: "center", padding: "24px", fontSize: "13px", color: "#64748B" }}>
        &copy; 2026 Neuroblyx &bull; Blyx is an open-source product of Neuroblyx &bull; Founded &amp; Lead by <a href="https://github.com/Rahulchaube1" target="_blank" rel="noopener noreferrer" style={{ color: "#38BDF8", textDecoration: "underline" }}>Rahul Chaube</a>
      </div>
    </footer>
  );
}
