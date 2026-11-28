import NestActivity from "@/components/NestActivity";
import { handbookSiteName, languageSiteName, pageMetadata } from "@/lib/metadata";
import StructuredData from "@/components/StructuredData";
import { LiveActivity } from "@/components/LiveActivity";
import GuideIndex from "@/components/GuideIndex";
import { bookEdition, buyMeACoffee, docs, githubSponsors, guideLink, playLink, repository, website } from "@/lib/site";
import samples from "@/lib/samples.json";
const home = (bookEdition ? docs : website) + "/";
const name = bookEdition ? handbookSiteName : languageSiteName;
export const metadata = pageMetadata(
    bookEdition ? handbookSiteName : "The Blyx Programming Language",
    bookEdition
        ? "The official Blyx handbook. Follow worked lessons or look up syntax, built-in functions, compiler commands and framework recipes."
        : "Blyx is an open-source programming language for numerical work and native programs. Download the compiler, learn Blyx, and explore its frameworks and libraries.",
    home,
);

const destinations = [
    ["Downloads", "/download", "Install the compiler for Windows, macOS or Linux and verify your download."],
    ["Project demos", "/demos", "Tap along to music in a live tempo instrument or run a forecasting project locally."],
    ["Blyx for beginners", "/learn", "Run your first program, change what it prints, and work through the first lessons."],
    ["Documentation", "/docs", "Look up language syntax, built-in functions and compiler commands."],
    ["Frameworks", "/frameworks", "Choose a workflow for a project, from training a network to processing audio."],
    ["Libraries", "/libraries", "Find functions to import into your own code, with examples and API references."],
    ["Package catalog", "/packages", "Search all Blyx packages by name or task and find their source and releases."],
];

export default function Home() {
    const identity = (
        <StructuredData data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": home + "#website",
            url: home,
            name,
            alternateName: bookEdition ? "Blyx Handbook" : ["Blyx Language", "Blyx Programming Language"],
        }} />
    );
    if (bookEdition) return <>{identity}<GuideIndex /></>;
    return (
        <main>
            {identity}
            <section className="hero">
                <div className="hero-inner">
                    <div>
                        <h1>The Blyx programming language</h1>
                        <p>
                            Blyx is an open-source programming language for numerical work
                            and native programs. Try a running example in your browser,
                            then download the compiler to build it locally.
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
                <NestActivity />
                <nav className="site-directory" aria-labelledby="explore-blyx">
                    <h2 id="explore-blyx">Explore Blyx</h2>
                    <ul>
                        {destinations.map(([label, href, description]) => (
                            <li key={href}>
                                <a href={href}>{label}</a>
                                <p>{description}</p>
                            </li>
                        ))}
                    </ul>
                </nav>
                <section className="block">
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
                <section className="prose block">
                    <h2>Build a native program</h2>
                    <p>Edit a Blyx file with the <a href="/vscode">Blyx extension for VS Code</a>.
                        When it is ready, follow the <a href={guideLink("native-builds")}>native build guide</a> to
                        compile an executable for your machine.</p>
                </section>
                <section className="prose block">
                    <h2>Engineering articles</h2>
                    <p><a href="/articles/vector-distance">New in Blyx 0.2.3: finding the nearest center in one pass</a></p>
                    <p>Follow a GPU training step from logits to updated weights. The Flightdeck study includes source code, a CPU comparison and results from 50 workflows.</p>
                    <a href="/articles/flightdeck">Read the Flightdeck study →</a>
                    <div className="actions"><a href="/articles/training-in-factors">Read the matrix and circuit study →</a><a href="/articles/blyxtorch-portable-training">One checkpoint, two processors</a><a href="/articles">All articles</a></div>
                </section>
                <section className="block"><div className="section-head"><h2>Blyx activity</h2><a href="/adoption">All usage statistics →</a></div><LiveActivity compact /></section>
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
