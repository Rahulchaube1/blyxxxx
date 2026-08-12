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
    <div style={{ background: "#0B0F19", color: "#F1F5F9", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      <style>{`
        .blyx-card {
          background: #101827;
          border: 1px solid #1E293B;
          border-radius: 8px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .blyx-card:hover {
          border-color: #334155;
          transform: translateY(-1px);
        }
        .blyx-link-card {
          background: #101827;
          border: 1px solid #1E293B;
          border-radius: 8px;
          padding: 28px;
          transition: border-color 0.2s ease, transform 0.2s ease;
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .blyx-link-card:hover {
          border-color: #334155;
          transform: translateY(-1px);
        }
      `}</style>
      <main style={{ padding: "60px 24px" }}>
        {/* ── Hero ── */}
        <section style={{ maxWidth: "860px", margin: "0 auto 60px" }}>
          <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "20px" }}>
            <Link href="/" style={{ color: "#38BDF8", textDecoration: "none" }}>Home</Link> / Community &amp; Governance
          </div>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(36px,5vw,60px)", color: "#F8FAFC", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "20px" }}>
            Community &amp; Governance
          </h1>
          <p style={{ fontSize: "clamp(17px,2vw,21px)", color: "#94A3B8", lineHeight: 1.7, margin: 0 }}>
            Blyx is an open-source project built by a global community of compiler engineers, systems programmers, and AI researchers.
          </p>
        </section>

        {/* ── Core Team ── */}
        <section style={{ maxWidth: "960px", margin: "0 auto 60px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "32px", color: "#F8FAFC", marginBottom: "32px" }}>
            Core Team
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
            {AUTHORS.map((author) => (
              <div key={author.name} className="blyx-card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #1E293B" }}>
                    <Image src={author.photo} alt={author.name} width={72} height={72} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#38BDF8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                      {author.role}
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: "22px", color: "#F8FAFC", margin: 0 }}>
                      {author.name}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                  {author.bio}
                </p>

                <div style={{ display: "flex", gap: "16px" }}>
                  <a href={author.github} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: "14px", color: "#38BDF8", textDecoration: "none" }}>
                    GitHub →
                  </a>
                  {author.x && (
                    <a href={author.x} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: "14px", color: "#94A3B8", textDecoration: "none" }}>
                      X (Twitter) →
                    </a>
                  )}
                  {author.linkedin && (
                    <a href={author.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: "14px", color: "#94A3B8", textDecoration: "none" }}>
                      LinkedIn →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Community Links ── */}
        <section style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2 style={{ fontWeight: 800, fontSize: "32px", color: "#F8FAFC", marginBottom: "32px" }}>
            Get Involved
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {[
              { title: "GitHub Repository", body: "Inspect source code, submit bug reports, and create pull requests.", href: "https://github.com/Rahulchaube1/blyxxxx", linkLabel: "Visit Repository →" },
              { title: "GitHub RFCs", body: "Propose language features, syntax changes, and compiler APIs.", href: "https://github.com/Blyx-lang-space/blyx/tree/blyx-main/RFC", linkLabel: "Browse RFCs →" },
              { title: "Code of Conduct", body: "Our community is welcoming and inclusive. Read our standards for participation.", href: "/community", linkLabel: "Read CoC →" },
              { title: "Security Disclosures", body: "Found a security vulnerability? Report it responsibly to the core team.", href: "/security", linkLabel: "Report Issue →" },
            ].map((card) => (
              <div key={card.title} className="blyx-card" style={{ padding: "28px" }}>
                <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#F8FAFC", marginBottom: "8px" }}>{card.title}</h3>
                <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6, marginBottom: "16px" }}>{card.body}</p>
                <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ color: "#38BDF8", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
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
