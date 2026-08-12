import React from "react";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh", padding: "60px 24px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / Blog
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "40px", color: "#F0EDE8", marginBottom: "16px", letterSpacing: "-0.5px" }}>
          Blyx Engineering Blog
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "48px" }}>
          Compiler architecture deep dives, release announcements, and language design notes.
        </p>

        <div style={{ display: "grid", gap: "32px" }}>
          {[
            {
              title: "Designing BIR: A Strongly-Typed SSA Intermediate Representation",
              date: "August 2, 2026",
              author: "Rahul Chaube",
              summary: "An in-depth look at how the Blyx Intermediate Representation enforces static shape verification and lifetime bounds before LLVM codegen.",
            },
            {
              title: "Memory Safety Without Garbage Collection in Blyx",
              date: "July 28, 2026",
              author: "Rahul Chaube",
              summary: "How compile-time linear ownership tracking eliminates double frees and data races with zero runtime latency overhead.",
            },
            {
              title: "Direct GPU PTX Compilation from High-Level Code",
              date: "July 15, 2026",
              author: "Rahul Chaube",
              summary: "Bypassing C/C++ CUDA wrappers: How Blyx lowers GPU kernels directly to NVPTX instructions.",
            },
          ].map((post, idx) => (
            <div key={idx} style={{ padding: "32px", background: "#121118", borderRadius: "12px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#A78BFA", marginBottom: "8px" }}>
                {post.date} • By {post.author}
              </div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "22px", color: "#F0EDE8", marginBottom: "12px" }}>
                {post.title}
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#9CA3AF", lineHeight: 1.6, margin: 0 }}>
                {post.summary}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
