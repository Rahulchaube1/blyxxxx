import GuideIndex from "@/components/GuideIndex";
import { bookEdition, guideLink, playLink, docs, website } from "@/lib/site";
import samples from "@/lib/samples.json";
export const metadata = {
    alternates: { canonical: (bookEdition ? docs : website) + "/" },
};
export default function Home() {
    if (bookEdition) return <GuideIndex />;
    return (
        <main>
            <section className="hero">
                <div className="hero-inner">
                    <div>
                        <h1>The Blyx programming language</h1>
                        <p>
                            Write a function, explore a dataset, or build a
                            native executable. Start with a running Blyx program
                            in your browser.
                        </p>
                        <div className="actions">
                            <a className="button" href={playLink("linear-fit")}>
                                Open playground →
                            </a>
                            <a
                                className="button secondary"
                                href="/learn"
                            >
                                Learn Blyx
                            </a>
                        </div>
                    </div>
                    <div className="hero-art">
                        <img
                            src="/penguin_coding.jpg"
                            alt="Blyx penguin working at a keyboard"
                            width="330"
                            height="330"
                        />
                    </div>
                </div>
            </section>
            <div className="wrap">
                <section>
                    <div className="section-head">
                        <h2>Programs to try</h2>
                        <a href="/examples">All examples →</a>
                    </div>
                    <div className="grid">
                        {["linear-fit", "package-retrieval", "gcd"].map((id) => {
                            const s = samples.find((x) => x.id === id)!;
                            return (
                                <a
                                    className="card card-link"
                                    href={playLink(id)}
                                    key={id}
                                >
                                    <div className="file-label">
                                        {s.category}
                                    </div>
                                    <h3>{s.title}</h3>
                                    <p>{s.description}</p>
                                    <span>Run example →</span>
                                </a>
                            );
                        })}
                    </div>
                </section>
                <section className="prose block">
                    <h2>Evaluate a model before you ship it</h2>
                    <p>Two classifiers can have the same accuracy and make very different mistakes. Compare them on a CSV of paired predictions, or use Blyx libraries to measure calibration and search quality.</p>
                    <a className="button secondary" href="/packages">Explore the Blyx ecosystem →</a>
                </section>
                <section className="block">
                    <div className="section-head">
                        <h2>From editor to executable</h2>
                    </div>
                    <div className="grid">
                        {[
                            [
                                "Install Blyx",
                                "Download the 0.2.1 compiler for your platform.",
                                "/download",
                            ],
                            [
                                "Write in VS Code",
                                "Run an unsaved Blyx buffer and get parser diagnostics while typing.",
                                "/vscode",
                            ],
                            [
                                "Build a program",
                                "Compile typed Blyx functions into a standalone executable.",
                                guideLink("native-builds"),
                            ],
                        ].map(([title, summary, href]) => (
                            <a
                                key={title}
                                className="card card-link"
                                href={href}
                            >
                                <h3>{title}</h3>
                                <p>{summary}</p>
                                <span>Get started →</span>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
