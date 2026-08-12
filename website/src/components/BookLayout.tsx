"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export const CHAPTERS = [
  { slug: 'ch01-getting-started', title: 'Getting Started', sections: ['Installation', 'Hello World', 'Project Structure'] },
  { slug: 'ch02-hello-world', title: 'Programming a Guessing Game', sections: ['Setting Up', 'Processing a Guess', 'Generating a Secret Number'] },
  { slug: 'ch03-types-variables', title: 'Common Concepts', sections: ['Variables & Mutability', 'Data Types', 'Functions', 'Control Flow'] },
  { slug: 'ch04-functions', title: 'Functions & Closures', sections: ['Function Syntax', 'Parameters', 'Return Values', 'Closures'] },
  { slug: 'ch05-ownership-memory', title: 'Ownership & Memory', sections: ['What is Ownership?', 'References & Borrowing', 'The Slice Type'] },
  { slug: 'ch06-structs-enums', title: 'Structs & Enums', sections: ['Defining Structs', 'Impl Blocks', 'Enums', 'Option Type'] },
  { slug: 'ch07-pattern-matching', title: 'Pattern Matching', sections: ['match Expressions', 'if let', 'while let', 'Destructuring'] },
  { slug: 'ch08-traits-generics', title: 'Traits & Generics', sections: ['Defining Traits', 'Implementing Traits', 'Generic Functions', 'Where Clauses'] },
  { slug: 'ch09-error-handling', title: 'Error Handling', sections: ['Result<T,E>', 'The ? Operator', 'Custom Errors', 'Panics'] },
  { slug: 'ch10-collections', title: 'Collections & Iterators', sections: ['Arrays', 'Vectors', 'HashMaps', 'Iterators', 'Closures with Iterators'] },
  { slug: 'ch11-actors-concurrency', title: 'Actors & Concurrency', sections: ['Actor Model', 'spawn & send', 'Message Types', 'Work-Stealing Pool', 'Actor Supervision'] },
  { slug: 'ch12-tensors-ai', title: 'Tensors & AI', sections: ['tensor<T,D1,D2> Types', 'Dimension Checking', 'Matrix Operations', 'Neural Networks', 'Data Pipelines'] },
  { slug: 'ch13-gpu-compute', title: 'GPU & Heterogeneous Compute', sections: ['gpu {} Blocks', 'SPIR-V Target', 'NVPTX Target', 'Memory Transfers', 'GPU Kernels'] },
  { slug: 'ch14-async-await', title: 'Async & Await', sections: ['Futures', 'async fn', 'await', 'Async Actors', 'Async I/O'] },
  { slug: 'ch15-modules-packages', title: 'Modules & Packages', sections: ['mod System', 'use Paths', 'Blyx.toml', 'blyxpkg', 'Publishing'] },
  { slug: 'ch16-testing', title: 'Testing', sections: ['Unit Tests', 'Integration Tests', 'Test Attributes', 'Benchmarks', 'Test Output'] },
  { slug: 'ch17-compiler-internals', title: 'Compiler Architecture', sections: ['Lexer', 'Parser', 'Semantic Analysis', 'Type Checking', 'BIR & Optimization', 'Code Generation'] },
  { slug: 'ch18-advanced-features', title: 'Advanced Features', sections: ['Unsafe Blyx', 'FFI', 'Macros', 'Custom Allocators', 'Intrinsics'] },
];

export default function BookLayout({ children, currentSlug }: { children: React.ReactNode; currentSlug: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentIdx = CHAPTERS.findIndex(c => c.slug === currentSlug);
  const prev = currentIdx > 0 ? CHAPTERS[currentIdx - 1] : null;
  const next = currentIdx < CHAPTERS.length - 1 ? CHAPTERS[currentIdx + 1] : null;

  const sidebar = (
    <nav style={{
      width: 270, minWidth: 270, background: '#0F172A',
      borderRight: '1px solid #1E293B',
      height: '100vh', position: 'sticky', top: 0,
      overflowY: 'auto', padding: '24px 0', flexShrink: 0,
    }}>
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #1E293B', marginBottom: 16 }}>
        <Link href="/learn/book" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 4 }}>The Blyx Book</div>
          <div style={{ fontSize: 14, color: '#38BDF8', fontWeight: 600 }}>Table of Contents</div>
        </Link>
      </div>
      {CHAPTERS.map((ch, i) => {
        const active = ch.slug === currentSlug;
        return (
          <div key={ch.slug}>
            <Link href={`/learn/book/${ch.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '8px 20px',
                fontSize: 14,
                color: active ? '#38BDF8' : '#94A3B8',
                background: active ? '#1E293B' : 'transparent',
                borderLeft: active ? '3px solid #0EA5E9' : '3px solid transparent',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
                display: 'block',
              }}>
                <span style={{ color: '#64748B', marginRight: 8, fontSize: 12 }}>{String(i + 1).padStart(2, '0')}.</span>
                {ch.title}
              </div>
            </Link>
            {active && ch.sections.map(sec => (
              <div key={sec} style={{ padding: '4px 20px 4px 44px', fontSize: 13, color: '#64748B' }}>
                {sec}
              </div>
            ))}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B0F19', color: '#F1F5F9' }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="desktop-sidebar">{sidebar}</div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', zIndex: 201 }}>{sidebar}</div>
        </div>
      )}
      {/* Content */}
      <main style={{ flex: 1, minWidth: 0, padding: '48px max(24px, 5vw)', maxWidth: 860 }}>
        {/* Mobile: show hamburger */}
        <button onClick={() => setSidebarOpen(true)} style={{ display: 'none', marginBottom: 24, background: '#0F172A', border: '1px solid #1E293B', color: '#F8FAFC', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontFamily: 'Inter, sans-serif' }} className="mobile-menu-btn">
          Menu [=] Table of Contents
        </button>
        {children}
        {/* Prev / Next */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          {prev ? (
            <Link href={`/learn/book/${prev.slug}`} style={{ textDecoration: 'none', padding: '12px 20px', border: '1px solid #1E293B', borderRadius: 6, color: '#F8FAFC', fontSize: 14, fontFamily: 'Inter, sans-serif', flex: 1, background: '#0F172A' }}>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>← Previous</div>
              {prev.title}
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/learn/book/${next.slug}`} style={{ textDecoration: 'none', padding: '12px 20px', border: '1px solid #1E293B', borderRadius: 6, color: '#F8FAFC', fontSize: 14, fontFamily: 'Inter, sans-serif', textAlign: 'right', flex: 1, background: '#0F172A' }}>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Next →</div>
              {next.title}
            </Link>
          ) : <div />}
        </div>
      </main>
      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: block !important; }
        }
        a:hover { color: #38BDF8 !important; }
      `}</style>
    </div>
  );
}
