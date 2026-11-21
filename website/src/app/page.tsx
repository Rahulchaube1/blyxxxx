import GuideIndex from "@/components/GuideIndex";
import { bookEdition, buyMeACoffee, docs, githubSponsors, guideLink, playLink, repository, website } from "@/lib/site";
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
                            <a href="/packages">Explore the ecosystem</a>
                        </div>
                    </div>
                    <picture className="hero-art">
                        <source type="image/webp" srcSet="/blyx-mascot.webp" />
                        <img
                            src="/blyx.png"
                            alt="The Blyx penguin wearing blue mirrored sunglasses"
                            width="1536"
                            height="1024"
                            fetchPriority="high"
                        />
                    </picture>
                </div>
            </section>
            <div className="wrap">
                <section>
                    <div className="section-head">
                        <h2>Programs to try</h2>
                        <a href="/examples">All examples →</a>
                    </div>
                    <div className="grid">
                        {["weighted-mean", "package-warbler", "package-fulmar"].map((id) => {
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
                    <div className="actions">
                        <a href="/frameworks">Browse frameworks</a>
                        <a href="/libraries">Browse libraries</a>
                        <a href={repository + "/releases/tag/ecosystem-v0.1.0"}>Download the 51 native workflow commands</a>
                    </div>
                </section>
                <section className="prose block">
                    <h2>Train a model and track its errors</h2>
                    <p>Fit a regression from a CSV, add a prediction interval, and detect when a deployed model repeatedly underpredicts. The same Blyx packages run in native programs and in the browser examples.</p>
                    <div className="actions">
                        <a className="button secondary" href="/packages">Explore the Blyx ecosystem →</a>
                        <a href="/packages/blyxtorch">Train a neural network with BlyxTorch</a>
                        <a href={guideLink("training-and-monitoring")}>Work through the tutorial</a>
                    </div>
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
                <section className="sponsor-section block" id="sponsor" aria-labelledby="sponsor-heading">
                    <div>
                        <h2 id="sponsor-heading">Support Blyx development</h2>
                        <p>Blyx is open source. Sponsoring Rahul Chaube helps fund compiler development, package testing on Windows, Linux and macOS, and the free Blyx handbook.</p>
                    </div>
                    <div className="actions">
                        <a className="button" href={buyMeACoffee}>Buy Me a Coffee</a>
                        <a className="button secondary" href={githubSponsors}>GitHub Sponsors</a>
                    </div>
                </section>
            </div>
        </main>
    );
}
