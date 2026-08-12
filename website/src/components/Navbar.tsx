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
        background: "#0F172A",
        color: "#F8FAFC",
        textAlign: "center",
        padding: "8px 24px",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        borderBottom: "1px solid #1E293B",
      }}>
        ⚡ Blyx v0.1.0-alpha: AI-Native Systems Language with Rust Runtime &bull;{" "}
        <a
          href="https://github.com/Rahulchaube1/blyxxxx"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#38BDF8", fontWeight: 700, textDecoration: "underline" }}
        >
          View on GitHub &rarr;
        </a>
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: "#0B0F19",
        borderBottom: "1px solid #1E293B",
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
              color: "#F8FAFC",
              letterSpacing: "-0.5px",
            }}>
              Blyx<span style={{ color: "#0EA5E9" }}>.</span>
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
                    color: "#94A3B8",
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
                    color: "#94A3B8",
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
                background: "#0EA5E9",
                padding: "8px 18px",
                borderRadius: "6px",
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
