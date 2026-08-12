import type { Metadata } from 'next';
import './globals.css';
import AppBackground from '@/components/AppBackground';

export const metadata: Metadata = {
  title: 'Blyx — A language built for the AI era.',
  description: 'Memory-safe, GPU-native, actor-concurrent. Zero garbage collector. Created by Rahul Chaube.',
  authors: [{ name: 'Rahul Chaube', url: 'https://github.com/Rahulchaube1' }],
  metadataBase: new URL('https://blyx-lang.space'),
  openGraph: {
    title: 'Blyx Programming Language',
    description: 'Memory-safe, GPU-native, actor-concurrent systems language for the AI era.',
    url: 'https://blyx-lang.space',
    siteName: 'Blyx',
    images: [{ url: '/blyxlogo.png' }],
  },
  twitter: {
    card: 'summary',
    creator: '@RahulChaube_',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/blyxlogo.png" />
      </head>
      <body>
        <AppBackground />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>{children}</div>
      </body>
    </html>
  );
}
