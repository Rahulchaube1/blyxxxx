import React from "react";
import Link from "next/link";
import Image from "next/image";
import MarqueSection from "@/components/MarqueSection";

const AUTHORS = [
  {
    photo: "/rahul.png",
    name: "Rahul Chaube",
    role: "Core Author & Lead Architect",
    bio: "Designer of the Blyx language specification, BIR SSA intermediate format, and lead maintainer of the compiler toolchain. Created Blyx to bring GPU-native, memory-safe programming to every developer.",
    github: "https://github.com/Rahulchaube1",
    x: "https://x.com/RahulChaube_",
    linkedin: "https://linkedin.com/in/rahulchaube1",
  },
  {
    photo: "/ujjwal.png",
    name: "Ujjwal Chaudhury",
    role: "Core Contributor & Systems Engineer",
    bio: "Core systems engineer contributing to the Blyx standard library, actor runtime, and package manager. Expert in low-level memory systems and concurrency primitives.",
    github: "https://github.com/Blyx-lang-space",
    x: null,
    linkedin: null,
  },
];

export default function CommunityPage() {
  return (
    <div style={{ background: "#0A0908", color: "#F0EDE8", minHeight: "100vh" }}>
      <main style={{ padding: "60px 24px" }}>
        {/* ── Hero ── */}
        <section style={{ maxWidth: "800px", margin: "0 auto 60px" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", marginBottom: "20px" }}>
            <Link href="/" style={{ color: "#A78BFA", textDecoration: "none" }}>Home</Link> / Community &amp; Governance
          </div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(36px,5vw,60px)", color: "#F0EDE8", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "20px" }}>
            Community &amp; Governance
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(17px,2vw,21px)", color: "#9CA3AF", lineHeight: 1.7, margin: 0 }}>
            Blyx is an open-source project built by a global community of compiler engineers, systems programmers, and AI researchers.
          </p>
        </section>

        {/* ── Core Team ── */}
        <section style={{ maxWidth: "960px", margin: "0 auto 60px" }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "36px", color: "#F0EDE8", marginBottom: "40px" }}>
            Core Team
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px" }}>
            {AUTHORS.map((author) => (
              <div key={author.name} style={{ background: "#121118", border: "1px solid rgba(124, 58, 237, 0.2)", borderTop: "4px solid #7C3AED", borderRadius: "12px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #7C3AED" }}>
                    <Image src={author.photo} alt={author.name} width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                      {author.role}
                    </div>
                    <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "22px", color: "#F0EDE8", margin: 0 }}>
                      {author.name}
                    </h3>
                  </div>
                </div>

                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#9CA3AF", lineHeight: 1.6, margin: 0 }}>
                  {author.bio}
                </p>

                <div style={{ display: "flex", gap: "16px" }}>
                  <a href={author.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "14px", color: "#A78BFA", textDecoration: "none" }}>
                    GitHub &rarr;
                  </a>
                  {author.x && (
                    <a href={author.x} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "14px", color: "#9CA3AF", textDecoration: "none" }}>
                      X (Twitter) &rarr;
                    </a>
                  )}
                  {author.linkedin && (
                    <a href={author.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "14px", color: "#9CA3AF", textDecoration: "none" }}>
                      LinkedIn &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Community Links ── */}
        <section style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "32px", color: "#F0EDE8", marginBottom: "32px" }}>
            Get Involved
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {[
              { title: "GitHub Repository", body: "Inspect source code, submit bug reports, and create pull requests.", href: "https://github.com/Rahulchaube1/blyxxxx", linkLabel: "Visit Repository →", color: "#7C3AED" },
              { title: "GitHub RFCs", body: "Propose language features, syntax changes, and compiler APIs.", href: "https://github.com/Blyx-lang-space/blyx/tree/blyx-main/RFC", linkLabel: "Browse RFCs →", color: "#06B6D4" },
              { title: "Code of Conduct", body: "Our community is welcoming and inclusive. Read our standards for participation.", href: "/community", linkLabel: "Read CoC →", color: "#10B981" },
              { title: "Security Disclosures", body: "Found a security vulnerability? Report it responsibly to the core team.", href: "/security", linkLabel: "Report Issue →", color: "#A78BFA" },
            ].map((card) => (
              <div key={card.title} style={{ padding: "28px", background: "#121118", border: "1px solid rgba(124, 58, 237, 0.2)", borderLeft: `4px solid ${card.color}`, borderRadius: "8px" }}>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "18px", color: "#F0EDE8", marginBottom: "8px" }}>{card.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "16px" }}>{card.body}</p>
                <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ color: card.color, fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                  {card.linkLabel}
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MarqueSection />
    </div>
  );
}
