"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const BLYX_EXAMPLES = [
  {
    title: 'AI Generation & CoT Reasoning',
    filename: 'inference.blyx',
    code: `// First-class LLM inference & chain-of-thought reasoning
task synthesize_response(prompt: str) -> str {
    let model = "gpt-4o";
    
    // Lowers directly to BIR SSA & native HTTP runtime dispatch
    let thoughts = reason(prompt);
    let output = generate(model, prompt);
    
    return output;
}`
  },
  {
    title: 'Multi-Agent Orchestration',
    filename: 'orchestrator.blyx',
    code: `// Declare and coordinate agent task graphs
task swarm_analysis(data: str) {
    let researcher = Agent::new("researcher");
    let analyst = Agent::new("analyst");

    // Native multi-agent coordination keyword
    let result = orchestrate([researcher, analyst], data);
    println!("Swarm task finished cleanly.");
}`
  },
  {
    title: 'Static Tensor Operations',
    filename: 'tensors.blyx',
    code: `// Compile-time verified rank & shape dimensions
fn matrix_multiply() {
    let weights: tensor<f32, 128, 64>;
    let inputs: tensor<f32, 64, 32>;

    // Inline heterogeneous GPU accelerator kernel
    gpu {
        let output = weights * inputs;
    };
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
    <div style={{ background: '#0A0908', color: '#F0EDE8', minHeight: '100vh' }}>
      {/* Background Radial Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1200px',
        height: '600px',
        background: 'radial-gradient(ellipse at top, rgba(124, 58, 237, 0.18) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 60px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'rgba(124, 58, 237, 0.12)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          color: '#A78BFA',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '28px',
        }}>
          ✨ Blyx v0.1.0-alpha Released &bull; AI-Native Systems Language
        </div>

        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(42px, 6vw, 76px)',
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: '-2px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 20%, #F0EDE8 50%, #A78BFA 80%, #7C3AED 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          The language that thinks.
        </h1>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(18px, 2.2vw, 22px)',
          color: '#9CA3AF',
          maxWidth: '780px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Blyx is an AI-native programming language backed by a high-performance <strong style={{ color: '#F0EDE8' }}>Rust compiler runtime</strong>.
          Designed with first-class primitives (<code style={{ color: '#A78BFA', background: 'rgba(124,58,237,0.2)', padding: '2px 6px', borderRadius: '4px' }}>generate</code>, <code style={{ color: '#A78BFA', background: 'rgba(124,58,237,0.2)', padding: '2px 6px', borderRadius: '4px' }}>reason</code>, <code style={{ color: '#A78BFA', background: 'rgba(124,58,237,0.2)', padding: '2px 6px', borderRadius: '4px' }}>orchestrate</code>, <code style={{ color: '#A78BFA', background: 'rgba(124,58,237,0.2)', padding: '2px 6px', borderRadius: '4px' }}>task</code>), static tensor types, and lock-free actor concurrency with zero garbage collection.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '56px' }}>
          <Link href="/download" style={{
            padding: '14px 32px',
            borderRadius: '8px',
            background: '#7C3AED',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '16px',
            textDecoration: 'none',
            boxShadow: '0 0 25px rgba(124, 58, 237, 0.5)',
            transition: 'all 0.2s',
          }}>
            Get Started &rarr;
          </Link>
          <Link href="/play" style={{
            padding: '14px 32px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#F0EDE8',
            fontWeight: 600,
            fontSize: '16px',
            textDecoration: 'none',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            Open Playground
          </Link>
        </div>

        {/* Quick Install Bar */}
        <div style={{
          maxWidth: '560px',
          margin: '0 auto 60px',
          background: '#121118',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: '10px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          color: '#F0EDE8',
        }}>
          <span style={{ color: '#9CA3AF' }}>$ <span style={{ color: '#F0EDE8' }}>curl -sSL https://blyx-lang.space/install.sh | sh</span></span>
          <button
            onClick={copyInstallCommand}
            style={{
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid #7C3AED',
              color: '#A78BFA',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Code Showcase Terminal */}
        <div style={{
          maxWidth: '860px',
          margin: '0 auto',
          background: '#121118',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          textAlign: 'left',
        }}>
          {/* Header / Tabs */}
          <div style={{
            background: '#181622',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {BLYX_EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  style={{
                    background: activeTab === idx ? '#7C3AED' : 'transparent',
                    color: activeTab === idx ? '#FFFFFF' : '#9CA3AF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 12px',
                    fontSize: '13px',
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {ex.filename}
                </button>
              ))}
            </div>
          </div>

          {/* Code Block */}
          <pre style={{
            padding: '24px',
            margin: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            lineHeight: 1.7,
            color: '#F0EDE8',
            overflowX: 'auto',
          }}>
            <code>{BLYX_EXAMPLES[activeTab].code}</code>
          </pre>
        </div>
      </section>

      {/* Core Features Grid */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '36px', fontWeight: 800, color: '#F0EDE8', marginBottom: '12px' }}>
            Built for the AI & Systems Horizon
          </h2>
          <p style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '640px', margin: '0 auto' }}>
            Combining Rust-level safety and speed with native LLM primitives for autonomous multi-agent workloads.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#121118', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              🧠
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700, color: '#F0EDE8', marginBottom: '10px' }}>
              AI-First Primitives
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
              First-class language keywords (<code style={{ color: '#A78BFA' }}>generate</code>, <code style={{ color: '#A78BFA' }}>reason</code>, <code style={{ color: '#A78BFA' }}>orchestrate</code>, <code style={{ color: '#A78BFA' }}>task</code>) lowered through BIR SSA to standard inference runtimes.
            </p>
          </div>

          <div style={{ background: '#121118', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              🦀
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700, color: '#F0EDE8', marginBottom: '10px' }}>
              Rust Engine Speed
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
              Zero garbage collection pauses. Ownership & lifetime analysis enforce data race safety and deterministic memory management.
            </p>
          </div>

          <div style={{ background: '#121118', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              🎭
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700, color: '#F0EDE8', marginBottom: '10px' }}>
              Lock-Free Actors
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
              Dedicated <code style={{ color: '#A78BFA' }}>actor</code> types with typed message channels backed by priority work-stealing thread schedulers.
            </p>
          </div>

          <div style={{ background: '#121118', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              𝚯
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700, color: '#F0EDE8', marginBottom: '10px' }}>
              Static Tensor Types
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
              Statically dimensioned <code style={{ color: '#A78BFA' }}>tensor&lt;f32, D1, D2&gt;</code> types catch matrix rank and dimension mismatches at compile time.
            </p>
          </div>

          <div style={{ background: '#121118', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              ⚡
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700, color: '#F0EDE8', marginBottom: '10px' }}>
              Inline GPU Accelerators
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
              Heterogeneous compute blocks <code style={{ color: '#A78BFA' }}>gpu &#123; ... &#125;</code> targeting SPIR-V and NVPTX GPU architectures natively.
            </p>
          </div>

          <div style={{ background: '#121118', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(124, 58, 237, 0.2)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              🛠️
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: 700, color: '#F0EDE8', marginBottom: '10px' }}>
              Complete Toolchain
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '15px' }}>
              Includes <code style={{ color: '#A78BFA' }}>blyxc</code> compiler, <code style={{ color: '#A78BFA' }}>blyxpkg</code> package manager, <code style={{ color: '#A78BFA' }}>blyxfmt</code> formatter, and <code style={{ color: '#A78BFA' }}>blyx-analyzer</code> LSP.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
