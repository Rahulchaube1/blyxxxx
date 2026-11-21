import catalog from "@/lib/packages.json";
import { directoryFor, type PackageCategory } from "@/lib/package-categories";

export default function PackageLogoGallery({ category }: { category: PackageCategory }) {
    const directory = directoryFor(category);
    const items = catalog.packages.filter((p) => p.category === category)
        .sort((a, b) => a.title.localeCompare(b.title, "en"));
    const frameworks = category === "framework";
    return (
        <main className="wrap directory-page">
            <header className="page-head">
                <a className="crumb" href={directory.href}>← Blyx {directory.title.toLowerCase()}</a>
                <h1>Blyx {category} logos</h1>
                <p>{frameworks
                    ? "Each framework has its own bird. Choose one to explore its API, run an example or install its editor extension."
                    : "Each penguin illustrates a task you can do with that library. Choose a name to see an example."}</p>
                <div className="actions">
                    <a className="button" href={"/blyx-" + category + "-logos.zip"} download>Download all {items.length} logos (ZIP)</a>
                </div>
            </header>
            <ul className="library-logo-grid" aria-label={frameworks ? "Framework logos" : "Library logos"}>
                {items.map((p) => (
                    <li className="library-logo-card" key={p.slug}>
                        <a href={"/packages/" + p.slug}>
                            <img src={p.logo} alt={p.logoAlt} width="144" height="144" loading="lazy" decoding="async" />
                            <span>{p.title}</span>
                        </a>
                        {frameworks && <a className="library-logo-download" href={"/packages/" + p.slug + "#editor"} aria-label={"Install the " + p.title + " editor extension"}>Editor extension</a>}
                        <a className="library-logo-download" href={p.logo} download={p.slug + ".png"} aria-label={"Download " + p.title + " logo as a PNG"}>Download PNG</a>
                    </li>
                ))}
            </ul>
        </main>
    );
}
