import GuideContent from "@/components/GuideContent";
import { guides } from "@/lib/handbook";
export const metadata = { title: "Printable Blyx handbook" };
export default function Print() {
    return (
        <main className="wrap prose">
            <header className="page-head">
                <h1>The Blyx handbook</h1>
                <p>Blyx 0.2.1 · Print edition</p>
            </header>
            <nav aria-label="Contents">
                <ol>
                    {guides.map((g) => (
                        <li key={g.slug}>
                            <a href={"#" + g.slug}>{g.title}</a>
                        </li>
                    ))}
                </ol>
            </nav>
            {guides.map((g) => (
                <article id={g.slug} className="block" key={g.slug}>
                    <p className="crumb">{g.group}</p>
                    <h2>{g.title}</h2>
                    <p>{g.summary}</p>
                    <GuideContent guide={g} print />
                </article>
            ))}
        </main>
    );
}
