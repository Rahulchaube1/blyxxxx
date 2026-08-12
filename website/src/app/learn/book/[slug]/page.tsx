import BookLayout from '@/components/BookLayout';
import { chapters } from '@/lib/bookContent';

export function generateStaticParams() {
  return Object.keys(chapters).map((slug) => ({ slug }));
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || 'ch01-getting-started';
  const chapter = chapters[slug] || chapters['ch01-getting-started'];

  return (
    <div style={{ background: '#0B0F19', color: '#F1F5F9', minHeight: '100vh', padding: '24px' }}>
      <BookLayout currentSlug={slug}>
        <div dangerouslySetInnerHTML={{ __html: chapter.html }} />
      </BookLayout>
    </div>
  );
}
