import { pageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { guides, stages } from "@/lib/handbook";
import catalog from "@/lib/packages.json";
import { docs, guideLink, mainLink } from "@/lib/site";
import GuideContent from "@/components/GuideContent";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
    return guides.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const g = guides.find((g) => g.slug === slug);
    return g
        ? pageMetadata(g.title.includes("Blyx") ? g.title : g.title + " · Blyx Handbook", g.summary, docs + "/guide/" + slug)
        : {};
}
export default async function Chapter({ params }: Props) {
    const { slug } = await params;
    const index = guides.findIndex((g) => g.slug === slug);
    if (index < 0) notFound();
    const g = guides[index];
    const subject = catalog.packages.find((p) => p.slug === slug && p.guide === slug);
    const contents = stages.map(([stage]) => (
        <div key={stage} className="chapter-group">
            <strong>{stage}</strong>
            {guides
                .filter((chapter) => chapter.group === stage)
                .map((chapter) => (
                    <a
                        key={chapter.slug}
                        href={guideLink(chapter.slug)}
                        aria-current={
                            chapter.slug === slug ? "page" : undefined
                        }
                    >
                        {chapter.title}
                    </a>
                ))}
        </div>
    ));
    return (
        <main className="wrap guide-shell">
            <aside className="guide-nav">
                <h2>In this guide</h2>
                <nav aria-label="Chapters">{contents}</nav>
            </aside>
            <div>
                <details className="guide-mobile">
                    <summary>Browse chapters</summary>
                    <nav aria-label="Chapters">{contents}</nav>
                </details>
                <header className="page-head">
                    <div className="crumb">
                        <a href={guideLink()}>Documentation</a> / {g.group}
                    </div>
                    {subject ? (
                        <div className="package-heading">
                            <img className="package-logo" src={mainLink(subject.logo)} alt="" width="66" height="66" />
                            <h1>{g.title}</h1>
                        </div>
                    ) : (
                        <h1>{g.title}</h1>
                    )}
                    <p>{g.summary}</p>
                </header>
                <article className="prose">
                    <GuideContent guide={g} />
                    {slug === "editor" && (
                        <div className="actions">
                            <a className="button" href={mainLink("/vscode")}>Get the language extension</a>
                            <a href={mainLink("/frameworks/logos")}>Find a framework extension</a>
                        </div>
                    )}
                    {slug === "installation" && (
                        <a className="button" href={mainLink("/download")}>
                            Choose a download
                        </a>
                    )}
                    {(slug === "ai-packages" || slug === "training-and-monitoring") && (
                        <a className="button" href={mainLink("/packages")}>
                            Get the Blyx packages
                        </a>
                    )}
                    {slug === "compatibility" && (
                        <a href={mainLink("/benchmarks")}>
                            Browse performance measurements
                        </a>
                    )}
                </article>
                <nav className="chapter-pager" aria-label="Chapter navigation">
                    {index > 0 && (
                        <a href={guideLink(guides[index - 1].slug)}>
                            ← {guides[index - 1].title}
                        </a>
                    )}
                    {index + 1 < guides.length && (
                        <a href={guideLink(guides[index + 1].slug)}>
                            {guides[index + 1].title} →
                        </a>
                    )}
                </nav>
            </div>
        </main>
    );
}
