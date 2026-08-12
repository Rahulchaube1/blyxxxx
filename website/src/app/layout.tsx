import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blyx — The Language That Thinks | AI-Native Programming Language',
  description: 'Blyx is an AI-native programming language with a high-performance Rust runtime, first-class LLM inference primitives (generate, reason, orchestrate, task), static tensor types, and zero-overhead memory safety.',
  authors: [{ name: 'Rahul Chaube', url: 'https://github.com/Rahulchaube1' }],
  metadataBase: new URL('https://blyx-lang.space'),
  openGraph: {
    title: 'Blyx — The Language That Thinks',
    description: 'AI-native programming language with Rust runtime, static tensors, actor concurrency, and first-class LLM operations.',
    url: 'https://blyx-lang.space',
    siteName: 'Blyx',
    images: [{ url: '/blyxlogo.png', width: 800, height: 800, alt: 'Blyx Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blyx — The Language That Thinks',
    description: 'AI-native programming language with Rust runtime.',
    creator: '@RahulChaube_',
    images: ['/blyxlogo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/blyxlogo.png" />
      </head>
      <body style={{ background: '#0A0908', color: '#F0EDE8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
