"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <div style={{ background: '#080F1E', color: '#F0EDE8', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero Section with Doodle Banner Background */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px 80px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Banner Illustration */}
        <div style={{ maxWidth: '1000px', margin: '0 auto 36px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0, 207, 255, 0.25)', boxShadow: '0 0 35px rgba(0, 207, 255, 0.15)' }}>
          <Image
            src="/hero_doodle.jpg"
            alt="Blyx Penguin Mascot Doodle Banner"
            width={1200}
            height={675}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Release Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: '9999px',
          background: 'rgba(0, 207, 255, 0.12)',
          border: '1px solid rgba(0, 207, 255, 0.35)',
          color: '#00CFFF',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '24px',
        }}>
          🐧 Blyx v0.1.0-alpha Released &bull; AI-Native Systems Language
        </div>

        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(42px, 6vw, 76px)',
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: '-2px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 20%, #F0EDE8 50%, #00CFFF 80%, #7C3AED 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          The language that thinks.
        </h1>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(18px, 2.2vw, 22px)',
          color: '#7A8FB0',
          maxWidth: '820px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Blyx is an AI-native programming language backed by a high-performance <strong style={{ color: '#F0EDE8' }}>Rust compiler engine</strong>.
          Designed with first-class primitives (<code style={{ color: '#00CFFF', background: 'rgba(0,207,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>generate</code>, <code style={{ color: '#00CFFF', background: 'rgba(0,207,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>reason</code>, <code style={{ color: '#00CFFF', background: 'rgba(0,207,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>orchestrate</code>, <code style={{ color: '#00CFFF', background: 'rgba(0,207,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>task</code>), static tensor types, and lock-free actor concurrency with zero garbage collection.
        </p>

        {/* CTA Buttons + Coding Mascot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', marginBottom: '56px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/download" style={{
              padding: '16px 36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #00CFFF 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(0, 207, 255, 0.4)',
              transition: 'all 0.2s',
            }}>
              Get Started &rarr;
            </Link>
            <Link href="/play" style={{
              padding: '16px 36px',
              borderRadius: '10px',
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
        </div>

        {/* Quick Install Bar */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 60px',
          background: '#0D172A',
          border: '1px solid rgba(0, 207, 255, 0.35)',
          borderRadius: '12px',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          color: '#F0EDE8',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>
          <span style={{ color: '#7A8FB0' }}>$ <span style={{ color: '#F0EDE8' }}>curl -sSL https://blyx-lang.space/install.sh | sh</span></span>
          <button
            onClick={copyInstallCommand}
            style={{
              background: 'rgba(0, 207, 255, 0.18)',
              border: '1px solid #00CFFF',
              color: '#00CFFF',
              borderRadius: '6px',
              padding: '6px 14px',
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
          maxWidth: '900px',
          margin: '0 auto',
          background: '#0C1322',
          border: '1px solid rgba(0, 207, 255, 0.3)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          textAlign: 'left',
        }}>
          {/* Terminal Header */}
          <div style={{
            background: '#131C31',
            padding: '14px 24px',
            borderBottom: '1px solid rgba(0, 207, 255, 0.2)',
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
                    background: activeTab === idx ? '#00CFFF' : 'transparent',
                    color: activeTab === idx ? '#080F1E' : '#7A8FB0',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  {ex.filename}
                </button>
              ))}
            </div>
          </div>

          {/* Code Block */}
          <pre style={{
            padding: '28px',
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

      {/* Core Features Grid with Penguin Mascot Doodle Art */}
      <section style={{ padding: '80px 24px 100px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '38px', fontWeight: 800, color: '#F0EDE8', marginBottom: '14px' }}>
            Built for the AI &amp; Systems Horizon
          </h2>
          <p style={{ fontSize: '18px', color: '#7A8FB0', maxWidth: '660px', margin: '0 auto' }}>
            Combining Rust-level safety and speed with native LLM primitives for autonomous multi-agent workloads.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
          
          {/* Card 1: AI-First Primitives */}
          <div style={{ background: '#0D172A', border: '1px solid rgba(0, 207, 255, 0.25)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0, 207, 255, 0.3)' }}>
              <Image src="/penguin_thinking.jpg" alt="Thinking Penguin Mascot" width={120} height={120} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: 700, color: '#F0EDE8', marginBottom: '12px', textAlign: 'center' }}>
              AI-First Primitives
            </h3>
            <p style={{ color: '#7A8FB0', fontSize: '15px', lineHeight: 1.6 }}>
              First-class language keywords (<code style={{ color: '#00CFFF' }}>generate</code>, <code style={{ color: '#00CFFF' }}>reason</code>, <code style={{ color: '#00CFFF' }}>orchestrate</code>, <code style={{ color: '#00CFFF' }}>task</code>) lowered through BIR SSA directly to inference runtime bridges.
            </p>
          </div>

          {/* Card 2: Rust Engine Speed */}
          <div style={{ background: '#0D172A', border: '1px solid rgba(0, 207, 255, 0.25)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 155, 59, 0.3)' }}>
              <Image src="/penguin_crab_duo.jpg" alt="Penguin & Rust Crab Duo" width={120} height={120} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: 700, color: '#F0EDE8', marginBottom: '12px', textAlign: 'center' }}>
              Rust Engine Speed
            </h3>
            <p style={{ color: '#7A8FB0', fontSize: '15px', lineHeight: 1.6 }}>
              Zero garbage collection pauses. Ownership &amp; lifetime analysis enforce data race safety and deterministic memory management across high-concurrency loops.
            </p>
          </div>

          {/* Card 3: Inline GPU Accelerators */}
          <div style={{ background: '#0D172A', border: '1px solid rgba(0, 207, 255, 0.25)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0, 207, 255, 0.3)' }}>
              <Image src="/penguin_gpu.jpg" alt="GPU Penguin Mascot" width={120} height={120} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: 700, color: '#F0EDE8', marginBottom: '12px', textAlign: 'center' }}>
              Inline GPU Accelerators
            </h3>
            <p style={{ color: '#7A8FB0', fontSize: '15px', lineHeight: 1.6 }}>
              Heterogeneous compute blocks <code style={{ color: '#00CFFF' }}>gpu &#123; ... &#125;</code> targeting SPIR-V and NVPTX GPU architectures natively for inline tensor ops.
            </p>
          </div>

          {/* Card 4: Coding & Dev Toolchain */}
          <div style={{ background: '#0D172A', border: '1px solid rgba(0, 207, 255, 0.25)', borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0, 207, 255, 0.3)' }}>
              <Image src="/penguin_coding.jpg" alt="Coding Penguin Mascot" width={120} height={120} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '22px', fontWeight: 700, color: '#F0EDE8', marginBottom: '12px', textAlign: 'center' }}>
              Complete Toolchain
            </h3>
            <p style={{ color: '#7A8FB0', fontSize: '15px', lineHeight: 1.6 }}>
              Includes <code style={{ color: '#00CFFF' }}>blyxc</code> compiler driver, <code style={{ color: '#00CFFF' }}>blyxpkg</code> package manager, <code style={{ color: '#00CFFF' }}>blyxfmt</code> formatter, and <code style={{ color: '#00CFFF' }}>blyx-analyzer</code> LSP.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
