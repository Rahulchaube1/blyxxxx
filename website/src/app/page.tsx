"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const CODE_EXAMPLES = [
  {
    id: 'ai-primitives',
    title: 'AI Primitives & Reasoning',
    filename: 'ai_reasoning.blyx',
    description: 'First-class keywords generate() and reason() lower directly to BIR SSA instructions for zero-overhead LLM inference.',
    code: `// Blyx AI-Native Primitives
task synthesize_report(context: str) -> str {
    let model = "gpt-4o";

    // Chain-of-thought reasoning pass
    let thoughts = reason(context);
    
    // Direct LLM inference call via BIR SSA
    let report = generate(model, thoughts);

    return report;
}`
  },
  {
    id: 'orchestration',
    title: 'Multi-Agent Orchestration',
    filename: 'swarm.blyx',
    description: 'Coordinate typed agent task graphs natively with compile-time checked communication channels.',
    code: `// Multi-Agent Swarm Orchestration
task execute_swarm(data: str) {
    let researcher = Agent::new("researcher");
    let analyst = Agent::new("analyst");

    // Coordinate parallel agent graph
    let result = orchestrate([researcher, analyst], data);
    println!("Swarm completed task successfully.");
}`
  },
  {
    id: 'tensors',
    title: 'Static Tensor Types & GPU',
    filename: 'tensors.blyx',
    description: 'Compile-time tensor rank & dimension checking with inline GPU accelerator blocks targeting SPIR-V & NVPTX.',
    code: `// Static Tensor Dimensions & Inline GPU
fn compute_embeddings() {
    let weights: tensor<f32, 128, 64>;
    let inputs: tensor<f32, 64, 32>;

    // Heterogeneous GPU kernel block
    gpu {
        let matrix_out = weights * inputs;
    };
}`
  },
  {
    id: 'actors',
    title: 'Lock-Free Actor Concurrency',
    filename: 'actor_service.blyx',
    description: 'Isolated state actors communicating over lock-free lockless channels with zero garbage collection pauses.',
    code: `// Lock-Free Actor Service
actor InferenceWorker {
    request_count: u64,

    fn handle_query(&mut self, prompt: str) -> str {
        self.request_count += 1;
        return generate("llama3", prompt);
    }
}`
  }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('curl -sSL https://blyx-lang.space/install.sh | sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: '#0B0F19', color: '#F1F5F9', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
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
      `}</style>
      
      {/* Hero Section — Inspired by Rust-lang.org */}
      <section style={{ borderBottom: '1px solid #1E293B', padding: '80px 24px 70px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Release Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '4px',
            background: '#1E293B',
            border: '1px solid #334155',
            color: '#38BDF8',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '28px',
          }}>
            ⚡ Blyx v0.1.0-alpha Released &bull; AI-Native Systems Language with Rust Runtime
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(44px, 5.5vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: '24px',
            color: '#F8FAFC',
          }}>
            A language empowering everyone to build fast, safe, and intelligent software.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(18px, 2.2vw, 22px)',
            color: '#94A3B8',
            lineHeight: 1.6,
            marginBottom: '40px',
            maxWidth: '820px',
            margin: '0 auto 40px',
          }}>
            Blyx is an open-source, AI-native systems programming language backed by a high-performance Rust compiler runtime.
            Featuring first-class AI keywords (<code style={{ color: '#38BDF8' }}>generate</code>, <code style={{ color: '#38BDF8' }}>reason</code>, <code style={{ color: '#38BDF8' }}>orchestrate</code>, <code style={{ color: '#38BDF8' }}>task</code>), static tensor verification, lock-free actor concurrency, and zero garbage collection.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Link href="/download" style={{
              padding: '14px 32px',
              borderRadius: '6px',
              background: '#0EA5E9',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '16px',
              textDecoration: 'none',
            }}>
              Get Started
            </Link>
            <Link href="/learn" style={{
              padding: '14px 32px',
              borderRadius: '6px',
              background: '#1E293B',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none',
              border: '1px solid #334155',
            }}>
              Read the Blyx Book
            </Link>
            <Link href="/play" style={{
              padding: '14px 32px',
              borderRadius: '6px',
              background: '#1E293B',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '16px',
              textDecoration: 'none',
              border: '1px solid #334155',
            }}>
              Try Blyx Online
            </Link>
          </div>

          {/* Terminal Quick Install */}
          <div style={{
            maxWidth: '640px',
            margin: '0 auto',
            background: '#020617',
            border: '1px solid #1E293B',
            borderRadius: '6px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            color: '#F8FAFC',
          }}>
            <span style={{ color: '#64748B' }}>$ <span style={{ color: '#38BDF8' }}>curl -sSL https://blyx-lang.space/install.sh | sh</span></span>
            <button
              onClick={copyInstallCommand}
              style={{
                background: '#1E293B',
                border: '1px solid #334155',
                color: '#38BDF8',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </section>

      {/* Why Blyx? — Inspired by Rust-lang "Why Rust?" */}
      <section style={{ borderBottom: '1px solid #1E293B', padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F8FAFC', marginBottom: '48px', textAlign: 'center' }}>
          Why Blyx?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Pillar 1: Performance */}
          <div className="blyx-card" style={{ padding: '36px' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F8FAFC', marginBottom: '12px' }}>
              High Performance
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.7 }}>
              Blyx compiles directly to LLVM machine code via the BIR SSA intermediate representation. Zero garbage collection pauses, zero runtime reflection overhead, and low memory consumption.
            </p>
          </div>

          {/* Pillar 2: Reliability & Safety */}
          <div className="blyx-card" style={{ padding: '36px' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>🛡️</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F8FAFC', marginBottom: '12px' }}>
              Memory &amp; Thread Safety
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.7 }}>
              Strict compile-time ownership, lifetime borrowing, and type checks eliminate data races, null pointer dereferences, and memory leaks before your code ever runs in production.
            </p>
          </div>

          {/* Pillar 3: AI-Native */}
          <div className="blyx-card" style={{ padding: '36px' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>🧠</div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F8FAFC', marginBottom: '12px' }}>
              AI-Native Primitives
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.7 }}>
              LLM inference (<code style={{ color: '#38BDF8' }}>generate</code>), chain-of-thought reasoning (<code style={{ color: '#38BDF8' }}>reason</code>), and multi-agent coordination (<code style={{ color: '#38BDF8' }}>orchestrate</code>) are built into the language grammar as first-class instructions.
            </p>
          </div>

        </div>
      </section>

      {/* Language Deep Dive / Code Showcase */}
      <section style={{ borderBottom: '1px solid #1E293B', padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F8FAFC', marginBottom: '12px' }}>
            Language in Action
          </h2>
          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto' }}>
            Explore how Blyx syntax balances system-level precision with high-level AI orchestration.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {CODE_EXAMPLES.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => setActiveTab(idx)}
              style={{
                background: activeTab === idx ? '#0EA5E9' : '#1E293B',
                color: activeTab === idx ? '#FFFFFF' : '#94A3B8',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {ex.title}
            </button>
          ))}
        </div>

        {/* Code Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'center' }}>
          
          {/* Description Box */}
          <div className="blyx-card" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#F8FAFC', marginBottom: '16px' }}>
              {CODE_EXAMPLES[activeTab].title}
            </h3>
            <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.7, marginBottom: '24px' }}>
              {CODE_EXAMPLES[activeTab].description}
            </p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#38BDF8', background: '#020617', padding: '12px 16px', borderRadius: '6px', border: '1px solid #1E293B' }}>
              Source file: <span style={{ color: '#F8FAFC' }}>{CODE_EXAMPLES[activeTab].filename}</span>
            </div>
          </div>

          {/* Terminal Block */}
          <div style={{ background: '#020617', border: '1px solid #1E293B', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#0F172A', padding: '12px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#64748B' }}>
                {CODE_EXAMPLES[activeTab].filename}
              </span>
            </div>
            <pre style={{
              padding: '24px',
              margin: 0,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              lineHeight: 1.7,
              color: '#F8FAFC',
              overflowX: 'auto',
            }}>
              <code>{CODE_EXAMPLES[activeTab].code}</code>
            </pre>
          </div>

        </div>
      </section>

      {/* Compiler & Toolchain Architecture */}
      <section style={{ borderBottom: '1px solid #1E293B', padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px', textAlign: 'center' }}>
          Complete Toolchain &amp; Compiler Architecture
        </h2>
        <p style={{ fontSize: '18px', color: '#94A3B8', textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
          Built in Rust from the ground up for maximum developer velocity and toolchain consistency.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="blyx-card" style={{ padding: '28px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8', marginBottom: '8px' }}>
              blyxc
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6 }}>
              The primary compiler driver. Lexes, parses, type checks, lowers to BIR SSA, and emits LLVM IR or native machine code.
            </p>
          </div>

          <div className="blyx-card" style={{ padding: '28px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8', marginBottom: '8px' }}>
              blyxpkg
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6 }}>
              The official package manager and registry client. Handles dependency resolution, builds, and publishes crates/modules.
            </p>
          </div>

          <div className="blyx-card" style={{ padding: '28px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8', marginBottom: '8px' }}>
              blyxfmt
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6 }}>
              Opinionated code formatter ensuring standardized Blyx code style across projects and repositories.
            </p>
          </div>

          <div className="blyx-card" style={{ padding: '28px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8', marginBottom: '8px' }}>
              blyx-analyzer
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6 }}>
              Full Language Server Protocol (LSP) implementation providing inline diagnostics, autocomplete, and code navigation in VS Code.
            </p>
          </div>

        </div>
      </section>

      {/* Getting Started & Community Footer Callout */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px' }}>
          Get Started with Blyx Today
        </h2>
        <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '640px', margin: '0 auto 36px' }}>
          Install the compiler, read the official guide, or start building AI-native applications in your browser.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/download" style={{
            padding: '14px 32px',
            borderRadius: '6px',
            background: '#0EA5E9',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '16px',
            textDecoration: 'none',
          }}>
            Install Blyx &rarr;
          </Link>
          <Link href="/docs" style={{
            padding: '14px 32px',
            borderRadius: '6px',
            background: '#1E293B',
            color: '#F8FAFC',
            fontWeight: 600,
            fontSize: '16px',
            textDecoration: 'none',
            border: '1px solid #334155',
          }}>
            Explore Documentation
          </Link>
        </div>
      </section>

    </div>
  );
}
