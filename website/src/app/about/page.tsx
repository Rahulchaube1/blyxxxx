import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / About
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
          About Blyx & Philosophy
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "48px" }}>
          Blyx was created to bridge high-level AI framework expressiveness with low-level systems performance.
        </p>

        <div style={{ padding: "32px", background: "#121118", borderRadius: "12px", border: "1px solid rgba(124, 58, 237, 0.2)", marginBottom: "32px" }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "22px", color: "#F0EDE8", marginBottom: "12px" }}>
            Design Principles
          </h2>
          <ul style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#9CA3AF", lineHeight: 1.7, margin: 0, paddingLeft: "20px" }}>
            <li><strong style={{ color: "#F0EDE8" }}>Zero-Cost Abstractions:</strong> High-level tensor operations and actor messaging compile directly to machine code without runtime overhead.</li>
            <li><strong style={{ color: "#F0EDE8" }}>Compile-Time Verification:</strong> Memory safety, array bounds, and tensor dimensions are checked before execution.</li>
            <li><strong style={{ color: "#F0EDE8" }}>Unified Toolchain:</strong> Single binary handles building, testing, package management, formatting, and LSP diagnostics.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
