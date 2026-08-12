import BookLayout from '@/components/BookLayout';
import { chapters } from '@/lib/bookContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return Object.keys(chapters).map((slug) => ({ slug }));
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || 'ch01-getting-started';
  const chapter = chapters[slug] || chapters['ch01-getting-started'];

  return (
    <div style={{ background: '#ffffff', color: '#1f1f1f', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <BookLayout currentSlug={slug}>
          <div dangerouslySetInnerHTML={{ __html: chapter.html }} />
        </BookLayout>
      </div>
      <Footer />
    </div>
  );
}
