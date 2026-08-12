declare module 'framer-motion';

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    authors?: Array<{ name: string; url?: string }>;
    metadataBase?: URL;
    openGraph?: any;
    twitter?: any;
    [key: string]: any;
  }
}

declare module 'next/link' {
  import React from 'react';
  const Link: React.ComponentType<any>;
  export default Link;
}

declare module 'next/image' {
  import React from 'react';
  const Image: React.ComponentType<any>;
  export default Image;
}

declare module 'next/navigation' {
  export function usePathname(): string;
  export function useRouter(): any;
  export function useSearchParams(): any;
}

declare module 'next/dynamic' {
  import React from 'react';
  export default function dynamic(loader: () => Promise<any>, options?: any): React.ComponentType<any>;
}

declare module 'lucide-react' {
  export const ShieldCheck: any;
  export const Zap: any;
  export const Cpu: any;
  export const Layers: any;
  export const Terminal: any;
  export const ArrowRight: any;
  export const Download: any;
  export const BookOpen: any;
  export const Code2: any;
  export const Box: any;
  export const Globe2: any;
  export const Lock: any;
  export const Github: any;
  export const Menu: any;
  export const X: any;
  export const Search: any;
  export const Sun: any;
  export const Moon: any;
  export const Sparkles: any;
  export const Check: any;
  export const Copy: any;
  export const Shield: any;
  export const ChevronRight: any;
  export const Calendar: any;
  export const User: any;
  export const MessageSquare: any;
  export const FileText: any;
  export const UserCheck: any;
  export const CheckCircle2: any;
  export const Clock: any;
  export const AlertTriangle: any;
  export const CheckCircle: any;
  export const Code: any;
  export const Play: any;
  export const RotateCcw: any;
  export const Package: any;
  export const ExternalLink: any;
  export const Heart: any;
}
