import React from "react";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / Install
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
          Install Blyx
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "48px" }}>
          Install official standalone binaries for Linux, macOS, and Windows. Every release includes the compiler (<code style={{ background: "rgba(124, 58, 237, 0.2)", color: "#A78BFA", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>blyx</code>), package manager (<code style={{ background: "rgba(124, 58, 237, 0.2)", color: "#A78BFA", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>blyxpkg</code>), and language server (<code style={{ background: "rgba(124, 58, 237, 0.2)", color: "#A78BFA", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>blyx-lsp</code>).
        </p>

        {/* Quick Terminal Command */}
        <div
          style={{
            background: "#121118",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            marginBottom: "48px",
          }}
        >
          <div style={{ background: "#181622", padding: "10px 16px", borderBottom: "1px solid rgba(124, 58, 237, 0.2)", color: "#9CA3AF", fontSize: "13px", fontFamily: "monospace" }}>
            Quick Installer Terminal Command
          </div>
          <pre style={{ margin: 0, padding: "20px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", lineHeight: 1.8, color: "#F0EDE8" }}>
            <span style={{ color: "#7C3AED" }}>$</span> curl -sSf https://blyx-lang.space/install.sh | sh
          </pre>
        </div>

        {/* OS Packages Table */}
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "24px", color: "#F0EDE8", marginBottom: "20px" }}>
          Standalone Binary Packages
        </h2>
        <div style={{ display: "grid", gap: "16px" }}>
          {[
            { os: "Linux", arch: "x86_64", file: "blyx-v0.1.0-alpha-x86_64-linux-gnu.tar.gz" },
            { os: "macOS", arch: "Apple Silicon (aarch64)", file: "blyx-v0.1.0-alpha-aarch64-apple-darwin.tar.gz" },
            { os: "Windows", arch: "x64", file: "blyx-v0.1.0-alpha-x86_64-pc-windows-msvc.zip" },
          ].map((pkg, idx) => (
            <div
              key={idx}
              style={{
                padding: "20px 24px",
                background: "#121118",
                borderRadius: "12px",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "16px", color: "#F0EDE8" }}>
                  {pkg.os} — <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 400 }}>{pkg.arch}</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#A78BFA", marginTop: "4px" }}>
                  {pkg.file}
                </div>
              </div>
              <a
                href="https://github.com/Rahulchaube1/blyxxxx/releases"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#7C3AED",
                  color: "#fff",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                Download Package
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
