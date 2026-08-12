import React from "react";
import Link from "next/link";

export default function PackagesPage() {
  return (
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / Package Registry
        </div>

        <h1 style={{ fontWeight: 800, fontSize: "40px", color: "#F8FAFC", marginBottom: "16px", letterSpacing: "-1px" }}>
          Blyx Package Registry
        </h1>
        <p style={{ fontSize: "18px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "48px" }}>
          Discover and publish packages for the Blyx ecosystem using <code style={{ background: "#1E293B", color: "#38BDF8", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>blyxpkg</code>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {[
            {
              name: "std/tensor",
              ver: "v0.1.0-beta",
              author: "blyx-core",
              desc: "Multidimensional static shape verified tensor primitives with SIMD acceleration.",
            },
            {
              name: "std/actor",
              ver: "v0.1.0-beta",
              author: "blyx-core",
              desc: "Lock-free actor model concurrency runtime with channels and message passing.",
            },
            {
              name: "std/cuda",
              ver: "v0.1.0-beta",
              author: "blyx-core",
              desc: "NVIDIA NVPTX GPU kernel lowering and direct device memory dispatch.",
            },
            {
              name: "std/net",
              ver: "v0.1.0-beta",
              author: "blyx-core",
              desc: "High-throughput asynchronous TCP, UDP, and HTTP/3 networking stack.",
            },
          ].map((pkg, idx) => (
            <div
              key={idx}
              style={{
                padding: "28px",
                background: "#0F172A",
                borderRadius: "8px",
                border: "1px solid #1E293B",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "16px", color: "#F8FAFC" }}>
                    {pkg.name}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "12px", background: "#1E293B", padding: "2px 6px", borderRadius: "4px", color: "#38BDF8" }}>
                    {pkg.ver}
                  </span>
                </div>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6, margin: "0 0 16px" }}>
                  {pkg.desc}
                </p>
              </div>
              <div style={{ fontSize: "13px", color: "#64748B", borderTop: "1px solid #1E293B", paddingTop: "12px" }}>
                Publisher: {pkg.author}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
