import Link from 'next/link';

const pillars = [
  {
    title: 'AI-oriented language primitives',
    text: 'Blyx explores language-level constructs such as generate, reason, orchestrate, and task for AI-oriented programming models.',
  },
  {
    title: 'Systems programming foundation',
    text: 'The project is organized as a native-oriented compiler and runtime experiment with explicit compiler stages, concurrency concepts, and low-level control.',
  },
  {
    title: 'BIR / SSA architecture',
    text: 'Blyx separates language semantics from lower-level code generation through a dedicated intermediate representation and SSA-oriented pipeline.',
  },
  {
    title: 'Tensors and heterogeneous computing',
    text: 'Tensor-oriented types and accelerator-oriented execution are part of the language design, with implementation maturity varying by feature.',
  },
];

const contributionLinks = [
  ['Parser regression tests', 'https://github.com/Rahulchaube1/blyxxxx/issues/5'],
  ['Formatter tests', 'https://github.com/Rahulchaube1/blyxxxx/issues/6'],
  ['Minimal language example', 'https://github.com/Rahulchaube1/blyxxxx/issues/7'],
  ['Lexer edge-case tests', 'https://github.com/Rahulchaube1/blyxxxx/issues/8'],
];

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Blyx',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    description: 'Experimental open-source AI-native systems programming language.',
    url: 'https://blyx-lang.space/',
    codeRepository: 'https://github.com/Rahulchaube1/blyxxxx',
    license: 'https://github.com/Rahulchaube1/blyxxxx/blob/blyx-main/LICENSE-MIT',
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section style={{ padding: '96px 24px 80px', borderBottom: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', padding: '7px 14px', border: '1px solid #334155', borderRadius: 999, color: '#38BDF8', background: '#0F172A', fontSize: 13, fontWeight: 700 }}>
            v0.1.0-alpha · experimental open source
          </span>
          <h1 style={{ margin: '28px auto 20px', maxWidth: 900, fontSize: 'clamp(44px, 7vw, 78px)', lineHeight: 1.03, letterSpacing: '-2px', fontWeight: 900, color: '#F8FAFC' }}>
            AI-native systems programming, explored in the open.
          </h1>
          <p style={{ maxWidth: 760, margin: '0 auto 36px', color: '#94A3B8', fontSize: 'clamp(18px, 2vw, 22px)', lineHeight: 1.65 }}>
            Blyx is an experimental programming language exploring how AI-oriented computation, systems programming, concurrency, tensors, heterogeneous computing, and native compilation can fit into one language model.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/learn" style={{ padding: '13px 24px', borderRadius: 7, background: '#0EA5E9', color: '#fff', fontWeight: 800, textDecoration: 'none' }}>Learn Blyx</Link>
            <Link href="/play" style={{ padding: '13px 24px', borderRadius: 7, background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', fontWeight: 700, textDecoration: 'none' }}>Try the Playground</Link>
            <a href="https://github.com/Rahulchaube1/blyxxxx" target="_blank" rel="noreferrer" style={{ padding: '13px 24px', borderRadius: 7, background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC', fontWeight: 700, textDecoration: 'none' }}>Explore GitHub ↗</a>
          </div>
          <p style={{ marginTop: 22, color: '#64748B', fontSize: 14 }}>
            Alpha status is intentional: the frontend is under active development and native code generation/execution are not yet complete.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, marginBottom: 42 }}>
          <h2 style={{ fontSize: 36, color: '#F8FAFC', marginBottom: 12 }}>What Blyx is exploring</h2>
          <p style={{ color: '#94A3B8', fontSize: 17, lineHeight: 1.7 }}>The project is deliberately transparent about what is implemented, experimental, and planned.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18 }}>
          {pillars.map((pillar) => (
            <article key={pillar.title} style={{ padding: 26, border: '1px solid #1E293B', borderRadius: 12, background: '#101827' }}>
              <h3 style={{ color: '#F8FAFC', fontSize: 19, marginBottom: 10 }}>{pillar.title}</h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, fontSize: 15 }}>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ borderTop: '1px solid #1E293B', borderBottom: '1px solid #1E293B', background: '#080C14' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 34, color: '#F8FAFC', marginBottom: 14 }}>See the language</h2>
            <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: 22 }}>The syntax is evolving. This example demonstrates the direction without implying that every runtime or backend capability is already complete.</p>
            <pre style={{ margin: 0, padding: 22, borderRadius: 10, background: '#020617', border: '1px solid #1E293B', overflowX: 'auto', color: '#E2E8F0', lineHeight: 1.65 }}><code>{`fn main() {
    let result = generate("Summarize this document");
    print(result);
}`}</code></pre>
          </div>
          <div style={{ padding: 28, border: '1px solid #1E293B', borderRadius: 12, background: '#101827' }}>
            <h3 style={{ color: '#F8FAFC', fontSize: 22, marginBottom: 16 }}>Compiler pipeline</h3>
            <ol style={{ color: '#CBD5E1', lineHeight: 2, paddingLeft: 22 }}>
              <li>Source → Lexer</li>
              <li>Parser → AST</li>
              <li>Semantic analysis</li>
              <li>Type checking</li>
              <li>BIR / SSA</li>
              <li>Optimization</li>
              <li>Backend / code generation — in development</li>
            </ol>
            <Link href="/compiler" style={{ display: 'inline-block', marginTop: 12, color: '#38BDF8', fontWeight: 700 }}>Read the compiler architecture →</Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 34, color: '#F8FAFC', marginBottom: 14 }}>Build with us</h2>
            <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: 22 }}>Blyx is intentionally open to compiler engineers, systems programmers, language designers, researchers, tooling developers, and documentation contributors.</p>
            <div style={{ display: 'grid', gap: 10 }}>
              {contributionLinks.map(([label, href]) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" style={{ padding: '12px 14px', borderRadius: 8, background: '#101827', border: '1px solid #1E293B', color: '#CBD5E1', textDecoration: 'none' }}>{label} ↗</a>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 34, color: '#F8FAFC', marginBottom: 14 }}>Project resources</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                ['Documentation', '/docs'],
                ['Blyx Book', '/learn'],
                ['Playground', '/play'],
                ['Examples', '/examples'],
                ['Roadmap', '/roadmap'],
                ['Community', '/community'],
              ].map(([label, href]) => <Link key={href} href={href} style={{ padding: '12px 14px', borderRadius: 8, background: '#101827', border: '1px solid #1E293B', color: '#CBD5E1', textDecoration: 'none' }}>{label} →</Link>)}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '70px 24px 90px', background: '#020617', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#F8FAFC', fontSize: 36, marginBottom: 14 }}>Help shape the language.</h2>
          <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: 24 }}>Try Blyx, inspect the compiler, report what is confusing, or send a small contribution. Technical criticism is welcome.</p>
          <a href="https://github.com/Rahulchaube1/blyxxxx" target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '13px 24px', borderRadius: 7, background: '#0EA5E9', color: '#fff', fontWeight: 800, textDecoration: 'none' }}>Open the repository ↗</a>
        </div>
      </section>
    </main>
  );
}
