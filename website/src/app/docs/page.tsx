import { pageMetadata } from "@/lib/metadata";
import { guides } from "@/lib/handbook";
import { guideLink, website } from "@/lib/site";
export const metadata = pageMetadata(
    "Blyx documentation and references",
    "Look up Blyx syntax, built-in functions and compiler commands, or open the handbook for installation and worked tutorials.",
    website + "/docs",
);
const references = [
    { title: "Language reference", slugs: ["language-reference", "builtin-reference", "compatibility"] },
    { title: "Compiler and tools", slugs: ["installation", "cli-reference", "diagnostics", "native-builds"] },
    { title: "Projects and packages", slugs: ["sensor-report", "ai-packages", "blyxtorch", "training-and-monitoring"] },
];

export default function Documentation() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Blyx documentation</h1>
                <p>Use the references below when writing a program, or read the handbook for a course with exercises.</p>
                <div className="actions">
                    <a className="button" href={guideLink()}>Open the Blyx handbook</a>
                    <a href="/learn">Start with Blyx for beginners</a>
                </div>
            </header>
            {references.map(({ title, slugs }) => (
                <section className="site-directory block" key={title}>
                    <h2>{title}</h2>
                    <ul>
                        {slugs.map((slug) => {
                            const guide = guides.find((item) => item.slug === slug)!;
                            return (
                                <li key={slug}>
                                    <a href={guideLink(slug)}>{guide.title}</a>
                                    <p>{guide.summary}</p>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
        </main>
    );
}
