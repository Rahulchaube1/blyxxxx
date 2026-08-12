import React from "react";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / Security Policy
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
          Blyx Security Policy
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "48px" }}>
          Vulnerability disclosure policy and compiler safety invariants.
        </p>

        <div style={{ padding: "32px", background: "#121118", borderRadius: "12px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "22px", color: "#F0EDE8", marginBottom: "12px" }}>
            Reporting Security Vulnerabilities
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#9CA3AF", lineHeight: 1.7, margin: 0 }}>
            To report security vulnerabilities or compiler soundness bugs, please email <strong style={{ color: "#F0EDE8" }}>rahulchaube1@gmail.com</strong> or submit a private disclosure on GitHub.
          </p>
        </div>
      </main>
    </div>
  );
}
