import PackageCatalog from "./PackageCatalog";
import { directoryFor, packageDirectories, type PackageCategory } from "@/lib/package-categories";
import { packageDirectory } from "@/lib/package-directory";
import { repository } from "@/lib/site";
import { sourceCollectionArchive } from "@/lib/source-channel";

export default function PackageDirectory({ category }: { category: PackageCategory }) {
    const directory = directoryFor(category);
    return (
        <main className="wrap directory-page">
            <header className="page-head">
                <a className="crumb" href="/packages">← Blyx ecosystem</a>
                <h1>Blyx {directory.title.toLowerCase()}</h1>
                <p>{directory.description}</p>
                <div className="actions">
                    {category === "framework"
                        ? <a href={repository + "/releases/tag/ecosystem-v0.1.0"}>Original 51 workflow CLIs (v0.1.0)</a>
                        : <a href="/packages/framesignal#import">See how to import a library</a>}
                    {category === "framework" && <a href="/frameworks/flightdeck">50 Flightdeck GPU training workflows</a>}
                    <a href="/packages#install">Package manager installation</a>
                    <a href={directory.href + "/logos"}>Browse {category} logos</a>
                    <a href={sourceCollectionArchive}>Download the current framework and library sources</a>
                </div>
            </header>
            <nav className="directory-switch" aria-label="Package directories">
                {packageDirectories.map((d) => (
                    <a key={d.category} href={d.href} aria-current={category === d.category ? "page" : undefined}>{d.title}</a>
                ))}
            </nav>
            <PackageCatalog items={packageDirectory(category)} category={category} />
        </main>
    );
}
