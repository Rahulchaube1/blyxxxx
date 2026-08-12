"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS: [string, string, boolean][] = [
  ["Install",    "/download",                      false],
  ["Learn",      "https://doc.blyx-lang.space/",   true],   // external docs
  ["Playground", "/play",                          false],
  ["Tools",      "/compiler",                      false],
  ["Community",  "/community",                     false],
  ["Blog",       "/blog",                          false],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      {/* Release Banner */}
      <div style={{
        background: "#1f2937",
        color: "#f9fafb",
        textAlign: "center",
        padding: "10px 24px",
        fontSize: "clamp(13px, 2vw, 15px)",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
      }}>
        Blyx v0.1.0-alpha is here!{" "}
        <a
          href="https://github.com/Rahulchaube1/blyxxxx/releases"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#fb923c", fontWeight: 700, textDecoration: "underline" }}
        >
          Read the release notes {"->"}
        </a>
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: "#ffffff",
        borderBottom: "2px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "clamp(68px, 8vw, 80px)",
        }}>
          {/* Logo + Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
            <Image src="/blyxlogo.png" alt="Blyx Logo" width={48} height={48} priority />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(22px, 3vw, 28px)",
              color: "#111827",
              letterSpacing: "-1px",
            }}>
              Blyx
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links" style={{ display: "flex", gap: "clamp(18px, 3vw, 36px)", alignItems: "center" }}>
            {NAV_LINKS.map(([label, href, external]) => (
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(15px, 1.5vw, 17px)",
                    color: "#374151",
                    textDecoration: "none",
                    padding: "4px 0",
                    borderBottom: "2px solid transparent",
                  }}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(15px, 1.5vw, 17px)",
                    color: "#374151",
                    textDecoration: "none",
                    padding: "4px 0",
                    borderBottom: "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </Link>
              )
            ))}
            <a
              href="https://github.com/Rahulchaube1/blyxxxx"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(14px, 1.4vw, 16px)",
                color: "#ffffff",
                textDecoration: "none",
                background: "#e05d44",
                padding: "10px 22px",
                borderRadius: "8px",
              }}
            >
              GitHub ↗
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="mobile-toggle"
            style={{
              background: "none",
              border: "2px solid #e5e7eb",
              color: "#111827",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "16px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div style={{
            background: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            padding: "24px clamp(20px, 4vw, 64px)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }} className="mobile-drawer">
            {NAV_LINKS.map(([label, href, external]) => (
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#111827",
                    textDecoration: "none",
                  }}
                >
                  {label} ↗
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#111827",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              )
            ))}
            <a
              href="https://github.com/Rahulchaube1/blyxxxx"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#e05d44",
              }}
            >
              GitHub ↗
            </a>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 901px) {
          .nav-links { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  );
}
