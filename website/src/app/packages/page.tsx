import PackageCatalog from "@/components/PackageCatalog";
import { guideLink, repository, website } from "@/lib/site";

export const metadata = {
    title: "Blyx ecosystem",
    description: "Find native Blyx libraries, training and monitoring frameworks, command-line tools, and runnable examples.",
    alternates: { canonical: website + "/packages" },
};

export default function Packages() {
    return (
        <main className="wrap">
            <header className="page-head">
                <h1>Blyx ecosystem</h1>
                <p>Find a package for the job, try its Blyx code in your browser, or install a pinned release in your project.</p>
                <div className="actions">
                    <a href="/frameworks">Browse frameworks by project</a>
                    <a className="button" href={guideLink("training-and-monitoring")}>Train and monitor a model →</a>
                    <a href="/examples/forecast-monitor.zip" download>Download the Blyx starter project</a>
                    <a href="/packages/blyxtorch">Train a neural network with BlyxTorch</a>
                    <a href={guideLink("ai-packages")}>Evaluate a model release</a>
                </div>
            </header>
            <PackageCatalog />
            <section className="prose block">
                <h2>Contribute a package or a fix</h2>
                <p>Each package page links to its source, tests and issue tracker. For a bug, include a small input, the observed output and the result you expected. To propose a catalog entry, include a tagged release and an example another developer can run.</p>
                <div className="actions">
                    <a href={repository + "/blob/blyx-main/docs/ecosystem-packages.md"}>Package contributor guide →</a>
                    <a href="/packages.json">Catalog JSON</a>
                    <a href="/blyx-package-logos.zip" download>Download all package logos</a>
                    <a href="/community">Discuss an idea</a>
                    <a href="/#sponsor">Sponsor Blyx development</a>
                </div>
            </section>
        </main>
    );
}
