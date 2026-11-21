import { condaChannel, distributionRepository, sourceCollection } from "@/lib/source-channel";
import { pageMetadata } from "@/lib/metadata";
import PackageCatalog from "@/components/PackageCatalog";
import { packageDirectories } from "@/lib/package-categories";
import { packageDirectory } from "@/lib/package-directory";
import { guideLink, nestRegistry, repository, website } from "@/lib/site";

export const metadata = pageMetadata(
    "Blyx package catalog",
    "Find Blyx frameworks and libraries by task. Each package includes its source, installation instructions, API and a runnable example.",
    website + "/packages",
);

export default function Packages() {
    const items = packageDirectory();
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Blyx package catalog</h1>
                <p>Choose a framework for a complete workflow or a library for functions you can use in your own code.</p>
                <div className="actions"><a className="button" href={nestRegistry + "/"}>Browse the Blyx Nest registry</a><a href={nestRegistry + "/publish.html"}>Publish a Blyx package</a></div>
                <a href="#install">Install packages with Conda, Homebrew or Scoop</a>
            </header>
            <nav className="grid directory-choices" aria-label="Package directories">
                {packageDirectories.map((d) => (
                    <a className="card card-link directory-choice" key={d.category} href={d.href} aria-labelledby={"choose-" + d.category}>
                        <div className="package-heading">
                            <img src={items.find((p) => p.slug === d.exampleSlug)?.logo} alt="" width="60" height="60" />
                            <h2 id={"choose-" + d.category}>{d.title}</h2>
                        </div>
                        <p>{d.description}</p>
                        <span>Browse {items.filter((p) => p.category === d.category).length} {d.title.toLowerCase()} →</span>
                    </a>
                ))}
            </nav>
            <PackageCatalog items={items} />
            <section id="install" className="prose block">
                <h2>Install Blyx packages</h2>
                <p>Use the Blyx Conda channel for an individual framework or library. For example, install Moments and run its example from the same directory with the Blyx compiler, Rust and a host linker.</p>
                <pre>{'conda create -y --prefix ./blyx-env --override-channels -c ' + condaChannel + ' blyx-moments=0.1.0\nblyxc native-run ./blyx-env/share/blyx/moments/main.blyx'}</pre>
                <p>For the full source collection, use <code>brew install rahulchaube1/blyx/blyx-packages</code> on macOS or Linux. On Windows, add the Blyx bucket with <code>scoop bucket add blyx https://github.com/Rahulchaube1/scoop-blyx</code> and run <code>scoop install blyx/blyx-packages</code>.</p>
                <div className="actions">
                    <a href={condaChannel + "/"}>Conda channel</a>
                    <a href={sourceCollection}>Download the full source ZIP and checksums</a>
                    <a href={distributionRepository + "#install-the-collection"}>Homebrew and Scoop examples</a>
                </div>
            </section>
            <section className="prose block">
                <h2>Downloads and tutorials</h2>
                <div className="actions">
                    <a href="/downloads/blyx-ecosystem-source.zip" download>Download 51 frameworks and 102 libraries</a>
                    <a className="button" href={guideLink("training-and-monitoring")}>Train and monitor a model →</a>
                    <a href="/examples/forecast-monitor.zip" download>Download the Blyx starter project</a>
                    <a href="/packages/blyxtorch">Train a neural network with BlyxTorch</a>
                    <a href={guideLink("ai-packages")}>Evaluate a model release</a>
                </div>
            </section>
            <section className="prose block">
                <h2>Contribute a package or a fix</h2>
                <p>Each package page links to its source, tests and issue tracker. For a bug, include a small input, the observed output and the result you expected. To propose a catalog entry, include a tagged release and an example another developer can run.</p>
                <div className="actions">
                    <a href={repository + "/blob/blyx-main/docs/ecosystem-packages.md"}>Package contributor guide →</a>
                    <a href="/packages.json">Catalog JSON</a>
                    <a href="/libraries/logos">Browse the library logos</a>
                    <a href="/frameworks/logos">Browse the framework birds</a>
                    <a href="/blyx-package-logos.zip" download>Download all package logos</a>
                    <a href="/community">Discuss an idea</a>
                    <a href="/#sponsor">Sponsor Blyx development</a>
                </div>
            </section>
        </main>
    );
}
