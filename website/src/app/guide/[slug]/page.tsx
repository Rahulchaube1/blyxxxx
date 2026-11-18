import { notFound } from "next/navigation";
import guides from "@/lib/guides.json";
import samples from "@/lib/samples.json";
import { docs, guideLink, mainLink, playLink } from "@/lib/site";
import Runner from "@/components/Runner";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
    return guides.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const g = guides.find((g) => g.slug === slug);
    return g
        ? {
              title: g.title,
              description: g.summary,
              alternates: { canonical: docs + "/guide/" + slug },
          }
        : {};
}
export default async function Chapter({ params }: Props) {
    const { slug } = await params;
    const index = guides.findIndex((g) => g.slug === slug);
    if (index < 0) notFound();
    const g = guides[index];
    const sample = samples.find((s) => s.id === g.example);
    const contents = guides.map((x) => (
        <a
            key={x.slug}
            href={guideLink(x.slug)}
            aria-current={x.slug === slug ? "page" : undefined}
        >
            {x.title}
        </a>
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
                    <h1>{g.title}</h1>
                    <p>{g.summary}</p>
                </header>
                <article className="prose">
                    {g.sections.map((s) => (
                        <section key={s.heading}>
                            <h2>{s.heading}</h2>
                            <p>{s.text}</p>
                            {"command" in s && (
                                <pre>
                                    <code>{s.command}</code>
                                </pre>
                            )}
                        </section>
                    ))}
                    {sample && (
                        <section>
                            <h2>Try the program</h2>
                            <Runner code={sample.code} filename={sample.file} />
                            <p>
                                <a href={playLink(sample.id)}>
                                    Open in the full playground →
                                </a>
                            </p>
                        </section>
                    )}
                    {slug === "editor" && (
                        <a className="button" href={mainLink("/vscode")}>
                            Get the editor extension
                        </a>
                    )}
                    {slug === "installation" && (
                        <a className="button" href={mainLink("/download")}>
                            Choose a download
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
