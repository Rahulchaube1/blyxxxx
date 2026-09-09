import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blyx — Open-Source AI-Native Systems Programming Language',
  description: 'Blyx is an experimental, open-source AI-native systems programming language exploring AI-oriented computation, concurrency, tensors, heterogeneous computing, and native compilation.',
  authors: [{ name: 'Rahul Chaube', url: 'https://github.com/Rahulchaube1' }],
  metadataBase: new URL('https://blyx-lang.space'),
  alternates: { canonical: '/' },
  keywords: [
    'Blyx',
    'Blyx programming language',
    'AI-native systems programming language',
    'open-source programming language',
    'compiler',
    'systems programming',
    'BIR SSA',
    'tensor programming',
  ],
  openGraph: {
    title: 'Blyx — Open-Source AI-Native Systems Programming Language',
    description: 'An experimental open-source language exploring systems programming, AI-oriented computation, concurrency, tensors, heterogeneous computing, and native compilation.',
    url: 'https://blyx-lang.space/',
    siteName: 'Blyx',
    type: 'website',
    images: [{ url: '/blyxlogo.png', width: 800, height: 800, alt: 'Blyx logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blyx — Open-Source AI-Native Systems Programming Language',
    description: 'Experimental alpha programming-language project exploring AI-oriented systems programming.',
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
