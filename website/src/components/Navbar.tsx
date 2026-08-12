"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS: [string, string, boolean][] = [
  ["Docs",       "/docs",                          false],
  ["Learn",      "/learn",                         false],
  ["Playground", "/play",                          false],
  ["Compiler",   "/compiler",                      false],
  ["Benchmarks", "/benchmarks",                    false],
  ["Community",  "/community",                     false],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100 }}>
      {/* Release Banner */}
      <div style={{
        background: "linear-gradient(90deg, #181028 0%, #2D1B4E 50%, #181028 100%)",
        color: "#F0EDE8",
        textAlign: "center",
        padding: "8px 24px",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        borderBottom: "1px solid rgba(124, 58, 237, 0.2)",
      }}>
        ⚡ Blyx v0.1.0-alpha: AI-Native Systems Language with Rust Runtime &bull;{" "}
        <a
          href="https://github.com/Rahulchaube1/blyxxxx"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#A78BFA", fontWeight: 700, textDecoration: "underline" }}
        >
          View on GitHub &rarr;
        </a>
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: "rgba(10, 9, 8, 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(124, 58, 237, 0.2)",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}>
          {/* Logo + Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <Image src="/blyxlogo.png" alt="Blyx Logo" width={40} height={40} priority />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "22px",
              color: "#F0EDE8",
              letterSpacing: "-0.5px",
            }}>
              Blyx<span style={{ color: "#7C3AED" }}>.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {NAV_LINKS.map(([label, href, external]) => (
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#9CA3AF",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {label} ↗
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#9CA3AF",
                    textDecoration: "none",
                    transition: "color 0.2s",
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
                fontWeight: 600,
                fontSize: "14px",
                color: "#ffffff",
                textDecoration: "none",
                background: "#7C3AED",
                padding: "8px 18px",
                borderRadius: "6px",
                boxShadow: "0 0 15px rgba(124, 58, 237, 0.4)",
              }}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
