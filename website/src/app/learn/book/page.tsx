import Link from 'next/link';

export default function BookIndex() {
  return (
    <div style={{ background: '#0A0908', color: '#F0EDE8', minHeight: '100vh', padding: '60px 24px' }}>
      <main style={{ maxWidth: 800, width: '100%', margin: '0 auto' }}>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#A78BFA', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>
          The Blyx Book
        </div>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 40, color: '#F0EDE8', marginBottom: 16 }}>
          The Blyx Programming Language
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 48, maxWidth: 600 }}>
          A complete guide to Blyx — from your first program to writing GPU kernels, actor systems, and high-performance AI workloads. Written by Rahul Chaube.
        </p>

        {/* Chapter list with descriptions */}
        {[
          { n: '01', slug: 'ch01-getting-started', title: 'Getting Started', desc: 'Install Blyx, write your first program, understand project structure.' },
          { n: '02', slug: 'ch02-hello-world', title: 'A Guessing Game', desc: 'Build a complete program — user input, random numbers, loops, error handling.' },
          { n: '03', slug: 'ch03-types-variables', title: 'Common Concepts', desc: 'Variables, mutability, data types, functions, comments, control flow.' },
          { n: '04', slug: 'ch04-functions', title: 'Functions & Closures', desc: 'Function syntax, parameters, return types, closures and higher-order functions.' },
          { n: '05', slug: 'ch05-ownership-memory', title: 'Ownership & Memory', desc: 'Blyx\'s memory model — ownership rules, references, borrowing, slices.' },
          { n: '06', slug: 'ch06-structs-enums', title: 'Structs & Enums', desc: 'Custom data types with structs, methods via impl, enums and Option.' },
          { n: '07', slug: 'ch07-pattern-matching', title: 'Pattern Matching', desc: 'match expressions, if let, while let, destructuring all Blyx types.' },
          { n: '08', slug: 'ch08-traits-generics', title: 'Traits & Generics', desc: 'Polymorphism in Blyx — define traits, implement them, use generic bounds.' },
          { n: '09', slug: 'ch09-error-handling', title: 'Error Handling', desc: 'Result<T,E>, the ? operator, custom error types, when to panic.' },
          { n: '10', slug: 'ch10-collections', title: 'Collections & Iterators', desc: 'Arrays, vectors, hashmaps, iterator chains, map/filter/fold.' },
          { n: '11', slug: 'ch11-actors-concurrency', title: 'Actors & Concurrency', desc: 'The Blyx actor model, spawn, send, join, work-stealing thread pools.' },
          { n: '12', slug: 'ch12-tensors-ai', title: 'Tensors & AI', desc: 'Native tensor<T,D1,D2> types, static dimension checking, neural networks.' },
          { n: '13', slug: 'ch13-gpu-compute', title: 'GPU & Heterogeneous Compute', desc: 'gpu {} blocks, SPIR-V and NVPTX targets, GPU memory management.' },
          { n: '14', slug: 'ch14-async-await', title: 'Async & Await', desc: 'Futures in Blyx, async functions, await, async actors, async I/O.' },
          { n: '15', slug: 'ch15-modules-packages', title: 'Modules & Packages', desc: 'The mod system, use paths, Blyx.toml manifest, blyxpkg, publishing.' },
          { n: '16', slug: 'ch16-testing', title: 'Testing', desc: 'Unit tests, integration tests, benchmark tests, test output.' },
          { n: '17', slug: 'ch17-compiler-internals', title: 'Compiler Architecture', desc: 'How blyxc works — lexer, parser, BIR, optimization passes, codegen.' },
          { n: '18', slug: 'ch18-advanced-features', title: 'Advanced Features', desc: 'Unsafe Blyx, FFI, macros, custom allocators, compiler intrinsics.' },
        ].map((ch) => (
          <Link
            key={ch.slug}
            href={`/learn/book/${ch.slug}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              gap: 20,
              padding: '20px 0',
              borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#A78BFA', fontWeight: 700, minWidth: 28, paddingTop: 2 }}>
              {ch.n}
            </span>
            <div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 17, color: '#F0EDE8', marginBottom: 4 }}>
                {ch.title}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9CA3AF', lineHeight: 1.5 }}>
                {ch.desc}
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
