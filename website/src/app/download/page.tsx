import React from "react";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / Install
        </div>

        <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
          Install Blyx
        </h1>
        <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "48px" }}>
          Install official standalone binaries for Linux, macOS, and Windows. Every release includes the compiler (<code style={{ background: "#1E293B", color: "#38BDF8", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>blyxc</code>), package manager (<code style={{ background: "#1E293B", color: "#38BDF8", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>blyxpkg</code>), and language server (<code style={{ background: "#1E293B", color: "#38BDF8", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>blyx-analyzer</code>).
        </p>

        {/* Quick Terminal Command */}
        <div
          style={{
            background: "#020617",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #1E293B",
            marginBottom: "48px",
          }}
        >
          <div style={{ background: "#0F172A", padding: "10px 16px", borderBottom: "1px solid #1E293B", color: "#64748B", fontSize: "13px", fontFamily: "monospace" }}>
            Quick Installer Terminal Command
          </div>
          <pre style={{ margin: 0, padding: "20px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", lineHeight: 1.8, color: "#F8FAFC" }}>
            <span style={{ color: "#0EA5E9" }}>$</span> curl -sSf https://blyx-lang.space/install.sh | sh
          </pre>
        </div>

        {/* OS Packages Table */}
        <h2 style={{ fontWeight: 700, fontSize: "24px", color: "#F8FAFC", marginBottom: "20px" }}>
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
                background: "#0F172A",
                borderRadius: "8px",
                border: "1px solid #1E293B",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px", color: "#F8FAFC" }}>
                  {pkg.os} — <span style={{ fontSize: "14px", color: "#94A3B8", fontWeight: 400 }}>{pkg.arch}</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#38BDF8", marginTop: "4px" }}>
                  {pkg.file}
                </div>
              </div>
              <a
                href="https://github.com/Rahulchaube1/blyxxxx/releases"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#0EA5E9",
                  color: "#fff",
                  padding: "8px 20px",
                  borderRadius: "6px",
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
