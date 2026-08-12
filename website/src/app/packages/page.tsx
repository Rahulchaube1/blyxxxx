import React from "react";
import Link from "next/link";

export default function PackagesPage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / Package Registry
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
          Blyx Package Registry
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "48px" }}>
          Discover and publish packages for the Blyx ecosystem using <code style={{ background: "rgba(124, 58, 237, 0.2)", color: "#A78BFA", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>blyxpkg</code>.
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
                background: "#121118",
                borderRadius: "12px",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "16px", color: "#F0EDE8" }}>
                    {pkg.name}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "12px", background: "rgba(124, 58, 237, 0.2)", padding: "2px 6px", borderRadius: "4px", color: "#A78BFA" }}>
                    {pkg.ver}
                  </span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", lineHeight: 1.6, margin: "0 0 16px" }}>
                  {pkg.desc}
                </p>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#9CA3AF", borderTop: "1px solid rgba(124, 58, 237, 0.2)", paddingTop: "12px" }}>
                Publisher: {pkg.author}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
