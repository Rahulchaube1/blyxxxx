import React from "react";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / Security Policy
        </div>

        <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
          Blyx Security Policy
        </h1>
        <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "48px" }}>
          Vulnerability disclosure policy and compiler safety invariants.
        </p>

        <div style={{ padding: "32px", background: "#0F172A", borderRadius: "8px", border: "1px solid #1E293B" }}>
          <h2 style={{ fontWeight: 700, fontSize: "22px", color: "#F8FAFC", marginBottom: "12px" }}>
            Reporting Security Vulnerabilities
          </h2>
          <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>
            To report security vulnerabilities or compiler soundness bugs, please email <strong style={{ color: "#F8FAFC" }}>rahulchaube1@gmail.com</strong> or submit a private disclosure on GitHub.
          </p>
        </div>
      </main>
    </div>
  );
}
